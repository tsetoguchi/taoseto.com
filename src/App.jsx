import styles from './App.module.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Commissions } from './components/Commissions/Commissions';
import { Experience } from './components/Experience/Experience';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      };
    }
  }, [location.pathname]);

  return (
    <div className={styles.App}>
      <MyNavbar />
      <div className={styles.contentWrapper}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
      <Contact className={styles.contact} />
    </div>
  );
}

export default App;