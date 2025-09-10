import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import ProductDetailsOne from "../components/ProductDetailsOne";
import NewArrivalTwo from "../components/NewArrivalTwo";
import ShippingOne from "../components/ShippingOne";
import NewsletterOne from "../components/NewsletterOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import BreadcrumbTwo from './../components/BreadcrumbTwo';
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import { useParams } from "react-router-dom";

const ProductDetailsPageOne = () => {
const { id } = useParams();


  return (
    <>

      <ColorInit color={false} />


      <ScrollToTop smooth color="#299E60" />

      <HeaderOne />

      <BreadcrumbTwo title={"Product Details"} />

      <ProductDetailsOne  courseId={id} />

      <NewArrivalTwo />

      <ShippingOne />

      <NewsletterOne />

      {/* FooterTwo */}
      <FooterOne />

     



    </>
  );
};

export default ProductDetailsPageOne;
