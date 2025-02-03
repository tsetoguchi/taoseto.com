import React from 'react'
import { Link } from 'react-router-dom'; 

import styles from './Hero.module.css'
import { getImageUrl } from '../../utils'

export const Hero = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.header}>Hi, I'm Tao Seto</h1>
            <p className={styles.description}>I’m a Computer Science and Music Technology graduate from Northeastern 
              University with a strong focus on collaboration and clear communication to build meaningful, impactful 
              products. I’m always looking for ways to improve, adapt, and create solutions that make a difference.</p>
            {/* <Link href="mailto:tao@taosetoguchi.com" className={styles.contactBtn}>Contact Me</Link> */}
        </div>
        <img src={getImageUrl('hero/heroImage.png')} alt="Hero image of me" className={styles.heroImg} />
        {/* <div className={styles.topBlur} />
        <div className={styles.bottomBlur} /> */}
    </section>
  )
}
