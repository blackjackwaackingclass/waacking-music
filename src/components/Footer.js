import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <Container fluid className="footer">
      <Row className="align-items-center" style={{ paddingTop: "1rem", paddingBottom: "1rem", position: "relative" }}>
        <Col className="text-center">
          <p style={{ color: "white", margin: 0 }}>
            Xin vui lòng không phát tán trang web ra bên ngoài lớp khi chưa có sự cho phép
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
