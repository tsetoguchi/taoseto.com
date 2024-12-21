import React from 'react';
import { Link } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import styles from './Navbar.module.css';

export const MyNavbar = () => {
    
    return (
        <Navbar expand="lg" className={`${styles.customNavbar} bg-dark`}>
          <Container>
          <Navbar.Brand href="/" className={styles.title}>Tao Seto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link className={styles.navLink} as={Link} to="#about">About</Nav.Link>
                <Nav.Link className={styles.navLink} as={Link} to="#experience">Experience</Nav.Link>
                <Nav.Link className={styles.navLink} as={Link} to="#projects">Projects</Nav.Link>
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
