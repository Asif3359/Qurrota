'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  LocalShipping, 
  People, 
  LocationOn, 
  VerifiedUser,
  ChildCare,
  Support,
  EmojiEvents,
  Spa
} from '@mui/icons-material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const values = [
    {
      icon: <Star sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Premium Quality',
      description: 'We never compromise on quality. Every product is carefully selected and tested to meet the highest standards.',
      color: '#FFD700',
    },
    {
      icon: <ChildCare sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Child Safety First',
      description: 'Your child\'s safety is our top priority. All products are made with safe, non-toxic materials.',
      color: '#9C27B0',
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Trust & Reliability',
      description: 'Building trust with families through transparent practices and reliable customer service.',
      color: '#2196F3',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Fast Delivery',
      description: 'Making parenting easier with fast delivery, easy returns, and exceptional support.',
      color: '#4CAF50',
    },
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      avatar: '/images/team/sarah.jpg',
      description: 'Former pediatric nurse with 15+ years experience in child care products.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      avatar: '/images/team/michael.jpg',
      description: 'Product safety expert with certifications in child safety standards.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Success',
      avatar: '/images/team/emma.jpg',
      description: 'Mother of three, passionate about helping families find the best products.',
    },
  ];

  const achievements = [
    { number: '10K+', label: 'Happy Families', icon: <People /> },
    { number: '500+', label: 'Premium Products', icon: <EmojiEvents /> },
    { number: '50+', label: 'Cities Served', icon: <LocationOn /> },
    { number: '4.9★', label: 'Customer Rating', icon: <Star /> },
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
              <Typography color="text.primary">About</Typography>
            </Breadcrumbs>
            
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
              <Chip 
                label="Est. 2020" 
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
                About Qurrota Kids
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
                Empowering families with premium, safe, and beautiful products for their little ones
              </Typography>
            </Box>
          </motion.div>

          {/* Story Section */}
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
                alignItems: 'center'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
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
                    Our Story
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.8, 
                      mb: 3, 
                      fontSize: '1.1rem',
                      fontWeight: 400
                    }}
                  >
                    Qurrota Kids was born from a simple yet powerful belief: <strong>every child deserves the best</strong>. 
                    Founded by parents who intimately understood the challenges of finding quality, safe, 
                    and beautiful products for their little ones, we set out to create a 
                    destination where families could shop with complete confidence.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.8, 
                      mb: 4,
                      fontSize: '1.1rem',
                      fontWeight: 400
                    }}
                  >
                    Today, we&apos;re proud to serve <strong>thousands of families</strong> across the country, 
                    offering a carefully curated selection of premium products that combine 
                    safety, quality, and style. Our mission is to make parenting a little 
                    easier and a lot more joyful.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<Spa />} 
                      label="Eco-Friendly" 
                      sx={{ 
                        background: 'rgba(76, 175, 80, 0.1)', 
                        color: '#4CAF50',
                        fontWeight: 600
                      }} 
                    />
                    <Chip 
                      icon={<Support />} 
                      label="24/7 Support" 
                      sx={{ 
                        background: 'rgba(33, 150, 243, 0.1)', 
                        color: '#2196F3',
                        fontWeight: 600
                      }} 
                    />
                    <Chip 
                      icon={<EmojiEvents />} 
                      label="Award Winning" 
                      sx={{ 
                        background: 'rgba(255, 193, 7, 0.1)', 
                        color: '#FFC107',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </motion.div>
              </Box>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    height: { xs: 300, md: 400 },
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(156, 39, 176, 0.1))',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
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
                  <Box sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#333',
                        mb: 2,
                        fontStyle: 'italic',
                      }}
                    >
                      &quot;Every child deserves the best start in life&quot;
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        fontStyle: 'italic',
                        fontSize: '1.1rem'
                      }}
                    >
                      &quot;- Our Promise to Every Family&quot;
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Values Section */}
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
                Our Core Values
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
                These principles guide everything we do, ensuring we deliver the best experience for your family
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 4,
                mb: { xs: 6, md: 10 }
              }}
            >
              {values.map((value, index) => (
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
                      border: `2px solid ${value.color}20`,
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
                        background: `linear-gradient(45deg, ${value.color}, ${value.color}80)`,
                        transform: 'scaleX(0)',
                        transition: 'transform 0.4s ease',
                      },
                      '&:hover': {
                        borderColor: value.color,
                        transform: 'translateY(-10px)',
                        boxShadow: `0 20px 40px ${value.color}20`,
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          background: `${value.color}15`,
                          border: `2px solid ${value.color}30`,
                        }}
                      >
                        {value.icon}
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
                        {value.title}
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
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box
              sx={{
                mt: { xs: 6, md: 10 },
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
              <Typography
                variant="h4"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  color: '#333', 
                  mb: 4,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Our Impact in Numbers
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 4,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          background: 'rgba(255, 215, 0, 0.1)',
                          mb: 2,
                          border: '2px solid rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        {React.cloneElement(achievement.icon, { 
                          sx: { fontSize: 30, color: '#FFD700' } 
                        })}
                      </Box>
                      <Typography
                        variant={isMobile ? 'h3' : 'h2'}
                        sx={{
                          fontWeight: 800,
                          background: 'linear-gradient(45deg, #FFD700, #9C27B0)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                        }}
                      >
                        {achievement.number}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}
                      >
                        {achievement.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 }, mb: { xs: 4, md: 6 } }}>
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
                Meet Our Team
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
                The passionate individuals behind Qurrota Kids who are dedicated to serving your family
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 4,
                mb: { xs: 6, md: 10 }
              }}
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: 4,
                      transition: 'all 0.4s ease',
                      textAlign: 'center',
                      '&:hover': {
                        borderColor: '#FFD700',
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(255, 215, 0, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 3,
                          border: '4px solid #FFD700',
                          background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                          fontSize: '3rem',
                          fontWeight: 700,
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ 
                          fontWeight: 700, 
                          color: '#333',
                          mb: 1,
                          fontSize: '1.25rem'
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Chip 
                        label={member.role} 
                        sx={{ 
                          mb: 3, 
                          background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                          color: '#000',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }} 
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.7,
                          fontSize: '1rem',
                          fontWeight: 400
                        }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
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
                  Ready to Experience the Difference?
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
                  Join thousands of families who trust Qurrota Kids for their children`&apos;s needs. 
                  Discover our premium collection today.
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
                    href="/contact" 
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
                    Contact Us
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
