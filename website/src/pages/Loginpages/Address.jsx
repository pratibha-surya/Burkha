// import React from 'react';
// import { Row, Col, Card, Button } from 'react-bootstrap';

// const Address = ({ user }) => {
  
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const cartItems = useSelector(state => state.mycart.cart);
  
//     // Calculate total amount and product names
//     const { totalAmount, productNames } = cartItems.reduce(
//       (acc, item) => ({
//         totalAmount: acc.totalAmount + (item.price * item.qnty),
//         productNames: [...acc.productNames, item.name]
//       }),
//       { totalAmount: 0, productNames: [] }
//     );
  
//     const productNameString = productNames.join(", ");
  
//     useEffect(() => {
//       const userDataStr = localStorage.getItem("user");
//       if (userDataStr) {
//         const userData = JSON.parse(userDataStr);
//         setFormData({
//           firstName: userData.user?.firmName || "",
         
//           address: userData.user?.address || "",
         
//           phone: userData.user?.mobile1 || "",
//           email: userData.user?.email || "",
        
//         });
//       }
//     }, []);
  
//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>My Address</h3>
//         <Button variant="success">Add New Address</Button>
//       </div>
//       <Row>
//         <Col md={6} className="mb-4">
//           <Card className="h-100 border-success border-2">
//             <Card.Body>
//               <div className="d-flex justify-content-between">
//                 <h5>Primary Address</h5>
//                 <div>
//                   <Button variant="outline-success" size="sm" className="me-2">Edit</Button>
//                   <Button variant="outline-danger" size="sm">Delete</Button>
//                 </div>
//               </div>
//               <hr />
//               <p className="mb-1"><strong>{firmName}</strong></p>
//               <p className="mb-1">{address}</p>
//               <p className="mb-1">Phone: {phone}</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} className="mb-4">
//           <Card className="h-100 border-0 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between">
//                 <h5>Office Address</h5>
//                 <div>
//                   <Button variant="outline-success" size="sm" className="me-2">Edit</Button>
//                   <Button variant="outline-danger" size="sm">Delete</Button>
//                 </div>
//               </div>
//               <hr />
//               <p className="mb-1"><strong>{firstName}</strong></p>
//               <p className="mb-1">{address}</p>
//               <p className="mb-1">Phone: {phone}</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Address;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Address = ({ user }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        firmName: '',
        address: '',
        phone: '',
        email: ''
    });
    const cartItems = useSelector(state => state.mycart.cart);
  
    // Calculate total amount and product names
    const { totalAmount, productNames } = cartItems.reduce(
        (acc, item) => ({
            totalAmount: acc.totalAmount + (item.price * item.qnty),
            productNames: [...acc.productNames, item.name]
        }),
        { totalAmount: 0, productNames: [] }
    );
  
    const productNameString = productNames.join(", ");
  
    useEffect(() => {
        const userDataStr = localStorage.getItem("user");
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            setFormData({
                firstName: userData.user?.firstName || "",
                firmName: userData.user?.firmName || "",
                address: userData.user?.address || "",
                phone: userData.user?.mobile1 || "",
                email: userData.user?.email || "",
            });
        }
    }, []);
  
    const { firmName, address, phone, firstName } = formData;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              
                <div>
  <h3 class="account-details-heading">My Address</h3>
</div>
                <Button variant="success">Add New Address</Button>
            </div>
            <Row>
                <Col md={6} className="mb-4">
                    <Card className="h-100 border-success border-2">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <h5>Primary Address</h5>
                                <div>
                                    <Button variant="outline-success" size="sm" className="me-2">Edit</Button>
                                    <Button variant="outline-danger" size="sm">Delete</Button>
                                </div>
                            </div>
                            <hr />
                            <p className="mb-1"><strong>{firmName}</strong></p>
                            <p className="mb-1">{address}</p>
                            <p className="mb-1">Phone: {phone}</p>
                            <p className="mb-0">Email: {formData.email}</p>
                        </Card.Body>
                    </Card>
                </Col>
                
            </Row>
        </div>
    );
};

export default Address;