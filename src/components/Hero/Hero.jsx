import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import styles from "./Hero.module.css";

import heroImage from "../../../assets/hero/heroImage.png";

// Images for projects
import TheSlushieMachine from "../../../assets/projects/the_slushie_machine.png";
import ValStatsAnalyzer from "../../../assets/projects/valorant_stats_analyzer.png";

export const Hero = () => {
  const handleScroll = (event) => {
    event.preventDefault(); // Prevent the default anchor tag behavior (page reload)
    const targetElement = document.getElementById("section"); // Get the section element
    targetElement.scrollIntoView({ behavior: "smooth" }); // Smoothly scroll to the section
  };

  return (
    <section>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.header}>Hi, I'm Tao Seto</h1>

          <p className={styles.description}>
            I’m a Computer Science and Music Technology graduate with 12+ years
            of experience in music production and tech through personal projects
            and independent work. I would love to innovate, improve, and push 
            boundaries to create something meaningful.
          </p>
        </div>

        {/* <a href="https://fanlink.tv/konac"> */}
        <img src={heroImage} alt="Konac" className={styles.heroImg} />
        {/* </a> */}
      </div>

      <h1 className={styles.myWork}>MY WORK</h1>

      <a href="#section" onClick={handleScroll} className={styles.scrollIcon}>
        <FontAwesomeIcon className={styles.downIcon} icon={faAngleDown} />
      </a>

      <div id="section" className={styles.projects}>
        <div id="scroll" className={styles.projectContainer}>
          <div>
            <a
              href="https://github.com/tsetoguchi/The-Slushie-Machine"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TheSlushieMachine} className={styles.imageContainer} />
            </a>
          </div>
        </div>

        <div className={styles.projectContainer}>
          <div>
            <a
              href="https://github.com/tsetoguchi/Valolytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={ValStatsAnalyzer} className={styles.imageContainer} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
