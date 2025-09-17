import React from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const ThankYou = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || null;

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div
        className="bg-white shadow rounded-4 p-4 p-md-5 text-center w-100"
        style={{ maxWidth: "500px" }}
      >
        <div className="text-success mb-4">
          <CheckCircle size={64} />
        </div>

        <h1 className="h3 fw-bold mb-2">Thank You for Your Purchase!</h1>

        <p className="text-muted mb-4">
          Your order has been placed successfully. We'll send you an update once
          it’s ready to ship.
        </p>

        {/* Display Order ID if available */}
        {orderId && (
          <div className="alert alert-secondary py-2 mb-4">
            <strong>Order Number:</strong> {orderId}
          </div>
        )}

        <Link to="/" className="btn btn-primary px-4 py-2">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
