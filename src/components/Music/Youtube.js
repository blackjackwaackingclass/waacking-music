import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchSheetsData } from "../../utils/sheetsData";
import LazyVideo from "./LazyVideo";

function Youtube() {
  const [musicData, setMusicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Sheets spreadsheet ID
  const SPREADSHEET_ID = "1CBx9nt3Rqae_3ndVB8KCTodb9KDJeIg8JMg__r-QeU4";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchSheetsData(SPREADSHEET_ID);
        setMusicData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load music data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Remove duplicates from an array
  const removeDuplicates = (array) => {
    return array.filter((value, index, self) => 
      self.indexOf(value) === index
    );
  };

  // Sort groups alphabetically by key
  const getSortedGroups = () => {
    if (!musicData) return [];
    return Object.entries(musicData)
      .map(([key, values]) => [key, removeDuplicates(values)]) // Remove duplicates from each group
      .sort(([keyA], [keyB]) => 
        keyA.localeCompare(keyB)
      );
  };

  if (loading) {
    return (
      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <p style={{ color: "#ffffff", fontSize: "1.2em" }}>Loading music data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <p style={{ color: "#ff6b6b", fontSize: "1.2em" }}>Error loading data: {error}</p>
      </div>
    );
  }

  const sortedGroups = getSortedGroups();

  return (
    <Container style={{ marginTop: "4rem", paddingBottom: "2rem" }}>   
      {sortedGroups.map(([groupName, videoUrls]) => (
        <div key={groupName} style={{ marginBottom: "4rem" }}>
          <h1 
            className="project-heading"
            style={{ 
              fontSize: "2em", 
              marginBottom: "2rem",
              textAlign: "left",
              paddingLeft: "1rem"
            }}
          >
            {groupName}
          </h1>
          
          <div 
            style={{ 
              display: "flex",
              overflowX: "auto",
              gap: "1.5rem",
              padding: "1rem",
              scrollbarWidth: "thin",
              scrollbarColor: "var(--accent-color) transparent"
            }}
            className="youtube-video-list"
          >
            {videoUrls.map((url, index) => {
              const videoId = getYouTubeVideoId(url);
              if (!videoId) return null;
              
              return (
                <LazyVideo
                  key={`${groupName}-${index}`}
                  videoId={videoId}
                  title={`${groupName} - Video ${index + 1}`}
                  groupName={groupName}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      ))}
    </Container>
  );
}

export default Youtube;

