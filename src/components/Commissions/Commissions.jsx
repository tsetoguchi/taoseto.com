import { useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Commissions.module.css";
import { getApiEndpoint } from "../../config";
import { CommissionsPortfolio2 as CommissionsPortfolio } from "./CommissionsPortfolio2";

const TIERS = [
  {
    id: "Mixing",
    name: "Mixing",
    price: "",
    featured: false,
    features: [
      "Radio ready mixdown",
      "Instrumental + Stems",
      "5 rounds of revisions",
    ],
  },
  {
    id: "Mastering",
    name: "Mastering",
    price: "",
    featured: false,
    features: [
      "Platform-ready master",
      "Commercial grade loudness",
      "3 rounds of revisions",
    ],
  },
  {
    id: "Mixing & Mastering",
    name: "Mixing & Mastering",
    price: "",
    featured: true,
    badge: "Full service",
    features: [
      "All mixing services",
      "All mastering services free of charge",
      "Priority turnaround",
    ],
  },
  {
    id: "Other",
    name: "Other",
    price: "",
    featured: false,
    features: [
      "Beat & track production",
      "Pre-production arrangement",
      "Post-production editing & cleanup",
    ],
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER = ["name", "email", "service", "message"];

export const Commissions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearFieldError(name);
  };

  const handleTierSelect = (tierId) => {
    setFormData({ ...formData, service: tierId });
    clearFieldError("service");
  };

  // Errors clear as the field is corrected rather than on a timer.
  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const collectFieldErrors = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Please enter your name.";
    if (!formData.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.service) errors.service = "Please select a service.";
    if (!formData.message.trim()) errors.message = "Please describe your project.";
    return errors;
  };

  const focusFirstInvalidField = (errors) => {
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) document.getElementById(firstInvalid)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = collectFieldErrors();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorMessage("");
      focusFirstInvalidField(errors);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
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
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      setErrorMessage(
        error.message || "There was an error sending your message. Please try again."
      );
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

      <CommissionsPortfolio />

      <div className={styles.layout}>

        {/* Tiers */}
        <div className={styles.tiersSection}>
          <p className={styles.tiersLabel}>You're looking for</p>
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              aria-pressed={formData.service === tier.id}
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
            </button>
          ))}
        </div>

        {/* Form */}
        <div className={styles.formSection}>
          <p className={styles.formLabel}>Inquiry</p>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text" id="name" name="name"
                autoComplete="name"
                value={formData.name} onChange={handleChange}
                placeholder="Your name" className={styles.nameInput}
                disabled={isSubmitting} required
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className={styles.fieldError}>{fieldErrors.name}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email" id="email" name="email"
                autoComplete="email"
                value={formData.email} onChange={handleChange}
                placeholder="your@email.com" className={styles.input}
                disabled={isSubmitting} required
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className={styles.fieldError}>{fieldErrors.email}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="service" className={styles.label}>Service</label>
              <select
                id="service" name="service"
                value={formData.service} onChange={handleChange}
                className={styles.select} disabled={isSubmitting} required
                aria-invalid={!!fieldErrors.service}
                aria-describedby={fieldErrors.service ? "service-error" : undefined}
              >
                <option value="">Select a service...</option>
                <option value="Mixing">Mixing</option>
                <option value="Mastering">Mastering</option>
                <option value="Mixing & Mastering">Mixing & Mastering</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.service && (
                <p id="service-error" className={styles.fieldError}>{fieldErrors.service}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange}
                placeholder="Tell me about your project, timeline, and any specific requirements..."
                className={styles.textarea} disabled={isSubmitting} required rows={5}
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "message-error" : undefined}
              />
              {fieldErrors.message && (
                <p id="message-error" className={styles.fieldError}>{fieldErrors.message}</p>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send inquiry"}
            </button>
          </form>

          {/* Live region is always mounted so screen readers announce the
              message when it appears, not just the container. */}
          <div className={styles.messageContainer} role="status" aria-live="polite">
            {showSuccess && (
              <div className={styles.successMessage}>
                Thank you for your inquiry.
              </div>
            )}
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
