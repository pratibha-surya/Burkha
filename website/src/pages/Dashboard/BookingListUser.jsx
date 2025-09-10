import React, { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { fetchBookingById, deleteBooking } from "../../features/booking/bookingSlice";
import { Link } from "react-router-dom";

const BookingListUser = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.booking);
    const [selectedTests, setSelectedTests] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showTestModal, setShowTestModal] = useState(false);

    const handleViewTests = (tests) => {
        setSelectedTests(tests);
        setShowTestModal(true);
    };
    useEffect(() => {
        dispatch(fetchBookingById());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            dispatch(deleteBooking(id));
        }
    };

    if (loading) return <p className="text-center text-gray-600 py-4">Loading bookings...</p>;
    if (error) return <p className="text-center text-red-600 py-4">Error: {error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-center text-gray-600">No bookings found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Package/Test Name</th>
                                <th className="border p-2">Included Tests</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Booking Date</th>
                                <th className="border p-2">Status</th>
                                {/* <th className="border p-2">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const isPackage = !!booking.packageId;
                                const name = isPackage
                                    ? booking.packageId.name
                                    : booking.tests.length > 0
                                        ? booking.tests.map((test) => test.testId.name).join(", ")
                                        : "N/A";

                                const link = isPackage
                                    ? `/package/${booking.packageId._id}`
                                    : booking.tests.length > 0
                                        ? `/test/${booking.tests[0]?.testId._id}`
                                        : "#";

                                return (
                                    <tr key={booking._id} className="text-center border">
                                        <td className="border p-2">{isPackage ? "Package" : "Test"}</td>
                                        <td className="border p-2">
                                            <Link to={link} className="text-blue-500 hover:underline">
                                                {name}
                                            </Link>
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleViewTests(booking.tests)}
                                                className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary"
                                            >
                                                {booking.tests.length > 0 ? "View Tests" : "N/A"}
                                            </button>
                                        </td>
                                        <td className="border p-2">₹{booking.totalPrice.toFixed(0)}.00</td>
                                        <td className="border p-2">{new Date(booking.bookingDate).toLocaleString()}</td>
                                        <td className="border p-2">{booking.status || "N/A"}</td>
                                        {/* <td className="border p-2 flex justify-center gap-2">
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Test Details Modal */}
            {showTestModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg w-96 md:w-[50%]">
                        <h3 className="text-lg font-semibold mb-4">Test Details</h3>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Test Name</th>
                                    <th className="border p-2">Description</th>
                                    <th className="border p-2">Test Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTests.map((test) => (
                                    <tr key={test._id}>
                                        <td className="border p-2">{test.testId?.name}</td>
                                        <td className="border p-2">{test.testId?.description}</td>
                                        <td className="border p-2">₹{test.testId?.finalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={() => setShowTestModal(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingListUser;
