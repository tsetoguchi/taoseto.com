import React from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Hero.module.css";
import heroImage from "../../../assets/hero/heroImage.png";

export const Hero = () => {
  return (
    <section className={styles.section}>
      <Helmet>
        <title>tao seto</title>
        <meta name="description" content="Tao Seto — Tokyo-based audio engineer and CS graduate. Mixing, mastering, and music technology. 12+ years in music production, 7+ years in tech." />
        <meta property="og:title" content="tao seto" />
        <meta property="og:url" content="https://taoseto.com" />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>

          <p className={styles.eyebrow}>Tokyo — Music & Technology</p>
          <h1 className={styles.name}>tao seto</h1>
          <p className={styles.description}>
            Computer Science and Music Technology graduate with 12+ years in music production
            and 7+ years in tech. English native.
          </p>


        </div>

        <a
          href="https://kon.ac"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkWrapper}
        >
          <img src={heroImage} alt="Konac" className={styles.heroImg} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
