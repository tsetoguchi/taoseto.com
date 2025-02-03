import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import airy from '../../../assets/projects/airy.gif';
import YouTubeAudioTranscriber from '../../../assets/projects/youtube_audio_transcriber.png';
import ValStatsAnalyzer from '../../../assets/projects/valorant_stats_analyzer.png'; 
import Img2 from '../../../assets/projects/2.png'; 
import Img3 from '../../../assets/projects/3.png'; 
import Genicloud from '../../../assets/projects/Genicloud.png';

import styles from './Projects.module.css';

export const Projects = () => {
  return (
    <div className={styles.container}>
      <Carousel fade className={styles.carousel}>

      <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <a href="https://github.com/tsetoguchi/airy" target="_blank" rel="noopener noreferrer">
              <img 
                src={airy} 
                alt="Second slide" 
                className="d-block w-100" 
              />
            </a>
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
            </div>
            <div className={styles.captionWrapper}>
              <h3>airy</h3>
              <p>Simple real-time oscilloscope audio plugin that allows users to visualize waveforms of incoming audio signals.</p>
            </div>
          </div>
        </Carousel.Item>

      <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <a href="https://github.com/tsetoguchi/Youtube-Audio-Transcriber" target="_blank" rel="noopener noreferrer">
              <img 
                src={YouTubeAudioTranscriber} 
                alt="Second slide" 
                className="d-block w-100" 
              />
            </a>
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
            </div>
            <div className={styles.captionWrapper}>
              <h3>YouTube Audio Transcriber</h3>
              <p>Audio to text transcriber for one or multiple YouTube videos.</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <img 
              src={ValStatsAnalyzer} 
              alt="First slide" 
              className="d-block w-100" 
            />
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
              {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
            </div>
            <div className={styles.captionWrapper}>
              <h3>VALORANT Stats Analyzer</h3>
              <p>Comprehensive esports match analysis tool for the game VALORANT.</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <a href="https://github.com/tsetoguchi/The-Slushie-Machine" target="_blank" rel="noopener noreferrer">
              <img 
                src={Img2} 
                alt="Second slide" 
                className="d-block w-100" 
              />
            </a>
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
              {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
            </div>
            <div className={styles.captionWrapper}>
              <h3>The Slushie Machine</h3>
              <p>Multicomponent audio processing application that focuses on maintaining a simple UI.</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <a href="https://github.com/tsetoguchi/Genicloud" target="_blank" rel="noopener noreferrer">
              <img 
                src={Genicloud} 
                alt="Third slide" 
                className="d-block w-100" 
              />
            </a>
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
              {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
            </div>
            <div className={styles.captionWrapper}>
              <h3>Genicloud</h3>
              <p>Downloads the lyrics of the top hits from artists within the Genius database and produces a word cloud.</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item className={styles.carouselItem}>
          <div className={styles.imageContainer}>
            <a href="https://github.com/tsetoguchi/Labyrinth" target="_blank" rel="noopener noreferrer">
              <img 
                src={Img3} 
                alt="Fourth slide" 
                className="d-block w-100" 
              />
            </a>
          </div>
          <div className={styles.carouselContent}>
            <div className={styles.carouselIndicators}></div>
            <div className={styles.carouselControls}>
              {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
            </div>
            <div className={styles.captionWrapper}>
              <h3>Labyrinth Game</h3>
              <p>Java implementation of the board game Labyrinth.</p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Projects;