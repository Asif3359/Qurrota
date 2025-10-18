import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/admin/',
        '/api/',
        '/_next/',
        '/login/forgetpassword/',
        '/signup/veryfication/',
      ],
    },
    sitemap: 'https://qurrota.com/sitemap.xml',
  }
}
