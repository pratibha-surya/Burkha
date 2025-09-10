import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addtoCart } from "../Redux/CardSlice";

const RecommendedOne = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const api = "http://localhost:8080/product/allproduct";

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get(api);
      console.log(response, "API response");

      // API sends courses inside response.data.data
      const coursesData = response.data.data || [];

      setCourses(coursesData);

      // Initialize selected sizes: pick first size if available
      const sizes = {};
      coursesData.forEach((course) => {
        const courseSizes = course.size
          ? Array.isArray(course.size)
            ? course.size
            : [course.size]
          : [];
        if (courseSizes.length > 0) {
          sizes[course._id] = courseSizes[0];
        }
      });
      setSelectedSizes(sizes);
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Error fetching course data");
    }
  };

  fetchCourses();
}, []);


  const handleCourseClick = (courseId) => {
    navigate(`/product-details/${courseId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/category");
        setCategories(res.data);
      } catch (error) {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const calculateDiscountedPrice = (price) => {
    const discount = user?.user?.discount || 0;
    if (discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  const handleSizeSelection = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCartClick = (course) => {
    if (!user?.user?.firmName) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const sizes = course.size
      ? Array.isArray(course.size)
        ? course.size
        : [course.size]
      : [];

    if (sizes.length > 1) {
      setCurrentProduct(course);
      setShowSizeModal(true);
    } else {
      handleaddtoCart(course, sizes[0] || "");
    }
  };

  

  const handleaddtoCart = (course, size) => {
    if (!user?.user?.firmName) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    dispatch(
      addtoCart({
        id: course._id,
        name: course.name,
        price: calculateDiscountedPrice(course.price),
        image: course.images?.[0] || "https://via.placeholder.com/150",
        qnty: 1,
        size: size || "N/A", // Include selected size in cart item
        productId: course._id, // Use this to group same products
        sizeOptions: course.size || [], // Include all available sizes
      })
    );

    toast.success(`${course.name} (Size: ${size || "N/A"}) added to cart!`);
    setShowSizeModal(false);
  };

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.category?.name === activeCategory);

  return (
    <section className="recommended">
      <div className="container container-lg mt-24">
        <div className="section-heading flex-between flex-wrap gap-16">
          <h5 className="mb-0">Recommended for you</h5>
        
        </div>

        {showSizeModal && currentProduct && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Size</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSizeModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex flex-wrap gap-2">
                    {currentProduct.size.map((size) => (
                      <button
                        key={size}
                        className={`btn ${
                          selectedSizes[currentProduct._id] === size
                            ? "btn-success"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          handleSizeSelection(currentProduct._id, size)
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowSizeModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      handleaddtoCart(
                        currentProduct,
                        selectedSizes[currentProduct._id]
                      )
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-all"
            role="tabpanel"
            aria-labelledby="pills-all-tab"
            tabIndex={0}
          >
            <div className="row g-12">
              {filteredCourses &&
                filteredCourses.map((course) => {
                  const discountedPrice = calculateDiscountedPrice(
                    course.price
                  );
                  const showOriginalPrice =
                    user?.user?.discount > 0 &&
                    discountedPrice !== course.price;
                  const sizes = course.size
                    ? Array.isArray(course.size)
                      ? course.size
                      : [course.size]
                    : [];
                  const selectedSize =
                    selectedSizes[course._id] ||
                    (sizes.length > 0 ? sizes[0] : "");

                  return (
                    <div
                      className="col-xxl-2 col-lg-3 col-sm-4 col-6"
                      key={course._id}
                    >
                      <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <div
                          onClick={() => handleCourseClick(course._id)}
                          className="product-card__thumb flex-center cursor-pointer"
                        >
                          <img
                            src={
                              course.images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={course.name}
                          />
                        </div>

                        <div className="product-card__content p-3 rounded-lg shadow-sm bg-white hover:shadow-md transition duration-300">
                          <h6 className="title text-lg fw-semibold mt-3 mb-3 text-dark">
                            <div
                              onClick={() => handleCourseClick(course._id)}
                              className="link text-line-2 cursor-pointer text-success"
                            >
                              {course.name}
                            </div>
                          </h6>

                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="text-success text-md me-2">
                                <i className="ph-fill ph-storefront text-success fs-5" />
                              </span>
                              <span className="text-muted text-sm">
                                {course.fabric || "No fabric specified"}
                              </span>
                            </div>
                            <span className="text-end text-sm text-dark fw-semibold">
                              Size:{" "}
                              <span className="text-success">
                                {sizes.length > 1 ? (
                                  <select
                                    className="form-select form-select-sm d-inline-block w-auto"
                                    value={selectedSize}
                                    onChange={(e) =>
                                      handleSizeSelection(
                                        course._id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    {sizes.map((size) => (
                                      <option key={size} value={size}>
                                        {size}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  sizes.join(", ")
                                )}
                              </span>
                            </span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-end text-sm text-dark fw-semibold">
                              Color:{" "}
                              <span className="text-success">
                                {course.color}
                              </span>
                            </span>
                          </div>

                          <div className="product-card__content mt-3">
                            <div className="product-card__price mb-3 d-flex align-items-center gap-3">
                              {showOriginalPrice && (
                                <span className="text-muted text-decoration-line-through fw-semibold">
                                  ₹{course.price.toFixed(2)}
                                </span>
                              )}
                              <span className="text-success fw-bold fs-5">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              {user?.user?.discount > 0 && (
                                <span className="badge bg-danger ms-2">
                                  {user.user.discount}% OFF
                                </span>
                              )}
                            </div>

                            <span className="text-sm fw-semibold text-success">
                              {course.stock}:
                              <span className="fw-normal text-muted">
                                {" "}
                                Stock{" "}
                              </span>
                            </span>

                            <button
                              onClick={() => handleAddToCartClick(course)}
                              className="product-card__cart btn btn-success mt-3 w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                            >
                              Add To Cart <i className="ph ph-shopping-cart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {filteredCourses.length === 0 && (
                <div className="col-12 text-center mt-4">
                  <p>No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedOne;

