import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";

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
        aria-expanded={expanded}
        className="custom-toggler"
      />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <div className={styles.menuItems}>
          <Nav className="ms-auto">
            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkCommissions}`}
              as={Link}
              to="/commissions"
              onClick={handleNavClick}
            >
              Commissions
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkExperience}`}
              as={Link}
              to="/experience"
              onClick={handleNavClick}
            >
              Experience
            </Nav.Link>

            <Nav.Link
              className={`${styles.navLink} ${styles.navLinkProjects}`}
              as={Link}
              to="/projects"
              onClick={handleNavClick}
            >
              Projects
            </Nav.Link>

            <a
              className={`nav-link ${styles.navLink} ${styles.navLinkGitHub}`}
              href="https://github.com/tsetoguchi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>

            <a
              className={`nav-link ${styles.navLink} ${styles.navLinkLinkedin}`}
              href="https://www.linkedin.com/in/taoseto/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a
              className={`nav-link ${styles.navLink} ${styles.navLinkSpotify}`}
              href="https://spotify.taoseto.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Spotify profile"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faSpotify} />
            </a>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
