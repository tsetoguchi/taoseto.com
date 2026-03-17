import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Commissions.module.css";
import { getApiEndpoint } from "../../config";

const TIERS = [
  {
    id: "Mixing",
    name: "Mixing",
    price: "Starting at $1000",
    featured: false,
    features: [
      "Radio ready mixdown",
      "Instrumental + Stems",
      "Guaranteed Satisfaction Policy",
    ],
  },
  {
    id: "Mastering",
    name: "Mastering",
    price: "$100",
    featured: false,
    features: [
      "3 rounds of revisions",
      "Commercial grade loudness",
      "Platform-ready master",
    ],
  },
  {
    id: "Mixing & Mastering",
    name: "Mixing & Mastering",
    price: "Starting at $1000",
    featured: true,
    badge: "Full service",
    features: [
      "All mixing services",
      "All mastering services free of charge",
      "Priority turnaround",
    ],
  },
];

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTierSelect = (tierId) => {
    setFormData({ ...formData, service: tierId });
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setErrorMessage("Please enter your name"); return false; }
    if (!formData.email.trim()) { setErrorMessage("Please enter your email"); return false; }
    if (!formData.service) { setErrorMessage("Please select a service"); return false; }
    if (!formData.message.trim()) { setErrorMessage("Please describe your project"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address"); return false;
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
      const response = await fetch(getApiEndpoint("contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", service: "", message: "" });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message || "There was an error sending your message. Please try again.");
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <Helmet>
        <title>Commissions — tao seto</title>
        <meta name="description" content="Mixing, mastering, and music technology services by Tao Seto. Radio-ready mixdowns, commercial-grade masters, and priority turnaround." />
        <meta property="og:title" content="Commissions — tao seto" />
        <meta property="og:url" content="https://taoseto.com/commissions" />
      </Helmet>
      <div className={styles.pageHeader}>
        <p className={styles.pageTitle}>Services</p>
        <h1 className={styles.pageSubtitle}>Get in touch</h1>
      </div>

      <div className={styles.layout}>

        {/* Tiers */}
        <div className={styles.tiersSection}>
          <p className={styles.tiersLabel}>Pricing</p>
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={[
                styles.tierCard,
                tier.featured ? styles.featured : "",
                formData.service === tier.id ? styles.selected : "",
              ].join(" ")}
              onClick={() => handleTierSelect(tier.id)}
            >
              <div className={styles.tierHeader}>
                <span className={styles.tierName}>{tier.name}</span>
                {tier.badge && <span className={styles.tierBadge}>{tier.badge}</span>}
              </div>
              <p className={styles.tierPrice}>{tier.price}</p>
              <div className={styles.tierDivider} />
              <ul className={styles.tierFeatures}>
                {tier.features.map((f) => (
                  <li key={f} className={styles.tierFeature}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className={styles.formSection}>
          <p className={styles.formLabel}>Inquiry</p>
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="Your name" className={styles.nameInput}
                disabled={isSubmitting} required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="your@email.com" className={styles.input}
                disabled={isSubmitting} required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="service" className={styles.label}>Service</label>
              <select
                id="service" name="service"
                value={formData.service} onChange={handleChange}
                className={styles.select} disabled={isSubmitting} required
              >
                <option value="">Select a service...</option>
                <option value="Mixing">Mixing</option>
                <option value="Mastering">Mastering</option>
                <option value="Mixing & Mastering">Mixing & Mastering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange}
                placeholder="Tell me about your project, timeline, and any specific requirements..."
                className={styles.textarea} disabled={isSubmitting} required rows={5}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send inquiry"}
            </button>
          </form>

          <div className={styles.messageContainer}>
            {showSuccess && (
              <div className={styles.successMessage}>
                Received — I'll be in touch soon.
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
