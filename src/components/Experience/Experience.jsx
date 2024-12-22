import React from 'react'
import { Link } from 'react-router-dom'; 

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from './Experience.module.css';
import StateStreet from '../../../assets/experience/StateStreet.jpg';
import Kohgendo from '../../../assets/experience/Kohgendo.jpg';

import Modal from '../Utility/Modal';

export const Experience = () => {
    return (
        <section className={styles.container}>
            <Card className={styles.card}>
                <Card.Img variant="top" src={StateStreet} />
                <Card.Body>
                    <Card.Title>State Street - Boston, MA</Card.Title>
                    <Card.Text>
                    Site Reliability Engineer
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>

            <Card className={styles.card}>
                <Card.Img variant="top" src={Kohgendo} />
                <Card.Body>
                    <Card.Title>KohGenDo - Tokyo, Japan</Card.Title>
                    <Card.Text>
                    Music Producer
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </section>
    );
}

export default Experience;
