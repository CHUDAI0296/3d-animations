# AnimAI - 3D Animation Generator

This is a web application built with Next.js for converting videos or images into 3D animated characters. The application integrates with a 3D animation API, allowing users to upload media files and select animation templates to generate 3D animations.

## Features

- Upload image or video files
- Choose from predefined animation templates
- Generate 3D animated characters
- Responsive design for desktop and mobile devices

## Tech Stack

- Next.js - React framework
- Tailwind CSS - Styling
- 3D Animation API - For generating 3D animations

## Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/animai.git
cd animai
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create environment variables file

Create a `.env.local` file and add the following content:

```
NEXT_PUBLIC_API_KEY=your_api_key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

## API Configuration

To use the 3D Animation API, you need to:

1. Register for an account
2. Obtain an API key
3. Add the API key to the `.env.local` file

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