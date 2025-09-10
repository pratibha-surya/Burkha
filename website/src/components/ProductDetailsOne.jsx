import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { getCountdown } from "../helper/Countdown";
import axios from "axios";
import DOMPurify from "dompurify";
import { addtoCart } from "../Redux/CardSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ReactImageMagnify from "react-image-magnify";

// Optional: Import slick carousel styles if not already included globally
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetailsOne = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [product, setProduct] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainMedia, setMainMedia] = useState(""); // Handles both image and "youtube"
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/${id}`);
        setProduct(response.data);
        if (response.data.size?.length > 0) {
          setSelectedSize(response.data.size[0]);
        }
        if (response.data.images?.length > 0) {
          setMainMedia(response.data.images[0]);
        } else if (response.data.youtubeUrl) {
          setMainMedia("youtube");
        }
      } catch (err) {
        setError(true);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getYoutubeThumbnail = (url) => {
    if (!url) return "/default-thumb.jpg";

    // Extract video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([0-9A-Za-z_-]{11})/i;
    const match = url.match(regex);

    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }

    return "/default-thumb.jpg"; // Fallback
  };

  const handleAddToCart = () => {
    if (product.size?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    dispatch(
      addtoCart({
        id: product._id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        image: product.images?.[0],
        qnty: quantity,
        size: selectedSize,
      })
    );

    toast.success(
      `${product.name} ${
        selectedSize ? `(Size: ${selectedSize})` : ""
      } added to cart!`
    );
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const settingsThumbs = {
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    infinite: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const sanitize = (dirty) => ({
    __html: DOMPurify.sanitize(dirty),
  });

  const isLikelyImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    if (url === "youtube") return false;
    return /(\.png|\.jpe?g|\.webp|\.gif|\.bmp|\.svg)(\?.*)?$/i.test(url) || url.startsWith("http");
  };

  if (loading)
    return (
      <div className="flex-center py-80">
        <div className="spinner-border text-main-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-20">Error loading product.</div>
    );

  // Combine images + youtube thumbnail
  const sliderItems = [...(product.images || [])];
  if (product.youtubeUrl) sliderItems.push("youtube");

  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-12">
            <div className="row gy-4">
              {/* Left Side - Main Image or Video */}
              <div className="col-xl-6">
                <div className="product-details__left">
                  {mainMedia === "youtube" ? (
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={product?.youtubeUrl?.replace("watch?v=", "embed/")}
                        title={product?.name ? `${product.name} Product Video` : "Product Video"}
                        allowFullScreen
                        width="100%"
                        height="315"
                        aria-label={product?.name ? `${product.name} product video` : "Product video"}
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  ) : (
                    <div style={{ position: "relative", overflow: "visible" }}>
                      {isLikelyImageUrl(mainMedia) ? (
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: product?.name || "Main Product Image",
                              isFluidWidth: true,
                              src: mainMedia,
                            },
                            largeImage: {
                              src: mainMedia,
                              width: 1600,
                              height: 1600,
                            },
                            enlargedImagePosition: "beside",
                            enlargedImageContainerDimensions: {
                              width: "140%",
                              height: "100%",
                            },
                            enlargedImageContainerStyle: {
                              zIndex: 1000,
                              background: "#fff",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            },
                            lensStyle: { backgroundColor: "rgba(0,0,0,0.15)" },
                            isHintEnabled: true,
                            shouldUsePositiveSpaceLens: true,
                          }}
                        />
                      ) : (
                        <img
                          src={mainMedia || "/default-thumb.jpg"}
                          alt={product?.name || "Product"}
                          style={{ width: "100%", height: "auto" }}
                          onError={(e) => (e.currentTarget.src = "/default-thumb.jpg")}
                        />
                      )}
                    </div>
                  )}

                  {/* Slider - Thumbnails */}
                  <div className="mt-24 product-details__images-slider">
                    <Slider {...settingsThumbs}>
                      {sliderItems.map((item, index) => (
                        <div
                          key={index}
                          style={{ width: "100px", height: "100px" }}
                          className="border border-gray-300 p-2 cursor-pointer"
                          onClick={() => {
                            setMainMedia(item);
                            setShowVideo(item === "youtube");
                          }}
                        >
                          <img
                            src={
                              item === "youtube"
                                ? getYoutubeThumbnail(product.youtubeUrl)
                                : item
                            }
                            alt={`Thumbnail ${index + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => (e.target.src = "/default-thumb.jpg")}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              </div>

              {/* Right Side - Product Info */}
              <div className="col-xl-6">
                <div className="product-details__content">
                  <h5 className="mb-12">{product.name}</h5>
                  <div className="flex-align flex-wrap gap-12">
                    <div className="flex-align gap-12 flex-wrap">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-15 fw-medium text-warning-600 d-flex"
                          aria-label="Star rating"
                        >
                          <i className="ph-fill ph-star" />
                        </span>
                      ))}
                      <span className="text-sm fw-medium text-neutral-600">
                        4.7 Star Rating
                      </span>
                      <span className="text-sm fw-medium text-gray-500">
                        ₹{product.price}
                      </span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      <span className="text-gray-400">Color:</span>{" "}
                      {product.color || "EB4DRP"}
                    </span>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={sanitize(product.description)}
                  />

                  <div className="mt-32 flex-align flex-wrap gap-32">
                    {product.size?.length > 0 && (
                      <div className="flex gap-4 d-flex align-items-center">
                        <h1 className="text-md text-gray-500 mb-0">Size:</h1>
                        <div className="d-flex flex-wrap gap-2">
                          {product.size.map((s, index) => (
                            <button
                              key={index}
                              className={`btn ${
                                selectedSize === s
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                              } rounded-pill px-3 py-1 border`}
                              onClick={() => setSelectedSize(s)}
                              aria-pressed={selectedSize === s}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex-align gap-8">
                      <h4 className="mb-0">
                        ₹{product.discountedPrice || product.price}
                      </h4>

                      {/* Show Price strikethrough only if discountedPrice exists */}
                      {product.discountedPrice && (
                        <span className="text-md text-gray-500 text-decoration-line-through">
                          ₹{product.price}
                        </span>
                      )}

                      {/* Show MRP if it exists and is higher than current price */}
                      {product.mrp && (
                        <span className="text-sm text-gray-400 text-decoration-line-through">
                          MRP: ₹{product.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <div className="mb-24">
                    <div className="mt-32 flex-align gap-12 mb-16">
                      <span className="w-32 h-32 bg-white flex-center rounded-circle text-main-600 box-shadow-xl">
                        <i className="ph-fill ph-lightning" />
                      </span>
                      <h6 className="text-md mb-0 fw-bold text-gray-900">
                        Products are almost sold out
                      </h6>
                    </div>
                    <div
                      className="progress w-100 bg-gray-100 rounded-pill h-8"
                      role="progressbar"
                      aria-valuenow={32}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Stock availability"
                    >
                      <div
                        className="progress-bar bg-main-two-600 rounded-pill"
                        style={{ width: "32%" }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 mt-8">
                      Available only: {product.stock || 45}
                    </span>
                  </div>

                  <span className="text-gray-900 d-block mb-8">Quantity:</span>
                  <div className="flex-between gap-16 flex-wrap">
                    <div className="flex-align flex-wrap gap-16">
                      <div className="border border-gray-100 rounded-pill py-9 px-16 flex-align">
                        <button
                          onClick={decrementQuantity}
                          type="button"
                          className="quantity__minus p-4 text-gray-700 hover-text-main-600 flex-center"
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <i className="ph ph-minus" />
                        </button>
                        <input
                          type="number"
                          className="quantity__input border-0 text-center w-32"
                          value={quantity}
                          min="1"
                          readOnly
                          aria-label={`Quantity: ${quantity}`}
                        />
                        <button
                          onClick={incrementQuantity}
                          type="button"
                          className="quantity__plus p-4 text-gray-700 hover-text-main-600 flex-center"
                          aria-label="Increase quantity"
                        >
                          <i className="ph ph-plus" />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="btn btn-main rounded-pill flex-align d-inline-flex gap-8 px-48"
                        aria-label="Add to cart"
                      >
                        <i className="ph ph-shopping-cart" /> Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="pt-80">
              <div className="product-dContent border rounded-24">
                <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
                  <ul className="nav common-tab nav-pills mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-description"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Description
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="product-dContent__box">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="pills-description"
                      role="tabpanel"
                    >
                      <div className="mb-40">
                        <h6 className="mb-24">Product Description</h6>
                        <p dangerouslySetInnerHTML={sanitize(product.description)} />
                        {product.additionalDescription && (
                          <p
                            dangerouslySetInnerHTML={sanitize(
                              product.additionalDescription
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsOne;