// import React from "react";
// import Preloader from "../helper/Preloader";
// import HeaderOne from "../components/HeaderOne";
// import ProductDetailsOne from "../components/ProductDetailsOne";
// import NewArrivalTwo from "../components/NewArrivalTwo";
// import ShippingOne from "../components/ShippingOne";
// import NewsletterOne from "../components/NewsletterOne";
// import FooterOne from "../components/FooterOne";
// import BottomFooter from "../components/BottomFooter";
// import BreadcrumbTwo from './../components/BreadcrumbTwo';
// import ScrollToTop from "react-scroll-to-top";
// import ColorInit from "../helper/ColorInit";
// import { useParams } from "react-router-dom";

// const ProductDetailsPageOne = () => {
// const { id } = useParams();


//   return (
//     <>

//       <ColorInit color={false} />


//       <ScrollToTop smooth color="#299E60" />

//       <HeaderOne />

//       <BreadcrumbTwo title={"Product Details"} />

//       <ProductDetailsOne  courseId={id} />

//       <NewArrivalTwo />

//       <ShippingOne />

//       <NewsletterOne />

//       {/* FooterTwo */}
//       <FooterOne />

     



//     </>
//   );
// };

// export default ProductDetailsPageOne;
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [mainMedia, setMainMedia] = useState("");
  const dispatch = useDispatch();

  // Lightbox states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lbMedia, setLbMedia] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const translateBeforeRef = useRef({ x: 0, y: 0 });
  const lbRef = useRef(null);
  const imgContainerRef = useRef(null);

  // Touch pinch helpers
  const pinchRef = useRef({ initialDistance: null, initialZoom: 1 });

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
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([0-9A-Za-z_-]{11})/i;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return "/default-thumb.jpg";
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
      `${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ""} added to cart!`
    );
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

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

  // ---------- Lightbox functions ----------
  const openLightbox = (item) => {
    if (item === "youtube") {
      setMainMedia("youtube");
      setShowVideo(true);
      return;
    }
    setLbMedia(item);
    setIsLightboxOpen(true);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
    pinchRef.current = { initialDistance: null, initialZoom: 1 };
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const zoomBy = (delta, focal = null) => {
    setZoom((prev) => {
      const next = clamp(prev + delta, 1, 4);
      if (focal && imgContainerRef.current) {
        const rect = imgContainerRef.current.getBoundingClientRect();
        const offsetX = focal.x - rect.left;
        const offsetY = focal.y - rect.top;
        const relX = (offsetX - translate.x) / (rect.width * prev);
        const relY = (offsetY - translate.y) / (rect.height * prev);
        const newTx = offsetX - relX * rect.width * next;
        const newTy = offsetY - relY * rect.height * next;
        setTranslate({ x: newTx, y: newTy });
      }
      return next;
    });
  };

  const onWheel = (e) => {
    if (!isLightboxOpen) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    zoomBy(delta, { x: e.clientX, y: e.clientY });
  };

  // Mouse pan handlers
  const onPointerDown = (e) => {
    if (!isLightboxOpen) return;
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
    translateBeforeRef.current = { ...translate };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setTranslate({
      x: translateBeforeRef.current.x + dx,
      y: translateBeforeRef.current.y + dy,
    });
  };

  const onPointerUp = () => {
    setIsPanning(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  // Touch pinch & pan
  const onTouchStart = (e) => {
    if (!isLightboxOpen) return;
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchRef.current.initialDistance = dist;
      pinchRef.current.initialZoom = zoom;
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      translateBeforeRef.current = { ...translate };
    }
  };

  const onTouchMove = (e) => {
    if (!isLightboxOpen) return;
    if (e.touches.length === 2 && pinchRef.current.initialDistance) {
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / pinchRef.current.initialDistance;
      const newZoom = clamp(pinchRef.current.initialZoom * ratio, 1, 4);
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isPanning) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      setTranslate({
        x: translateBeforeRef.current.x + dx,
        y: translateBeforeRef.current.y + dy,
      });
    }
  };

  const onTouchEnd = () => {
    setIsPanning(false);
    pinchRef.current.initialDistance = null;
  };

  // Navigation functions
  const openPrev = () => {
    const idx = sliderItems.indexOf(lbMedia ?? mainMedia);
    const prevIdx = idx > -1 ? (idx - 1 + sliderItems.length) % sliderItems.length : 0;
    const item = sliderItems[prevIdx];
    setLbMedia(item);
    setMainMedia(item);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  const openNext = () => {
    const idx = sliderItems.indexOf(lbMedia ?? mainMedia);
    const nextIdx = idx > -1 ? (idx + 1) % sliderItems.length : 0;
    const item = sliderItems[nextIdx];
    setLbMedia(item);
    setMainMedia(item);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  const onKeyDown = useCallback(
    (e) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openPrev();
      if (e.key === "ArrowRight") openNext();
      if (e.key === "+" || e.key === "=") zoomBy(0.25);
      if (e.key === "-") zoomBy(-0.25);
    },
    [isLightboxOpen] // Fixed: Removed problematic dependencies
  );

  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, onKeyDown]);

  if (loading)
    return (
      <div className="flex-center py-80">
        <div className="spinner-border text-main-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 py-20">Error loading product.</div>;

  // Combine images + youtube thumbnail indicator
  const sliderItems = [...(product?.images || [])];
  if (product?.youtubeUrl) sliderItems.push("youtube");

  return (
    <section className="product-details py-80">
      <style>{`
        .lb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .lb-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          overflow: hidden;
          touch-action: none;
        }
        .lb-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          z-index: 2010;
        }
        .lb-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2010;
          background: rgba(0,0,0,0.35);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
        }
        .lb-prev { left: 18px; }
        .lb-next { right: 18px; }
        .lb-footer-thumbs {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2010;
          display:flex;
          gap:8px;
          background: rgba(0,0,0,0.25);
          padding:8px;
          border-radius:10px;
          align-items:center;
        }
        .lb-thumb {
          width: 64px;
          height: 48px;
          object-fit:cover;
          border-radius:6px;
          cursor:pointer;
          border:2px solid rgba(255,255,255,0.06);
        }
      `}</style>

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
                        <div
                          onClick={() => openLightbox(mainMedia)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter") openLightbox(mainMedia); }}
                          aria-label="Open image viewer"
                          style={{ cursor: "zoom-in" }}
                        >
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
                        </div>
                      ) : (
                        <img
                          src={mainMedia || "/default-thumb.jpg"}
                          alt={product?.name || "Product"}
                          style={{ width: "100%", height: "auto", cursor: "zoom-in" }}
                          onClick={() => openLightbox(mainMedia)}
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
                            src={item === "youtube" ? getYoutubeThumbnail(product.youtubeUrl) : item}
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
                  <h5 className="mb-12">{product?.name}</h5>
                  <div className="flex-align flex-wrap gap-12">
                    <div className="flex-align gap-12 flex-wrap">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-15 fw-medium text-warning-600 d-flex" aria-label="Star rating">
                          <i className="ph-fill ph-star" />
                        </span>
                      ))}
                      <span className="text-sm fw-medium text-neutral-600">4.7 Star Rating</span>
                      <span className="text-sm fw-medium text-gray-500">₹{product?.price}</span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      <span className="text-gray-400">Color:</span> {product?.color || "EB4DRP"}
                    </span>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <p className="text-gray-700" dangerouslySetInnerHTML={sanitize(product?.description || "")} />

                  <div className="mt-32 flex-align flex-wrap gap-32">
                    {product?.size?.length > 0 && (
                      <div className="flex gap-4 d-flex align-items-center">
                        <h1 className="text-md text-gray-500 mb-0">Size:</h1>
                        <div className="d-flex flex-wrap gap-2">
                          {product.size.map((s, index) => (
                            <button
                              key={index}
                              className={`btn ${
                                selectedSize === s ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
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
                      <h4 className="mb-0">₹{product?.discountedPrice || product?.price}</h4>

                      {product?.discountedPrice && (
                        <span className="text-md text-gray-500 text-decoration-line-through">₹{product.price}</span>
                      )}

                      {product?.mrp && (
                        <span className="text-sm text-gray-400 text-decoration-line-through">MRP: ₹{product.mrp}</span>
                      )}
                    </div>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <div className="mb-24">
                    <div className="mt-32 flex-align gap-12 mb-16">
                      <span className="w-32 h-32 bg-white flex-center rounded-circle text-main-600 box-shadow-xl">
                        <i className="ph-fill ph-lightning" />
                      </span>
                      <h6 className="text-md mb-0 fw-bold text-gray-900">Products are almost sold out</h6>
                    </div>
                    <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar" aria-valuenow={32} aria-valuemin={0} aria-valuemax={100} aria-label="Stock availability">
                      <div className="progress-bar bg-main-two-600 rounded-pill" style={{ width: "32%" }} />
                    </div>
                    <span className="text-sm text-gray-700 mt-8">Available only: {product?.stock || 45}</span>
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
                    <div className="tab-pane fade show active" id="pills-description" role="tabpanel">
                      <div className="mb-40">
                        <h6 className="mb-24">Product Description</h6>
                        <p dangerouslySetInnerHTML={sanitize(product?.description || "")} />
                        {product?.additionalDescription && (
                          <p dangerouslySetInnerHTML={sanitize(product.additionalDescription)} />
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

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          className="lb-overlay"
          onWheel={onWheel}
          ref={lbRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button className="lb-nav lb-prev" aria-label="Previous" onClick={openPrev}>
            ◀
          </button>

          <div
            className="lb-content"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            ref={imgContainerRef}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="lb-controls" style={{ right: 12 }}>
              <button
                className="lb-btn"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => clamp(z - 0.25, 1, 4))}
              >
                −
              </button>
              <button
                className="lb-btn"
                aria-label="Reset"
                onClick={() => {
                  setZoom(1);
                  setTranslate({ x: 0, y: 0 });
                }}
              >
                Reset
              </button>
              <button
                className="lb-btn"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => clamp(z + 0.25, 1, 4))}
              >
                +
              </button>
              <button className="lb-btn" aria-label="Close" onClick={closeLightbox}>
                ✕
              </button>
            </div>

            <div
              style={{
                overflow: "hidden",
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
              }}
            >
              <img
                src={lbMedia || mainMedia}
                alt={product?.name || "Product large view"}
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
                  transformOrigin: "0 0",
                  willChange: "transform",
                  maxWidth: "none",
                  maxHeight: "none",
                  userSelect: "none",
                  cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "zoom-out",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onError={(e) => (e.currentTarget.src = "/default-thumb.jpg")}
              />
            </div>

            <div className="lb-footer-thumbs" aria-hidden>
              {sliderItems.map((it, i) => (
                <img
                  key={i}
                  src={it === "youtube" ? getYoutubeThumbnail(product.youtubeUrl) : it}
                  alt={`thumb-${i}`}
                  className="lb-thumb"
                  onClick={() => {
                    setLbMedia(it);
                    setMainMedia(it);
                    setZoom(1);
                    setTranslate({ x: 0, y: 0 });
                  }}
                  onError={(e) => (e.currentTarget.src = "/default-thumb.jpg")}
                />
              ))}
            </div>
          </div>

          <button className="lb-nav lb-next" aria-label="Next" onClick={openNext}>
            ▶
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductDetailsOne;
