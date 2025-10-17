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
import { getRgbaColor } from '../../theme/colors';
import QurrotaLogo from '../../../public/images/QurrotaLogo';

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
        background: theme.palette.background.default,
        pt: 6,
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: theme.palette.primary.dark,
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
                        border: `1px solid ${getRgbaColor(theme.palette.primary.dark, 0.2)}`,
                        transition: 'all 0.3s ease',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: `0 8px 25px ${getRgbaColor(theme.palette.primary.dark, 0.15)}`,
                        }
                      }}
                    >
                      <Box
                        sx={{
                          color: theme.palette.primary.dark,
                          mb: 1,
                          p: 1,
                          borderRadius: '50%',
                          background: getRgbaColor(theme.palette.primary.dark, 0.1),
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.dark,
                  mb: 2,
                }}
              >
                Qurrota Kids
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Making childhood magical with safe, sustainable, and stylish products that parents trust and kids love.
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <IconButton
                      component="a"
                      href={social.href}
                      aria-label={social.label}
                      sx={{
                        color: theme.palette.primary.dark,
                        background: getRgbaColor(theme.palette.primary.dark, 0.1),
                        '&:hover': {
                          background: getRgbaColor(theme.palette.primary.dark, 0.2),
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>

              {/* Newsletter Signup */}
              <Box
                sx={{
                  background: theme.palette.primary.main,
                  p: 3,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  Stay Updated
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    mb: 2,
                    opacity: 0.9,
                  }}
                >
                  Get the latest updates on new products and exclusive offers!
                </Typography>
                <Chip
                  label="Subscribe Now"
                  sx={{
                    background: theme.palette.primary.contrastText,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              </Box>
            </motion.div>
          </Box>

          {/* Footer Links */}
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
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {section.links.map((link, linkIndex) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          color: theme.palette.text.secondary,
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: theme.palette.primary.dark,
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 4,
              p: 3,
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 2,
              border: `1px solid ${getRgbaColor(theme.palette.primary.dark, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: theme.palette.primary.dark, mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              support@qurrota.com 
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: theme.palette.primary.dark, mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                +880 01789846204
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ color: theme.palette.primary.dark, mr: 1.5, fontSize: 20, mt: 0.2 }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Dhaka, Bangladesh
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            pt: 3,
            borderTop: `1px solid ${getRgbaColor(theme.palette.primary.dark, 0.1)}`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Favorite sx={{ fontSize: 16, color: theme.palette.primary.dark }} />
              Made with love for families worldwide
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Link
                href="/privacy"
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: theme.palette.primary.dark },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: theme.palette.primary.dark },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: theme.palette.primary.dark },
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </motion.div>
        </Box>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: 'center',
              mt: 4,
              p: 2,
              background: theme.palette.primary.dark,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.contrastText,
                fontWeight: 500,
              }}
            >
              © 2024 Qurrota Kids. All rights reserved.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
