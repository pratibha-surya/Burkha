// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Slider from "react-slick";
// import { ToastContainer, toast } from 'react-toastify';

// const BannerOne = () => {
//      const [banners, setBanners] = useState([]);
//   const api = 'http://localhost:8080/banner/alldisplay';

//   // Load banners
//   const loadData = async () => {
//     try {
//       const response = await axios.get(api);
//       setBanners(response.data);
//     } catch (error) {
//       toast.error('Error fetching banners');
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//     function SampleNextArrow(props) {
//         const { className, onClick } = props;
//         return (
//             <button
//                 type="button"
//                 onClick={onClick}
//                 className={`${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
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
//                 className={`${className} slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
//             >
//                 <i className="ph ph-caret-left" />
//             </button>
//         );
//     }

//     const settings = {
//         dots: false,
//         arrows: true,
//         infinite: true,
//         speed: 1500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         nextArrow: <SampleNextArrow />,
//         prevArrow: <SamplePrevArrow />
//     };

//     const slides = [
//         {
//             img: "https://www.abayakart.com/assets/desktop-design/assets/images/sliders/a5.jpg"
//         },
//         {
//             img: "https://www.abayakart.com/assets/desktop-design/assets/images/sliders/Abays.jpg"
//         },
//           {
//             img: "https://www.abayakart.com/assets/desktop-design/assets/images/sliders/a5.jpg"
//         },
//           {
//             img: "https://www.abayakart.com/assets/desktop-design/assets/images/sliders/a5.jpg"
//         },
//     ];

//     return (
//         <>
//             {/* Inline CSS styles */}
//             <style>{`
//                 .banner-fullpage-slider {
//                     width: 100%;
//                     overflow: hidden;
//                     position: relative;
//                 }

//                 .slider-item {
//                     width: 100%;
//                     text-align: center;
//                 }

//                 .slider-img {
//                     width: 100%;
//                     height: 100vh;
//                     object-fit: cover;
//                     display: block;
//                 }
//             `}</style>

//             <div className="banner-fullpage-slider">
//                    <a href={banners.URL}>
//                 <Slider {...settings}>
//                     {/* {slides.map((slide, index) => ( */}
//                     {banners.map((banners, idx) => (
//                         <div key={indx} className="slider-item">
//                             <img  src={banners.images[0]} alt="" className="slider-img" />
//                         </div>
//                     ))}
//                 </Slider>
//             </a>
//             </div>
//                <ToastContainer position="top-right" autoClose={3000} />
//         </>
//     );
// };

// export default BannerOne;

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerOne = () => {
  const [banners, setBanners] = useState([]);
  const api = "http://localhost:8080/banner/alldisplay";

  // Load banners
  const loadData = async () => {
    try {
      const response = await axios.get(api);
      setBanners(response.data);
    } catch (error) {
      toast.error("Error fetching banners");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Arrow components
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
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
        className={`${className} slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  // Slider settings
  const settings = {
    dots: false,
    arrows: banners.length > 1, // Show arrows only if multiple banners
    infinite: banners.length > 1,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <style>{`
        .banner-fullpage-slider {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .slider-item {
          width: 100%;
          text-align: center;
        }

        .slider-img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }
      `}</style>

      <div className="banner-fullpage-slider">
        <Slider {...settings}>
          {banners.map((banner, idx) => (
            <div key={idx} className="slider-item">
              <a href={banner.URL || "#"}>
                <img
                  src={banner.images?.[0]}
                  alt={`Banner ${idx}`}
                  className="slider-img"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default BannerOne;
