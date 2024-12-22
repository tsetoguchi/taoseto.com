import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Img1 from '../../../assets/projects/1.jpg'; 
import Img2 from '../../../assets/projects/2.jpg'; 
import Img3 from '../../../assets/projects/3.jpg'; 

import styles from './Projects.module.css';

export const Projects = () => {
  return (
    <Carousel fade className={styles.carousel}>
      <Carousel.Item className={styles.carouselItem}>
        <img
          src={Img1}
          alt="First slide"
          className="d-block w-100"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className={styles.carouselItem}>
        <img
          src={Img2}
          alt="Second slide"
          className="d-block w-100"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className={styles.carouselItem}>
        <img
          src={Img3}
          alt="Third slide"
          className="d-block w-100"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Projects;
