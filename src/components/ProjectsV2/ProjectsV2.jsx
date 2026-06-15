import { Helmet } from "react-helmet-async";

import airy from "../../../assets/projects/airy.gif";
import CurrentlyVST from "../../../assets/projects/currentlyvst.png";
import ValStatsAnalyzer from "../../../assets/projects/valorant_stats_analyzer.png";
import TheSlushieMachine from "../../../assets/projects/the_slushie_machine.png";
import Nitecorn from "../../../assets/projects/nitecorn.png";
import LyricalMiracle from "../../../assets/projects/lyrical_miracle.png";
import styles from "./ProjectsV2.module.css";

const PROJECTS = [
  {
    title: "Lyrical Miracle",
    href: "https://lyricalmiracle.pages.dev/",
    image: LyricalMiracle,
    description: "Lyrics writing tool with real-time rhyme finding, syllable counts, and rhyme scheme analysis.",
  },
  {
    title: "nitecorn",
    href: "https://nitecorn.pages.dev/",
    image: Nitecorn,
    description: "Web app for converting songs into nightcore edits with pitch and tempo controls.",
  },
  {
    title: "airy",
    href: "https://github.com/tsetoguchi/airy",
    image: airy,
    description:
      "Simple real-time oscilloscope audio plugin that allows users to visualize waveforms of incoming audio signals.",
  },
  {
    title: "Currently VST",
    href: "https://github.com/tsetoguchi/CurrentlyVST",
    image: CurrentlyVST,
    description:
      "JUCE-based audio plugin displaying DAW timecode to help producers and engineers stay in sync.",
  },
  {
    title: "Valolytics",
    href: "https://github.com/tsetoguchi/Valolytics",
    image: ValStatsAnalyzer,
    description: "Esports match analysis dashboard for VALORANT with player and match metrics.",
  },
  {
    title: "The Slushie Machine",
    href: "https://github.com/tsetoguchi/The-Slushie-Machine",
    image: TheSlushieMachine,
    description: "Audio processing app with a focus on low latency and simplistic UI workflows.",
  },
];

export const ProjectsV2 = () => {
  return (
    <section className={styles.container}>
      <Helmet>
        <title>Projects — tao seto</title>
        <meta
          name="description"
          content="Software and audio projects by Tao Seto — JUCE audio plugins, web apps, tools, and games."
        />
        <meta property="og:title" content="Projects — tao seto" />
        <meta property="og:url" content="https://taoseto.com/projects" />
      </Helmet>

      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <p className={styles.pageTitle}>Portfolio</p>
          <h1 className={styles.pageSubtitle}>Projects</h1>
          <p className={styles.pageDescription}>
            A selection of audio, web, and software engineering projects I've developed.
          </p>
        </header>

        <div className={styles.stack}>
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <img
                src={project.image}
                alt={project.title}
                className={styles.cardImage}
              />
              <div className={styles.cardOverlay}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
              </div>
              <div className={styles.cardLabel}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsV2;
