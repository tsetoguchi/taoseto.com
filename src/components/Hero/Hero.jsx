import React from 'react'
import { Link } from 'react-router-dom'; 

import styles from './Hero.module.css'
import { getImageUrl } from '../../utils'

export const Hero = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.header}>Hi, I'm Tao Setoguchi</h1>
            <p className={styles.description}>"Lorem ipsum dolor sit amet, consectetur adipiscing 
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
               minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
               commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
               cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
               proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Umm yeah
                okay bye xD</p>
            {/* <Link href="mailto:tao@taosetoguchi.com" className={styles.contactBtn}>Contact Me</Link> */}
        </div>
        <img src={getImageUrl('hero/heroImage.png')} alt="Hero image of me" className={styles.heroImg} />
        {/* <div className={styles.topBlur} />
        <div className={styles.bottomBlur} /> */}
    </section>
  )
}
