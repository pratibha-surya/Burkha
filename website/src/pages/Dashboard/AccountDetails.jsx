import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/auth/AuthSlice";
import { toast } from "react-toastify";

const AccountDetails = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      const parsedUser = JSON.parse(userDetails);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        mobileNumber: parsedUser.mobileNumber || "",
        email: parsedUser.email || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUserData = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
    };

    dispatch(updateUser(updatedUserData));
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    toast.success("User details updated successfully!");
  };

  if (!user) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container bg-white shadow rounded p-4 p-md-5 mt-4">
      <h2 className="h4 fw-bold mb-4 text-dark">Account Detailss</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label text-muted">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="form-control"
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="form-control"
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="form-control"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
