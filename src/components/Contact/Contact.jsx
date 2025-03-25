import React from "react";
import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.bar}>
        <h2 className={styles.contactHeader}>Contact</h2>
        <a href="mailto:tao@taoseto.com" className={styles.emailLink}>
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        tao@taoseto.com
      </div>
    </footer>
  );
};
