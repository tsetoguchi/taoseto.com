
import styles from './App.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyNavbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { About } from './components/About/About'
import { Experience } from './components/Experience/Experience'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <Router>
    <div className={styles.App}>
      <MyNavbar />
      <Routes>
      <Route path="/" element={<Hero />} />
      {/* <About />
      <Experience /> */}
      </Routes>
    </div>
    </Router>
  )
}

export default App
