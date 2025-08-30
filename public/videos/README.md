# Advertisement Videos

This directory contains your advertisement videos for the HeroSection slider.

## File Structure
```
public/videos/
├── ad1.mp4          # First advertisement video
├── ad2.mp4          # Second advertisement video
├── ad3.mp4          # Third advertisement video
└── README.md        # This file
```

## Video Requirements
- **Format**: MP4 (recommended for web compatibility)
- **Resolution**: 1920x1080 or 1280x720 (16:9 aspect ratio)
- **Duration**: 10-30 seconds per video
- **File Size**: Keep under 10MB per video for faster loading
- **Codec**: H.264 for best browser compatibility

## How to Add Your Videos
1. Place your video files in this directory
2. Update the `advertisementVideos` array in `src/components/sections/HeroSection.tsx`
3. Replace the sample video paths with your actual video paths

## Example Video Configuration
```javascript
const advertisementVideos = [
  {
    id: 1,
    src: '/videos/your-video-1.mp4',
    title: 'Your Video Title',
    description: 'Your video description',
    poster: '/images/your-poster-1.jpg', // Optional
  },
  // Add more videos...
];
```

## Poster Images (Optional)
You can also add poster images (thumbnail images) for each video:
- Place poster images in `public/images/`
- Reference them in the `poster` property of each video object
- Recommended size: 1280x720 pixels
