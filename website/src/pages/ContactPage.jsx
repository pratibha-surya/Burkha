import React from "react";
// import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
// import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
// import FooterTwo from "../components/FooterTwo";
// import BottomFooter from "../components/BottomFooter";
import ShippingOne from "../components/ShippingOne";
import Contact from "../components/Contact";
import ScrollToTop from "react-scroll-to-top";
import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
const ContactPage = () => {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={false} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />


      {/* HeaderTwo */}
      <HeaderOne category={true} />

      {/* Breadcrumb */}
      <Breadcrumb title={"Contact"} />

      {/* Contact */}
      <Contact />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterTwo */}
      <FooterOne />

      {/* BottomFooter */}
      {/* <BottomFooter /> */}
    </>
  );
};

export default ContactPage;
