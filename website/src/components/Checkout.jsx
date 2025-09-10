
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Redux/CardSlice";
import axios from "axios";

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("payment1");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postCode: "",
    phone: "",
    email: "",
    notes: "",
    chequeNumber: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = useSelector((state) => state.mycart.cart);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Calculate total amount and product names
  const discount = user?.user?.discount || 0;
  const hasDiscount = discount !== null;

  const { totalAmount, productNameString } = cartItems.reduce(
    (acc, item) => {
      const itemTotal = item.price * item.qnty;
      const discountedItemTotal = itemTotal - (itemTotal * discount) / 100;

      return {
        totalAmount: acc.totalAmount + discountedItemTotal,
        productNameString: acc.productNameString
          ? `${acc.productNameString}, ${item.name}`
          : item.name,
      };
    },
    { totalAmount: 0, productNameString: "" }
  );

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setFormData({
        firstName: userData.user?.firmName || "",
        lastName: "",
        businessName: userData.user?.contactType || "",
        country: "India",
        address: userData.user?.address || "",
        apartment: "",
        city: userData.user?.city || "",
        state: userData.user?.state || "",
        postCode: userData.user?.pincode || "",
        phone: userData.user?.mobile1 || "",
        email: userData.user?.email || "",
        notes: "",
        chequeNumber: "",
      });
    }
  }, []);

  const initPay = (data) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_o3vkPO5n8pMXdo",
      amount: data.amount,
      currency: data.currency,
      name: "Your Company Name",
      description: `Order for ${productNameString}`,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "http://localhost:8080/paymentuser/verify";
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const { data: verificationData } = await axios.post(
            verifyURL,
            verifyPayload,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (verificationData.success) {
            message.success("Payment successful!");
            dispatch(clearCart());
            window.localStorage.removeItem("persist:cartData");
            navigate("/thank-you", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                verification: verificationData,
              },
            });
          } else {
            message.error(
              verificationData.message || "Payment verification failed"
            );
          }
        } catch (error) {
          console.error(
            "Verification error:",
            error.response?.data || error.message
          );
          message.error(
            error.response?.data?.message || "Payment verification failed."
          );
        }
      },
      theme: { color: "#3399cc" },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      notes: { address: formData.address },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async () => {
    if (cartItems.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }

    if (
      !formData.firstName ||
      !formData.address ||
      !formData.phone ||
      !formData.email
    ) {
      message.warning("Please fill in all required details.");
      return;
    }

    if (selectedPayment === "payment2" && !formData.chequeNumber) {
      message.warning("Please enter a cheque number.");
      return;
    }

    try {
      setIsLoading(true);
      const orderURL = "http://localhost:8080/paymentuser/orders";
      console.log(orderURL)

      const userDataStr = localStorage.getItem("user");
      const userId = userDataStr ? JSON.parse(userDataStr).user?._id : "guest";

      const cartData = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.qnty,
        price: item.price,
      }));

      const payload = {
        amount: totalAmount,
        productname: productNameString,
        cartItems: cartData,
        FirstName: formData.firstName,
        address: formData.address,
        email: formData.email,
        id: userId,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        postCode: formData.postCode,
        paymentMode: selectedPayment,
        chequeNumber:
          selectedPayment === "payment2" ? formData.chequeNumber : undefined,
      };

      const { data } = await axios.post(orderURL, payload);

      if (selectedPayment === "payment1" || selectedPayment === "payment4") {
        initPay(data.data);
      } else {
        message.success("Order placed successfully, awaiting confirmation.");
        navigate("/", { state: { orderId: data.data.id } });
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create order.");
      console.error(
        "Order creation error:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="checkout py-80">
      <div className="container container-lg">
        <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
          <span>
            Have a coupon?{" "}
            <Link
              to="/cart"
              className="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
            >
              Click here to enter your code
            </Link>
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <form className="pe-xl-5">
              <div className="row gy-3">
                <div className="col-sm-6 col-xs-6">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-sm-6 col-xs-6">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                     required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                     required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="Country *"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="House number and street name *"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="Apartment, suite, unit, etc. (Optional)"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                     required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="State *"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="common-input border-gray-100"
                    placeholder="Post Code"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleChange}
                     required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="tel"
                    className="common-input border-gray-100"
                    placeholder="Phone *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="email"
                    className="common-input border-gray-100"
                    placeholder="Email Address *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {selectedPayment === "payment2" && (
                  <div className="col-12">
                    <input
                      type="text"
                      className="common-input border-gray-100"
                      placeholder="Cheque Number *"
                      name="chequeNumber"
                      value={formData.chequeNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="col-12">
                  <div className="my-40">
                    <h6 className="text-lg mb-24">Additional Information</h6>
                    <textarea
                      className="common-input border-gray-100"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-xl-3 col-lg-4">
            <div className="checkout-sidebar">
              <div className="bg-color-three rounded-8 p-24 text-center">
                <span className="text-gray-900 text-xl fw-semibold">
                  Your Order
                </span>
              </div>
              <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">
                    Product
                  </span>
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">
                    Subtotal
                  </span>
                </div>

                {cartItems.map((item, index) => (
                  <div className="flex-between gap-24 mb-32" key={index}>
                    <div className="flex-align gap-12">
                      <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                        {item.name}
                      </span>
                      <span className="text-gray-900 fw-normal text-md font-heading-two">
                        <i className="ph-bold ph-x" />
                      </span>
                      <span className="text-gray-900 fw-semibold text-md font-heading-two">
                        {item.qnty}
                      </span>
                    </div>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">
                      ₹{item.price * item.qnty}
                    </span>
                  </div>
                ))}

                <div className="border-top border-gray-100 pt-30 mt-30">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Subtotal
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      ₹{totalAmount}
                    </span>
                  </div>
                  <div className="mb-0 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Total
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-32">
                {[
                  { id: "payment1", label: "Online Payment" },
                  // { id: "payment2", label: "Check Payments" },
                  {
                    id: "payment3",
                    label: "Cash on Delivery",
                    disabled: hasDiscount,
                  },
                  // { id: "payment4", label: "Online Payment (Razorpay)" },
                ].map((payment) => (
                  <div className="payment-item" key={payment.id}>
                    <div className="form-check common-check common-radio py-16 mb-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id={payment.id}
                        checked={selectedPayment === payment.id}
                        onChange={handlePaymentChange}
                        disabled={payment.disabled}
                      />
                      <label
                        className={`form-check-label fw-semibold ${
                          payment.disabled
                            ? "text-gray-400"
                            : "text-neutral-600"
                        }`}
                        htmlFor={payment.id}
                      >
                        {payment.label}
                        {payment.disabled && (
                          <span className="text-xs text-danger ms-2">
                            (Not available)
                          </span>
                        )}
                      </label>
                    </div>
                    {selectedPayment === payment.id && (
                      <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                        <p className="text-gray-800">
                          {payment.id === "payment1" &&
                            "Make your payment directly into our bank account. Please use your Order ID as the payment reference."}
                          {payment.id === "payment2" &&
                            "Please send a check to our store address."}
                          {payment.id === "payment3" &&
                            "Pay with cash upon delivery."}
                          {payment.id === "payment4" &&
                            "Secure online payment through Razorpay. You will be redirected to their payment gateway."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-32 pt-32 border-top border-gray-100">
                <p className="text-gray-500">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link
                    to="#"
                    className="text-main-600 text-decoration-underline"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
                <button
                  className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
                  type="button"
                  onClick={handlePay}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
