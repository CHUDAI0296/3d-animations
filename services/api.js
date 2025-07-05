/**
 * API Service - Handle interactions with 3D Animation API
 * Note: Need to replace with actual API endpoints and parameters
 */

// Get template list
export async function getTemplates() {
  try {
    // In a real project, this should call the API to get templates
    // const response = await fetch('https://api.example.com/templates', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    //   }
    // });
    // return await response.json();

    // Mock response - using richer template data
    return [
      { 
        id: 1, 
        name: "Action Character", 
        description: "Perfect for action and combat scenes with fluid motion transitions and battle poses", 
        thumbnailUrl: "/templates/action.jpg",
        category: "Action",
        features: ["Combat moves", "Running poses", "Jump effects"]
      },
      { 
        id: 2, 
        name: "Dance Character", 
        description: "Ideal for dance and music videos with beautiful dance movements and rhythmic feel", 
        thumbnailUrl: "/templates/dance.jpg",
        category: "Dance",
        features: ["Smooth steps", "Rhythm sync", "Elegant poses"]
      },
      { 
        id: 3, 
        name: "Cartoon Character", 
        description: "Suitable for cartoon and animation styles with exaggerated expressions and lively actions", 
        thumbnailUrl: "/templates/cartoon.jpg",
        category: "Cartoon",
        features: ["Exaggerated expressions", "Cartoon moves", "Cute style"]
      },
      { 
        id: 4, 
        name: "Business Character", 
        description: "Perfect for business and professional scenes, showcasing professional image and confident posture", 
        thumbnailUrl: "/templates/business.jpg",
        category: "Business",
        features: ["Professional posture", "Business gestures", "Formal presentation"]
      },
    ];
  } catch (error) {
    console.error("Failed to load templates:", error);
    throw error;
  }
}

// Generate animation
export async function generateAnimation(file, templateId) {
  try {
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateId', templateId);

    // Call internal API route that will handle communication with the animation service
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to generate animation:", error);
    throw error;
  }
}

// Check generation status
export async function checkGenerationStatus(jobId) {
  try {
    // In a real project, this should call the API to check generation status
    // const response = await fetch(`https://api.example.com/status/${jobId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    //   }
    // });
    // return await response.json();

    // Mock response
    return {
      status: "processing", // Possible values: "processing", "completed", "failed"
      progress: 65,
      message: "Generating animation..."
    };
  } catch (error) {
    console.error("Failed to check generation status:", error);
    throw error;
  }
} 