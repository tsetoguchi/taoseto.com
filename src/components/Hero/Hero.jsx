import React from 'react'
import { Link } from 'react-router-dom'; 

import styles from './Hero.module.css'
import { getImageUrl } from '../../utils'

export const Hero = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.title}>Hi, I'm Tao</h1>
            <p className={styles.description}>I'm the god of audio engineering and music production, reach out!</p>
            {/* <Link href="mailto:tao@taosetoguchi.com" className={styles.contactBtn}>Contact Me</Link> */}
        </div>
        <img src={getImageUrl('hero/heroImage.png')} alt="Hero image of me" className={styles.heroImg} />
        <div className={styles.topBlur} />
        <div className={styles.bottomBlur} />
    </section>
  )
}
