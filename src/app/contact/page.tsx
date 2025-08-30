'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Send, 
  Support,
  VerifiedUser,
  LocalShipping,
} from '@mui/icons-material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Email Us',
      info: 'hello@qurrota.com',
      description: 'We\'ll get back to you within 24 hours',
      color: '#FFD700',
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Call Us',
      info: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
      color: '#9C27B0',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Visit Us',
      info: '123 Kids Street, Family City',
      description: 'FC 12345, United States',
      color: '#2196F3',
    },
  ];

  const features = [
    {
      icon: <Support sx={{ fontSize: 30, color: '#4CAF50' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
      color: '#4CAF50',
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 30, color: '#FF9800' }} />,
      title: 'Trusted Brand',
      description: 'Thousands of happy families',
      color: '#FF9800',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 30, color: '#E91E63' }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping',
      color: '#E91E63',
    },
  ];

  const faqs = [
    {
      question: 'What are your shipping times?',
      answer: 'We typically ship within 1-2 business days and delivery takes 3-5 business days.',
    },
    {
      question: 'Do you offer returns?',
      answer: 'Yes, we offer a 30-day return policy for unused items in original packaging.',
    },
    {
      question: 'Are your products safe for children?',
      answer: 'Absolutely! All our products meet or exceed safety standards and are tested for quality.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship to all 50 US states. International shipping coming soon!',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box sx={{ pt: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Breadcrumbs sx={{ mb: 4 }}>
              <Link href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#FFD700' } }}>
                Home
              </Link>
              <Typography color="text.primary">Contact</Typography>
            </Breadcrumbs>
            
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
              <Chip 
                label="Get Support" 
                sx={{ 
                  mb: 2, 
                  background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }} 
              />
              <Typography
                variant={isSmallMobile ? 'h3' : isMobile ? 'h2' : 'h1'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FFD700, #9C27B0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                }}
              >
                Get in Touch
              </Typography>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                color="text.secondary"
                sx={{ 
                  maxWidth: 800, 
                  mx: 'auto', 
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </Typography>
            </Box>
          </motion.div>

          {/* Contact Form & Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: { xs: 4, md: 6 },
                mb: { xs: 6, md: 10 },
                alignItems: 'start'
              }}
            >
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Box sx={{ width: '100%' , display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Typography
                      variant={isMobile ? 'h4' : 'h3'}
                      gutterBottom
                      sx={{ 
                        fontWeight: 700, 
                        color: '#333', 
                        mb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -10,
                          left: 0,
                          width: 60,
                          height: 4,
                          background: 'linear-gradient(45deg, #FFD700, #9C27B0)',
                          borderRadius: 2,
                        }
                      }}
                    >
                      Send Us a Message
                    </Typography>
                  
                <Card
                  elevation={0}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>                    
                    {submitted && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        Thank you for your message! We&apos;ll get back to you soon.
                      </Alert>
                    )}
                    
                    <Box component="form" onSubmit={handleSubmit}>
                      <Box 
                        sx={{ 
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 3,
                          mb: 3,
                          py: 2
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#FFD700',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#9C27B0',
                              },
                            },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(255, 215, 0, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#FFD700',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#9C27B0',
                              },
                            },
                          }}
                        />
                      </Box>
                      
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 215, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#FFD700',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#9C27B0',
                            },
                          },
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        sx={{
                          mb: 4,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 215, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#FFD700',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#9C27B0',
                            },
                          },
                        }}
                      />
                      
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<Send />}
                        sx={{
                          background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                          color: '#000',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FFC000, #FFD700)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 20px rgba(255, 215, 0, 0.3)',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
                </Box>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
                  <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    gutterBottom
                    sx={{ 
                      fontWeight: 700, 
                      color: '#333', 
                      mb: 3,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -10,
                        left: 0,
                        width: 60,
                        height: 4,
                        background: 'linear-gradient(45deg, #FFD700, #9C27B0)',
                        borderRadius: 2,
                      }
                    }}
                  >
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                      >
                        <Card
                          elevation={0}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: `2px solid ${info.color}20`,
                            borderRadius: 4,
                            transition: 'all 0.4s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: `linear-gradient(45deg, ${info.color}, ${info.color}80)`,
                              transform: 'scaleX(0)',
                              transition: 'transform 0.4s ease',
                            },
                            '&:hover': {
                              borderColor: info.color,
                              transform: 'translateY(-5px)',
                              boxShadow: `0 15px 30px ${info.color}20`,
                              '&::before': {
                                transform: 'scaleX(1)',
                              },
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                              <Box 
                                sx={{ 
                                  display: 'flex',
                                  p: 2,
                                  borderRadius: '50%',
                                  background: `${info.color}15`,
                                  border: `2px solid ${info.color}30`,
                                }}
                              >
                                {info.icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  gutterBottom
                                  sx={{ fontWeight: 700, color: '#333', mb: 1 }}
                                >
                                  {info.title}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600, color: '#666', mb: 1 }}
                                >
                                  {info.info}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.6 }}
                                >
                                  {info.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  mb: 2,
                }}
              >
                Why Choose Qurrota Kids?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto', 
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                We&apos;re committed to providing the best experience for your family
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 4,
                mb: { xs: 6, md: 10 }
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: `2px solid ${feature.color}20`,
                      borderRadius: 4,
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(45deg, ${feature.color}, ${feature.color}80)`,
                        transform: 'scaleX(0)',
                        transition: 'transform 0.4s ease',
                      },
                      '&:hover': {
                        borderColor: feature.color,
                        transform: 'translateY(-10px)',
                        boxShadow: `0 20px 40px ${feature.color}20`,
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          background: `${feature.color}15`,
                          border: `2px solid ${feature.color}30`,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ 
                          fontWeight: 700, 
                          color: '#333',
                          mb: 2,
                          fontSize: '1.25rem'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.7,
                          fontSize: '1rem',
                          fontWeight: 400
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  gutterBottom
                  sx={{ 
                    fontWeight: 700, 
                    color: '#333', 
                    mb: 4,
                  }}
                >
                  Frequently Asked Questions
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 4
                  }}
                >
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 3,
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderColor: '#FFD700',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ 
                            fontWeight: 700, 
                            color: '#333', 
                            mb: 2,
                            fontSize: '1.1rem'
                          }}
                        >
                          {faq.question}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.7,
                            fontSize: '1rem'
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box
              sx={{
                mt: { xs: 6, md: 10 },
                p: { xs: 4, md: 6 },
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(156, 39, 176, 0.1))',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  gutterBottom
                  sx={{ 
                    fontWeight: 700, 
                    color: '#333', 
                    mb: 3,
                  }}
                >
                  Ready to Get Started?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    maxWidth: 600, 
                    mx: 'auto', 
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    mb: 4
                  }}
                >
                  Join thousands of families who trust Qurrota Kids. Start shopping today!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link 
                    href="/products" 
                    sx={{ 
                      textDecoration: 'none',
                      px: 4,
                      py: 2,
                      background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                      color: '#000',
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(255, 215, 0, 0.3)',
                      }
                    }}
                  >
                    Shop Now
                  </Link>
                  <Link 
                    href="/about" 
                    sx={{ 
                      textDecoration: 'none',
                      px: 4,
                      py: 2,
                      border: '2px solid #9C27B0',
                      color: '#9C27B0',
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#9C27B0',
                        color: '#fff',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Learn More
                  </Link>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
