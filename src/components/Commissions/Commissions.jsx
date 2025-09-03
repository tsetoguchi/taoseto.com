import React, { useState } from "react";
import styles from "./Commissions.module.css";
import { getApiEndpoint } from "../../config";

export const Commissions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email");
      return false;
    }
    if (!formData.service) {
      setErrorMessage("Please select a service");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please describe your project");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const apiUrl = getApiEndpoint('contact');
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", service: "", message: "" });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowError(true);
      setErrorMessage(error.message || "There was an error sending your message. Please try again.");
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>

        {/* <div className={styles.servicesContainer}>


        </div> */}

        <div className={styles.formContainer}>
          <h1 className={styles.mainText}>Get in touch</h1>
          <p className={styles.description}></p>

          <form onSubmit={handleSubmit} className={styles.form}>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <option className={styles.serviceOption} value="">
                  Select a service...
                </option>
                <option className={styles.serviceOption} value="Mixing">
                  Mixing
                </option>
                <option className={styles.serviceOption} value="Mastering">
                  Mastering
                </option>
                <option
                  className={styles.serviceOption}
                  value="Mixing & Mastering"
                >
                  Mixing & Mastering
                </option>
                <option className={styles.serviceOption} value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project, timeline, budget range, and any specific requirements..."
                className={styles.textarea}
                disabled={isSubmitting}
                rows={6}
              />
            </div>

                      <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className={styles.messageContainer}>
          {showSuccess && (
            <div className={styles.successMessage}>
              Thank you! Your commission request has been sent successfully. I'll get back to you soon.
            </div>
          )}

          {showError && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};