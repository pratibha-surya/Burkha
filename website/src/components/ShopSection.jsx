// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { addtoCart } from '../../src/Redux/CardSlice';

// const ShopSection = ({subcategoryId,searchProductData}) => {
//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [grid, setGrid] = useState(false);
//   const [active, setActive] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [user, setUser] = useState(null);
//   const [selectedSizes, setSelectedSizes] = useState({});
//   const [showSizeModal, setShowSizeModal] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
// // const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

//   const dataredux = useSelector(state => state.searchSlice)

//   console.log(dataredux);

// // const gettingdata = async (subcategoryId)=>{
// //     console.log(subcategoryId,"subhai bhai");
// //     const response  = await axios.get(`http://localhost:8080/product/subcategory/${subcategoryId}`)
// //     console.log(response);

// //   }

// //   gettingdata();

// console.log(searchProductData,"data aaya hai");

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   }, []);

//   const handleCourseClick = (courseId) => {
//     navigate(`/product-details/${courseId}`);
//   };

//   const discount = user?.user?.discount || 0;
//   const api = 'http://localhost:8080/product';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [categoriesRes, coursesRes] = await Promise.all([
//           axios.get('http://localhost:8080/category'),
//           axios.get(api)
//         ]);
//         setCategories(categoriesRes.data);
//         setCourses(coursesRes.data);

//         // Initialize selected sizes
//         const sizes = {};
//         coursesRes.data.forEach(course => {
//           const courseSizes = course.size ? (Array.isArray(course.size) ? course.size : [course.size]) : [];
//           if (courseSizes.length > 0) {
//             sizes[course._id] = courseSizes[0];
//           }
//         });
//         setSelectedSizes(sizes);
//       } catch (error) {
//         setError('Error fetching data');
//         toast.error('Error fetching data');
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate discounted price
//   const calculateDiscountedPrice = (price) => {
//     if (discount > 0) {
//       return Math.round(price * (1 - discount / 100));
//     }
//     return price;
//   };

//   console.log(courses,"data poora aa rha hai");

// //  if(subcategoryId){
// // useEffect(() => {

// const filteredCourses = courses.filter(course => {

//   return course.subCategory?._id === subcategoryId.id
// })

// // }, [subcategoryId])

//     // Match by subCategory._id or subCategory string
//     // const subCatId = course.subCategory?._id || course.subCategory;

// //  }else{
// //   const filteredCourses = activeCategory === 'All'
// //     ? courses
// //     : courses.filter((course) => course.category?.name === activeCategory);
// //  }

// //  const data = filteredCourses ? filteredCourses.map((datat)=>{
//     // console.log(datat.subCategory?._id,"from filter ");
//       // console.log(datat.subCategory?._id);

// //     return datat.subCategory?._id === subcategoryId.id

// //   }) : "10"

// // console.log(data);

//   const sidebarController = () => {
//     setActive(!active);
//   };

//   const handleSizeSelection = (productId, size) => {
//     setSelectedSizes(prev => ({
//       ...prev,
//       [productId]: size
//     }));
//   };

//   const handleAddToCartClick = (course) => {
//     if (!user?.user?.firmName) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     const sizes = course.size ? (Array.isArray(course.size) ? course.size : [course.size]) : [];

//     if (sizes.length > 1) {
//       setCurrentProduct(course);
//       setShowSizeModal(true);
//     } else {
//       handleaddtoCart(course, sizes[0] || 'One Size');
//     }
//   };

//   const handleaddtoCart = (course, size) => {
//     if (!user?.user?.firmName) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     dispatch(
//       addtoCart({
//         id: course._id,
//         name: course.name,
//         price: calculateDiscountedPrice(course.price),
//         image: course.images?.[0] || 'assets/images/thumbs/product-two-img5.png',
//         qnty: 1,
//         size: size
//       })
//     );

//     toast.success(`${course.name} (Size: ${size}) added to cart!`);
//     setShowSizeModal(false);
//   };

//   if (loading) {
//     return (
//       <section className="shop py-80">
//         <div className="container container-lg">
//           <div className="row">
//             <div className="col-12 text-center">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="shop py-80">
//         <div className="container container-lg">
//           <div className="row">
//             <div className="col-12 text-center text-danger">
//               {error}
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="shop py-80">
//       <div className={`side-overlay ${active && 'show'}`}></div>
//       <div className="container container-lg">
//         <div className="row">
//           {/* Sidebar Start */}
//           <div className="col-lg-3">
//             <div className={`shop-sidebar ${active && 'active'}`}>
//               <button
//                 onClick={sidebarController}
//                 type="button"
//                 className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
//               >
//                 <i className="ph ph-x" />
//               </button>
//               <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
//                 <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
//                   Product Category
//                 </h6>
//                 <ul className="max-h-540 overflow-y-auto scroll-sm">
//                   <li className="mb-24">
//                     <div
//                       className={`text-gray-900 hover-text-main-600 cursor-pointer ${
//                         activeCategory === 'All' ? 'text-main-600' : ''
//                       }`}
//                       onClick={() => setActiveCategory('All')}
//                     >
//                       All ({courses.length})
//                     </div>
//                   </li>
//                   {categories.map((category) => (
//                     <li key={category._id} className="mb-24">
//                       <div
//                         className={`text-gray-900 hover-text-main-600 cursor-pointer ${
//                           activeCategory === category.name ? 'text-main-600' : ''
//                         }`}
//                         onClick={() => setActiveCategory(category.name)}
//                       >
//                         {category.name} (
//                         {courses.filter((course) => course.category?.name === category.name).length}
//                         )
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//           {/* Sidebar End */}

//           {/* Content Start */}
//           <div className="col-lg-9">
//             {/* Top Start */}
//             <div className="flex-between gap-16 flex-wrap mb-40">
//               <span className="text-gray-900">
//                 Showing 1-{filteredCourses.length} of {filteredCourses.length} results
//               </span>
//               <div className="position-relative flex-align gap-16 flex-wrap">
//                 <div className="list-grid-btns flex-align gap-16">
//                   <button
//                     type="button"
//                     onClick={() => setGrid(true)}
//                     className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
//                       grid && 'border-main-600 text-white bg-main-600'
//                     }`}
//                   >
//                     <i className="ph-bold ph-list-dashes" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setGrid(false)}
//                     className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
//                       !grid && 'border-main-600 text-white bg-main-600'
//                     }`}
//                   >
//                     <i className="ph ph-squares-four" />
//                   </button>
//                 </div>
//                 <div className="position-relative text-gray-500 flex-align gap-4 text-14">
//                 </div>
//                 <button
//                   onClick={sidebarController}
//                   type="button"
//                   className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
//                 >
//                   <i className="ph-bold ph-funnel" />
//                 </button>
//               </div>
//             </div>
//             {/* Top End */}

//             {/* Size Selection Modal */}
//             {showSizeModal && currentProduct && (
//               <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
//                 <div className="modal-dialog modal-dialog-centered">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title">Select Size</h5>
//                       <button type="button" className="btn-close" onClick={() => setShowSizeModal(false)}></button>
//                     </div>
//                     <div className="modal-body">
//                       <div className="d-flex flex-wrap gap-2">
//                         {currentProduct.size.map((size) => (
//                           <button
//                             key={size}
//                             className={`btn ${selectedSizes[currentProduct._id] === size ? 'btn-success' : 'btn-outline-secondary'}`}
//                             onClick={() => handleSizeSelection(currentProduct._id, size)}
//                           >
//                             {size}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="modal-footer">
//                       <button
//                         type="button"
//                         className="btn btn-secondary"
//                         onClick={() => setShowSizeModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-primary"
//                         onClick={() => handleaddtoCart(currentProduct, selectedSizes[currentProduct._id])}
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid */}
//             <div className={`list-grid-wrapper ${grid && 'list-view'}`}>
//               {filteredCourses.length > 0 ? (
//                 filteredCourses.map((course) => {
//                   const discountedPrice = calculateDiscountedPrice(course.price);
//                   const showOriginalPrice = discount > 0 && discountedPrice !== course.price;
//                   const sizes = course.size ? (Array.isArray(course.size) ? course.size : [course.size]) : [];
//                   const selectedSize = selectedSizes[course._id] || (sizes.length > 0 ? sizes[0] : 'One Size');

//                   return (
//                     <div
//                       key={course._id}
//                       className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
//                     >
//                       <div
//                         onClick={() => handleCourseClick(course._id)}
//                         className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative cursor-pointer"
//                       >
//                         <img
//                           src={course.images?.[0] || 'assets/images/thumbs/product-two-img5.png'}
//                           alt={course.name}
//                           className="w-auto max-w-unset"
//                         />
//                       </div>

//                       <div className="product-card__content p-3 rounded-lg shadow-sm bg-white hover:shadow-md transition duration-300">
//                         <h6 className="title text-lg fw-semibold mt-3 mb-3 text-dark">
//                           <div
//                             onClick={() => handleCourseClick(course._id)}
//                             className="link text-line-2 cursor-pointer text-success"
//                           >
//                             {course.name}
//                           </div>
//                         </h6>

//                         <div className="d-flex align-items-center justify-content-between mb-2">
//                           <div className="d-flex align-items-center gap-2">
//                             <span className="text-success text-md me-2">
//                               <i className="ph-fill ph-storefront text-success fs-5" />
//                             </span>
//                             <span className="text-muted text-sm">
//                               {course.fabric || "No fabric specified"}
//                             </span>
//                           </div>
//                           <span className="text-end text-sm text-dark fw-semibold">
//                             Size: <span className="text-success">
//                               {sizes.length > 1 ? (
//                                 <select
//                                   className="form-select form-select-sm d-inline-block w-auto"
//                                   value={selectedSize}
//                                   onChange={(e) => handleSizeSelection(course._id, e.target.value)}
//                                 >
//                                   {sizes.map(size => (
//                                     <option key={size} value={size}>{size}</option>
//                                   ))}
//                                 </select>
//                               ) : (
//                                 sizes.join(', ') || 'One Size'
//                               )}
//                             </span>
//                           </span>
//                         </div>

//                         <div className="product-card__content mt-3">
//                           <div className="product-card__price mb-3 d-flex align-items-center gap-3">
//                             {showOriginalPrice && (
//                               <span className="text-muted text-decoration-line-through fw-semibold">
//                                 ₹{course.price}
//                               </span>
//                             )}
//                             <span className="text-success fw-bold fs-5">
//                               ₹{discountedPrice}
//                             </span>
//                             {discount > 0 && (
//                               <span className="badge bg-danger ms-2">
//                                 {discount}% OFF
//                               </span>
//                             )}
//                           </div>

//                           <span className="text-sm fw-semibold text-success">
//                             {course.stock}:
//                             <span className="fw-normal text-muted"> Stock </span>
//                           </span>

//                           <button
//                             onClick={() => handleAddToCartClick(course)}
//                             className="product-card__cart btn btn-success mt-3 w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
//                           >
//                             Add To Cart <i className="ph ph-shopping-cart" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found in this category</h4>
//                 </div>
//               )}
//             </div>

//             {/* Pagination Start */}
//             {filteredCourses.length > 0 && (
//               <ul className="pagination flex-center flex-wrap gap-16 mt-40">
//                 <li className="page-item">
//                   <Link
//                     className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
//                     to="#"
//                   >
//                     <i className="ph-bold ph-arrow-left" />
//                   </Link>
//                 </li>
//                 {[1, 2, 3, 4, 5, 6, 7].map((page) => (
//                   <li key={page} className={`page-item ${page === 1 ? 'active' : ''}`}>
//                     <Link
//                       className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
//                       to="#"
//                     >
//                       {page.toString().padStart(2, '0')}
//                     </Link>
//                   </li>
//                 ))}
//                 <li className="page-item">
//                   <Link
//                     className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
//                     to="#"
//                   >
//                     <i className="ph-bold ph-arrow-right" />
//                   </Link>
//                 </li>
//               </ul>
//             )}
//             {/* Pagination End */}
//           </div>
//           {/* Content End */}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShopSection;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../../src/Redux/CardSlice";

const ShopSection = ({ subcategoryId, searchProductData }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const dataredux = useSelector((state) => state.searchSlice);
  const discount = user?.user?.discount || 0;
  const api = "http://localhost:8080/product";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:8080/category"),
          axios.get(api),
        ]);
        setCategories(categoriesRes.data);
        setCourses(coursesRes.data);
        setFilteredCourses(coursesRes.data);

        const sizes = {};
        coursesRes.data.forEach((course) => {
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
        setError("Error fetching data");
        toast.error("Error fetching data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (subcategoryId?.id) {
      const filtered = courses.filter((course) => {
        return course.subCategory?._id === subcategoryId.id;
      });
      setFilteredCourses(filtered);
      setActiveCategory("All"); // Reset category filter when subcategory is selected
    } else {
      const filtered =
        activeCategory === "All"
          ? courses
          : courses.filter(
              (course) => course.category?.name === activeCategory
            );
      setFilteredCourses(filtered);
    }
  }, [subcategoryId, courses, activeCategory]);

  const calculateDiscountedPrice = (price) => {
    if (discount > 0) {
      return Math.round(price * (1 - discount / 100));
    }
    return price;
  };

  const handleCourseClick = (courseId) => {
    navigate(`/product-details/${courseId}`);
  };

  const sidebarController = () => {
    setActive(!active);
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
      handleaddtoCart(course, sizes[0] || "One Size");
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
        image:
          course.images?.[0] || "assets/images/thumbs/product-two-img5.png",
        qnty: 1,
        size: size,
      })
    );

    toast.success(`${course.name} (Size: ${size}) added to cart!`);
    setShowSizeModal(false);
  };

  if (loading) {
    return (
      <section className="shop py-80">
        <div className="container container-lg">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="shop py-80">
        <div className="container container-lg">
          <div className="row">
            <div className="col-12 text-center text-danger">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="shop py-80">
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar Start */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  <li className="mb-24">
                    <div
                      className={`text-gray-900 hover-text-main-600 cursor-pointer ${
                        activeCategory === "All" ? "text-main-600" : ""
                      }`}
                      onClick={() => setActiveCategory("All")}
                    >
                      All ({courses.length})
                    </div>
                  </li>
                  {categories.map((category) => (
                    <li key={category._id} className="mb-24">
                      <div
                        className={`text-gray-900 hover-text-main-600 cursor-pointer ${
                          activeCategory === category.name
                            ? "text-main-600"
                            : ""
                        }`}
                        onClick={() => setActiveCategory(category.name)}
                      >
                        {category.name} (
                        {
                          courses.filter(
                            (course) => course.category?.name === category.name
                          ).length
                        }
                        )
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Sidebar End */}

          {/* Content Start */}
          <div className="col-lg-9">
            {/* Top Start */}
            <div className="flex-between gap-16 flex-wrap mb-40">
              <span className="text-gray-900">
                Showing 1-{filteredCourses.length} of {filteredCourses.length}{" "}
                results
              </span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button
                    type="button"
                    onClick={() => setGrid(true)}
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      grid && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGrid(false)}
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                      !grid && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph ph-squares-four" />
                  </button>
                </div>
                <button
                  onClick={sidebarController}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>
            {/* Top End */}

            {/* Size Selection Modal */}
            {showSizeModal && currentProduct && (
              <div
                className="modal fade show"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1050,
                }}
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

            {/* Products Grid */}
            <div className={`list-grid-wrapper ${grid && "list-view"}`}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const discountedPrice = calculateDiscountedPrice(
                    course.price
                  );
                  const showOriginalPrice =
                    discount > 0 && discountedPrice !== course.price;
                  const sizes = course.size
                    ? Array.isArray(course.size)
                      ? course.size
                      : [course.size]
                    : [];
                  const selectedSize =
                    selectedSizes[course._id] ||
                    (sizes.length > 0 ? sizes[0] : "One Size");

                  return (
                    <div
                      key={course._id}
                      className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
                    >
                      <div
                        onClick={() => handleCourseClick(course._id)}
                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative cursor-pointer"
                      >
                        <img
                          src={
                            course.images?.[0] ||
                            "assets/images/thumbs/product-two-img5.png"
                          }
                          alt={course.name}
                          className="w-auto max-w-unset"
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
                                sizes.join(", ") || "One Size"
                              )}
                            </span>
                          </span>
                        </div>

                        <div className="product-card__content mt-3">
                          <div className="product-card__price mb-3 d-flex align-items-center gap-3">
                            {showOriginalPrice && (
                              <span className="text-muted text-decoration-line-through fw-semibold">
                                ₹{course.price}
                              </span>
                            )}
                            <span className="text-success fw-bold fs-5">
                              ₹{discountedPrice}
                            </span>
                            {discount > 0 && (
                              <span className="badge bg-danger ms-2">
                                {discount}% OFF
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
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found in this category</h4>
                </div>
              )}
            </div>

            {/* Pagination Start */}
            {filteredCourses.length > 0 && (
              <ul className="pagination flex-center flex-wrap gap-16 mt-40">
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-left" />
                  </Link>
                </li>
                {[1, 2, 3, 4, 5, 6, 7].map((page) => (
                  <li
                    key={page}
                    className={`page-item ${page === 1 ? "active" : ""}`}
                  >
                    <Link
                      className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                      to="#"
                    >
                      {page.toString().padStart(2, "0")}
                    </Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-right" />
                  </Link>
                </li>
              </ul>
            )}
            {/* Pagination End */}
          </div>
          {/* Content End */}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
