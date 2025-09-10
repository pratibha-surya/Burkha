import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCountdown } from "../helper/Countdown";
import axios from "axios";
import { toast } from "react-toastify";

const BestSellsOne = () => {
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [courses, setCourses] = useState([]);
  const [filterText, setFilterText] = useState("");

  const api = "http://localhost:8080/product";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(api);
        setCourses(response.data);
      } catch (error) {
        toast.error("Error fetching course data");
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="best sells pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">Daily Best Sells</h5>
          </div>
        </div>
        <div className="row g-12">
          <div className="col-xxl-8">
            <div className="row gy-4">
              {courses.map((course) => (
                <div className="col-md-6" key={course.id}>
                  <div className="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                    <div className="">
                      <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                        Sale 50%{" "}
                      </span>
                      <Link
                        to="/product-details"
                        className="product-card__thumb flex-center"
                      >
                        <img
                          src={
                            course.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={course.name}
                        />
                      </Link>
                      <div className="countdown" id="countdown6">
                        <ul className="countdown-list style-three flex-align flex-wrap">
                          <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                            <span className="hours" />
                            {timeLeft.hours} Hours
                          </li>
                          <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                            <span className="minutes" />
                            {timeLeft.minutes} Min
                          </li>
                          <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                            <span className="seconds" />
                            {timeLeft.seconds} Sec
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="product-card__content">
                      <div className="product-card__price mb-16">
                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                          {course.price}
                        </span>
                        <span className="text-heading text-md fw-semibold ">
                          {course.stock}{" "}
                          <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                        </span>
                      </div>
                      <div className="flex-align gap-6">
                        <span className="text-xs fw-bold text-gray-600">
                          4.8
                        </span>
                        <span className="text-15 fw-bold text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-xs fw-bold text-gray-600">
                          {course.price}
                        </span>
                      </div>
                      <h6 className="title text-lg fw-semibold mt-12 mb-8">
                        <Link
                          to="/product-details"
                          className="link text-line-2"
                        >
                          {course.name}
                        </Link>
                      </h6>
                      <div className="flex-align gap-4">
                        <span className="text-main-600 text-md d-flex">
                          <i className="ph-fill ph-storefront" />
                        </span>
                        <span className="text-gray-500 text-xs">
                          {course.fabric}
                        </span>
                      </div>
                      <div className="mt-12">
                        <div
                          className="progress w-100  bg-color-three rounded-pill h-4"
                          role="progressbar"
                          aria-valuenow={35}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-main-600 rounded-pill"
                            style={{ width: "35%" }}
                          />
                        </div>
                        <span className="text-gray-900 text-xs fw-medium mt-8">
                          Sold: 18/35
                        </span>
                      </div>
                      <Link
                        to="/cart"
                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                      >
                        Add To Cart <i className="ph ph-shopping-cart" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 text-center">
              <div className="">
                <img
                  src="assets/images/bg/special-snacks.png"
                  alt=""
                  className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
                />
                <div className="d-xxl-block d-none">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4fBPRMDqsuMH1Bv1CFlC-5SGAsgmbeU9sNA&s"
                    alt=""
                  />
                </div>
              </div>
              <div className="py-xl-4">
                <h4 className="mb-8">Special Offer</h4>
                <div className="countdown my-32" id="countdown5">
                  <ul className="countdown-list style-two flex-center flex-wrap">
                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium colon-white">
                      <span className="hours" />
                      {timeLeft.hours} Hours
                    </li>
                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium colon-white">
                      <span className="minutes" />
                      {timeLeft.minutes} Min
                    </li>
                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium colon-white">
                      <span className="seconds" />
                      {timeLeft.seconds} Sec
                    </li>
                  </ul>
                </div>
                <Link
                  to="/shop"
                  className="mt-16 btn btn-main-two fw-medium d-inline-flex align-items-center rounded-pill gap-8"
                  tabIndex={0}
                >
                  Shop Now
                  <span className="icon text-xl d-flex">
                    <i className="ph ph-arrow-right" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellsOne;
