// import React from 'react'
// import { Link, useParams } from 'react-router-dom';
// import Slider from 'react-slick';

// const NewArrivalTwo = () => {
//       const { id } = useParams();
//   const [mainCourse, setMainCourse] = useState(null);
//   const [sameCategoryCourses, setSameCategoryCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCourseAndSameCategory = async () => {
//       console.log(sameCategoryCourses, 'course')
//       try {
//         setLoading(true);
//         // Fetch main course by ID
//         const res = await axios.get(`http://localhost:8080/product/${id}`);
//         const main = res.data;
//         setMainCourse(main);

//         // Now fetch all courses with the same category ID
//         const sameCategoryRes = await axios.get(
//           `http://localhost:8080/product/category/${main.category._id}`
//         );
//         const subCategoryRes = await axios.get(
//           `http://localhost:8080/product/subcategory/${main.category._id}`
//         );
//         // Filter out the main course from the list
//         const filtered = sameCategoryRes.data.filter((course) => course._id !== main._id);
//         setSameCategoryCourses(filtered);
//       } catch (err) {
//         console.error("Error loading course and same category data", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseAndSameCategory();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!mainCourse) return <p>Course not found</p>;

//     function SampleNextArrow(props) {
//         const { className, onClick } = props;
//         return (
//             <button
//                 type="button" onClick={onClick}
//                 className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
//             >
//                 <i className="ph ph-caret-right" />
//             </button>
//         );
//     }
//     function SamplePrevArrow(props) {
//         const { className, onClick } = props;

//         return (

//             <button
//                 type="button"
//                 onClick={onClick}
//                 className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
//             >
//                 <i className="ph ph-caret-left" />
//             </button>
//         );
//     }
//     const settings = {
//         dots: false,
//         arrows: true,
//         infinite: true,
//         speed: 1000,
//         slidesToShow: 6,
//         slidesToScroll: 1,
//         initialSlide: 0,
//         nextArrow: <SampleNextArrow />,
//         prevArrow: <SamplePrevArrow />,
//         responsive: [
//             {
//                 breakpoint: 1599,
//                 settings: {
//                     slidesToShow: 6,

//                 },
//             },
//             {
//                 breakpoint: 1399,
//                 settings: {
//                     slidesToShow: 4,

//                 },
//             },
//             {
//                 breakpoint: 992,
//                 settings: {
//                     slidesToShow: 3,

//                 },
//             },
//             {
//                 breakpoint: 575,
//                 settings: {
//                     slidesToShow: 2,

//                 },
//             },
//             {
//                 breakpoint: 424,
//                 settings: {
//                     slidesToShow: 1,

//                 },
//             },

//         ],
//     };
//     return (
//         <section className="new-arrival pb-80">
//             <div className="container container-lg">
//                 <div className="section-heading">
//                     <div className="flex-between flex-wrap gap-8">
//                         <h5 className="mb-0">You Might Also Like</h5>
//                         <div className="flex-align mr-point gap-16">
//                             <Link
//                                 to="/shop"
//                                 className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
//                             >
//                                 All Products
//                             </Link>

//                         </div>
//                     </div>
//                 </div>
//                 <div className="new-arrival__slider arrow-style-two">
//                     <Slider {...settings}>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img7.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             C-500 Antioxidant Protect Dietary Supplement
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
//                                     Sale 50%{" "}
//                                 </span>
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img8.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             Marcel's Modern Pantry Almond Unsweetened
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
//                                     Sale 50%{" "}
//                                 </span>
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img9.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             O Organics Milk, Whole, Vitamin D
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">
//                                     Best Sale{" "}
//                                 </span>
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img10.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             Whole Grains and Seeds Organic Bread
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img11.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             Lucerne Yogurt, Lowfat, Strawberry
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
//                                     Sale 50%{" "}
//                                 </span>
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img12.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             Nature Valley Whole Grain Oats and Honey Protein
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                                 <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">
//                                     Best Sale{" "}
//                                 </span>
//                                 <Link
//                                     to="/product-details"
//                                     className="product-card__thumb flex-center"
//                                 >
//                                     <img src="assets/images/thumbs/product-img10.png" alt="" />
//                                 </Link>
//                                 <div className="product-card__content p-sm-2">
//                                     <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                                         <Link to="/product-details" className="link text-line-2">
//                                             Whole Grains and Seeds Organic Bread
//                                         </Link>
//                                     </h6>
//                                     <div className="flex-align gap-4">
//                                         <span className="text-main-600 text-md d-flex">
//                                             <i className="ph-fill ph-storefront" />
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             By Lucky Supermarket
//                                         </span>
//                                     </div>
//                                     <div className="product-card__content mt-12">
//                                         <div className="product-card__price mb-8">
//                                             <span className="text-heading text-md fw-semibold ">
//                                                 $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
//                                             </span>
//                                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                                                 $28.99
//                                             </span>
//                                         </div>
//                                         <div className="flex-align gap-6">
//                                             <span className="text-xs fw-bold text-gray-600">4.8</span>
//                                             <span className="text-15 fw-bold text-warning-600 d-flex">
//                                                 <i className="ph-fill ph-star" />
//                                             </span>
//                                             <span className="text-xs fw-bold text-gray-600">(17k)</span>
//                                         </div>
//                                         <Link
//                                             to="/cart"
//                                             className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                                         >
//                                             Add To Cart <i className="ph ph-shopping-cart" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Slider>
//                 </div>
//             </div>
//         </section>

//     )
// }

// export default NewArrivalTwo

// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import Slider from 'react-slick';
// import axios from 'axios';

// const NewArrivalTwo = () => {
//   const { id } = useParams();
//   const [mainCourse, setMainCourse] = useState(null);
//   const [sameCategoryCourses, setSameCategoryCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCourseAndSameCategory = async () => {
//       try {
//         setLoading(true);
//         // Fetch main course by ID
//         const res = await axios.get(`http://localhost:8080/product/${id}`);
//         const main = res.data;
//         setMainCourse(main);

//         // Now fetch all courses with the same category ID
//         const sameCategoryRes = await axios.get(
//             `http://localhost:8080/product/category/${main.category}`
//         );
//         console.log(sameCategoryRes,'sdfgn')
//         // Filter out the main course from the list
//         const filtered = sameCategoryRes.data.filter((course) => course._id !== main._id);
//         setSameCategoryCourses(filtered);
//       } catch (err) {
//         console.error("Error loading course and same category data", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseAndSameCategory();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!mainCourse) return <p>Course not found</p>;

//   function SampleNextArrow(props) {
//     const { className, onClick } = props;
//     return (
//       <button
//         type="button" onClick={onClick}
//         className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
//       >
//         <i className="ph ph-caret-right" />
//       </button>
//     );
//   }

//   function SamplePrevArrow(props) {
//     const { className, onClick } = props;
//     return (
//       <button
//         type="button"
//         onClick={onClick}
//         className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
//       >
//         <i className="ph ph-caret-left" />
//       </button>
//     );
//   }

//   const settings = {
//     dots: false,
//     arrows: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: Math.min(6, sameCategoryCourses.length),
//     slidesToScroll: 1,
//     initialSlide: 0,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1599,
//         settings: {
//           slidesToShow: Math.min(6, sameCategoryCourses.length),
//         },
//       },
//       {
//         breakpoint: 1399,
//         settings: {
//           slidesToShow: Math.min(4, sameCategoryCourses.length),
//         },
//       },
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: Math.min(3, sameCategoryCourses.length),
//         },
//       },
//       {
//         breakpoint: 575,
//         settings: {
//           slidesToShow: Math.min(2, sameCategoryCourses.length),
//         },
//       },
//       {
//         breakpoint: 424,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <section className="new-arrival pb-80">
//       <div className="container container-lg">
//         <div className="section-heading">
//           <div className="flex-between flex-wrap gap-8">
//             <h5 className="mb-0">You Might Also Like</h5>
//             <div className="flex-align mr-point gap-16">
//               <Link
//                 to="/shop"
//                 className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
//               >
//                 All Products
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="new-arrival__slider arrow-style-two">
//           {sameCategoryCourses.length > 0 ? (
//             <Slider {...settings}>
//               {sameCategoryCourses.map((product) => (
//                 <div key={product._id}>
//                   <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
//                     {product.discountPercentage > 0 && (
//                       <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
//                         Sale {product.discountPercentage}%
//                       </span>
//                     )}
//                     <Link
//                       to={`/product-details/${product._id}`}
//                       className="product-card__thumb flex-center"
//                     >
//                       <img
//                         src={product.images[0]?.url || "assets/images/thumbs/default-product.png"}
//                         alt={product.name}
//                         style={{ height: '200px', objectFit: 'contain' }}
//                       />
//                     </Link>
//                     <div className="product-card__content p-sm-2">
//                       <h6 className="title text-lg fw-semibold mt-12 mb-8">
//                         <Link
//                           to={`/product-details/${product._id}`}
//                           className="link text-line-2"
//                         >
//                           {product.name}
//                         </Link>
//                       </h6>
//                       <div className="flex-align gap-4">
//                         <span className="text-main-600 text-md d-flex">
//                           <i className="ph-fill ph-storefront" />
//                         </span>
//                         <span className="text-gray-500 text-xs">
//                           By {product.brand || 'Unknown Brand'}
//                         </span>
//                       </div>
//                       <div className="product-card__content mt-12">
//                         <div className="product-card__price mb-8">
//                           <span className="text-heading text-md fw-semibold ">
//                             ${product.price?.toFixed(2) || '0.00'}
//                             <span className="text-gray-500 fw-normal">/Qty</span>
//                           </span>
//                           {product.originalPrice && product.originalPrice > product.price && (
//                             <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
//                               ${product.originalPrice.toFixed(2)}
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex-align gap-6">
//                           <span className="text-xs fw-bold text-gray-600">
//                             {product.ratings?.toFixed(1) || '0.0'}
//                           </span>
//                           <span className="text-15 fw-bold text-warning-600 d-flex">
//                             <i className="ph-fill ph-star" />
//                           </span>
//                           <span className="text-xs fw-bold text-gray-600">
//                             ({product.numOfReviews || 0})
//                           </span>
//                         </div>
//                         <Link
//                           to="/cart"
//                           className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
//                         >
//                           Add To Cart <i className="ph ph-shopping-cart" />
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <p>No similar products found</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewArrivalTwo;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";

const NewArrivalTwo = () => {
  const { id } = useParams();
  const [mainProduct, setMainProduct] = useState(null);
  const [sameCategoryProducts, setSameCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductAndSameCategory = async () => {
      try {
        setLoading(true);
        // Fetch main product by ID
        const res = await axios.get(`http://localhost:8080/product/${id}`);
        const main = res.data;
        setMainProduct(main);

        // Now fetch all products with the same category ID
        const sameCategoryRes = await axios.get(
          `http://localhost:8080/product/category/${main.category}`
        );
        console.log(sameCategoryRes, "Same category products response");

        // Filter out the main product from the list
        const filtered = sameCategoryRes.data.filter(
          (product) => product._id !== main._id
        );
        setSameCategoryProducts(filtered);
      } catch (err) {
        console.error("Error loading product and same category data", err);
      } finally {
        setLoading(false);
      }
    };
    console.log(fetchProductAndSameCategory, "sdfghnm");

    fetchProductAndSameCategory();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!mainProduct) return <p>Product not found</p>;

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: Math.min(6, sameCategoryProducts.length),
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: Math.min(6, sameCategoryProducts.length),
        },
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: Math.min(4, sameCategoryProducts.length),
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(3, sameCategoryProducts.length),
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: Math.min(2, sameCategoryProducts.length),
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="new-arrival pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">You Might Also Like</h5>
            <div className="flex-align mr-point gap-16">
              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
        <div className="new-arrival__slider arrow-style-two">
          {sameCategoryProducts.length > 0 ? (
            <Slider {...settings}>
              {sameCategoryProducts.map((product) => (
                <div key={product._id}>
                  <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    {/* Removed discountPercentage badge since it's not in schema */}
                    <Link
                      to={`/product-details/${product._id}`}
                      className="product-card__thumb flex-center"
                    >
                      <img
                        src={
                          product.images[0] ||
                          "assets/images/thumbs/default-product.png"
                        }
                        alt={product.name}
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                    </Link>
                    <div className="product-card__content p-sm-2">
                      <h6 className="title text-lg fw-semibold mt-12 mb-8">
                        <Link
                          to={`/product-details/${product._id}`}
                          className="link text-line-2"
                        >
                          {product.name}
                        </Link>
                      </h6>
                      <div className="flex-align gap-4">
                        <span className="text-main-600 text-md d-flex">
                          <i className="ph-fill ph-storefront" />
                        </span>
                        {/* Removed brand since it's not in schema */}
                        <span className="text-gray-500 text-xs">
                          By {product.fabric || "Unknown"}
                        </span>
                      </div>
                      <div className="product-card__content mt-12">
                        <div className="product-card__price mb-8">
                          <span className="text-heading text-md fw-semibold ">
                            ₹{product.price?.toFixed(2) || "0.00"}
                            <span className="text-gray-500 fw-normal">
                              /Qty
                            </span>
                          </span>
                          {/* Removed originalPrice since it's not in schema */}
                        </div>
                        {/* Removed ratings since they're not in schema */}
                        <div className="flex-align gap-6">
                          <span className="text-xs fw-bold text-gray-600">
                            Stock: {product.stock || 0}
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
                </div>
              ))}
            </Slider>
          ) : (
            <p>No similar products found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalTwo;
