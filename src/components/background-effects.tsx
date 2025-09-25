import React from 'react';

export const BackgroundEffects: React.FC = () => {
  // Add lazy loading for the 3D background
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  
  React.useEffect(() => {
    // Delay loading the iframe to improve initial page load performance
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Background 3D Spline - with lazy loading */}
      <div className="spline-container fixed top-0 w-full h-screen -z-10">
        {iframeLoaded ? (
          <iframe 
            src="https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV" 
            width="100%" 
            height="100%" 
            id="aura-spline"
            title="3D Background Animation"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full bg-background flex items-center justify-center">
            <div className="inline-flex h-10 w-10 rounded-full border-2 border-white/20 border-t-violet-400 animate-spin"></div>
          </div>
        )}
      </div>

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl opacity-35 bg-[radial-gradient(closest-side,rgba(138,92,246,0.5),rgba(10,10,18,0))]"></div>
        <div className="absolute -bottom-20 -right-20 w-[800px] h-[800px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,rgba(99,102,241,0.4),rgba(10,10,18,0))]"></div>
      </div>
    </>
  );
};