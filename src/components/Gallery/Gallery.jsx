import React from 'react';
import styles from './Gallery.module.css';


const Gallery = ({ images, sectionTheme = 'black' }) => {
  return (
    <section
      data-test="page-section"
      data-section-theme={sectionTheme}
      className={`page-section gallery-section full-bleed-section background-width--full-bleed section-height--medium content-width--wide horizontal-alignment--center vertical-alignment--middle ${sectionTheme}`}
      data-controller="SectionWrapperController"
    >
      <div className="section-border">
        <div className="section-background"></div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          <div className="gallery gallery-section-wrapper">
            <div
              className="gallery-reel"
              data-controller="GalleryReel"

              data-show-captions="false"
            >
              <div className="gallery-reel-wrapper">
                <div className="gallery-reel-list">
                  {images.map((image, index) => (
                    <figure
                      key={index}
                      className="gallery-reel-item"
                      data-test="gallery-reel-item"
                    >
                      <div className="gallery-reel-item-wrapper">
                        <div className="gallery-reel-item-src">
                            <div className={styles.imgContainer}>
                          <img
                            className={styles.img}  /* Apply the centering styles */
                            src={image.src}
                            alt={image.alt || ''}
                            loading="lazy"
                            decoding="async"
                          />
                          </div>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
