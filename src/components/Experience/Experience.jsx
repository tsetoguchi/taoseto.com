import styles from './Experience.module.css';
import Resume from '../../../assets/experience/tao_seto_resume.pdf';

export const Experience = () => {

    return (
      <section className={styles.container}>
        <div className={styles.content} id="content">
          {/* <h1 className={styles.experience}>
          <a 
                href={Resume} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
              >

                Resume
                
              </a>
          </h1>
           */}

          <h1 className={styles.experience}>
            <a
              href="https://open.spotify.com/artist/6XoPTqzeS9Y6YhHCnSH5bQ?si=941d4f716bf04ddf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Konac
            </a>
          </h1>
          <p className={styles.description}>
            <ul class="list-group">
              <li className={styles.listItem}>
                Garnered over 200 million streams across platforms, reflecting
                significant audience engagement and reach.
              </li>

              <li className={styles.listItem}>
                Founded and manage independent music project Konac, producing
                original music and overseeing all creative and production
                aspects.
              </li>

              <li className={styles.listItem}>
                Built and maintained a global network of over 100 musicians,
                visual artists, and promoters, leveraging connections to create
                engaging content and manage social media accounts for increased
                brand visibility and exposure.
              </li>
            </ul>
          </p>

          <h1 className={styles.experience}>
            <a
              href="https://www.rhythmedia.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Rhythmedia
            </a>
          </h1>
          <p className={styles.description}>
            <ul class="list-group">
              <li className={styles.listItem}>
                Worked with executive teams and major artists like The Alchemist, DJ MURO, and MISIA using
                Pro Tools and Avid S6 consoles, recorded audio that aired on
                nationwide J-WAVE radio and LAWSON commercials, attended
                mastering sessions at Sony Music studios, and shadowed engineers
                such as
                <a
                  href="https://hotoda.com/en/worklist.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {" "}
                  Goh Hotoda{" "}
                </a>
                (Depeche Mode, Madonna, Janet Jackson, Anri, etc.).
              </li>

              <li className={styles.listItem}>
                Developed automated audio-to-SRT subtitle generation systems and
                created a timecode display VST plugin using JUCE framework in
                C++ to streamline studio workflows.
              </li>

              <li className={styles.listItem}>
                Provided creative direction and worked directly with the company
                president on branding decisions including helping design logo
                and slogans for sister companies, deciding album titles, and
                developing event concepts and naming.
              </li>
            </ul>
          </p>

          {/* <h1 className={styles.experience}>
              <a 
                href="https://mem-mem.jp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
              >

                MEM
                
              </a>
            </h1>
            <p className={styles.description}>

            <ul class="list-group">
              <li className={styles.listItem}>
                Worked with executive teams and major artists like MISIA using Pro Tools and Avid S6 consoles, recorded audio that aired on nationwide J-WAVE radio and LAWSON commercials, attended mastering sessions at Sony Music studios, and shadowed engineers such as Goh Hotoda (Depeche Mode, Madonna, Janet Jackson, Anri, etc.).
              </li>

              <li className={styles.listItem}>
                Developed automated audio-to-SRT subtitle generation systems and created a timecode display VST plugin using JUCE framework in C++ to streamline studio workflows.
              </li>

              <li className={styles.listItem}>
                Provided creative direction and worked directly with the company president on branding decisions including helping design logos for sister companies, deciding album titles, and developing event concepts and naming.
              </li>
            </ul>

            </p> */}

          <h1 className={styles.experience}>
            <a
              href="https://www.statestreet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              State Street
            </a>
          </h1>
          <p className={styles.description}>
            <ul class="list-group">
              <li className={styles.listItem}>
                Led full-stack development of a client web app, improving
                navigation speed and minimizing click expenditure by 75%.
              </li>

              <li className={styles.listItem}>
                Engaged in daily Scrum meetings and automated manual operational
                tasks, exceeding $500,000 in cost savings.
              </li>

              <li className={styles.listItem}>
                Cooperated with operations teams to mitigate failure patterns,
                reduce downtime, and improve stability, enhancing performance by
                up to 200%.
              </li>

              <li className={styles.listItem}>
                Enhanced application reliability by up to 180%, proactively
                analyzing system performance using tools like Dynatrace and
                Splunk to detect and address anomalies.
              </li>
            </ul>
          </p>

          <h1 className={styles.experience}>
            <a
              href="https://www.kohgendo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Koh Gen Do
            </a>
          </h1>
          <p className={styles.description}>
            <ul class="list-group">
              <li className={styles.listItem}>
                Produced, mixed, and mastered music using FL Studio and Ableton
                for a KohGenDo commercial broadcast to millions on national
                television and YouTube Ads, contributing to an increase in brand
                visibility.
              </li>

              <li className={styles.listItem}>
                Collaborated closely with renowned Japanese actress
                <a
                  href="https://www.instagram.com/hikarimitsushima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {" "}
                  Hikari Mitsushima{" "}
                </a>
                to refine and finalize music, ensuring alignment with the
                commercial’s vision.
              </li>

              <li className={styles.listItem}>
                Supervised and conducted recording sessions with a guitarist,
                achieving high-quality recordings under tight deadlines,
                showcasing strong project management skills.
              </li>
            </ul>
          </p>
        </div>
      </section>
    );
};

export default Experience;
