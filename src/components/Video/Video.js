import React from "react";
import { Container } from "react-bootstrap";
import Particle from "../Particle";

function Video() {
  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          IN PROGRESS
        </h1>
      </Container>
    </Container>
  );
}

export default Video;

