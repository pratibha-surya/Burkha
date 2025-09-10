import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { debounce } from "lodash";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const Orders = () => {
  const [state, setState] = useState({
    orders: [],
    filteredOrders: [],
    loading: true,
    error: null,
    search: "",
    selectedOrder: null,
    paymentDetails: [],
    paymentDetailsLoading: false,
    updatingStatus: {},
  });

  const printRef = useRef();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order`);
      console.log("Orders response:", res.data);
      setState(prev => ({
        ...prev,
        orders: res.data.orders || [],
        filteredOrders: res.data.orders || [],
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || "Failed to fetch orders",
        orders: [],
        filteredOrders: []
      }));
    }
  }, []);

  const fetchPaymentDetails = async orderId => {
    try {
      setState(prev => ({ ...prev, paymentDetailsLoading: true }));
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/${orderId}`);
      setState(prev => ({
        ...prev,
        paymentDetails: res.data.payments || [],
        paymentDetailsLoading: false,
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, paymentDetails: [], paymentDetailsLoading: false }));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setState(prev => ({ ...prev, updatingStatus: { ...prev.updatingStatus, [orderId]: true } }));
      const orderToUpdate = state.orders.find(order => order._id === orderId);
      if (["shipped", "delivered", "cancelled"].includes(newStatus)) {
        navigate(`/${newStatus}-order/${orderId}`, { state: { order: orderToUpdate } });
        return;
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/order/${orderId}`, { status: newStatus });
      await fetchOrders();
      if (state.selectedOrder?._id === orderId) closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setState(prev => ({ ...prev, updatingStatus: { ...prev.updatingStatus, [orderId]: false } }));
    }
  };

  const handleSearch = debounce(searchValue => {
    const lower = searchValue.toLowerCase();
    const result = state.orders.filter(order =>
      order._id?.toLowerCase().includes(lower) ||
      order.orderItems[0]?.discountName?.firmName?.toLowerCase().includes(lower) ||
      new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(lower) ||
      `${order.totalPriceAfterDiscount ?? order.totalPrice}`.toLowerCase().includes(lower) ||
      order.status?.toLowerCase().includes(lower) ||
      order.paymentStatus?.toLowerCase().includes(lower)
    );
    setState(prev => ({ ...prev, filteredOrders: result }));
  }, 300);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `@page { size: auto; margin: 5mm; } @media print { body { -webkit-print-color-adjust: exact; } .no-print { display: none !important; } }`,
    removeAfterPrint: true,
  });

  const viewOrderDetails = async order => {
    setState(prev => ({ ...prev, selectedOrder: order }));
    await fetchPaymentDetails(order._id);
  };

  const closeModal = () => setState(prev => ({ ...prev, selectedOrder: null, paymentDetails: [] }));

  const navigateToPayments = orderId => navigate(`/allpayment/${orderId}`);

  // Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      state.filteredOrders.map(o => ({
        OrderID: o._id,
        Date: new Date(o.createdAt).toLocaleDateString(),
        Vendor: o.orderItems[0]?.discountName?.firmName || "N/A",
        Total: o.totalPriceAfterDiscount ?? o.totalPrice,
        Paid: o.paidAmount || 0,
        Due: o.dueAmount ?? (o.totalPriceAfterDiscount ?? o.totalPrice) - (o.paidAmount || 0),
        PaymentStatus: o.paymentStatus?.toUpperCase(),
        Status: o.status?.toUpperCase()
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "orders.xlsx");
  };

  // ✅ PDF export using autoTable properly
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Report", 14, 15);
    const tableColumn = ["Order ID", "Date", "Vendor", "Total", "Paid", "Due", "Payment Status", "Status"];
    const tableRows = state.filteredOrders.map(o => [
      o._id.slice(-6).toUpperCase(),
      new Date(o.createdAt).toLocaleDateString(),
      o.orderItems[0]?.discountName?.firmName || "N/A",
      o.totalPriceAfterDiscount ?? o.totalPrice,
      o.paidAmount || 0,
      o.dueAmount ?? (o.totalPriceAfterDiscount ?? o.totalPrice) - (o.paidAmount || 0),
      o.paymentStatus?.toUpperCase(),
      o.status?.toUpperCase()
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("orders.pdf");
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const columns = [
    { name: "Order ID", selector: row => row._id.slice(-6).toUpperCase(), sortable: true, width: "120px" },
    { name: "Date", selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true, width: "120px" },
    { name: "Vendor", selector: row => row.orderItems[0].discountName?.firmName || "N/A", sortable: true, width: "150px" },
    { name: "Total", selector: row => `₹${row.totalPriceAfterDiscount ?? row.totalPrice}`, sortable: true, width: "120px" },
    { name: "Due Amount", selector: row => `₹${row.dueAmount ?? (row.totalPriceAfterDiscount ?? row.totalPrice) - (row.paidAmount || 0)}`, sortable: true, width: "120px" },
    {
      name: "Payment Status",
      cell: row => <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${row.paymentStatus==="paid"?"bg-green-100 text-green-800":row.paymentStatus==="partially_paid"?"bg-blue-100 text-blue-800":"bg-yellow-100 text-yellow-800"}`}>{(row.paymentStatus||"pending").toUpperCase()}</span>,
      width: "120px"
    },
    {
      name: "Order Status",
      cell: row => <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${row.status==="delivered"?"bg-green-100 text-green-800":row.status==="processing"||row.status==="shipped"?"bg-blue-100 text-blue-800":row.status==="cancelled"?"bg-red-100 text-red-800":"bg-yellow-100 text-yellow-800"}`}>{(row.status||"pending").toUpperCase()}</span>,
      width: "150px"
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex flex-col gap-2">
          <button onClick={()=>viewOrderDetails(row)} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100" disabled={state.updatingStatus[row._id]}>View</button>
          <select value={row.status || "pending"} onChange={e=>updateOrderStatus(row._id, e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded" disabled={state.updatingStatus[row._id]}>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {state.updatingStatus[row._id] && <span className="text-xs text-gray-500">Updating...</span>}
        </div>
      ),
      width: "180px"
    },
    {
      name: "Payment",
      cell: row => <button onClick={()=>navigateToPayments(row._id)} className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100">{row.paymentStatus==="paid"?"View Payments":"Add Payment"}</button>,
      width: "120px"
    },
    {
      name: "Print",
      cell: row => <button onClick={()=>{viewOrderDetails(row); setTimeout(()=>handlePrint(),500)}} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded hover:bg-yellow-100">Print</button>,
      width: "100px"
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Orders Management</h1>
        <button
          onClick={() => navigate('/create-order')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Order
        </button>
      </div>

      {/* Search + Export */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <input
          type="text"
          placeholder="Search orders..."
          className="border border-gray-300 rounded px-2 py-2 w-full max-w-sm"
          onChange={e => { setState(prev => ({ ...prev, search: e.target.value })); handleSearch(e.target.value); }}
          value={state.search}
        />

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button onClick={exportToExcel} className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Excel</button>
          <button onClick={exportToPDF} className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">PDF</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={state.filteredOrders}
        progressPending={state.loading}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        dense
      />

      {/* Modal */}
      {state.selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold" onClick={closeModal}>&times;</button>
            <h2 className="text-2xl font-semibold mb-4">Order Details - #{state.selectedOrder._id.slice(-6).toUpperCase()}</h2>

            <div ref={printRef}>
              {/* Vendor & Order Info */}
              <div className="mb-4">
                <h3 className="font-semibold">Vendor:</h3>
                <p>{state.selectedOrder.orderItems[0].discountName?.firmName || "N/A"}</p>
                <p>{state.selectedOrder.orderItems[0].discountName?.contactName}</p>
                <p>{state.selectedOrder.orderItems[0].discountName?.email}</p>
                <p>{state.selectedOrder.orderItems[0].discountName?.address}, {state.selectedOrder.orderItems[0].discountName?.city}, {state.selectedOrder.orderItems[0].discountName?.state}</p>
                <p>Mobile: {state.selectedOrder.orderItems[0].discountName?.mobile1}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Order Info:</h3>
                <p>Date: {new Date(state.selectedOrder.createdAt).toLocaleDateString()}</p>
                <p>Status: {state.selectedOrder.status.toUpperCase()}</p>
                <p>Payment Status: {state.selectedOrder.paymentStatus.toUpperCase()}</p>
                <p>Total: ₹{state.selectedOrder.totalPriceAfterDiscount ?? state.selectedOrder.totalPrice}</p>
                <p>Paid Amount: ₹{state.selectedOrder.paidAmount || 0}</p>
                <p>Due Amount: ₹{state.selectedOrder.dueAmount ?? (state.selectedOrder.totalPriceAfterDiscount ?? state.selectedOrder.totalPrice)-(state.selectedOrder.paidAmount || 0)}</p>
              </div>

              {/* Order Items Table */}
              <table className="w-full text-left border border-gray-300 mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Product</th>
                    <th className="border px-2 py-1">Qty</th>
                    <th className="border px-2 py-1">Price</th>
                    <th className="border px-2 py-1">Discount %</th>
                    <th className="border px-2 py-1">After Disc</th>
                    <th className="border px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {state.selectedOrder.orderItems.map(item => (
                    <tr key={item._id || item.productId}>
                      <td className="border px-2 py-1">{item.productName}</td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">₹{item.price.toFixed(2)}</td>
                      <td className="border px-2 py-1">{item.discountPercentage}%</td>
                      <td className="border px-2 py-1">₹{item.priceAfterDiscount.toFixed(2)}</td>
                      <td className="border px-2 py-1">₹{(item.priceAfterDiscount * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Payment History */}
              <div>
                <h3 className="font-semibold mb-2">Payment History:</h3>
                {state.paymentDetailsLoading ? <p>Loading payment details...</p> :
                  state.paymentDetails.length===0 ? <p>No payment records found.</p> :
                  <table className="w-full text-left border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Amount</th>
                        <th className="border px-2 py-1">Method</th>
                        <th className="border px-2 py-1">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.paymentDetails.map(p => (
                        <tr key={p._id}>
                          <td className="border px-2 py-1">{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td className="border px-2 py-1">₹{p.amount}</td>
                          <td className="border px-2 py-1">{p.paymentMethod}</td>
                          <td className="border px-2 py-1">{p.referenceNumber || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handlePrint} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Print</button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
