import { useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Commissions.module.css";
import { getApiEndpoint } from "../../config";
import { CommissionsPortfolio2 as CommissionsPortfolio } from "./CommissionsPortfolio2";

// `id` is the value submitted to the backend, so it stays stable even when the
// display name changes.
const SERVICES = [
  {
    id: "Mixing",
    name: "Mixing",
    summary:
      "Balance, processing and stereo staging on a finished arrangement. You get the mixdown plus the instrumental and stems, and five rounds of revisions.",
  },
  {
    id: "Mastering",
    name: "Mastering",
    summary: "Final loudness, tone and format for release. Three rounds.",
  },
  {
    id: "Mixing & Mastering",
    name: "Mixing & Mastering",
    summary: "Both, with the mastering included and priority turnaround.",
  },
  {
    id: "Other",
    name: "Something else",
    summary: "Anything else in the production chain:",
    items: [
      "Beat & track production",
      "Pre-production arrangement",
      "Post-production editing & cleanup",
    ],
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Service sits left of the form, so it leads the focus order.
const FIELD_ORDER = ["service", "name", "email", "message"];
const SERVICES_SECTION_ID = "services";

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

  // Focus moves without the browser's own scroll: for the service group that
  // targets a 1px hidden radio and lands wherever the browser picks. The
  // service band scrolls to its top instead, and a text field to mid-screen.
  const focusFirstInvalidField = (errors) => {
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    const field = firstInvalid && document.getElementById(firstInvalid);
    if (!field) return;
    field.focus({ preventScroll: true });
    if (firstInvalid === "service") {
      document.getElementById(SERVICES_SECTION_ID)?.scrollIntoView({ block: "start" });
      return;
    }
    field.scrollIntoView({ block: "center" });
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
        <title>Commissions</title>
        <meta name="description" content="Mixing, mastering, and music technology services by Tao Seto. Radio-ready mixdowns, commercial-grade masters, and priority turnaround." />
        <meta property="og:title" content="Commissions" />
        <meta property="og:url" content="https://taoseto.com/commissions" />
      </Helmet>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageHeading}>Commissions</h1>
      </header>

      {/* Full-bleed bands in the same rhythm as Projects and Experience: a
          heading column on the left, the content on the right. */}
      <div className={styles.bands}>
        <section
          className={`${styles.band} ${styles.bandCentered}`}
          aria-labelledby="work-heading"
        >
          <div className={styles.bandIntro}>
            <h2 id="work-heading" className={styles.bandTitle}>Selected work</h2>
            <p className={styles.bandText}>
              Recent releases I produced, mixed or mastered.
            </p>
            {/* A link rather than a button: it moves to a place on the page, and
                the global smooth scroll (off under reduced motion) animates it. */}
            <a href={`#${SERVICES_SECTION_ID}`} className={styles.bandCta}>
              Start a commission
            </a>
          </div>
          <CommissionsPortfolio />
        </section>

        <section
          id={SERVICES_SECTION_ID}
          className={`${styles.band} ${styles.bandMirrored} ${styles.scrollTarget}`}
          aria-labelledby="services-heading"
        >
          {/* The step number is decorative: reading order already carries the
              sequence, and "01 What you need" reads badly as a group label. */}
          <div className={styles.bandIntro}>
            <span className={styles.stepNumber} aria-hidden="true">01</span>
            <h2 id="services-heading" className={styles.bandTitle}>
              What you need
              <span className={styles.requiredMark} aria-hidden="true"> *</span>
            </h2>
            <p className={styles.bandText}>Pick the service closest to your project.</p>
          </div>

          {/* A grid item cannot be a <legend>, so the heading names the group. */}
          <fieldset
            className={styles.servicesSection}
            aria-labelledby="services-heading"
            aria-describedby={fieldErrors.service ? "service-error" : undefined}
          >
            <div className={styles.serviceList}>
              {SERVICES.map((service, index) => (
                <label
                  key={service.id}
                  className={[
                    styles.serviceOption,
                    formData.service === service.id ? styles.selected : "",
                  ].join(" ")}
                >
                  {/* Native radios so one choice is enforced and the arrow keys
                      move between options without a roving tabindex. */}
                  <input
                    type="radio"
                    name="service"
                    /* The group's first control is what an unanswered "select a
                       service" error focuses. */
                    id={index === 0 ? "service" : undefined}
                    value={service.id}
                    checked={formData.service === service.id}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={styles.serviceRadio}
                  />
                  {/* Selection shows as a filled ring — a shape change, not only
                      a colour change, so it survives colour-blindness. */}
                  <span className={styles.serviceMarker} aria-hidden="true" />
                  <span className={styles.serviceBody}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceSummary}>{service.summary}</span>
                    {service.items && (
                      <span className={styles.serviceItems}>
                        {service.items.map((item) => (
                          <span key={item} className={styles.serviceItem}>{item}</span>
                        ))}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {fieldErrors.service && (
              <p id="service-error" className={styles.fieldError}>{fieldErrors.service}</p>
            )}
          </fieldset>
        </section>

        <section className={styles.band} aria-labelledby="details-heading">
          <div className={styles.bandIntro}>
            <span className={styles.stepNumber} aria-hidden="true">02</span>
            <h2 id="details-heading" className={styles.bandTitle}>Your details</h2>
            <p className={styles.bandText}>
              Tell me about the project and I’ll reply by email.
            </p>
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name<span className={styles.requiredMark} aria-hidden="true"> *</span>
                </label>
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
                <label htmlFor="email" className={styles.label}>
                  Email<span className={styles.requiredMark} aria-hidden="true"> *</span>
                </label>
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
                <label htmlFor="message" className={styles.label}>
                  Message<span className={styles.requiredMark} aria-hidden="true"> *</span>
                </label>
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
        </section>
      </div>
    </section>
  );
};
