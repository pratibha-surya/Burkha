import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Outstanding = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (from = null, to = null) => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/order/dueAmount/${true}`;
      if (from && to) url += `?from=${from}&to=${to}`;

      const response = await axios.get(url);
      console.log("Outstanding orders response:", response.data);

      const data = response?.data || {};
      const list = data.orders || data.data || (Array.isArray(data) ? data : []);

      const processed = (list || []).map((order) => {
        const total = order.totalPriceAfterDiscount ?? order.totalPrice ?? 0;
        const paid = order.amount ?? 0;
        const due = total - paid;

        return {
          ...order,
          formattedId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
          amount: paid,
          dueAmount: due > 0 ? due : 0,
        };
      });

      setOrders(processed);
      setCurrentPage(1);
      toast.success(`Loaded ${processed.length} orders with outstanding dues`);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.warning('Select both From and To dates');
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('From date cannot be later than To date');
      return;
    }
    fetchOrders(fromDate, toDate);
  };

  const totalAmount = orders.reduce((sum, o) => sum + (o.totalPriceAfterDiscount || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalDue = totalAmount - totalPaid;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Outstanding</h2>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button onClick={handleFilter} className="bg-green-600 text-white px-4 py-1 rounded">
          Filter
        </button>
        <button onClick={() => fetchOrders()} disabled={loading} className="bg-blue-600 text-white px-4 py-1 rounded">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total Amount</th>
              <th className="px-4 py-2 text-left">Paid</th>
              <th className="px-4 py-2 text-left">Due</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            ) : currentOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No orders found.</td>
              </tr>
            ) : (
              <>
                {currentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{o.formattedId}</td>
                    <td className="px-4 py-2">{o.orderItems?.[0]?.discountName?.firmName || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-blue-600 font-medium">₹{o.totalPriceAfterDiscount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 text-gray-800">₹{o.amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 text-red-600 font-bold">₹{o.dueAmount?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan="3" className="px-4 py-2 text-right">Total</td>
                  <td className="px-4 py-2 text-blue-700">₹{totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800">₹{totalPaid.toFixed(2)}</td>
                  <td className="px-4 py-2 text-red-700">₹{totalDue.toFixed(2)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {!loading && orders.length > itemsPerPage && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Outstanding;
