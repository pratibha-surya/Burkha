
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";

import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import AboutUs from "./AboutUs";
const About = () => {

  return (

    <>

      {/* Preloader */}
      {/* <Preloader /> */}

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      {/* <ColorInit color={false} /> */}

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <AboutUs/>




      <FooterOne />

      {/* BottomFooter */}
      {/* <BottomFooter /> */}


    </>
  );
};

export default About;
