


import React from 'react';
import { Link } from 'react-router-dom';

const FooterOne = () => {
    return (
        <footer
            className="py-12 mt-14"
            style={{
                backgroundColor: '#E9EEFF',
            }}
        >
            <div className="container container-lg">
                <div className="row g-4">
                    {/* Brand Column */}
                    <div className="col-md-4">
                        <Link to="/" className="text-decoration-none">
                            <h3 className="text-dark fw-bold fs-2 font-serif">
                                Umair <span className="text-success">Abaya</span>
                            </h3>
                           
                        </Link>
                        

                        <div className="mt-4">
                            {/* Address */}
                            <div className="d-flex mb-3">
                                <div
                                    className="bg-success rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="ph ph-map-pin text-white" style={{ fontSize: '20px' }}></i>
                                </div>
                                <address className="text-muted m-0">
                                    3rd Floor, 2170, Matia Mahal
                                    <br />
                                    Kalyan Pura, Main Bazar
                                    <br />
                                    Delhi-110006
                                    <br />
                                    <small>GSTIN: 07AMVPU7646P1ZM</small>
                                </address>
                            </div>

                            {/* Phone Numbers */}
                            <div className="d-flex mb-3">
                                <div
                                    className="bg-success rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="ph ph-phone text-white" style={{ fontSize: '20px' }}></i>
                                </div>
                                <div>
                                    <Link
                                        to="tel:+919368298145"
                                        className="d-block text-muted text-decoration-none"
                                    >
                                        +91 93682 98145
                                    </Link>
                                    <Link
                                        to="tel:+919368298145"
                                        className="d-block text-muted text-decoration-none"
                                    >
                                        +91 93682 98145
                                    </Link>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="d-flex">
                                <div
                                    className="bg-success rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="ph ph-envelope-simple text-white" style={{ fontSize: '20px' }}></i>
                                </div>
                                <Link
                                    to="mailto:contact@umairabhaya.com"
                                    className="text-muted text-decoration-none align-self-center"
                                >
                                    contact@umairabhaya.com
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Explore and Customer Care - Desktop View */}
                    <div className="col-md-2 d-none d-md-block">
                        <p className="text-dark fw-bold mb-4 pb-2">Explore</p>
                        <ul className="list-unstyled">
                            {['Full black', 'New fashion', 'Claaical black', 'New fashion', 'Claaical black'].map(
                                (item) => (
                                    <li key={item} className="mb-2">
                                        <Link
                                            to={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                            className="text-muted text-decoration-none hover-text-warning"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="col-md-2 d-none d-md-block">
                        <p className="text-dark fw-bold mb-4 pb-2">Customer Care</p>
                        <ul className="list-unstyled">
                            {['Contact Us', 'Shipping Policy', 'Returns', 'FAQ', 'Custom Orders'].map((item) => (
                                <li key={item} className="mb-2">
                                    <Link
                                        to={`/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-muted text-decoration-none"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                   {/* Explore & Customer Care - Mobile View */}
<div className="col-12 d-block d-md-none">
  <div className="d-flex flex-row justify-content-between">
    {/* Explore */}
    <div className="w-50 pe-2">
      <p className="text-dark fw-bold mb-3">Explore</p>
      <ul className="list-unstyled">
        {['Full black', 'New fashion', 'Claaical black'].map((item) => (
          <li key={item} className="mb-2">
            <Link
              to={`/shop/${item.toLowerCase().replace(' ', '-')}`}
              className="text-muted text-decoration-none"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Customer Care */}
    <div className="w-50 ps-2">
      <p className="text-dark fw-bold mb-3">Customer Care</p>
      <ul className="list-unstyled">
        {['Contact Us', 'Shipping Policy', 'Returns'].map((item) => (
          <li key={item} className="mb-2">
            <Link
              to={`/${item.toLowerCase().replace(' ', '-')}`}
              className="text-muted text-decoration-none"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


                    {/* Newsletter */}
                    <div className="col-md-4">
                        <p className="text-dark fw-bold mb-4 pb-2">Stay Updated</p>
                        <p className="text-muted">Subscribe for exclusive designs and offers.</p>

                        <div className="input-group mb-4">
                            <input
                                type="email"
                                className="form-control border-end-0"
                                placeholder="Your email"
                            />
                            <button className="btn btn-success" type="button">
                                <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>

                        <h6 className="text-muted mb-3">Follow Us</h6>
                        <div className="d-flex gap-2">
                            {['facebook', 'instagram', 'pinterest', 'twitter'].map((social) => (
                                <Link
                                    key={social}
                                    to={`https://www.${social}.com/umairabhaya`}
                                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className={`bi bi-${social}`}></i>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="row mt-5">
                    <div className="col-12 text-center text-muted border-top pt-3">
                        <small>© {new Date().getFullYear()} Umair Abaya. Crafted with care in Delhi.</small>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterOne;
