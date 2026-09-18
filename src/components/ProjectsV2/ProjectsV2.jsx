import { Helmet } from "react-helmet-async";

import airyPoster from "../../../assets/projects/airy-poster.jpg";
import CurrentlyVST from "../../../assets/projects/currentlyvst.webp";
import Valorant from "../../../assets/projects/valorant.webp";
import TheSlushieMachine from "../../../assets/projects/the_slushie_machine.webp";
import LyricLike from "../../../assets/projects/lyriclike.webp";
import styles from "./ProjectsV2.module.css";

const PROJECTS = [
  {
    title: "LyricLike.com",
    href: "https://lyriclike.com/",
    image: LyricLike,
    // Wider than the 2:1 frame; anchor left so the crop spares the logo.
    imagePosition: "left center",
    description:
      "A rhyme finder for writing lyrics. Six kinds of rhyme, syllable counts and scheme analysis, all updating as you type.",
    meta: ["2026", "JavaScript", "lyriclike.com"],
  },
  {
    title: "airy",
    href: "https://github.com/tsetoguchi/airy",
    image: airyPoster,
    description: "A real-time oscilloscope. It draws the signal while it plays, and that is all it does.",
    meta: ["2026", "C++/JUCE"],
  },
  {
    title: "Currently VST",
    href: "https://github.com/tsetoguchi/CurrentlyVST",
    image: CurrentlyVST,
    description:
      "Built for DAWs that give you no clear time display. It puts the playhead's timecode on screen and sizes itself to whatever resolution it lands on.",
    meta: ["2025", "C++/JUCE"],
  },
  {
    title: "Valolytics",
    href: "https://github.com/tsetoguchi/Valolytics",
    image: Valorant,
    description:
      "Point it at a VLR tournament's match pages and it scrapes the results, rates every team by ELO, and weighs a given matchup.",
    meta: ["2025", "Python"],
  },
  {
    title: "The Slushie Machine",
    href: "https://github.com/tsetoguchi/The-Slushie-Machine",
    image: TheSlushieMachine,
    description:
      "Delay, filter, chorus, limiter, imager and waveshaper, chained in series — where the order you put them in is the whole instrument.",
    meta: ["2023", "C++/JUCE", "VST3"],
  },
];

export const ProjectsV2 = () => {
  return (
    <section className={styles.container}>
      <Helmet>
        <title>Projects</title>
        <meta
          name="description"
          content="Software and audio projects by Tao Seto — JUCE audio plugins, web apps, tools, and games."
        />
        <meta property="og:title" content="Projects" />
        <meta property="og:url" content="https://taoseto.com/projects" />
      </Helmet>

      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageHeading}>Projects</h1>
        </header>

        <div className={styles.projects}>
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.project}
            >
              <div className={styles.media}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.projectImage}
                  style={{ objectPosition: project.imagePosition }}
                  loading="lazy"
                />
              </div>
              <div className={styles.projectText}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                {/* Joined into one string so the facts are not read as three
                    run-together words. */}
                <p className={styles.projectMeta}>{project.meta.join(" · ")}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsV2;
