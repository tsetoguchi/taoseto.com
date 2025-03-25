import styles from './App.module.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Experience } from './components/Experience/Experience';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (

    <Router>
      <div className={styles.App}>
        <MyNavbar />
          <div className={styles.contentWrapper}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
            </Routes>
            
          </div>
        <Contact className={styles.contact}/>
      </div>
    </Router>
  );
}

export default App;