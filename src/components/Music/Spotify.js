import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchSheetsData } from "../../utils/sheetsData";
import LazySpotify from "./LazySpotify";

function Spotify() {
  const [musicData, setMusicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Sheets spreadsheet ID
  const SPREADSHEET_ID = "1DmyTnmYH9qoKr9mX64lIAjcBslCa2ah073fjjj_Rztg";

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

  // Extract Spotify track ID from API URL
  const getSpotifyTrackId = (url) => {
    if (!url) return null;
    // Match pattern: https://api.spotify.com/v1/tracks/{trackId}
    const match = url.match(/\/tracks\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
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
      {sortedGroups.map(([groupName, trackUrls]) => (
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
            className="spotify-track-list"
          >
            {trackUrls.map((url, index) => {
              const trackId = getSpotifyTrackId(url);
              if (!trackId) return null;
              
              return (
                <LazySpotify
                  key={`${groupName}-${index}`}
                  trackId={trackId}
                  title={`${groupName} - Track ${index + 1}`}
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

export default Spotify;

