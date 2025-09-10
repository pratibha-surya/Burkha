import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Menu & Close Icons

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle Sidebar Function
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close Sidebar on Link Click
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="container mx-auto  md:py-10 md:pt-16 relative">
            <div className="mb-4 px-2">
                <h1 className="text-xl md:text-2xl  font-bold ">My Accounts</h1>

                {/* Menu Icon (Visible on Mobile) */}
                <button
                    className="lg:hidden text-2xl absolute top-1 right-5 text-gray-700 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    {isSidebarOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row rounded-lg gap-16 overflow-hidden shadow-2xl">

                {/* Sidebar */}
                <aside className={`fixed lg:relative z-0 top-20 md:top-4 left-0 w-3/4 lg:w-1/4 bg-white border-r h-full p-4 space-y-2 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-10`}>

                    {/* Close Button (Mobile View) */}
                    {/* <button
                        className="lg:hidden absolute top-5 right-5 text-gray-700 text-2xl focus:outline-none"
                        onClick={closeSidebar}
                    >
                        <FiX />
                    </button> */}

                    <nav className="flex flex-col space-y-2 mt-10 lg:mt-0">
                        <NavLink to="/user" end className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink to="/user/booking-list" className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            Your Bookings
                        </NavLink>
                        <NavLink to="/user/cart-booking" className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            Your Cart Bookings
                        </NavLink>
                        <NavLink to="/user/addresses" className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            My Address
                        </NavLink>
                        <NavLink to="/user/account-details" className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            Account Details
                        </NavLink>
                        <NavLink to="/user/change-password" className={({ isActive }) =>
                            `py-2 px-4 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                            onClick={closeSidebar}
                        >
                            Change Password
                        </NavLink>
                        <NavLink to="/logout" className="py-2 px-4 hover:text-white rounded hover:bg-gray-900"
                            onClick={closeSidebar}
                        >
                            Logout
                        </NavLink>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 me-14">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
