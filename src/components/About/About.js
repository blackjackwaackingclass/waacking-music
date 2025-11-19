import React from "react";
import { Container } from "react-bootstrap";
import Particle from "../Particle";

function About() {
  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <h1 className="project-heading about-title">
         <strong> BJWC MUSIC </strong>
        </h1>
        <img 
          src="/anhMit.avif" 
          alt="BJWC Music" 
          style={{
            maxWidth: "200px",
            width: "100%",
            height: "auto",
            marginTop: "2rem"
          }}
        />
      </Container>
    </Container>
  );
}

export default About;
