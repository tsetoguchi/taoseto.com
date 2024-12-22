import React from 'react';
import PropTypes from 'prop-types';

const CarouselSlide = ({ text }) => {
  return (
    <img
      className="d-block w-100"
      src={`../../assets/projects/${text}`}
      alt={text}
    />
  );
};

ExampleCarouselImage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CarouselSlide;
