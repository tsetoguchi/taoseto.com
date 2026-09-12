import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";

import styles from "./Navbar.module.css";

const PAGE_LINKS = [
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/commissions", label: "Commissions" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/tsetoguchi", icon: faGithub, label: "GitHub profile" },
  { href: "https://www.linkedin.com/in/taoseto/", icon: faLinkedin, label: "LinkedIn profile" },
  { href: "https://spotify.taoseto.com", icon: faSpotify, label: "Spotify profile" },
];

export const MyNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // The menu overlays the page on small viewports, so Escape has to dismiss it.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.title} onClick={closeMenu}>
        tao seto
      </Link>

      <button
        type="button"
        className={styles.toggler}
        aria-label="Toggle navigation"
        aria-controls="primary-nav"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className={styles.togglerIcon} aria-hidden="true" />
      </button>

      <div
        id="primary-nav"
        className={`${styles.collapse}${isMenuOpen ? ` ${styles.isOpen}` : ""}`}
      >
        <div className={styles.collapseInner}>
          <nav className={styles.menuItems} aria-label="Main">
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={styles.navLink}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
                aria-label={link.label}
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={link.icon} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
