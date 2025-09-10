import React from "react";

const Orders = () => {
    const orders = [
        { id: 2416, date: "October 1, 2023", status: "On hold", total: "$1,200.65 for 3 items" },
        { id: 2417, date: "October 2, 2023", status: "On hold", total: "$1,200.65 for 3 items" },
        { id: 2418, date: "October 3, 2023", status: "On hold", total: "$1,200.65 for 3 items" },
        { id: 2419, date: "October 4, 2023", status: "On hold", total: "$1,200.65 for 3 items" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Orders</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Order</th>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 text-center">#{order.id}</td>
                                <td className="border px-4 py-2 text-center">{order.date}</td>
                                <td className="border px-4 py-2 text-center">{order.status}</td>
                                <td className="border px-4 py-2 text-center">{order.total}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button className="bg-primary text-white px-4 py-2 rounded">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
