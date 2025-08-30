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

const JoinUsSection = () => {

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
  )
}

export default JoinUsSection