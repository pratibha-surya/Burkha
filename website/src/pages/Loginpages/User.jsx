import React from "react";
// import Preloader from "../helper/Preloader";

import Dashboard from "./Dashbaord";
import ScrollToTop from "react-scroll-to-top";
import HeaderOne from "../../components/HeaderOne";
import FooterOne from "../../components/FooterOne";
import BottomFooter from "../../components/BottomFooter";
import DashboardOverview from "./DashboardOverview";

const User = () => {

  return (

    <>

      {/* Preloader */}
      {/* <Preloader /> */}

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      {/* <ColorInit color={false} /> */}

      {/* HeaderOne */}
      <HeaderOne/>

      {/* BannerOne */}
      <DashboardOverview/>
    
      {/* <NewsletterOne /> */}

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default User;
