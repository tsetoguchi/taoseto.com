import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Img1 from '../../../assets/projects/1.png'; 
import Img2 from '../../../assets/projects/2.jpg'; 
import Img3 from '../../../assets/projects/3.jpg'; 
export const Projects = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          src={Img1}
          alt="First slide"
          className="d-block w-100"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={Img2}
          alt="Second slide"
          className="d-block w-100"
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={Img3}
          alt="Third slide"
          className="d-block w-100"
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Projects;
