import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import heroImage from "../../../assets/hero/heroImage.png";

const PAGE_TITLE = "tao seto";
const PAGE_URL = "https://taoseto.com/";
const PAGE_DESCRIPTION =
  "Tao Seto is a Tokyo-based audio engineer and developer. Mixing, mastering, and music software from a CS and music technology graduate.";

export const Hero = () => {
  return (
    <section className={styles.section}>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.assembly}>
          <div className={styles.content}>
            {/* One word per line on desktop for a taller headline; the space
                between the spans keeps the accessible name {PAGE_TITLE} rather
                than "taoseto", and is the gap when mobile joins them. */}
            <h1 className={styles.name}>
              <span className={styles.nameLine}>tao</span>{" "}
              <span className={styles.nameLine}>seto</span>
            </h1>
            <p className={styles.description}>
              Computer Science and Music Technology graduate with 12+ years in
              music production and 7+ years in tech. Bridging the gap between
              artistry and programming.
            </p>

            <div className={styles.ctas}>
              <Link to="/projects" className={styles.ctaPrimary}>
                Projects
              </Link>
              <Link to="/experience" className={styles.ctaSecondary}>
                Experience
              </Link>
            </div>
          </div>

          <div className={styles.visual}>
            <a
              href="https://kon.ac"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkWrapper}
            >
              {/* No visible label, so the alt text carries the link's name. */}
              <img
                src={heroImage}
                alt="Konac — my music project"
                className={styles.heroImg}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
