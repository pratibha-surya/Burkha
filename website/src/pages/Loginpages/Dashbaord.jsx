// import React from 'react';
// import { Row, Col, Card, Button } from 'react-bootstrap';
// import { Calendar, Cart, Person, GeoAlt, Gear } from 'react-bootstrap-icons';
// import { useSelector } from "react-redux";
// const Dashboard = ({ user }) => {
// const Product = useSelector((state) => state.mycart.cart);
//   const productLength = Product.length;
//  const [payments, setPayments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   // Fetch userId from localStorage
//   const userDataStr = localStorage.getItem("user");
//   const userId = userDataStr ? JSON.parse(userDataStr).user?._id : null;

//   // Fetch payment history
//   useEffect(() => {
//     const fetchPayments = async () => {
//       if (!userId) {
//         message.error("Please log in to view your payment history.");
//         navigate("/login");
//         return;
//       }

//       try {
//         setIsLoading(true);
//         const response = await axios.get(`http://localhost:8080/paymentuser/payments/${userId}`);
//         setPayments(response.data.data);
//       } catch (error) {
//         console.error("Error fetching payments:", error);
//         message.error("Failed to load payment history.");
//         setPayments([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [userId, navigate]);

//   return (
//     <div className='ms-12 '>
//       <div>
//   <h3 class="account-details-heading">Dashboard Overview</h3>
// </div>
//       {/* <h3 className="mb-4"></h3> */}
//       <Row>
//         <Col md={6} lg={4} className="mb-4">
//           <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
//             <Card.Body>
//               <div className="d-flex align-items-center">
//                 <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
//                   <Calendar size={24} className="text-success" />
//                 </div>
//                 <div>
//                   <h6 className="mb-1">Upcoming Bookings</h6>
//                   <h4 className="mb-0">3</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} lg={4} className="mb-4">
//           <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
//             <Card.Body>
//               <div className="d-flex align-items-center">
//                 <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
//                   <Cart size={24} className="text-success" />
//                 </div>
//                 <div>
//                   <h6 className="mb-1">Cart Items</h6>
//                   <h4 className="mb-0">  {productLength > 0 ? productLength : 0}</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} lg={4} className="mb-4">
//           <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
//             <Card.Body>
//               <div className="d-flex align-items-center">
//                 <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
//                   <Person size={24} className="text-success" />
//                 </div>
//                 <div>
//                   <h6 className="mb-1">Account Status</h6>
//                   <h4 className="mb-0">Active</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Card className="border-0 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">Welcome back, !</h5>
//           {/* <p className="text-muted">Here's what's happening with your account today.</p> */}
//           <hr />
//           <Row>
//             {/* <Col md={6}>
//               <h6 className="mb-3">Recent Activity</h6>
//               <ul className="list-unstyled">
//                 <li className="mb-2">
//                   <span className="badge bg-success me-2">✓</span>
//                   Booking confirmed for May 15
//                 </li>
//                 <li className="mb-2">
//                   <span className="badge bg-success me-2">✓</span>
//                   Payment received for order #12345
//                 </li>
//                 <li className="mb-2">
//                   <span className="badge bg-success me-2">✓</span>
//                   Profile updated successfully
//                 </li>
//               </ul>
//             </Col> */}
//             {/* <Col md={6}>
//               <h6 className="mb-3">Quick Actions</h6>
//               <Button variant="outline-success" className="me-2 mb-2">
//                 <Cart className="me-1" /> Book Service
//               </Button>
//               <Button variant="outline-success" className="me-2 mb-2">
//                 <GeoAlt className="me-1" /> Add Address
//               </Button>
//               <Button variant="outline-success" className="mb-2">
//                 <Gear className="me-1" /> Account Settings
//               </Button>
//             </Col> */}
//           </Row>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Calendar, Cart, Person, GeoAlt, Gear } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Dashboard = ({ user }) => {
  const Product = useSelector((state) => state.mycart.cart);
  const productLength = Product.length;
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState({});
  const navigate = useNavigate();

  // Fetch userId from localStorage
  const userDataStr = localStorage.getItem("user");
  const userId = userDataStr ? JSON.parse(userDataStr).user?._id : null;

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) {
        message.error("Please log in to view your payment history.");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/paymentuser/payments/${userId}`
        );
        setPayments(response.data.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        message.error("Failed to load payment history.");
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [userId, navigate]);

  return (
    <div className="ms-12 ">
      <div>
        <h3 class="account-details-heading">Dashboard Overview</h3>
      </div>
      <Row>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
                  <Calendar size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="mb-1">All Orders</h6>
                  <h4 className="mb-0">{payments.length}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
                  <Cart size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="mb-1">Cart Items</h6>
                  <h4 className="mb-0">
                    {productLength > 0 ? productLength : 0}
                  </h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 p-3 rounded-circle me-3">
                  <Person size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="mb-1">Account Status</h6>
                  <h4 className="mb-0">Active</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Welcome back</h5>
          <hr />
          <Row>{/* Additional content can be added here */}</Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
