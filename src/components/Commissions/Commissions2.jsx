import React, { useState } from "react";
import styles from "./Commissions.module.css";

export const Commissions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create mailto link
    const subject = encodeURIComponent(

      `${formData.service} - ${formData.name}`

    );

    const body = encodeURIComponent(

      `From: ${formData.email}\nService: ${formData.service}\n\nMessage:\n${formData.message}`

    );

    const mailtoLink = `mailto:commissions@taoseto.com?subject=${subject}&body=${body}`;

    // Redirect to same page with success parameter
    window.location.href = window.location.pathname + '?submitted=true';

    // Show success message
    setShowSuccess(true);
    setShowError(false);

    // Reset form after delay
    setTimeout(() => {
      setFormData({ name: "", email: "", service: "", message: "" });
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {/* <p className={styles.description}>
          Mixing package:
          <br></br>
          <ul class="list-group">
            What you get:
            <li>Industry-quality mix</li>
            <li>Final mix ready for mastering</li>
            <li>Revisions included</li>
          </ul>
        </p> */}

        <div className={styles.formContainer}>
          <h1 className={styles.mainText}>Get in touch</h1>
          <p className={styles.description}></p>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Name"
                className={styles.nameInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="service" className={styles.label}>
                Service Type
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a service...</option>
                <option value="Mixing">Mixing</option>
                <option value="Mastering">Mastering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project, timeline, and any specific requirements..."
                className={styles.textarea}
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className={styles.submitBtn}
            >
              Send
            </button>
          </div>

          {showSuccess && (
            <div className={styles.successMessage}>
              Your message has been sent successfully! I'll get back to you
              soon.
            </div>
          )}

          {showError && (
            <div className={styles.errorMessage}>
              There was an error sending your message. Please try again.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
