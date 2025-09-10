import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Cart = () => {
  return (
    <div>
      <h3 className="mb-4">Your Cart Bookings</h3>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AC Service</td>
                  <td>June 1, 2023</td>
                  <td>₹599</td>
                  <td>
                    <Button variant="outline-danger" size="sm" className="me-2">Remove</Button>
                    <Button variant="success" size="sm">Checkout</Button>
                  </td>
                </tr>
                <tr>
                  <td>Plumbing</td>
                  <td>June 5, 2023</td>
                  <td>₹799</td>
                  <td>
                    <Button variant="outline-danger" size="sm" className="me-2">Remove</Button>
                    <Button variant="success" size="sm">Checkout</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="success" size="lg">Proceed to Payment (₹1398)</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Cart;