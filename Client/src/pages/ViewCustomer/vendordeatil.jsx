
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";

const VendorDetails = () => {
  const [state, setState] = useState({
    orders: [],
    filteredOrders: [],
    loading: true,
    error: null,
    search: "",
  });
  const { id } = useParams();
  console.log("vendor Id", id)
  const navigate = useNavigate();
   
  const fetchOrders = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order/member/${id}`);
      setState(prev => ({
        ...prev,
        orders: res.data.orders,
        filteredOrders: res.data.orders,
        loading: false
      }));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Failed to fetch orders. Please try again."
      }));
    }
  }, [id]);

  const handleSearch = debounce((searchValue) => {
    const result = state.orders.filter((order) => {
      const searchLower = searchValue.toLowerCase();
      return (
        order._id?.toLowerCase().includes(searchLower) ||
        (order.orderItems[0]?.discountName?.firmName?.toLowerCase().includes(searchLower)) ||
        new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(searchLower) ||
        `${order.totalPriceAfterDiscount ?? order.totalPrice}`.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower) ||
        order.paymentStatus?.toLowerCase().includes(searchLower)
      );
    });
    setState(prev => ({ ...prev, filteredOrders: result }));
  }, 300);

  const navigateToVendor = (vendorId) => {
    if (vendorId) {
      navigate(`/vendor/${vendorId}`);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row._id.slice(-6).toUpperCase(),
      sortable: true,
      width: "120px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: "120px",
    },
    {
      name: "Vendor Name",
      cell: (row) => (
        <button 
          onClick={() => navigateToVendor(row.orderItems[0]?.discountName?._id)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {row.orderItems[0]?.discountName?.firmName || "N/A"}
        </button>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Vendor Address",
      cell: (row) => (
        <span className="text-left">
          {row.orderItems[0]?.discountName?.address || "N/A"}
        </span>
      ),
      width: "200px",
    },
    {
      name: "Vendor Email",
      cell: (row) => (
        <span className="text-left">
          {row.orderItems[0]?.discountName?.email || "N/A"}
        </span>
      ),
      width: "180px",
    },
    {
      name: "Product",
      cell: (row) => (
        <span className="text-left">
          {row.orderItems[0]?.productName || "N/A"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Total Amount",
      selector: (row) => `₹${(row.totalPriceAfterDiscount ?? row.totalPrice).toFixed(2)}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Due Amount",
      selector: (row) => `₹${(row.dueAmount ?? (row.totalPriceAfterDiscount ?? row.totalPrice) - (row.paidAmount || 0)).toFixed(2)}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Credit Limit",
      selector: (row) => `₹${row.orderItems[0]?.discountName?.limit?.toFixed(2) || "0.00"}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Remaining Limit",
      selector: (row) => {
        const limit = row.orderItems[0]?.discountName?.limit || 0;
        const due = row.dueAmount ?? (row.totalPriceAfterDiscount ?? row.totalPrice) - (row.paidAmount || 0);
        return `₹${(limit - due).toFixed(2)}`;
      },
      sortable: true,
      width: "140px",
    },
  ];

  return (
    <div className="max-w-7xl py-8 mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Details</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search orders..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-64"
          />
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {state.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {state.error}
          <button 
            onClick={fetchOrders}
            className="ml-2 text-red-700 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={state.filteredOrders}
          progressPending={state.loading}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              {state.error ? 'Error loading orders' : 'No orders found'}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default VendorDetails;