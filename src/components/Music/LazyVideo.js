import React, { useState, useRef, useEffect } from "react";

function LazyVideo({ videoId, title, groupName, index }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Find the parent scrolling container (youtube-video-list)
    const findScrollContainer = (element) => {
      let parent = element?.parentElement;
      while (parent) {
        if (parent.classList?.contains('youtube-video-list')) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const scrollContainer = findScrollContainer(videoRef.current);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is visible or close to viewport - load it
            const intersectionRatio = entry.intersectionRatio;
            
            if (!isLoaded) {
              // Priority loading based on visibility:
              // - Videos with >10% visibility load immediately (high priority)
              // - Videos with small intersection get a delay (prevents loading many at once)
              const delay = intersectionRatio > 0.1 ? 0 : 150;
              
              // Clear any pending timeout
              if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
              }
              
              isLoadingRef.current = true;
              loadTimeoutRef.current = setTimeout(() => {
                setIsLoaded(true);
                isLoadingRef.current = false;
              }, delay);
            }
          } else {
            // Video scrolled out of view - unload it to free resources
            if (isLoaded) {
              setIsLoaded(false);
            }
            
            // Cancel any pending load
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
              loadTimeoutRef.current = null;
              isLoadingRef.current = false;
            }
          }
        });
      },
      {
        root: scrollContainer, // Use the scrolling container as root for horizontal scrolling
        rootMargin: "50px", // Only preload videos very close to viewport (50px buffer)
        threshold: [0, 0.1, 0.5, 1.0], // Multiple thresholds to better track visibility
      }
    );

    observerRef.current.observe(videoRef.current);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (observerRef.current && videoRef.current) {
        observerRef.current.unobserve(videoRef.current);
      }
    };
  }, [isLoaded]);

  return (
    <div
      ref={videoRef}
      key={`${groupName}-${index}`}
      style={{
        flexShrink: 0,
        width: "320px",
        height: "180px",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(240, 94, 255, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(240, 94, 255, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(240, 94, 255, 0.3)";
      }}
    >
      {!isLoaded ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5a7ff",
            fontSize: "0.9em",
          }}
        >
          Loading...
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{
            display: "block",
          }}
        />
      )}
    </div>
  );
}

export default LazyVideo;

