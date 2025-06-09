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
      `Audio Commission Request - ${formData.service}`
    );
    const body = encodeURIComponent(
      `From: ${formData.email}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message
    setShowSuccess(true);
    setShowError(false);

    // Reset form after delay
    setTimeout(() => {
      setFormData({ email: "", service: "", message: "" });
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.experience}>Commission</h1>
        <p className={styles.description}></p>

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Your Name
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
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
              placeholder="Tell us about your project, timeline, and any specific requirements..."
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
            ✅ Your message has been sent successfully! We'll get back to you
            soon.
          </div>
        )}

        {showError && (
          <div className={styles.errorMessage}>
            ❌ There was an error sending your message. Please try again.
          </div>
        )}
      </div>
    </section>
  );
};
