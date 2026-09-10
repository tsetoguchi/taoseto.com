import { Helmet } from "react-helmet-async";

import airyVideo from "../../../assets/projects/airy.mp4";
import airyPoster from "../../../assets/projects/airy-poster.jpg";
import CurrentlyVST from "../../../assets/projects/currentlyvst.webp";
import Valorant from "../../../assets/projects/valorant.webp";
import TheSlushieMachine from "../../../assets/projects/the_slushie_machine.webp";
import LyricLike from "../../../assets/projects/lyriclike.webp";
import styles from "./ProjectsV2.module.css";

const PROJECTS = [
  {
    title: "LyricLike",
    href: "https://lyriclike.com/",
    image: LyricLike,
    imagePosition: "center top",
    description:
      "Lyric writing tool with real-time rhyme finding across six rhyme types, syllable counts, and rhyme scheme analysis.",
  },
  {
    title: "airy",
    href: "https://github.com/tsetoguchi/airy",
    // Screen recording, so it ships as H.264 rather than a 30 MB GIF.
    video: airyVideo,
    image: airyPoster,
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
    image: Valorant,
    imagePosition: "center center",
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
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.image}
                  className={styles.cardImage}
                  style={{ objectPosition: project.imagePosition }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-label={project.title}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.cardImage}
                  style={{ objectPosition: project.imagePosition }}
                  loading="lazy"
                />
              )}
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
