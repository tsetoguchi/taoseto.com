import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export const NotFound = () => {
  return (
    <section className={styles.container}>
      <Helmet>
        <title>Page not found — tao seto</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.heading}>Page not found</h1>
        <p className={styles.description}>
          That page doesn&rsquo;t exist — it may have moved, or the link may be
          out of date.
        </p>

        <div className={styles.ctas}>
          <Link to="/" className={styles.ctaPrimary}>
            Home
          </Link>
          <Link to="/projects" className={styles.ctaSecondary}>
            Projects
          </Link>
          <Link to="/experience" className={styles.ctaSecondary}>
            Experience
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
