import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s+-]{10,}$/.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid phone number (at least 10 digits)";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/contact/add",
        formData
      );
      setSubmitStatus({
        success: true,
        message: "Your message has been sent successfully!",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "Failed to send message. Please try again later.";
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors.join(", ");
      }

      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact py-80">
      <div className="container container-lg">
        <div className="row gy-5">
          <div className="col-lg-8">
            <div className="contact-box border border-gray-100 rounded-16 px-24 py-40">
              <form onSubmit={handleSubmit}>
                <h6 className="mb-32">Make Custom Request</h6>
                {submitStatus && (
                  <div
                    className={`alert ${
                      submitStatus.success ? "alert-success" : "alert-danger"
                    } mb-32`}
                  >
                    {submitStatus.message}
                  </div>
                )}
                <div className="row gy-4">
                  <div className="col-sm-6 col-xs-6">
                    <label
                      htmlFor="name"
                      className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                    >
                      Full Name{" "}
                      <span className="text-danger text-xl line-height-1">
                        *
                      </span>{" "}
                    </label>
                    <input
                      type="text"
                      className={`common-input px-16 ${
                        errors.name ? "border-danger" : ""
                      }`}
                      id="name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="text-danger text-xs mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 col-xs-6">
                    <label
                      htmlFor="email"
                      className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                    >
                      Email Address{" "}
                      <span className="text-danger text-xl line-height-1">
                        *
                      </span>{" "}
                    </label>
                    <input
                      type="email"
                      className={`common-input px-16 ${
                        errors.email ? "border-danger" : ""
                      }`}
                      id="email"
                      name="email"
                      placeholder="email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="text-danger text-xs mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 col-xs-6">
                    <label
                      htmlFor="phone"
                      className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                    >
                      Phone Number
                      <span className="text-danger text-xl line-height-1">
                        *
                      </span>{" "}
                    </label>
                    <input
                      type="tel"
                      className={`common-input px-16 ${
                        errors.phone ? "border-danger" : ""
                      }`}
                      id="phone"
                      name="phone"
                      placeholder="Phone Number*"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="text-danger text-xs mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 col-xs-6">
                    <label
                      htmlFor="subject"
                      className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                    >
                      Subject
                      <span className="text-danger text-xl line-height-1">
                        *
                      </span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input px-16"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-12">
                    <label
                      htmlFor="message"
                      className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                    >
                      Message
                      <span className="text-danger text-xl line-height-1">
                        *
                      </span>{" "}
                    </label>
                    <textarea
                      className={`common-input px-16 ${
                        errors.message ? "border-danger" : ""
                      }`}
                      id="message"
                      name="message"
                      placeholder="Type your message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && (
                      <div className="text-danger text-xs mt-1">
                        {errors.message}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-12 mt-32">
                    <button
                      type="submit"
                      className="btn btn-main py-18 px-32 rounded-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Get a Quote"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-box border border-gray-100 rounded-16 px-24 py-40">
              <h6 className="mb-48">Get In Touch</h6>
              <div className="flex-align gap-16 mb-16">
                <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                  <i className="ph-fill ph-phone-call" />
                </span>
                <Link
                  to="tel:+00123456789"
                  className="text-md text-gray-900 hover-text-main-600"
                >
                  +919368298145
                </Link>
              </div>
              <div className="flex-align gap-16 mb-16">
                <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                  <i className="ph-fill ph-envelope" />
                </span>
                <Link
                  to="mailto:support24@marketpro.com"
                  className="text-md text-gray-900 hover-text-main-600"
                >
                  admin@mgmail.com
                </Link>
              </div>
              <div className="flex-align gap-16 mb-0">
                <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                  <i className="ph-fill ph-map-pin" />
                </span>
                <span className="text-md text-gray-900">
                  3rd Floor,2170,Matia Mahal Kalyan Pura , Main Bazar, Turkman
                  Gate, <br /> Nera Masid Dlehi-110006 GSTIN/UIN:
                  07AMVPU7646P1ZM <br />
                  State Name : Delhi, Code : 07
                </span>
              </div>
            </div>
            <div className="mt-24 flex-align flex-wrap gap-16"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
