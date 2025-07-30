import React, { useState, useRef } from 'react';
import { Camera, Video, Settings, Download, Heart, History, Zap, Key, Copy, Eye, EyeOff, Play } from 'lucide-react';

interface Generation {
  id: string;
  prompt: string;
  type: 'image' | 'video';
  url: string;
  timestamp: Date;
  liked: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 修改handleGenerate函数，集成真实API调用
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      console.log('Sending request to API...');
      
      const response = await fetch('/api/replicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: activeTab
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if (!data.output) {
        throw new Error('No output received from API');
      }
      
      const newGeneration: Generation = {
        id: Date.now().toString(),
        prompt: data.prompt,
        type: data.type,
        url: data.output,
        timestamp: new Date(),
        liked: false
      };
      
      setGenerations(prev => [newGeneration, ...prev]);
      setCurrentGeneration(newGeneration);
      setPrompt(''); // 清空输入框
      
      console.log('Generation completed successfully:', newGeneration);
    } catch (error: any) {
      console.error('Generation error:', error);
      alert(`生成失败: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLike = (id: string) => {
    setGenerations((prev: Generation[]) => prev.map((gen: Generation) => 
      gen.id === id ? { ...gen, liked: !gen.liked } : gen
    ));
  };

  const suggestedPrompts = [
    "Cyberpunk warrior in neon-lit alley",
    "Retro synthwave sunset over city",
    "Holographic dragon in digital space",
    "80s arcade machine glowing in darkness",
    "Neon car racing through grid tunnel"
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Neon Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
            animation: 'scanlines 0.1s linear infinite'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg blur-md opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Text Animation Generator
              </h1>
              <p className="text-cyan-400 text-sm font-mono">Create Stunning Animated Text with Artificial Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Selector */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg transition-all duration-300 font-mono text-sm uppercase tracking-wider ${
                    activeTab === 'image'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-500/25'
                      : 'text-cyan-400 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg transition-all duration-300 font-mono text-sm uppercase tracking-wider ${
                    activeTab === 'video'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-500/25'
                      : 'text-cyan-400 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-400 font-mono text-sm uppercase tracking-wider mb-4">
                    &gt; DESCRIBE YOUR VISION
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={`Enter your ${activeTab} description...`}
                      className="w-full h-32 bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-pink-500/50 focus:shadow-lg focus:shadow-pink-500/25 resize-none font-mono transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Suggested Prompts */}
                <div>
                  <p className="text-cyan-400/70 text-sm font-mono mb-3">&gt; QUICK_PROMPTS:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        className="text-xs bg-black/50 hover:bg-pink-500/20 text-cyan-400 hover:text-pink-400 px-3 py-2 rounded border border-cyan-500/30 hover:border-pink-500/50 transition-all duration-300 font-mono hover:shadow-lg hover:shadow-pink-500/25"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-3 uppercase tracking-wider text-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>GENERATING...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>GENERATE {activeTab}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Current Generation */}
            {currentGeneration && (
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-wider">&gt; LATEST_OUTPUT</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleLike(currentGeneration.id)}
                      className={`p-2 rounded-lg transition-all duration-300 border ${
                        currentGeneration.liked
                          ? 'text-pink-400 bg-pink-500/20 border-pink-500/50 shadow-lg shadow-pink-500/25'
                          : 'text-cyan-400 hover:text-pink-400 hover:bg-pink-500/10 border-cyan-500/30 hover:border-pink-500/50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${currentGeneration.liked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => window.open(currentGeneration.url, '_blank')}
                      className="p-2 text-cyan-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-pink-500/50"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  {currentGeneration.type === 'video' ? (
                    <video
                      src={currentGeneration.url}
                      controls
                      className="w-full h-64 object-cover rounded-lg border border-cyan-500/30"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2300ffff' font-family='monospace' font-size='16'%3ELoading Video...%3C/text%3E%3C/svg%3E"
                    />
                  ) : (
                    <img
                      src={currentGeneration.url}
                      alt={currentGeneration.prompt}
                      className="w-full h-64 object-cover rounded-lg border border-cyan-500/30"
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-cyan-100 text-sm font-mono">
                    {currentGeneration.prompt}
                  </p>
                  <p className="text-cyan-500/70 text-xs font-mono mt-1">
                    {currentGeneration.timestamp.toLocaleDateString()} - {currentGeneration.type.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generation History */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-wider">&gt; HISTORY</h3>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {generations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-cyan-500/50 text-sm font-mono">
                      NO_DATA_FOUND
                    </p>
                    <p className="text-cyan-500/30 text-xs font-mono mt-1">
                      Start creating...
                    </p>
                  </div>
                ) : (
                  generations.map((generation) => (
                    <div
                      key={generation.id}
                      onClick={() => setCurrentGeneration(generation)}
                      className="flex items-center space-x-3 p-3 bg-black/50 hover:bg-pink-500/10 rounded-lg cursor-pointer transition-all duration-300 group border border-transparent hover:border-pink-500/30"
                    >
                      <div className="w-12 h-12 bg-black/50 rounded-lg overflow-hidden flex-shrink-0 border border-cyan-500/20">
                        <img
                          src={generation.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cyan-100 text-sm truncate font-mono">
                          {generation.prompt}
                        </p>
                        <p className="text-cyan-500/70 text-xs font-mono">
                          {generation.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      {generation.liked && (
                        <Heart className="w-4 h-4 text-pink-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-wider mb-4">&gt; STATS</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500/70 text-sm font-mono">IMAGES:</span>
                  <span className="text-pink-400 font-mono font-bold">{generations.filter(g => g.type === 'image').length.toString().padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500/70 text-sm font-mono">VIDEOS:</span>
                  <span className="text-pink-400 font-mono font-bold">{generations.filter(g => g.type === 'video').length.toString().padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500/70 text-sm font-mono">LIKED:</span>
                  <span className="text-pink-400 font-mono font-bold">{generations.filter(g => g.liked).length.toString().padStart(3, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 20, 147, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;