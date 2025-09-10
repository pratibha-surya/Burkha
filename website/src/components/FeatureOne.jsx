import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const FeatureOne = () => {

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={` ${className} slick-next slick-arrow flex-center rounded-3 bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
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
                className={`${className} slick-prev slick-arrow flex-center rounded-3 bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 10,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1699,
                settings: {
                    slidesToShow: 9,
                },
            },
            {
                breakpoint: 1599,
                settings: {
                    slidesToShow: 8,
                },
            },
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 424,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 359,
                settings: {
                    slidesToShow: 1,
                },
            },

        ],
    };
    return (
        <div className="feature " id="featureSection">
            <h4 className='text-center'>Explore Our <span className=''>Furniture</span>  Range</h4>

            <div className="container container-lg">
                <div className="position-relative arrow-center">
                    <div className="flex-align">
                        <button
                            type="button"
                            id="feature-item-wrapper-prev"
                            className="slick-prev slick-arrow flex-center rounded-3 bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
                        >
                            <i className="ph ph-caret-left" />
                        </button>
                        <button
                            type="button"
                            id="feature-item-wrapper-next"
                            className="slick-next slick-arrow flex-center rounded-3 bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
                        >
                            <i className="ph ph-caret-right" />
                        </button>
                    </div>
                    <div className="feature-item-wrapper">
                        <Slider {...settings}>


                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                            New Arrivals
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/beautiful-arabic-lady-cartoon-character_1308-48006.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Midis&Tops
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important",  borderRadius:"50%" }} src="https://img.freepik.com/premium-vector/woman-wearing-niqab-islamic-traditional-veil-cartoon-character_1639-18099.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                          Midis&Tops
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                           <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Midis&Tops
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>


                          <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Prayer Dresses
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/beautiful-arabic-lady-cartoon-character_1308-48006.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Prayer Dresses
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important",  borderRadius:"50%" }} src="https://img.freepik.com/premium-vector/woman-wearing-niqab-islamic-traditional-veil-cartoon-character_1639-18099.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                          Kids Abayas
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                           <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Mom & Baby
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                              <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Mom & Baby
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/beautiful-arabic-lady-cartoon-character_1308-48006.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                         Shrugs and Coat Abaya
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                            <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important",  borderRadius:"50%" }} src="https://img.freepik.com/premium-vector/woman-wearing-niqab-islamic-traditional-veil-cartoon-character_1639-18099.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                           Shrugs and Coat Abaya
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>

                           <div className="feature-item text-center">
                                <div className="feature-item__thumb rounded-3">
                                    <Link to="/shop" className="w-100 h-100 flex-center">
                                        <img style={{ height:"105px" , width:"105px !important", borderRadius:"50%" }} src="https://img.freepik.com/free-vector/muslim-girl-black-outfit_1308-20422.jpg?uid=R79748185&ga=GA1.1.1807792258.1717831286&semt=ais_hybrid&w=740" alt="" />
                                    </Link>
                                </div>
                                <div className="feature-item__content mt-16">
                                    <h6 className="text-lg mb-8">
                                        <Link to="/shop" className="text-inherit">
                                          Shrugs and Coat Abaya
                                        </Link>
                                    </h6>
                                    <span className="text-sm text-white">125+ Products</span>
                                </div>
                            </div>


                        </Slider>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FeatureOne