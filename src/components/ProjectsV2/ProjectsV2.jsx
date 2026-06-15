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
    imagePosition: "center 35%",
    description: "Lyrics writing tool with real-time rhyme finding, syllable counts, and rhyme scheme analysis.",
  },
  {
    title: "nitecorn",
    href: "https://nitecorn.pages.dev/",
    image: Nitecorn,
    imagePosition: "center top",
    description: "Web app for converting songs into nightcore edits with pitch and tempo controls.",
  },
  {
    title: "airy",
    href: "https://github.com/tsetoguchi/airy",
    image: airy,
    imagePosition: "center center",
    description:
      "Simple real-time oscilloscope audio plugin that allows users to visualize waveforms of incoming audio signals.",
  },
  {
    title: "Currently VST",
    href: "https://github.com/tsetoguchi/CurrentlyVST",
    image: CurrentlyVST,
    imagePosition: "center center",
    description:
      "JUCE-based audio plugin displaying DAW timecode to help producers and engineers stay in sync.",
  },
  {
    title: "Valolytics",
    href: "https://github.com/tsetoguchi/Valolytics",
    image: ValStatsAnalyzer,
    imagePosition: "center top",
    description: "Esports match analysis dashboard for VALORANT with player and match metrics.",
  },
  {
    title: "The Slushie Machine",
    href: "https://github.com/tsetoguchi/The-Slushie-Machine",
    image: TheSlushieMachine,
    imagePosition: "center top",
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
                style={{ objectPosition: project.imagePosition }}
                loading="lazy"
              />
              <div className={styles.cardScrim}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsV2;
