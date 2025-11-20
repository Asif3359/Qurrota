'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { 
  Facebook, 
  Instagram, 
} from '@mui/icons-material';
import { additionalColors, getRgbaColor } from '../../theme/colors';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerSections = [
    {
      title: 'About Qurrota',
      links: [
        { name: 'Our story', href: '/about' },
        { name: 'Safety standards', href: '/safety' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Contact us', href: '/contact' },
        { name: 'Size guide', href: '/size-guide' },
        { name: 'Shipping & Returns', href: '/shipping' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: 'https://www.facebook.com/qurrotakids', label: 'Facebook' },
    { icon: <Instagram />, href: 'https://www.instagram.com/qurrota_kids', label: 'Instagram' },
  ];

  return (
    <Box
      sx={{
        borderTop: `1px solid ${getRgbaColor(theme.palette.divider, 0.1)}`,
        py: { xs: 4, md: 6 },
        marginBottom: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 4, md: 6 },
            mb: 4,
          }}
        >
          {/* Left Section - Brand */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 40%' },
              maxWidth: { xs: '100%', md: '400px' },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Qurrota
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: 1.8,
                fontSize: '0.875rem',
              }}
            >
              Making childhood magical with safe, sustainable, and stylish products that parents trust and kids love.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    width: 40,
                    height: 40,
                    color: theme.palette.text.secondary,
                    background: getRgbaColor(theme.palette.action.hover, 0.05),
                    border: `1px solid ${getRgbaColor(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      background: getRgbaColor(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Right Section - Links */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 3, md: 6 },
              justifyContent: { md: 'flex-start' },
            }}
          >
            {footerSections.map((section) => (
              <Box
                key={section.title}
                sx={{
                  minWidth: { sm: '150px' },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      sx={{
                        fontWeight: 400,
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
        <Divider />
            
        {/* Bottom Section - Legal Links */}
        <Box
          sx={{
            pt: 3,
            borderTop: `1px solid ${getRgbaColor(theme.palette.divider, 0.1)}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'end',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 },
            mb: 4,
          }}
        >
          <Link
            href="/privacy"
            sx={{
              color: theme.palette.text.secondary,
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            sx={{
              color: theme.palette.text.secondary,
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Terms of Service
          </Link>
          <Link
            href="/cookies"
            sx={{
              color: theme.palette.text.secondary,
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Cookie Policy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
