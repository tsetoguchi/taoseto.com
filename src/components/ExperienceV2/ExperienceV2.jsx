import { Helmet } from 'react-helmet-async';
import styles from './ExperienceV2.module.css';

// Company logos — add image files to assets/experience/ to enable
const logos = import.meta.glob('../../../assets/experience/*.{webp,png,jpg,svg}', { eager: true });
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
    period: "April 2015 — Present",
    bullets: [
      "Signed to NoCopyrightSounds as the label's first ever Japanese artist, announced by NCS on release day, July 2016; negotiated the contract directly with NCS executives and also released on Tasty.",
      "Landed Spotify editorial placements on Brain Food (3.7M saves) and metropolis (869K saves); Away, the Brain Food placement, is the catalogue's most-streamed track at 3.1M plays.",
      "Built a catalogue that has drawn 7,800 creator posts on TikTok totalling 59M views, 5.6M Spotify streams, and 46K Shazams; work the artist-facing analytics of Spotify, Apple Music, and TikTok for Artists directly.",
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
      "Drove Rhythmedia's in-house audio production capability from zero to one, launching on-demand studio sessions with The Alchemist, MISIA, and DJ MURO, and cutting broadcast-commercial post-production turnaround by 2-5 days for clients including Lawson, J-Wave, and Koikeya.",
      "Managed collaboration across time zones and cultures with counterparts in the US, UK, and Thailand, including The Alchemist and mastering engineer Herb Powers Jr., building a coordination process that supported 6+ projects.",
      "Engineered the workflow's software tooling, including a Python OpenAI Whisper audio-to-SRT pipeline replacing from-scratch subtitle creation in After Effects, and a C++/JUCE timecode display VST used across 10+ hours of production audio.",
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
      "Investigated production edge cases in microservices at a $4T+ AUM custodian bank using Dynatrace and Splunk, shipping PRs with defensive error handling and logging across API endpoints.",
      "Prototyped an internal client-data analysis web app for a 5-person operations team, refactoring UI routing to cut per-task navigation from 4 clicks to 1.",
      "Diagnosed root cause of account-level transactional lock timeouts in Snowflake through query profile analysis, authoring Python automation that replaced manual query-profile inspection with near-instant alerts and cut mean time to triage from 10-30 minutes to seconds.",
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
          </div>
        </div>

        <div className={styles.cards}>
          {EXPERIENCE.map((entry, i) => (
            <article key={i} className={styles.card}>
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
                  <h3 className={styles.companyName}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.companyLink}
                    >
                      {entry.company}
                    </a>
                  </h3>
                  <p className={styles.role}>{entry.role}</p>
                </div>
                <ul className={styles.bullets}>
                  {entry.bullets.map((b, j) => (
                    <li key={j} className={styles.bullet}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceV2;
