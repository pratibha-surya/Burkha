


import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import HomePageOne from "./pages/HomePageOne";

import ShopPage from "./pages/ShopPage";
import ProductDetailsPageOne from "./pages/ProductDetailsPageOne";
import ProductDetailsPageTwo from "./pages/ProductDetailsPageTwo";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import ContactPage from "./pages/ContactPage";
import PhosphorIconInit from "./helper/PhosphorIconInit";

import Login from "./pages/Login/Login";
import Registration from "./pages/Login/Register";
// import AboutUs from "./About/AboutUs";
import About from "./About/About";

import User from "./pages/Loginpages/User";

import ProtectedRoute from "./components/protect/ProtectedRoute";
import CheckOut from "./pages/Checkout/checkout";
import { useState } from "react";
import ThankYou from "./pages/Checkout/Thankyou";
import Zoomer from "./About/Zoomer";

function App() {
    const [searchProductData, setsearchProductData] = useState()
  
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <PhosphorIconInit />

      <Routes>

        <Route exact path="/t" element={<Zoomer/>}/>
        <Route exact path='/' element={<HomePageOne data1={setsearchProductData} />} />
        {/* <Route exact path='/index-two' element={<HomePageTwo />} /> */}
        {/* <Route exact path='/index-three' element={<HomePageThree />} /> */}
        <Route exact path='/shop' element={<ShopPage searchProductData={searchProductData} />} />
        <Route exact path='/shop/category/:id/subcategory/:id' element={<ShopPage  />} />

        <Route
          exact
          path='/product-details/:id'
          element={<ProductDetailsPageOne />}
        />
        <Route

          path='/product-details-two/:id'
          element={<ProductDetailsPageTwo />}
        />

        {/* <Route exact path="/store" element={<Store/>}/> */}
        <Route exact path='/cart' element={<ProtectedRoute>
          <CartPage />
        </ProtectedRoute>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Registration />} />
        <Route exact path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route exact path='/thank-you' element={<ThankYou/>}/>


        <Route exact path='/account' element={<AccountPage />} />

        <Route exact path='/contact' element={<ContactPage />} />

        <Route exact path="/about" element={<About />} />
        <Route path="/dashboardoverview" element={<User />} />
        <Route path="/checkoutpay" element={<ProtectedRoute> <CheckOut/></ProtectedRoute> }/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;