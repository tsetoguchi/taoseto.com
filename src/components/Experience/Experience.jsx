import styles from './Experience.module.css';


import StateStreet from '../../../assets/experience/StateStreet.jpg';
import Kohgendo from '../../../assets/experience/Kohgendo.webp';


export const Experience = () => {

  // const images = [
  //   { src: StateStreet, alt: 'State Street' },
  //   { src: Kohgendo, alt: 'KohGenDo' },
  // ];



    return (
      <section className={styles.container}>
          <div className={styles.content}>
          <h1 className={styles.experience}>
            <a 
              href="https://www.statestreet.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link} // Optional: Add a CSS class for styling
            >
              State Street
            </a>
          </h1>
            <p className={styles.description}>
              Led full-stack development of a client web app, improving navigation speed and minimizing click expenditure by 75%.<br />
              Engaged in daily Scrum meetings and automated manual operational tasks, exceeding $500,000 in cost savings.<br />
              Cooperated with operations teams to mitigate failure patterns, reduce downtime, and improve stability, enhancing performance by up to 200%.<br />
              Enhanced application reliability by up to 180%, proactively analyzing system performance using tools like Dynatrace and Splunk to detect and address anomalies.
            </p>

            <h1 className={styles.experience}>
              <a 
                href="https://www.kohgendo.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link} // Optional: Add a CSS class for styling
              >
                Koh Gen Do
              </a>
            </h1>
            <p className={styles.description}>
              Produced, mixed, and mastered music using FL Studio and Ableton for a KohGenDo commercial broadcast to millions on national television and YouTube Ads, contributing to an increase in brand visibility.<br />
              Collaborated closely with renowned Japanese actress Hikari Mitsushima to refine and finalize music, ensuring alignment with the commercial’s vision.<br />
              Supervised and conducted recording sessions with a guitarist, achieving high-quality recordings under tight deadlines, showcasing strong project management skills.
            </p>
          </div>
          
      </section>
    )
  
};

export default Experience;
