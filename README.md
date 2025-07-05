# 3D Animation Generator

A modern web application for generating 3D animations from videos and images using AI technology.

## Features

- Upload videos or images to convert to 3D animations
- Choose from various animation templates (Action, Dance, Cartoon, Business)
- Generate high-quality 3D animations with AI
- Preview animations directly in the browser
- Download or share your animations

## SEO Optimization

This project includes comprehensive SEO optimization:

- Semantic HTML structure
- Meta tags for title, description, and keywords
- Open Graph and Twitter card meta tags
- Structured data (JSON-LD) for rich search results
- Sitemap.xml and robots.txt
- Optimized for the following keywords:
  - 3D animation generator
  - Video to 3D animation
  - AI animation
  - 3D cartoon characters
  - 3D animation software
  - 3D character creator
  - 3D avatar maker
  - AI motion capture
  - 3D animation online
  - 3D animation converter

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/3d-animation-generator.git

# Navigate to the project directory
cd 3d-animation-generator

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Utility-first CSS framework
- React Hooks - State management
- Next.js API Routes - Backend API

## Deployment

The application can be deployed using Vercel:

```bash
npm run build
npm run start
```

Or deploy directly to Vercel:

```bash
vercel
```

## License

MIT

## SEO Best Practices Implemented

1. **Page Speed Optimization**
   - Image optimization with Next.js Image component
   - Code splitting and lazy loading
   - Minimized CSS and JavaScript

2. **Mobile Responsiveness**
   - Fully responsive design for all device sizes
   - Mobile-friendly UI elements

3. **Content Optimization**
   - Keyword-rich content
   - Proper heading structure (H1, H2, H3)
   - Alt text for images
   - Schema markup for rich snippets

4. **Technical SEO**
   - Clean URL structure
   - XML sitemap
   - Robots.txt configuration
   - Canonical URLs
   - HTTPS implementation

## Project Structure

```
/
├── pages/              # Page components
│   ├── api/            # API routes
│   │   └── generate.js # API route for handling animation generation requests
│   └── index.js        # Homepage
├── services/           # Services
│   └── api.js          # API service functions
├── public/             # Static assets
│   └── templates/      # Template thumbnails
└── ...
```

## Custom Templates

To add custom templates, modify the `getTemplates` function in the `services/api.js` file. In a production application, these templates should be fetched from the API.

## Notes

- Currently, the application uses mock data and API responses for demonstration
- To fully integrate with a 3D animation API, you'll need to obtain official API documentation and access
- Please contact the API provider to get complete API documentation and developer resources

## License

MIT 