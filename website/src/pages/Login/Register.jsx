import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ColorInit from "../../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import HeaderOne from "../../components/HeaderOne";
import FooterOne from "../../components/FooterOne";
import BottomFooter from "../../components/BottomFooter";

const Registration = () => {
  const formik = useFormik({
    initialValues: {
      firmName: "",
      mobile1: "",
      email: "",
      address: "",
      password: "",
    },
    validationSchema: Yup.object({
      firmName: Yup.string().required("Company name is required"),
      mobile1: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
        .required("Mobile number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      address: Yup.string().required("Address is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/auth/register`,
          values
        );
        console.log("Registration successful:", response.data);
        toast.success("Registration successful!");
        formik.resetForm();
      } catch (error) {
        console.error("Registration failed:", error.response?.data);
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    },
  });

  return (
    <>
      <ColorInit color={false} />
      <ScrollToTop smooth color="#299E60" />
      <HeaderOne category={true} />

      <div
        className="bg-success bg-opacity-10 py-5"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                <div className="card-header bg-success text-white py-3">
                  <h2 className="card-title text-center mb-0">
                    <i className="bi bi-building me-2"></i>Registration
                  </h2>
                </div>
                <div className="card-body p-4 bg-white">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="firmName" className="form-label fw-bold">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-1 ${
                          formik.touched.firmName && formik.errors.firmName
                            ? "is-invalid"
                            : ""
                        }`}
                        id="firmName"
                        name="firmName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firmName}
                        placeholder="Enter your company name"
                      />
                      {formik.touched.firmName && formik.errors.firmName && (
                        <div className="invalid-feedback">
                          {formik.errors.firmName}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mobile1" className="form-label fw-bold">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light rounded-1">
                          +91
                        </span>
                        <input
                          type="text"
                          className={`form-control rounded-1 ${
                            formik.touched.mobile1 && formik.errors.mobile1
                              ? "is-invalid"
                              : ""
                          }`}
                          id="mobile1"
                          name="mobile1"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.mobile1}
                          placeholder="9876543210"
                          maxLength="10"
                        />
                      </div>
                      {formik.touched.mobile1 && formik.errors.mobile1 && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.mobile1}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-bold">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control rounded-1 ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="company@example.com"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label fw-bold">
                        Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className={`form-control rounded-1 ${
                          formik.touched.address && formik.errors.address
                            ? "is-invalid"
                            : ""
                        }`}
                        id="address"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        rows="3"
                        placeholder="Enter your address with pin code"
                      ></textarea>
                      {formik.touched.address && formik.errors.address && (
                        <div className="invalid-feedback">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-bold">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control rounded-1 ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        placeholder="Create a password (min 6 characters)"
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg rounded-1 fw-bold py-2"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Registering...
                          </>
                        ) : (
                          "Register Now"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-footer bg-light text-center py-3">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-success fw-bold">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </div>

      <FooterOne />
      <BottomFooter />
    </>
  );
};

export default Registration;
