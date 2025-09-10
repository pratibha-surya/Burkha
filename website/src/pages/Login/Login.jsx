import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Form, Button, Alert, Card, Spinner, FloatingLabel
} from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import ColorInit from '../../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import HeaderOne from '../../components/HeaderOne';
import FooterOne from '../../components/FooterOne';
import BottomFooter from '../../components/BottomFooter';
import { login } from '../../pages/features/auth/AuthSlice';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboardoverview');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const particlesInit = useCallback(async (engine) => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    if (loginError) setLoginError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboardoverview');
    } catch (err) {
      // Error handled in slice; optionally override here
      console.error(err);
    }
  };

  return (
    <>
      <ColorInit color={false} />
      <ScrollToTop smooth color="#299E60" />
      <HeaderOne category={true} />

      <div className="login-container">
        <div className="particles-background">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              interactivity: {
                events: {
                  onClick: { enable: true, mode: "push" },
                  onHover: { enable: true, mode: "repulse" },
                },
                modes: {
                  push: { quantity: 4 },
                  repulse: { distance: 100, duration: 0.4 },
                },
              },
              particles: {
                color: { value: "#ffffff" },
                links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3, width: 1 },
                collisions: { enable: true },
                move: { direction: "none", enable: true, outModes: { default: "bounce" }, speed: 2 },
                number: { density: { enable: true, area: 800 }, value: 60 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        </div>

        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
          <Row className="justify-content-center w-100">
            <Col md={8} lg={6} xl={5}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="glass-card shadow-lg border-0 overflow-hidden">
                  <div style={{ backgroundColor: "#299E60" }} className="py-4">
                    <h2 className="text-center text-white mb-1">Welcome Back</h2>
                    <p className="text-center text-white mb-0">Sign in to access your account</p>
                  </div>

                  <Card.Body className="p-4 p-sm-5">
                    <AnimatePresence>
                      {loginError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <Alert variant="danger" className="mb-4">
                            <ExclamationTriangle className="me-2" />
                            {loginError}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Form onSubmit={handleSubmit}>
                      <FloatingLabel controlId="email" label="Email address" className="mb-24 mt-24">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          className="input-field"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </FloatingLabel>

                      <FloatingLabel controlId="password" label="Password" className="mb-24 mt-24">
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          className="input-field"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </FloatingLabel>

                      <div className="d-flex justify-content-center align-items-center mb-24 mt-24">
                        <a href="/forgot-password" className="text-decoration-none text-primary">Forgot password?</a>
                      </div>

                      <Button
                        style={{ backgroundColor: "#299E60" }}
                        type="submit"
                        disabled={loading}
                        className="w-100 mb-24 mt-24"
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Form>

                    <div className="text-center mb-24 mt-24">
                      <p className="text-muted">
                        Don't have an account?{' '}
                        <motion.a
                          href="/register"
                          className="text-decoration-none fw-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ color: '#299E60' }}
                        >
                          Sign up
                        </motion.a>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      <FooterOne />
      <BottomFooter />
      <ToastContainer />
    </>
  );
};

export default Login;
