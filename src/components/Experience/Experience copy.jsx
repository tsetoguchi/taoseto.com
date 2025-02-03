import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import styles from './Experience.module.css';

import StateStreet from '../../../assets/experience/StateStreet.jpg';
import Kohgendo from '../../../assets/experience/Kohgendo.jpg';

export const Experience = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', company: '', details: '' });

  const experiences = [
    {
      id: 1,
      title: 'Site Reliability Engineer',
      company: 'State Street - Boston, MA',
      logo: StateStreet,
      details: `Led the full-stack development of a client web application, optimizing navigation speed and 
      reducing click expenditure by 75%. Participated in daily Scrum meetings to identify and automate manu
      al operational tasks, resulting in over $500,000 in cost savings. Collaborated with operations teams 
      to mitigate failure patterns, minimize downtime, and improve system stability, achieving a performance
       increase of up to 200%. Enhanced application reliability b   y 180% through proactive system performance
        analysis using tools such as Dynatrace and Splunk to detect and address anomalies.`,
    },
    {
      id: 2,
      title: 'Music Producer',
      company: 'KohGenDo - Tokyo, Japan',
      logo: Kohgendo,
      details: `Produced, mixed, and mastered music using FL Studio and Ableton for a KohGenDo commercial 
      broadcast to millions on national television and YouTube Ads, significantly boosting brand visibility. 
      Collaborated with renowned Japanese actress Hikari Mitsushima to refine and finalize the music, ensuring 
      it aligned with the commercial’s vision. Supervised and conducted recording sessions with a guitarist, 
      delivering high-quality recordings under tight deadlines, demonstrating strong project management and 
      coordination skills.`,
    },
  ];

  const handleShow = (experience) => {
    setModalContent(experience);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <section className={styles.container}>
      <div className="row">
        {experiences.map((exp) => (
          <div className="col-md-6 col-lg-6" key={exp.id}>
            <Card className={styles.card}>
              <Card.Img variant="top" src={exp.logo} />
              <Card.Body>
                <Card.Title>{exp.company}</Card.Title>
                <Card.Text>{exp.title}</Card.Text>
                <Button variant="outline-dark" onClick={() => handleShow(exp)}>
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.company}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Role:</strong> {modalContent.title}</p>
          <p><strong>Details:</strong> {modalContent.details}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Experience;
