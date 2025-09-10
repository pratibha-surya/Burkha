// import React from 'react';
// import { motion } from 'framer-motion';
// import { Container, Row, Col } from 'react-bootstrap';

// const AboutUs = () => {
//     return (
//         <div className="bg-light">
//             {/* Hero Section */}
//             <div className="position-relative overflow-hidden" style={{ height: '500px' }}>
//                 <div className="position-absolute w-100 h-100" style={{
//                     backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center'
//                 }}></div>
//                 <Container className="position-relative h-100 d-flex align-items-center">
//                     <motion.div
//                         initial={{ opacity: 0, y: 50 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.8 }}
//                         className="text-white"
//                     >
//                         <h1 className="display-3 fw-bold mb-4">Our Story</h1>
//                         <p className="lead" style={{ maxWidth: '600px' }}>
//                             Celebrating modesty through elegant designs that blend tradition with contemporary fashion
//                         </p>
//                     </motion.div>
//                 </Container>
//             </div>

//             {/* Mission Section */}
//             <Container className="py-5 my-5">
//                 <Row className="align-items-center g-5">
//                     <Col md={6} as={motion.div}
//                         initial={{ opacity: 0, x: -50 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="p-4 p-lg-5 position-relative">
//                             <div className="position-absolute top-0 start-0 w-100 h-100 bg-white shadow-sm rounded-3" style={{
//                                 transform: 'rotate(-2deg)',
//                                 zIndex: -1
//                             }}></div>
//                             <h5 className=" fw-bold text-dark mb-4">Our Mission</h5>
//                             <p className="fs-5 text-muted lh-lg">
//                                 To provide high-quality, stylish Islamic clothing that empowers women to express their faith with confidence and elegance.
//                                 We combine traditional values with modern design to create garments that are both modest and fashionable.
//                             </p>
//                         </div>
//                     </Col>
//                     <Col md={6} as={motion.div}
//                         initial={{ opacity: 0, x: 50 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <img
//                             src="https://images.unsplash.com/photo-1561526116-e2460f4d40a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
//                             alt="Elegant Islamic clothing"
//                             className="w-100 rounded-3 shadow"
//                             style={{ objectFit: 'cover', height: '400px' }}
//                         />
//                     </Col>
//                 </Row>
//             </Container>

//             {/* Values Section */}
//             <div className="py-5 bg-white">
//                 <Container>
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         whileInView={{ opacity: 1 }}
//                         transition={{ duration: 0.7 }}
//                         viewport={{ once: true }}
//                         className="text-center mb-5"
//                     >
//                         <h5 className="-5 fw-bold text-dark">Our Core Values</h5>
//                         <p className="text-muted fs-5">Guiding principles in everything we create</p>
//                     </motion.div>

//                     <Row className="g-4">
//                         {[
//                             {
//                                 title: "Modesty",
//                                 description: "Our designs always prioritize Islamic principles of modesty while maintaining elegance",
//                                 icon: "fas fa-hands-praying"
//                             },
//                             {
//                                 title: "Quality",
//                                 description: "Only premium fabrics and meticulous craftsmanship go into each garment",
//                                 icon: "fas fa-award"
//                             },
//                             {
//                                 title: "Comfort",
//                                 description: "Breathable fabrics and thoughtful designs for all-day ease",
//                                 icon: "fas fa-leaf"
//                             },
//                             {
//                                 title: "Innovation",
//                                 description: "Continually evolving our designs to meet modern needs",
//                                 icon: "fas fa-lightbulb"
//                             },
//                             {
//                                 title: "Sustainability",
//                                 description: "Ethical production and sustainable materials",
//                                 icon: "fas fa-globe"
//                             },
//                             {
//                                 title: "Community",
//                                 description: "Supporting and empowering Muslim women worldwide",
//                                 icon: "fas fa-hands-helping"
//                             }
//                         ].map((value, index) => (
//                             <Col md={4} key={index} as={motion.div}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                             >
//                                 <div className="p-4 text-center h-100">
//                                     <div className="icon-lg bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
//                                         <i className={`${value.icon} fs-3 text-primary`}></i>
//                                     </div>
//                                     <h3 className="h4 fw-bold text-dark mb-3">{value.title}</h3>
//                                     <p className="text-muted">{value.description}</p>
//                                 </div>
//                             </Col>
//                         ))}
//                     </Row>
//                 </Container>
//             </div>

//             {/* Founder Message */}
//             <div className="py-5 bg-light">
//                 <Container>
//                     <Row className="align-items-center g-5">
//                         <Col md={6} as={motion.div}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             whileInView={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.5 }}
//                             viewport={{ once: true }}
//                         >
//                             <img
//                                 src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
//                                 alt="Founder"
//                                 className="w-100 rounded-3 shadow"
//                                 style={{ objectFit: 'cover', height: '500px' }}
//                             />
//                         </Col>
//                         <Col md={6} as={motion.div}
//                             initial={{ opacity: 0, x: 50 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                             viewport={{ once: true }}
//                         >
//                             <div className="p-4">
//                                 <h5 className="fw-bold text-dark mb-4">A Message From Our Founder</h5>
//                                 <p className="fs-5 text-muted lh-lg mb-4">
//                                     "As a Muslim woman myself, I understand the challenges of finding clothing that is both modest and stylish.
//                                     Our brand was born from a desire to create beautiful, high-quality Islamic wear that makes women feel confident
//                                     and proud of their faith."
//                                 </p>
//                                 <div className="d-flex align-items-center">
//                                     <div className="me-3">
//                                         <h4 className="mb-0 fw-bold">Aisha Rahman</h4>
//                                         <p className="text-muted mb-0">Founder & CEO</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* Call to Action */}
//             <div className="py-5 bg-dark text-white">
//                 <Container className="text-center py-5">
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <h5 className=" text-white fw-bold mb-4">Join Our Modest Fashion Journey</h5>
//                         <p className="fs-5 mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
//                             Discover our latest collection of elegant burqas and Islamic wear designed for the modern Muslim woman
//                         </p>
//                         <button className="btn border  border-1 text-dark btn-lg px-13 py-13 rounded-pill fw-bold">
//                             Explore Collections
//                         </button>
//                     </motion.div>
//                 </Container>
//             </div>
//         </div>
//     );
// };

// export default AboutUs;



import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

const AboutUs = () => {
    return (
        <div className="bg-light">
            {/* Hero Section */}
            <div className="position-relative overflow-hidden" style={{ height: '500px' }}>
                <div className="position-absolute w-100 h-100" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://fabriclore.com/cdn/shop/articles/Blog-Banner-for-graphics_3_80e2f79c-3f90-4914-87de-ccbed4225531.jpg?v=1665050127&width=1400)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top'
                }}></div>
                <Container className="position-relative h-100 d-flex align-items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <h1 className="display-3 fw-bold mb-4">Our Story</h1>
                        <p className="lead" style={{ maxWidth: '600px' }}>
                           At Umair Abaya, we firmly believe that tradition and culture go hand in hand with style. A style that is as timeless as our faith. We are continuously working to change perceptions and raise expectations about how the modern Muslim woman looks and more importantly, how she feels.
                        </p>
                    </motion.div>
                </Container>
            </div>

            {/* Mission Section */}
            <Container className="py-5 my-5">
                <Row className="align-items-center g-5">
                    <Col md={6} as={motion.div}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="p-4 p-lg-5 position-relative">
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white shadow-sm rounded-3" style={{
                                transform: 'rotate(-2deg)',
                                zIndex: -1
                            }}></div>
                            <h5 className=" fw-bold text-dark mb-4">Our Mission</h5>
                            <p className="fs-5 text-muted lh-lg">
                              Our mission is to become the leading brand for Muslim fashion by offering beautifully crafted garments at a competitive price - and creating a space where customers can gain our insight into the modest fashion space. With this in mind, we aim to provide an enjoyable shopping experience every time through our personal approach to customer service.
                            </p>
                        </div>
                    </Col>
                    <Col md={6} as={motion.div}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://www.shutterstock.com/image-vector/beautiful-islamic-woman-wearing-hijab-600nw-2282607765.jpg"
                            alt="Elegant Islamic clothing"
                            className="w-100 rounded-3 shadow"
                            style={{ objectFit: 'cover', height: '400px' }}
                        />
                    </Col>
                </Row>
            </Container>

            {/* Values Section */}


            {/* Founder Message */}
            <div className="py-5 bg-light">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col md={6} as={motion.div}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src="https://thumbs.dreamstime.com/b/poster-vector-showing-hijab-chador-niqab-burka-various-muslim-female-clothing-styles-muslim-headgear-types-vector-381253674.jpg"
                                alt="Founder"
                                className="w-100 rounded-3 shadow"
                                style={{ objectFit: 'cover', height: '500px' }}
                            />
                        </Col>
                        <Col md={6} as={motion.div}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-4">
                                <h5 className="fw-bold text-dark mb-4">A Message From Our Founder</h5>
                                <p className="fs-5 text-muted lh-lg mb-4">
                                   All of our items are available to shop online, offline meaning you have access to a wide range of modest fashion items around the clock. Since launching in 2018, we have been overwhelmed with your response to our brand and are proud to say we have established a global client base.
                                </p>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                         <p className="text-muted mb-0"> We love to hear from our customers, so please get in touch on our social media pages. You can also sign up to our newsletter for the latest news and offers, or just to say hello to the team. We look forward to hearing from you!
</p>
                                        {/* <h4 className="mb-0 fw-bold">Aisha Rahman</h4> */}
                                        <p className="text-muted mb-0"> Today, Umair Abaya is more than just a brand — it’s a growing community of women who choose authenticity, elegance, and integrity.
From our passion to your confidence, Welcome to Umair Abaya.
</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>


        </div>
    );
};

export default AboutUs;