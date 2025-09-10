// import React from 'react';
// import { Card, Form, Button } from 'react-bootstrap';

// const ChangePassword = () => {
//   return (
//     <div>

//                 <div>
//   <h3 class="account-details-heading">Change Password</h3>
// </div>
//       {/* <h3 className="mb-4">Change Password</h3> */}
//       <Card className="border-0 shadow-sm">
//         <Card.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Current Password</Form.Label>
//               <Form.Control type="password" placeholder="Enter current password" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>New Password</Form.Label>
//               <Form.Control type="password" placeholder="Enter new password" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Confirm New Password</Form.Label>
//               <Form.Control type="password" placeholder="Confirm new password" />
//             </Form.Group>
//             <Button variant="success">Update Password</Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ChangePassword;

import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [resetData, setResetData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error("New passwords don't match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:8080/user/resetpassword",
        {
          email: resetData.email,
          oldPassword: resetData.oldPassword,
          newPassword: resetData.newPassword,
          confirmPassword: resetData.confirmPassword,
        }
      );

      toast.success(response.data.message || "Password reset successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form after successful submission
      setResetData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h3 className="account-details-heading">Change Password</h3>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={resetData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Enter current password"
                value={resetData.oldPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={resetData.newPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={resetData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
