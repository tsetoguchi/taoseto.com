import React from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import the envelope icon

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div>
        <h2>Contact</h2>
        <FontAwesomeIcon icon={faEnvelope} /> tao@taosetoguchi.com
      </div>
    </footer>
  );
};
