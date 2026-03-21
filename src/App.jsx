import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Commissions } from './components/Commissions/Commissions';
import { Experience } from './components/Experience/Experience';
import { ExperienceV2 } from './components/ExperienceV2/ExperienceV2';
import { Projects } from './components/Projects/Projects';
import { ProjectsV2 } from './components/ProjectsV2/ProjectsV2';
import { Contact } from './components/Contact/Contact';
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

const FADE_DISTANCE = 50;

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const footer = document.getElementById("contact");
    const content = document.getElementById("content");

    if (footer && content) {
      // Ensure footer starts un-faded on route change
      footer.classList.remove("is-faded");

      const handleScroll = () => {
        const footerRect = footer.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        // Check if footer is covering the bottom portion of content (within FADE_DISTANCE of content bottom)
        const contentBottomThreshold = contentRect.bottom - FADE_DISTANCE;
        const isOverlapping = footerRect.top < contentBottomThreshold;

        if (isOverlapping) {
          footer.classList.add("is-faded");

        } else {
          footer.classList.remove("is-faded");

        }
      };

      // Check initial state when page loads
      handleScroll();

      // Add scroll listener
      window.addEventListener("scroll", handleScroll);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", handleScroll);
        // Reset fade state on unmount/navigation
        footer.classList.remove("is-faded");
      };
    }
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <div className={`${styles.App}${isHome ? ` ${styles.homeLayout}` : ''}`}>
      <MyNavbar />
      <div key={location.pathname} className={styles.contentWrapper}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/Commissions" element={<Navigate to="/commissions" replace />} />
          <Route path="/experience" element={<ExperienceV2 />} />
          <Route path="/experience/v1" element={<Experience />} />
          <Route path="/Experience" element={<Navigate to="/experience" replace />} />
          <Route path="/projects" element={<ProjectsV2 />} />
          <Route path="/projects/v1" element={<Projects />} />
          <Route path="/Projects" element={<Navigate to="/projects" replace />} />
        </Routes>
      </div>
      {location.pathname === '/' && <Contact className={styles.contact} />}
    </div>
  );
}

export default App;