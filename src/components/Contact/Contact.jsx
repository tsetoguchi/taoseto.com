import { useLocation } from "react-router-dom";
import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// Pinned to the viewport on the home screen, which does not scroll; every
// other page ends with it in flow, below its content.
export const Contact = () => {
  const isPinned = useLocation().pathname === "/";
  const className = isPinned ? styles.container : `${styles.container} ${styles.inFlow}`;

  return (
    <footer id="contact" className={className}>
      <div className={styles.bar}>
        <h2 className={styles.contactHeader}>Contact</h2>
        <a href="mailto:tao@taoseto.com" className={styles.emailLink}>
          <FontAwesomeIcon icon={faEnvelope} />
          <span>tao@taoseto.com</span>
        </a>
      </div>
    </footer>
  );
};
