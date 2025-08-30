import { Box, Breadcrumbs, Link, Chip, Container, Typography, Card, CardContent, Alert, TextField, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Email, LocationOn, Phone, Send } from '@mui/icons-material'

const contactInfo: { title: string; info: string; description: string; icon: React.ReactNode; color: string }[] = [

    {
        title: 'Email',
        info: 'info@qurrota.com',
        description: 'Send us an email for any questions or inquiries',
        icon: <Email />,
        color: '#FFD700'
    },
    {
        title: 'Phone',
        info: '+1 (555) 123-4567',
        description: 'Call us for any questions or inquiries',
        icon: <Phone />,
        color: '#9C27B0'
    },
    {
        title: 'Address',
        info: '123 Main St, Anytown, USA',
        description: 'Visit us for any questions or inquiries',
        icon: <LocationOn />,
        color: '#FFD700'
    }
] as const

const GetInTouch = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }   
  return (
    <Box sx={{ py: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', gap: 2, background: 'rgba(255, 255, 255, 0.32)', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
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
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>
          </motion.div>

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
                        Thank you for your message! We'll get back to you soon.
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
        </Container>
    </Box>
  )
}

export default GetInTouch   