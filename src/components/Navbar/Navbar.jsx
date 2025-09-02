import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

import styles from "./Navbar.module.css";

export const MyNavbar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      className={`fixed-top ${styles.customNavbar}`}
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Navbar.Brand as={Link} to="/" className={styles.title} onClick={handleNavClick}>
        tao seto
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        className="custom-toggler"
      />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <div className={styles.menuItems}>
          <Nav className="ms-auto">
            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkCommissions}`}
              as={Link}
              to="/Commissions"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faHeadphones} className={styles.headphonesIcon} />
              Commissions
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkExperience}`}
              as={Link}
              to="/Experience"
              onClick={handleNavClick}
            >
              Experience
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkProjects}`}
              as={Link}
              to="/Projects"
              onClick={handleNavClick}
            >
              Projects
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkGitHub}`}
              as={Link}
              to="https://github.com/tsetoguchi"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faGithub} />
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkLinkedin}`}
              as={Link}
              to="https://www.linkedin.com/in/taoseto/"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkSpotify}`}
              as={Link}
              to="https://spotify.taoseto.com"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faSpotify} />
            </Nav.Link>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
