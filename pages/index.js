import { useState, useEffect } from "react";
import { getTemplates, generateAnimation } from "../services/api";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);

  // Load templates
  useEffect(() => {
    async function loadTemplates() {
      try {
        const templatesData = await getTemplates();
        setTemplates(templatesData);
      } catch (err) {
        setError("Unable to load templates. Please refresh the page and try again.");
        console.error("Failed to load templates:", err);
      }
    }

    loadTemplates();
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // Generate animation
  const handleGenerate = async () => {
    if (!file || !selectedTemplate) {
      alert("Please upload a video/image and select a template!");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call API service to generate animation
      const result = await generateAnimation(file, selectedTemplate.id);
      alert(`Animation request sent! Job ID: ${result.jobId}`);
      
      // Simulate a generated video after 3 seconds
      setTimeout(() => {
        setGeneratedVideo({
          url: "https://example.com/demo-animation.mp4",
          thumbnail: "/templates/generated-demo.jpg",
          // In a real implementation, this would be the actual video URL from the API response
        });
        setIsLoading(false);
      }, 3000);
    } catch (err) {
      setError("An error occurred during generation. Please try again later.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-purple-600">AnimAI</div>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
          Sign In / Register
        </button>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Create Stunning 3D Animations with AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload your image or video and let AI bring your ideas to life in 3D.
        </p>

        {/* Error alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md">
            <p>{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">1. Upload Your Video or Image</h2>
            
            <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <input
                type="file"
                id="file-upload"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
                {!previewUrl ? (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-sm text-gray-500 mb-1">Click or drag files here</p>
                    <p className="text-xs text-gray-400">Supports image and video files</p>
                  </>
                ) : (
                  <div className="relative w-full">
                    {file.type.startsWith("image") ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-contain rounded"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-48 object-contain rounded"
                      />
                    )}
                    <div className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {file && (
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">2. Choose Animation Template</h2>
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div 
                    key={template.id} 
                    className={`border rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
                      selectedTemplate?.id === template.id 
                        ? "border-purple-500 ring-2 ring-purple-300" 
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="bg-gray-100 h-36 flex items-center justify-center">
                      {/* Template preview */}
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <div className="text-center">
                          <span className="inline-block px-3 py-1 bg-white bg-opacity-80 rounded-full text-purple-600 font-medium mb-2">{template.category}</span>
                          <h3 className="text-gray-700 font-medium">{template.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      
                      {/* Feature tags */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.features && template.features.map((feature, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-purple-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">Loading templates...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-10">
          <button
            onClick={handleGenerate}
            className={`px-8 py-4 text-lg font-medium rounded-lg shadow-lg transition transform ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700 hover:-translate-y-1 hover:shadow-xl"
            } text-white`}
            disabled={isLoading || !file || !selectedTemplate}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate 3D Animation"
            )}
          </button>
        </div>

        {/* Generated Animation Display */}
        {generatedVideo && (
          <div className="mt-16 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">3. Your Generated 3D Animation</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-4">
                <div className="flex items-center justify-center h-full">
                  {/* This would be replaced with the actual video in production */}
                  <div className="bg-gradient-to-r from-purple-400 to-blue-500 w-full h-64 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-lg font-medium">Your 3D Animation</p>
                      <p className="text-sm opacity-75">Generated with {selectedTemplate?.name} template</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Animation_{Date.now()}.mp4</h3>
                  <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API status note */}
        <div className="mt-8 text-center max-w-2xl">
          <p className="text-sm text-gray-500">
            Note: Currently using demo templates. To access the full API and template library,
            please contact us to obtain API keys and developer resources.
          </p>
        </div>
      </header>

      {/* Footer */}
      <footer className="text-center py-6 bg-white shadow-inner">
        <p className="text-gray-600">© {new Date().getFullYear()} AnimAI. All rights reserved.</p>
      </footer>
    </div>
  );
} 