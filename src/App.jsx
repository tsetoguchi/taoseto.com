
import styles from './App.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { About } from './components/About/About'
import { Experience } from './components/Experience/Experience'
import { Projects } from './components/Projects/Projects'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <Router>
      <div className={styles.App}>
        <MyNavbar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            {/* <About /> */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
