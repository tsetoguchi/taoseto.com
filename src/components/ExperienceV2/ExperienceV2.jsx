import { Helmet } from 'react-helmet-async';
import styles from './ExperienceV2.module.css';
import Resume from '../../../assets/experience/tao_seto_resume.pdf';

// Company logos — add image files to assets/experience/ to enable
const logos = import.meta.glob('../../../assets/experience/*.{png,jpg,svg}', { eager: true });
const getLogo = (name) => {
  const match = Object.entries(logos).find(([path]) => path.includes(name));
  return match ? match[1].default : null;
};

const EXPERIENCE = [
  {
    company: "Konac",
    url: "https://kon.ac",
    logo: getLogo("konac"),
    gradient: ["#1a1a1a", "#8a8a8a"],
    role: "Founder & Producer",
    period: "2014 — Present",
    bullets: [
      "Garnered over 200 million streams across platforms, reflecting significant audience engagement and reach.",
      "Founded and manage independent music project Konac, producing original music and overseeing all creative and production aspects.",
      "Built and maintained a global network of over 100 musicians, visual artists, and promoters, leveraging connections to create engaging content and manage social media accounts for increased brand visibility and exposure.",
    ],
  },
  {
    company: "Rhythmedia",
    url: "https://www.rhythmedia.co.jp/",
    logo: getLogo("rhythmedia"),
    gradient: ["#3d1510", "#e05a3a"],
    role: "Lead Audio Engineer & International Communications",
    period: "March 2025 - March 2026",
    bullets: [
      "Worked with executive teams and major artists like The Alchemist, DJ MURO, and MISIA using Pro Tools and Avid S6 consoles, recorded audio that aired on nationwide J-WAVE radio and LAWSON commercials, attended mastering sessions at Sony Music studios, and shadowed engineers such as Goh Hotoda (Depeche Mode, Madonna, Janet Jackson, Anri, etc.).",
      "Developed automated audio-to-SRT subtitle generation systems and created a timecode display VST plugin using JUCE framework in C++ to streamline studio workflows.",
      "Provided creative direction and worked directly with the company president on branding decisions including helping design logo and slogans for sister companies, deciding album titles, and developing event concepts and naming.",
    ],
  },
  {
    company: "State Street",
    url: "https://www.statestreet.com/",
    logo: getLogo("statestreet"),
    gradient: ["#0a1540", "#2a5cdb"],
    role: "Site Reliability Engineer",
    period: "February 2022 - July 2022",
    bullets: [
      "Led full-stack development of a client web app, improving navigation speed and minimizing click expenditure by 75%.",
      "Engaged in daily Scrum meetings and automated manual operational tasks, exceeding $500,000 in cost savings.",
      "Cooperated with operations teams to mitigate failure patterns, reduce downtime, and improve stability, enhancing performance by up to 200%.",
      "Enhanced application reliability by up to 180%, proactively analyzing system performance using tools like Dynatrace and Splunk to detect and address anomalies.",
    ],
  },
  {
    company: "Koh Gen Do",
    url: "https://kohgendocosmetics.com/",
    logo: getLogo("kohgendo"),
    gradient: ["#1a0808", "#cc2020"],
    role: "Music Producer",
    period: "July 2019",
    bullets: [
      "Produced, mixed, and mastered music using FL Studio and Ableton for a KohGenDo commercial broadcast to millions on national television and YouTube Ads, contributing to an increase in brand visibility.",
      "Collaborated closely with renowned Japanese actress Hikari Mitsushima to refine and finalize music, ensuring alignment with the commercial's vision.",
      "Supervised and conducted recording sessions with a guitarist, achieving high-quality recordings under tight deadlines, showcasing strong project management skills.",
    ],
  },
];

export const ExperienceV2 = () => {
  return (
    <section className={styles.container}>
      <Helmet>
        <title>Experience — tao seto</title>
        <meta name="description" content="Tao Seto's professional experience in music production, audio engineering, and software engineering. Konac, Rhythmedia, State Street, and more." />
        <meta property="og:title" content="Experience — tao seto" />
        <meta property="og:url" content="https://taoseto.com/experience" />
      </Helmet>

      <div className={styles.content} id="content">
        <div className={styles.pageHeader}>
          <p className={styles.pageTitle}>Background</p>
          <div className={styles.headerRow}>
            <h1 className={styles.pageSubtitle}>Experience</h1>
            <a
              href={Resume}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
            >
              Resume ↗
            </a>
          </div>
        </div>

        <div className={styles.cards}>
          {EXPERIENCE.map((entry, i) => (
            <a
              key={i}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              {entry.gradient && (
                <div
                  className={styles.cardGradient}
                  style={{
                    background: `linear-gradient(135deg, ${entry.gradient[0]}, ${entry.gradient[1]})`,
                  }}
                />
              )}
              <div className={styles.cardLeft}>
                <div className={styles.logoWrapper}>
                  {entry.logo ? (
                    <img
                      src={entry.logo}
                      alt={`${entry.company} logo`}
                      className={styles.companyLogo}
                    />
                  ) : (
                    <span className={styles.logoFallback}>
                      {entry.company.charAt(0)}
                    </span>
                  )}
                </div>
                <span className={styles.period}>{entry.period}</span>
              </div>

              <div className={styles.cardRight}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.companyName}>{entry.company}</h3>
                  <p className={styles.role}>{entry.role}</p>
                </div>
                <ul className={styles.bullets}>
                  {entry.bullets.map((b, j) => (
                    <li key={j} className={styles.bullet}>{b}</li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceV2;
