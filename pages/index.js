import { useState, useCallback } from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from "next-auth/react"
import { motion } from 'framer-motion';

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
    tags: ['Smooth steps', 'Rhythm sync', 'Elegant poses'],
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

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

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
    
    if (!session) {
      alert("Please sign in to generate an animation.");
      signIn(); // Redirect to sign-in page
      return;
    }

    setIsGenerating(true);
    setGeneratedAnimation(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateId', selectedTemplate.id);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const result = await response.json();
      setGeneratedAnimation(result.animationUrl);
    } catch (error) {
      console.error("Error generating animation:", error);
      alert(`Failed to generate animation: ${error.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col font-sans">
      <Head>
        <title>AnimAI - Create Stunning 3D Animations with AI</title>
        <meta name="description" content="Upload your image or video and let AI bring your ideas to life in 3D" />
        <meta name="keywords" content="3D animation generator, video to 3D animation, AI animation, 3D cartoon characters, 3D animation software, 3D character creator, 3D avatar maker, AI motion capture, 3D animation online, 3D animation converter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full">
        <nav className="relative flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="text-2xl font-bold text-gray-800">AnimAI</div>
          
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
          <div className={`absolute md:static top-full left-0 w-full md:w-auto bg-white/80 md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0 z-20`}>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block md:inline-block py-2 text-gray-600 hover:text-indigo-600 font-semibold">Features</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block md:inline-block py-2 text-gray-600 hover:text-indigo-600 font-semibold">How It Works</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block md:inline-block py-2 text-gray-600 hover:text-indigo-600 font-semibold">FAQ</a>
            <div className="md:pl-4">
              {session ? (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-t md:border-none pt-4 md:pt-0 mt-4 md:mt-0">
                  <p className="text-sm text-gray-700">Welcome, {session.user.email}</p>
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full md:w-auto text-sm text-gray-600 hover:text-indigo-600 font-semibold">
                    Sign Out
                  </button>
                </div>
              ) : (
                 <button onClick={() => { signIn(); setIsMenuOpen(false); }} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-all shadow-md hover:shadow-lg w-full md:w-auto">
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        className="flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center"
      >
        <motion.h1 variants={sectionVariants} className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Create Stunning 3D Animations with AI</motion.h1>
        <motion.p variants={sectionVariants} className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl">
          Upload your image or video and let AI bring your ideas to life in 3D
        </motion.p>
      </motion.section>

      {/* Main Content - Two Column Layout */}
      <main id="upload" className="container mx-auto px-4 pb-12 flex-grow">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
        >
          
          {/* Left Column: Upload */}
          <motion.div variants={sectionVariants} className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">1. Upload Your Video or Image</h2>
             <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400'}`}
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
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="mt-2 font-semibold">Click or drag files here</p>
                  <p className="text-sm">Supports image and video files</p>
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
                {file ? "Change File" : "Select File"}
              </label>
            </div>
          </motion.div>

          {/* Right Column: Templates */}
          <motion.div variants={sectionVariants} className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">2. Choose Animation Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className={`template-card-v2 bg-slate-50 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedTemplate?.id === template.id 
                      ? 'border-indigo-500 shadow-lg scale-105' 
                      : 'border-transparent hover:shadow-md hover:border-indigo-200'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="p-4 text-center">
                    <div className="flex justify-center mb-3">
                      <span className="pill-v2">{template.name}</span>
                    </div>
                    <p className="font-semibold text-gray-800">{template.character}</p>
                  </div>
                  <div className="bg-white p-4 rounded-b-xl border-t">
                    <p className="text-gray-600 mb-3 text-sm">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map(tag => (
                        <span key={tag} className="tag-v2">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Generate Button & Result */}
        <div className="mt-12">
            <div className="text-center">
             <button
              onClick={handleGenerate}
              disabled={!file || !selectedTemplate || isGenerating}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? 'Generating...' : 'Generate 3D Animation'}
            </button>
          </div>

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

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful 3D Animation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">AI-Powered Conversion</h3>
              <p>Convert videos and images to 3D animations with advanced AI technology</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">Multiple Animation Styles</h3>
              <p>Choose from various 3D animation templates and styles for your characters</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">Easy Export & Sharing</h3>
              <p>Download your 3D animations or share them directly on social media</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        id="how-it-works" 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Create 3D Animations</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Media</h3>
              <p>Upload your video or image that you want to convert to a 3D animation</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
              <p>Select from our library of 3D animation templates and styles</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">3</div>
              <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
              <p>Our AI generates your 3D animation, ready to download or share</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        id="faq" 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
      </motion.section>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
              <p>&copy; 2024 AnimAI. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
} 