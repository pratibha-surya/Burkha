// src/pages/CheckOut.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { clearCart } from "../../Redux/CardSlice";

const CheckOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.mycart.cart);

  const totalAmount = products.reduce(
    (acc, item) => acc + item.price * item.qnty,
    0
  );

  const productName = products.map((item) => item.name).join(", ");

  // Razorpay script loader
  useEffect(() => {
    const scriptId = "razorpay-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const initPay = (data) => {
    const options = {
      key: "rzp_test_o3vkPO5n8pMXdo", // Test key, replace with live in production
      amount: data.amount,
      currency: data.currency,
      description: "Order Payment",
      handler: async (response) => {
        try {
          const verifyURL = "http://localhost:8080/paymentuser/verify";
          await axios.post(verifyURL, response);

          message.success("Payment successful!");

          // Clear cart
          dispatch(clearCart());
          localStorage.removeItem("persist:cartData");

          // ✅ Redirect to thank you page using full page reload
          window.location.href = "/thank-you";
        } catch (error) {
          message.error("Payment verification failed.");
          console.error("Verification Error:", error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePay = async () => {
    if (products.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }

    try {
      setIsLoading(true);
      const orderURL = "http://localhost:8080/paymentuser/orders";
      const { data } = await axios.post(orderURL, {
        amount: totalAmount,
        productname: productName,
      });

      initPay(data.data);
    } catch (error) {
      message.error("Failed to create payment order.");
      console.error("Payment Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>

      <Row>
        {products.map((item, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card>
              <Card.Img
                variant="top"
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
              />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Price: ₹{item.price}</Card.Text>
                <Card.Text>Quantity: {item.qnty}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4">
        <h4>Total Amount: ₹{totalAmount}</h4>
        <Button variant="primary" onClick={handlePay} disabled={isLoading}>
          {isLoading ? "Processing..." : "Proceed to Pay"}
        </Button>
      </div>
    </Container>
  );
};

export default CheckOut;
