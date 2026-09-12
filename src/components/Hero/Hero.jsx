import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import heroImage from "../../../assets/hero/heroImage.png";

export const Hero = () => {
  return (
    <section className={styles.section}>
      <Helmet>
        <title>tao seto</title>
        <meta
          name="description"
          content="Tao Seto is a Tokyo-based audio engineer and CS graduate. Mixing, mastering, and music technology. 12+ years in music production, 7+ years in tech."
        />
        <meta property="og:title" content="tao seto" />
        <meta property="og:url" content="https://taoseto.com" />
      </Helmet>
      <div className={styles.container}>
        {/* Sized to its contents so the staggered block centres as one unit
            rather than each row centring independently. */}
        <div className={styles.assembly}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>Tokyo · Music & Technology</p>
            <h1 className={styles.name}>tao seto</h1>
            <p className={styles.description}>
              Computer Science and Music Technology graduate with 12+ years in
              music production and 7+ years in tech. Love creating meaningful
              products.
            </p>

            <div className={styles.ctas}>
              <Link to="/commissions" className={styles.ctaPrimary}>
                Commissions
              </Link>
              <Link to="/experience" className={styles.ctaSecondary}>
                Experience
              </Link>
            </div>
          </div>

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
    </section>
  );
};

export default Hero;
