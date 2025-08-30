# Poster Images

This directory contains poster images (thumbnails) for your advertisement videos.

## File Structure
```
public/images/
├── ad1-poster.jpg   # Poster for first advertisement video
├── ad2-poster.jpg   # Poster for second advertisement video
├── ad3-poster.jpg   # Poster for third advertisement video
└── README.md        # This file
```

## Image Requirements
- **Format**: JPG or PNG
- **Resolution**: 1280x720 pixels (16:9 aspect ratio)
- **File Size**: Keep under 500KB for faster loading
- **Quality**: High quality, clear images that represent the video content

## How to Add Poster Images
1. Create poster images for your videos
2. Place them in this directory
3. Reference them in the `poster` property of your video objects in `HeroSection.tsx`

## Example Usage
```javascript
{
  id: 1,
  src: '/videos/ad1.mp4',
  title: 'Premium Kids Collection',
  description: 'Discover our latest collection',
  poster: '/images/ad1-poster.jpg', // This will show before video loads
}
```

## Tips for Creating Poster Images
- Use a frame from your video that best represents the content
- Ensure good contrast and visibility
- Include text or branding if appropriate
- Test how it looks at different screen sizes
