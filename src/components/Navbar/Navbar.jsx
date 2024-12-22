import React from 'react';
import { Link } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import styles from './Navbar.module.css';

export const MyNavbar = () => {
    
    return (
        <Navbar expand="lg" className={`fixed-top ${styles.customNavbar}`}>
          <Container>
          <Navbar.Brand href="/" className={styles.title}>tao seto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                
                <Nav.Link className={`${styles.navLink} ${styles.navLinkExperience}`} as={Link} to="/Experience">Experience</Nav.Link>
                <Nav.Link className={`${styles.navLink} ${styles.navLinkProjects}`} as={Link} to="/Projects">Projects</Nav.Link>
                {/* <Nav.Link className={styles.navLink} as={Link} to="/konac">KONAC</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
      
};


// export const Navbar = () => {
//     const [menuOpen, setMenuOpen] = useState(false);

//   return (

//     <nav className={styles.navbar}>
//         <a className={styles.title} href="/">Tao Seto</a>
//         <div className={styles.menu}>

//             <img className={styles.menuBtn} src={
//                 menuOpen 
//             ? getImageUrl('nav/closeIcon.png')
//             : getImageUrl('nav/menuIcon.png')} 
//             alt="menu-button"
//             onClick={() => setMenuOpen(!menuOpen)}
//             />

//             <ul className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
//             onClick = { () => setMenuOpen(false)}
//             >
//                 <li><a href="#about">About</a></li>
//                 <li><a href="#experience">Experience</a></li>
//                 <li><a href="#projects">Projects</a></li>
//                 <li><a href="#contact">Contact</a></li>
//             </ul>
//         </div>
//     </nav>
//   )
// }
