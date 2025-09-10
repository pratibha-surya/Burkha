


import React from "react";

import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";

import RecommendedOne from "../components/RecommendedOne";

import NewArrivalOne from "../components/NewArrivalOne";
import ShippingOne from "../components/ShippingOne";
import NewsletterOne from "../components/NewsletterOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
const HomePageOne = ({setsubcategory,data1}) => {

  return (

    <>


      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne  setsearchProductData={data1} />

      {/* BannerOne */}
      <BannerOne />


  {/* RecommendedOne */}
  <RecommendedOne />




      {/* NewArrivalOne */}
      <NewArrivalOne />

      {/* ShippingOne */}

      {/* NewsletterOne */}
      <NewsletterOne />


         <ShippingOne />

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      {/* <BottomFooter /> */}


    </>
  );
};

export default HomePageOne;