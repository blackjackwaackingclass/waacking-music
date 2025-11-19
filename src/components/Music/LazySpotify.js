import React, { useState, useRef, useEffect } from "react";

function LazySpotify({ trackId, title, groupName, index }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const spotifyRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!spotifyRef.current) return;

    // Find the parent scrolling container (spotify-track-list)
    const findScrollContainer = (element) => {
      let parent = element?.parentElement;
      while (parent) {
        if (parent.classList?.contains('spotify-track-list')) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const scrollContainer = findScrollContainer(spotifyRef.current);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Track is visible or close to viewport - load it
            const intersectionRatio = entry.intersectionRatio;
            
            if (!isLoaded) {
              // Priority loading based on visibility:
              // - Tracks with >10% visibility load immediately (high priority)
              // - Tracks with small intersection get a delay (prevents loading many at once)
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
            // Track scrolled out of view - unload it to free resources
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
        rootMargin: "50px", // Only preload tracks very close to viewport (50px buffer)
        threshold: [0, 0.1, 0.5, 1.0], // Multiple thresholds to better track visibility
      }
    );

    observerRef.current.observe(spotifyRef.current);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (observerRef.current && spotifyRef.current) {
        observerRef.current.unobserve(spotifyRef.current);
      }
    };
  }, [isLoaded]);

  return (
    <div
      ref={spotifyRef}
      key={`${groupName}-${index}`}
      className="spotify-embed-container"
      style={{
        flexShrink: 0,
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
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          title={title}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            border: "none",
          }}
        />
      )}
    </div>
  );
}

export default LazySpotify;

