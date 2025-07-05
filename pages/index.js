import { useState, useCallback } from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from "next-auth/react"

const templates = [
  {
    id: 1,
    name: 'Action',
    character: 'Action Character',
    description: 'Perfect for action and combat scenes with fluid motion transitions and battle poses.',
    tags: ['Combat moves', 'Running poses', 'Jump effects'],
    thumbnail: '/templates/action.png',
  },
  {
    id: 2,
    name: 'Dance',
    character: 'Dance Character',
    description: 'Ideal for dance and music videos with beautiful dance movements and rhythmic feel.',
    tags: ['Smooth steps', 'Rhytm sync', 'Elegant poses'],
    thumbnail: '/templates/dance.png',
  },
  {
    id: 3,
    name: 'Cartoon',
    character: 'Cartoon Character',
    description: 'Suitable for cartoon and animation styles with exaggerated expressions and movements.',
    tags: ['Exaggerated', 'Funny', 'Cartoonish'],
    thumbnail: '/templates/cartoon.png',
  },
  {
    id: 4,
    name: 'Business',
    character: 'Business Character',
    description: 'Perfect for business and professional scenes, showcasing professional image.',
    tags: ['Professional', 'Confident', 'Demo'],
    thumbnail: '/templates/business.png',
  },
];

export default function Home() {
  const { data: session } = useSession()
  const [file, setFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnimation, setGeneratedAnimation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerate = async () => {
    if (!file || !selectedTemplate) {
      alert("Please upload a file and select a template first.");
      return;
    };

    setIsGenerating(true);
    setGeneratedAnimation(null);
    try {
      // Mocking generation process
      console.log("Generating animation with:", {
        fileName: file.name,
        template: selectedTemplate.name,
      });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate network request
      setGeneratedAnimation("/animations/result.mp4"); // Mock result
    } catch (error) {
      console.error("Error generating animation:", error);
      alert("Failed to generate animation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col">
      <Head>
        <title>Free 3D Animation Generator | Create Animations from Video</title>
        <meta name="description" content="Instantly turn your videos and images into high-quality 3D animations with our AI-powered generator. Free to use, no sign-up required." />
        <meta name="keywords" content="3D animation generator, video to 3D animation, AI animation, 3D cartoon characters, 3D animation software, 3D character creator, 3D avatar maker, AI motion capture, 3D animation online, 3D animation converter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "3D Animation Generator",
              "description": "Transform videos and images into stunning 3D animations with AI technology",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Head>

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow">
        <div className="text-xl font-bold text-indigo-600">3D Ani Gen</div>
        
        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <div className={`absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:space-x-4 p-4 md:p-0 z-20`}>
          <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block md:inline-block py-2 text-gray-600 hover:text-indigo-600">FAQ</a>
          <a href="#templates" onClick={() => setIsMenuOpen(false)} className="block md:inline-block py-2 text-gray-600 hover:text-indigo-600">Templates</a>
          {session ? (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-t md:border-none pt-4 md:pt-0 mt-4 md:mt-0">
              <p className="text-sm text-gray-500">{session.user.email}</p>
              <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t md:border-none pt-4 md:pt-0 mt-4 md:mt-0">
              <button onClick={() => { signIn(); setIsMenuOpen(false); }} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Free 3D Animation Generator</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Instantly turn your videos and images into high-quality 3D animations. 
          Free to use, no sign-up required.
        </p>
        <a href="#upload" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Start Creating Now
        </a>
      </section>

      {/* Main Content - Upload & Generate */}
      <main id="upload" className="container mx-auto px-4 py-12 flex-grow">
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-8 max-w-7xl mx-auto">
          
          {/* Step 1: Upload */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">1. Upload Your Video or Image</h2>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="mb-4">
                  {file.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="max-h-60 mx-auto rounded-lg" />
                  ) : (
                    <video src={previewUrl} controls className="max-h-60 mx-auto rounded-lg" />
                  )}
                </div>
              ) : (
                <div className="text-gray-500 mb-4 py-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2">Drag and drop your file here</p>
                  <p className="text-sm">Supports images and videos</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
              >
                {file ? "Change File" : "Click to select a file"}
              </label>
            </div>
          </div>
          
          {/* Step 2: Choose Template */}
          <div id="templates" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">2. Choose Animation Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className={`template-card p-6 rounded-lg cursor-pointer transition-all transform hover:-translate-y-1 ${
                    selectedTemplate?.id === template.id ? 'selected' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h3 className="text-xl font-bold">{template.name}</h3>
                  <p className="text-sm opacity-80 mb-3">{template.character}</p>
                  <p className="opacity-90 mb-4 text-sm font-light">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Generate */}
          <div className="text-center">
             <button
              onClick={handleGenerate}
              disabled={!file || !selectedTemplate || isGenerating}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate 3D Animation'}
            </button>
          </div>

          {/* Result */}
          {isGenerating && (
            <div className="mt-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Our AI is working its magic... this may take a moment.</p>
            </div>
          )}

          {generatedAnimation && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6">Your Animation is Ready!</h2>
              <div className="flex justify-center">
                  <video src={generatedAnimation} controls autoPlay loop className="max-w-lg w-full rounded-lg shadow-2xl" />
              </div>
              <div className="text-center mt-6">
                <a 
                  href={generatedAnimation} 
                  download="my-3d-animation.mp4"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Download Animation
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What is a 3D animation generator?</h3>
              <p className="text-gray-700">A 3D animation generator is a tool that uses AI to automatically convert 2D media like videos or images into 3D animated sequences. It simplifies the complex process of 3D modeling, rigging, and animation into a few simple steps.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What kind of files can I upload?</h3>
              <p className="text-gray-700">Our platform supports most common image formats (JPEG, PNG) and video formats (MP4, MOV, AVI). We recommend using clear, high-resolution media for the best results.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How long does the animation process take?</h3>
              <p className="text-gray-700">The generation time depends on the length and complexity of your input file. Typically, it takes just a few minutes for our AI to create your 3D animation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
              <p>&copy; 2024 3D Animation Generator. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
                  <a href="#" className="hover:text-indigo-400">Terms of Service</a>
              </div>
          </div>
      </footer>
    </div>
  );
} 