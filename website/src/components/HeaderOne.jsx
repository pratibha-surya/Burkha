


import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useSelector } from "react-redux";
import { queries } from "@testing-library/react";
// import { setSearchProduct } from "../Redux/Slice/searchSlice";


const HeaderOne = ({ onSearch, setsearchProductData }) => {
  const location = useLocation();
  const { categoryId, subCategoryId } = useParams();
  const { subCategory, parentCategory, categoryData } = location.state || {};
  const Product = useSelector((state) => state.mycart.cart);
  const productLength = Product.length;
  const [scroll, setScroll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuActive, setMenuActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSearch, setActiveSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState(false);
  const [activeIndexCat, setActiveIndexCat] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [showPopup, setShowPopup] = useState(false);


  // Fetch all categories and subcategories
  const fetchData = async () => {
    try {
      const [categoryRes, subCategoryRes, productRes] = await Promise.all([
        axios.get("http://localhost:8080/category"),
        axios.get("http://localhost:8080/subcategory"),
        axios.get("http://localhost:8080/product"),
      ]);

      setCategories(categoryRes.data);
      setSubCategories(subCategoryRes.data);
      console.log(subCategoryRes.data)

      const formattedProducts = productRes.data.map((product) => ({
        _id: product._id,
        name: product.name,
        category: product.category?._id || null,
        subCategory: product.subCategory?._id || null,
      }));

      setAllProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // const searchquery = async () => {
  //   try {
  //     console.log(searchQuery, "search");
  //     const response = await axios.get(
  //       `http://localhost:8080/product/search?query=${searchQuery}`
  //     );

  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const searchquery = async () => {
  try {
    console.log(searchQuery, "search");
    const response = await axios.get(
      `http://localhost:8080/product/search?query=${searchQuery}`
    );
    setSearchResults(response.data); // <-- store results
    setShowPopup(true); // <-- open popup
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.pageYOffset > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers
  const handleMenuToggle = () => setMenuActive(!menuActive);
  const handleSearchToggle = () => setActiveSearch(!activeSearch);
  const handleCategoryToggle = () => setActiveCategory(!activeCategory);

  const handleCatClick = (index) => {
    setActiveIndexCat(activeIndexCat === index ? null : index);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <>
      <div className="overlay" />
      <div
        className={`side-overlay ${(menuActive || activeCategory) && "show"}`}
      />

      {/* Search Box */}
      <form
        onSubmit={handleSearchSubmit}
        className={`search-box ${activeSearch && "active"}`}
      >
        <button
          onClick={handleSearchToggle}
          type="button"
          className="search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
        >
          <i className="ph ph-x" />
        </button>
    <div className="container relative">
  <div className="position-relative">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
      className="form-control py-16 px-24 text-xl rounded-[30px] pe-64 border-2 border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-200"
    />
    <button
      type="submit"
      onClick={searchquery}
      className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8 hover:bg-main-700 transition-colors"
    >
      <i className="ph ph-magnifying-glass" />
    </button>
  </div>

  {/* 🔍 Overlay Search Results */}
  {searchResults.length > 0 && (
    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">
          Found {searchResults.length} results for "{searchQuery}"
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-2">
                <h3 className="text-base font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 truncate">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

      </form>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu scroll-sm d-lg-none d-block ${
          menuActive && "active"
        }`}
      >
        <button
          onClick={() => {
            handleMenuToggle();
            setActiveIndex(null);
          }}
          type="button"
          className="close-button"
        >
          <i className="ph ph-x" />
        </button>
        <div className="mobile-menu__inner">
          <Link
            to="/"
            className="mobile-menu__logo flex items-center space-x-2"
          >
            <h3 className="text-2xl font-bold text-blue-600 tracking-wide hover:text-blue-800 transition-all duration-300">
              Umair <span className="text-black">Abaya</span>
            </h3>
          </Link>
          <div className="mobile-menu__menu">
            <ul className="nav-menu flex-align nav-menu--mobile">
              <li className="on-hover-item nav-menu__item">
                <Link to="/" className="nav-menu__link">
                  Home
                </Link>
              </li>
              <li className="on-hover-item nav-menu__item">
                <Link to="/about" className="nav-menu__link">
                  About
                </Link>
              </li>
              <li className="on-hover-item nav-menu__item">
                <Link to="/shop" className="nav-menu__link">
                  Shop
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link to="/contact" className="nav-menu__link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <header className="header-middle bg-color-one border-bottom border-gray-100">
        <div className="container container-lg">
          <nav className="header-inner flex-between">
            <div className="logo">
              <Link to="/" className="mobile-menu__logo">
                <h3 className="logo-text">
                  Umair <span className="logo-subtext">Abaya</span>
                </h3>
              </Link>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="flex-align flex-wrap form-location-wrapper"
            >
              <div className="search-category d-flex h-48 select-border-end-0 radius-end-0 search-form d-sm-flex d-none">
                <div className="search-form__wrapper position-relative w-full">
                  <input
                    type="text"
                    className="search-form__input common-input py-13 ps-16 pe-18 rounded-[30px] border-2 border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-200"
                    placeholder="Search for a product or brand"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    onClick={searchquery}
                    type="submit"
                    className="w-32 h-32 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8 hover:bg-main-700 transition-colors"
                  >
                    <i className="ph ph-magnifying-glass" />
                  </button>
                </div>
              </div>
            </form>
            <div className="header-right flex-align d-lg-block d-none">
              <div className="flex-align flex-wrap gap-12">
                <button
                  type="button"
                  className="search-icon flex-align d-lg-none d-flex gap-4 item-hover"
                  onClick={handleSearchToggle}
                >
                  <span className="text-2xl text-gray-700 d-flex position-relative item-hover__text">
                    <i className="ph ph-magnifying-glass" />
                  </span>
                </button>
                <Link to="/login" className="flex-align gap-4 item-hover">
                  <span className="text-md text-gray-500 item-hover__text d-none d-lg-flex">
                    Account
                  </span>
                </Link>
                <Link to="/cart" className="flex-align gap-4 item-hover">
                  <span className="text-2xl text-gray-700 d-flex position-relative me-6 mt-6 item-hover__text">
                    <i className="ph ph-shopping-cart-simple" />
                    <span className="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">
                      {productLength > 0 ? productLength : 0}
                    </span>
                  </span>
                  <span className="text-md text-gray-500 item-hover__text d-none d-lg-flex">
                    Cart
                  </span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {showPopup && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl max-h-[80%] overflow-y-auto relative">
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-2 right-2 text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-4">Search Results</h2>
     {searchResults.length > 0 ? (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Search Results ({searchResults.length})
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searchResults.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Product Image */}
          <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
            <img
              src={item.images?.[0] || "/assets/images/default-product.png"}
              alt={item.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {item.name}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-main-600">
                ₹{item.price?.toFixed(2) || "0.00"}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {item.stock || 0}
              </span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-main-600 hover:bg-main-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                <i className="ph ph-shopping-cart mr-2"></i>
                Add to Cart
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-md transition-colors">
                <i className="ph ph-heart"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <i className="ph ph-magnifying-glass text-3xl text-gray-400"></i>
    </div>
    <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
    <p className="text-gray-500">Try different search terms or browse our categories</p>
  </div>
)}
    </div>
  </div>
)}


      {/* Main Header */}
      <header
        className={`header bg-white border-bottom border-gray-100 ${
          scroll && "fixed-header"
        }`}
      >
        <div className="container container-lg">
          <nav className="header-inner d-flex justify-content-between gap-8">
            <div className="flex-align menu-category-wrapper">
              {/* Category Dropdown */}
              <div className="category on-hover-item">
                <button
                  onClick={handleCategoryToggle}
                  type="button"
                  className="category__button flex-align gap-8 fw-medium p-16 border-end border-start border-gray-100 text-heading"
                >
                  <span className="icon text-2xl d-xs-flex d-none">
                    <i className="ph ph-dots-nine" />
                  </span>
                  <span className="d-sm-flex d-none">All</span> Categories
                  <span className="arrow-icon text-xl d-flex">
                    <i className="ph ph-caret-down" />
                  </span>
                </button>
                <div
                  className={`responsive-dropdown cat on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper ${
                    activeCategory && "active"
                  }`}
                >
                  <button
                    onClick={() => {
                      handleCategoryToggle();
                      setActiveIndexCat(null);
                    }}
                    type="button"
                    className="close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex"
                  >
                    <i className="ph ph-x" />
                  </button>
                  <div className="logo px-16 d-lg-none d-block">
                    <Link to="/" className="link">
                      <img src="assets/images/logo/logo.png" alt="Logo" />
                    </Link>
                  </div>
                  <ul className="scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto">
                    <li className="has-submenus-submenu">
                      <Link
                        to="/shop"
                        className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0"
                      >
                        <span>All Products</span>
                      </Link>
                    </li>
                    {categories.map((cat, index) => (
                      <li
                        key={cat._id}
                        onClick={() => handleCatClick(index)}
                        className={`has-submenus-submenu ${
                          activeIndexCat === index || cat._id === categoryId
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          to={`/shop/category/${cat._id}`}
                          className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0"
                        >
                          <span>{cat.name}</span>
                          <span className="icon text-md d-flex ms-auto">
                            <i className="ph ph-caret-right" />
                          </span>
                        </Link>
                        <div
                          className={`submenus-submenu py-16 ${
                            activeIndexCat === index || cat._id === categoryId
                              ? "open"
                              : ""
                          }`}
                        >
                          <h6 className="text-lg px-16 submenus-submenu__title">
                            {cat.name}
                          </h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            {subCategories
                              .filter((sub) => {
                                // Handle both cases: parentCategory as object or string
                                const parentId =
                                  sub.category?._id || sub.category;
                                return parentId === cat._id;
                              })
                              .map((subCat) => (
                                <li key={subCat._id}>
                                  <Link
                                    to={`/shop/category/${cat._id}/subcategory/${subCat._id}`}
                                    className={`text-gray-500 text-15 py-8 px-16 d-block ${
                                      subCat._id === subCategoryId
                                        ? "activePage"
                                        : ""
                                    }`}
                                  >
                                    {subCat.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Main Menu */}
              <div className="header-menu d-lg-block d-none">
                <ul className="nav-menu flex-align">
                  <li className="on-hover-item nav-menu__item">
                    <Link to="/" className="nav-menu__link">
                      Home
                    </Link>
                  </li>
                  <li className="on-hover-item nav-menu__item">
                    <Link to="/about" className="nav-menu__link">
                      About
                    </Link>
                  </li>
                  <li className="on-hover-item nav-menu__item">
                    <Link to="/shop" className="nav-menu__link">
                      Shop
                    </Link>
                  </li>
                  <li className="nav-menu__item">
                    <NavLink
                      to="/contact"
                      className={(navData) =>
                        navData.isActive
                          ? "nav-menu__link activePage"
                          : "nav-menu__link"
                      }
                    >
                      Contact Us
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>

            {/* Header Right */}
            <div className="header-right flex-align">
              <Link
                to="/tel:+919368298145"
                className="bg-main-600 text-white p-12 h-100 hover-bg-main-800 flex-align gap-8 text-lg d-lg-flex d-none"
              >
                <div className="d-flex text-32">
                  <i className="ph ph-phone-call" />
                </div>
                +919368298145
              </Link>
              <div className="me-16 d-lg-none d-block">
                <div className="flex-align flex-wrap gap-12">
                  <button
                    onClick={handleSearchToggle}
                    type="button"
                    className="search-icon flex-align d-lg-none d-flex gap-4 item-hover"
                  >
                    <span className="text-2xl text-gray-700 d-flex position-relative item-hover__text">
                      <i className="ph ph-magnifying-glass" />
                    </span>
                  </button>
                  <Link to="/cart" className="flex-align gap-4 item-hover">
                    <span className="text-2xl text-gray-700 d-flex position-relative me-6 mt-6 item-hover__text">
                      <i className="ph ph-shopping-cart-simple" />
                      <span className="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">
                        {productLength > 0 ? productLength : 0}
                      </span>
                    </span>
                    <span className="text-md text-gray-500 item-hover__text d-none d-lg-flex">
                      Cart
                    </span>
                  </Link>
                </div>
              </div>
              <button
                onClick={handleMenuToggle}
                type="button"
                className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex"
              >
                <i className="ph ph-list" />
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;
