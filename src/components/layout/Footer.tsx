'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  YouTube, 
  Email, 
  Phone, 
  LocationOn,
  LocalShipping,
  Security,
  Favorite,
  Support,
  Verified
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerSections = [
    {
      title: 'Shop by Age',
      links: [
        { name: '0-6 Months', href: '/products/0-6-months' },
        { name: '6-12 Months', href: '/products/6-12-months' },
        { name: '1-2 Years', href: '/products/1-2-years' },
        { name: '2-4 Years', href: '/products/2-4-years' },
        { name: '4+ Years', href: '/products/4-plus-years' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { name: 'Clothing & Shoes', href: '/products/clothing' },
        { name: 'Toys & Games', href: '/products/toys' },
        { name: 'Baby Care', href: '/products/baby-care' },
        { name: 'Maternity', href: '/products/maternity' },
        { name: 'Books & Learning', href: '/products/books' },
      ],
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Shipping & Returns', href: '/shipping' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'About Qurrota',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Safety Standards', href: '/safety' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <Instagram />, href: '#', label: 'Instagram' },
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <YouTube />, href: '#', label: 'YouTube' },
  ];

  const trustFeatures = [
    { icon: <Security />, text: '100% Safe & Non-Toxic' },
    { icon: <LocalShipping />, text: 'Free Shipping Over $50' },
    { icon: <Verified />, text: 'Certified Organic' },
    { icon: <Support />, text: '24/7 Customer Support' },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%)',
        borderTop: '3px solid #FFD700',
        pt: 6,
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
        }
      }}
    >
      <Container maxWidth="lg">
        {/* Trust Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3,
              }}
            >
              {trustFeatures.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: '1 1 200px',
                    maxWidth: '250px',
                    minWidth: '200px',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.15)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          color: '#FFD700',
                          mb: 1,
                          p: 1,
                          borderRadius: '50%',
                          background: 'rgba(255, 215, 0, 0.1)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mb: 4,
          }}
        >
          {/* Brand Section */}
          <Box
            sx={{
              flex: '1 1 300px',
              minWidth: '300px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #FFD700, #FF6B6B)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                  }}
                >
                  Qurrota Kids
                </Typography>
                
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    mb: 3, 
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                  }}
                >
                  Making childhood magical with premium, safe, and sustainable products for your little ones. 
                  Every item is carefully selected for quality and joy.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Email sx={{ color: '#FFD700', mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      hello@qurrota.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Phone sx={{ color: '#FFD700', mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationOn sx={{ color: '#FFD700', mr: 1.5, fontSize: 20, mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                      123 Kids Street, Family City, FC 12345
                    </Typography>
                  </Box>
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconButton
                        href={social.href}
                        sx={{
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #FFA500, #FFD700)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <Box
              key={section.title}
              sx={{
                flex: '1 1 200px',
                minWidth: '200px',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 700, 
                    color: '#333', 
                    mb: 2,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid #FFD700',
                    pb: 1,
                    display: 'inline-block',
                  }}
                >
                  {section.title}
                </Typography>
                
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          textDecoration: 'none',
                          py: 0.8,
                          px: 0,
                          transition: 'all 0.3s ease',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          '&:hover': {
                            color: '#FFD700',
                            transform: 'translateX(8px)',
                            fontWeight: 600,
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 215, 0, 0.3)', borderWidth: 2 }} />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                © 2024 Qurrota Kids. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Made with ❤️ for kids" 
                  size="small" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }} 
                />
                <Chip 
                  label="Eco-Friendly" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(76, 175, 80, 0.1)',
                    color: '#4CAF50',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Link
                href="/privacy"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#FFD700',
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#FFD700',
                    textDecoration: 'underline',
                  },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#FFD700',
                    textDecoration: 'underline',
                  },
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
