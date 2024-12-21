import React from 'react'

import styles from './About.module.css'
import { getImageUrl } from '../../utils'

export const About = () => {
  return (
    <section className={styles.container} id="about">
        <h2 className={styles.title}>About Me</h2>
        <div className={styles.content}>
            <img src={getImageUrl('about/aboutImage.png')} alt="Me sitting with a laptop" className={styles.aboutImage}/>
        <ul className={styles.aboutItems}>
            <li className={styles.aboutItem}>
                {/* <img src={getImageUrl('about/cursorIcon.png')} alt="Cursor icon"/> */}
            <div className={styles.aboutItemText}>
                <h3>Frontend Developer</h3>
                <p>
                I'm a recent graduate with a background in Computer Science and Music Technology from Northeastern University, 
                eager to begin my professional journey. My approach emphasizes collaboration and recognizing the indispensable role of 
                effective communication in delivering valuable products. 
                I am always endeavoring to improve and succeed in every facet of my life.
                </p>
            </div>
            </li>
            {/* <li className={styles.aboutItem}>
                <img src={getImageUrl('about/serverIcon.png')} alt="Server icon"/>
            <div className={styles.aboutItemText}>
                <h3>Backend Developer</h3>
                <p>
                    I have experience with server-side technologies like Node.js, Express, and MongoDB.
                    I'm also familiar with RESTful APIs and GraphQL.
                </p>
            </div>
            </li>
            <li className={styles.aboutItem}>
                <img src={getImageUrl('about/serverIcon.png')} alt="UI icon"/>
            <div className={styles.aboutItemText}>
                <h3>UI Designer</h3>
                <p>
                    I have experience with UI design and prototyping. I'm familiar with tools like Figma and Adobe XD.
                </p>
            </div>
            </li> */}
        </ul>
        </div>
    </section>
  )
}
