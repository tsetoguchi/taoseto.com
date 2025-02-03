import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Experience } from './components/Experience/Experience';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const enableDevMode = () => {
    console.warn('DEV MODE ENABLED via enableDevMode(): Disable in production.');
    let state = ['off', 'on'];
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.code === 'Space') {
        state.reverse();
        if (state[0] === 'on') {
          new Style([...document.querySelectorAll('*')], ['outline.2px solid greenyellow']);
        } else {
          new Style([...document.querySelectorAll('*')], ['outline.none']);
        }
      }
    });
  };

  // Call enableDevMode when the component is loaded
  enableDevMode();

  return (
    <Router>
      <div className={styles.App}>
        <MyNavbar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </div>
        <Contact />
      </div>
    </Router>
  );
}

export default App;
