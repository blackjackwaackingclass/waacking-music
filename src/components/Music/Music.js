import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Particle from "../Particle";
import Youtube from "./Youtube";
import Spotify from "./Spotify";

function Music() {
  const [activeTab, setActiveTab] = useState("youtube");

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", marginTop: -50, marginBottom: 0 }}>
          <Navbar expand="md" className="justify-content-center align-items-center" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="justify-content-center music-nav" style={{ alignItems: "center", marginTop: 0, marginBottom: 0 }}>
              <Nav.Item>
                <Nav.Link 
                  eventKey="youtube" 
                  className={activeTab === "youtube" ? "music-nav-link active" : "music-nav-link"}
                >
                  Youtube
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="spotify" 
                  className={activeTab === "spotify" ? "music-nav-link active" : "music-nav-link"}
                >
                  Spotify
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
        </div>
        <div style={{ width: "100%" }}>
          {activeTab === "youtube" && <Youtube />}
          {activeTab === "spotify" && <Spotify />}
        </div>
      </Container>
    </Container>
  );
}

export default Music;

