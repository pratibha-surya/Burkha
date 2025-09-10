import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../features/auth/AuthSlice";
import { toast } from "react-toastify";

const PasswordChangeForm = () => {
    const dispatch = useDispatch();
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [errors, setErrors] = useState("");

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Validate if all fields are filled
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setErrors("All fields are required.");
            return;
        }

        // Validate new password and confirm new password
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setErrors("New password and confirm new password do not match.");
            return;
        }

        setErrors(""); // Clear previous errors

        const updatedPasswordData = {
            newPassword: passwordData.newPassword,
            oldPassword: passwordData.currentPassword,
        };

        try {
            const response = await dispatch(changePassword(updatedPasswordData)).unwrap();
            toast.success(response?.message || "Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (error) {
            toast.error(error?.message || "Failed to change password.");
        }
    };

    return (
        <form onSubmit={handlePasswordChange} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>

            {errors && <p className="text-red-500 text-sm mb-3">{errors}</p>}

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-gray-600 text-sm mb-2">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="Current Password"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 text-sm mb-2">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="New Password"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 text-sm mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="Confirm New Password"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-primary text-white rounded-lg px-6 py-3 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    Change Password
                </button>
            </div>
        </form>
    );
};

export default PasswordChangeForm;
