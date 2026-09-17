import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";

import styles from "./Navbar.module.css";

const PAGE_LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
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
            {/* NavLink rather than Link: it marks the current page with
                aria-current, which is what carries the highlight to anyone
                not seeing the colour change. */}
            {PAGE_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ""}`
                }
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
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
