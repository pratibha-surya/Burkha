import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Outstanding = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState(null);

  // --- Parent table states ---
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorRows, setVendorRows] = useState(10);

  // --- Child table states ---
  const [childPage, setChildPage] = useState(1);
  const [childRows, setChildRows] = useState(10);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/order/dueAmount/true`;
      const response = await axios.get(url);
      console.log(response);

      setVendors(response?.data?.vendors || []);
      toast.success(`Loaded ${response?.data?.vendors?.length} vendors`);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(error.response?.data?.message || "Failed to load vendors");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVendor = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
    setChildPage(1); // reset child pagination when toggling
  };

  // --- Parent filter + pagination ---
  const filteredVendors = vendors.filter((v) =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
    (vendorPage - 1) * vendorRows,
    vendorPage * vendorRows
  );

  const totalVendorPages = Math.ceil(filteredVendors.length / vendorRows);

  // ✅ Grand totals calculation here
  const totals = vendors.reduce(
    (acc, v) => {
      const totalOrderCount = Array.isArray(v?.totalOrders)
        ? v.totalOrders.reduce((s, n) => s + n, 0)
        : v?.totalOrders || 0;

      const totalAmount = v?.totalAmount || 0;
      const totalPaid =
        v?.totalPaid ||
        (v?.totalAmount && v?.totalDue ? v.totalAmount - v.totalDue : 0);
      const totalDue = v?.totalDue || 0;

      return {
        orders: acc.orders + totalOrderCount,
        amount: acc.amount + totalAmount,
        paid: acc.paid + totalPaid,
        due: acc.due + totalDue,
      };
    },
    { orders: 0, amount: 0, paid: 0, due: 0 }
  );

  // --- Child filter + pagination ---
  const filterOrdersByDate = (orders) => {
    if (!dateRange.from && !dateRange.to) return orders;
    return orders.filter((o) => {
      const orderDate = new Date(o.latestPaymentDate || o.createdAt);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      if (fromDate && orderDate < fromDate) return false;
      if (toDate && orderDate > toDate) return false;
      return true;
    });
  };

  const paginateOrders = (orders) => {
    return orders.slice((childPage - 1) * childRows, childPage * childRows);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Outstanding Vendors</h2>

      {/* Search + Rows per page */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by vendor name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVendorPage(1);
          }}
          className="border px-3 py-1 rounded w-64"
        />
        <select
          value={vendorRows}
          onChange={(e) => {
            setVendorRows(Number(e.target.value));
            setVendorPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} rows
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Vendor</th>
              <th className="px-4 py-2 text-left">Total Orders</th>
              <th className="px-4 py-2 text-left">Total Amount</th>
              <th className="px-4 py-2 text-left">Paid</th>
              <th className="px-4 py-2 text-left">Due</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No vendors found.
                </td>
              </tr>
            ) : (
              paginatedVendors.map((v) => {
                const totalPaid =
                  v.totalAmount && v.totalDue
                    ? v.totalAmount - v.totalDue
                    : v.orders?.reduce((sum, o) => sum + (o.amount ?? 0), 0);

                {
                  /* const totalOrderCount = Array.isArray(v?.totalOrders)
                  ? v.totalOrders.reduce((sum, n) => sum + n, 0)
                  : v?.totalOrders || 0;

                console.log(totalOrderCount); */
                }

                {
                  /* const grandTotalOrders = vendors.reduce((sum, v) => {
                  const totalOrderCount = Array.isArray(v?.totalOrders)
                    ? v.totalOrders.reduce((s, n) => s + n, 0)
                    : v?.totalOrders || 0;

                  return sum + totalOrderCount;
                }, 0);

                console.log("Grand Total Orders:", grandTotalOrders); */
                }

                return (
                  <React.Fragment key={v.vendorId}>
                    {/* Vendor row */}
                    <tr className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-2 font-medium">{v.vendorName}</td>
                      <td className="px-4 py-2">{v.totalOrders}</td>
                      <td className="px-4 py-2 text-blue-600 font-medium">
                        ₹{(v.totalAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        ₹{(totalPaid ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-red-600 font-bold">
                        ₹{(v.totalDue ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => toggleVendor(v.vendorId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          {expandedVendor === v.vendorId
                            ? "Hide Orders"
                            : "View Orders"}
                        </button>
                      </td>
                    </tr>

                    {/* Orders table */}
                    {expandedVendor === v.vendorId && v.orders && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <div className="p-4">
                            {/* Date filter + rows selector */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  value={dateRange.from}
                                  onChange={(e) =>
                                    setDateRange((prev) => ({
                                      ...prev,
                                      from: e.target.value,
                                    }))
                                  }
                                  className="border px-2 py-1 rounded"
                                />
                                <span>to</span>
                                <input
                                  type="date"
                                  value={dateRange.to}
                                  onChange={(e) =>
                                    setDateRange((prev) => ({
                                      ...prev,
                                      to: e.target.value,
                                    }))
                                  }
                                  className="border px-2 py-1 rounded"
                                />
                              </div>
                              <select
                                value={childRows}
                                onChange={(e) => {
                                  setChildRows(Number(e.target.value));
                                  setChildPage(1);
                                }}
                                className="border px-2 py-1 rounded"
                              >
                                {[10, 25, 50, 100].map((num) => (
                                  <option key={num} value={num}>
                                    {num} rows
                                  </option>
                                ))}
                              </select>
                            </div>

                        <div className="overflow-x-auto border rounded">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-4 py-2 text-left">Order ID</th>
        <th className="px-4 py-2 text-left">Customer</th>
        <th className="px-4 py-2 text-left">Bill Amount</th>
        <th className="px-4 py-2 text-left">Paid</th>
        <th className="px-4 py-2 text-left">Due</th>
        <th className="px-4 py-2 text-left">Last Payment</th>
        {/* ✅ New Date Column */}
        <th className="px-4 py-2 text-left">Date</th>
      </tr>
    </thead>
    <tbody>
      {paginateOrders(filterOrdersByDate(v.orders)).map((o) => {
        const total = o.totalPriceAfterDiscount ?? o.totalPrice ?? 0;
        const paid = total - o.dueAmount ?? 0;
        const due = o.dueAmount;

        return (
          <tr key={o._id} className="hover:bg-gray-50">
            <td className="px-4 py-2 font-mono">{o.formattedId}</td>
            <td className="px-4 py-2">
              {o.orderItems?.[0]?.discountName?.firmName || "N/A"}
            </td>
            <td className="px-4 py-2 text-blue-600">₹{total.toFixed(2)}</td>
            <td className="px-4 py-2 text-gray-800">₹{paid.toFixed(2)}</td>
            <td className="px-4 py-2 text-red-600 font-bold">₹{due.toFixed(2)}</td>
            <td className="px-4 py-2 text-gray-500">
              {o.latestPaymentDate
                ? new Date(o.latestPaymentDate).toLocaleDateString()
                : "No Payment"}
            </td>
            {/* ✅ Show Order Creation Date */}
            <td className="px-4 py-2 text-gray-500">
              {o.createdAt
                ? new Date(o.createdAt).toLocaleDateString()
                : "N/A"}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


                            {/* Child Pagination */}
                            <div className="flex justify-center mt-2 gap-2">
                              <button
                                disabled={childPage === 1}
                                onClick={() => setChildPage(childPage - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                              >
                                Prev
                              </button>
                              <span className="px-2">
                                Page {childPage} of{" "}
                                {Math.ceil(
                                  filterOrdersByDate(v.orders).length /
                                    childRows
                                )}
                              </span>
                              <button
                                disabled={
                                  childPage ===
                                  Math.ceil(
                                    filterOrdersByDate(v.orders).length /
                                      childRows
                                  )
                                }
                                onClick={() => setChildPage(childPage + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      

      <div class="w-full mt-6 overflow-x-auto whitespace-nowrap border p-4 md:grid md:grid-cols-6 border-t pt-4 bg-gray-50  rounded">
        <div class="inline-block mr-4 font-bold">Grand Totals</div>
        <div class="inline-block mr-4 font-bold px-8">{totals.orders}</div>
        <div class="inline-block mr-4 font-bold text-blue-500 px-8">
          ₹{totals.amount.toFixed(2)}
        </div>
        <div class="inline-block mr-4 font-bold px-10">
          ₹{totals.paid.toFixed(2)}
        </div>
        <div class="inline-block mr-4 font-bold text-red-600 px-2">
          ₹{totals.due.toFixed(2)}
        </div>
      </div>

      {/* Parent Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={vendorPage === 1}
          onClick={() => setVendorPage(vendorPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2">
          Page {vendorPage} of {totalVendorPages}
        </span>
        <button
          disabled={vendorPage === totalVendorPages}
          onClick={() => setVendorPage(vendorPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Outstanding;