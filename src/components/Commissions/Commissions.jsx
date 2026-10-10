import { useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Commissions.module.css";
import { getApiEndpoint } from "../../config";
import { CommissionsPortfolio2 as CommissionsPortfolio } from "./CommissionsPortfolio2";
import { ServiceCards } from "./ServiceCards";

const PAGE_TITLE = "Commissions · tao seto";
const PAGE_URL = "https://taoseto.com/commissions";
const PAGE_DESCRIPTION =
  "Mixing, mastering, and music technology commissions from Tao Seto. Radio-ready mixdowns, commercial-grade masters, and priority turnaround.";

// ~74M as of Oct 2026: 59M TikTok views, 5.6M Spotify streams and ~9.1M
// YouTube views across uploads. Rounded down so the claim stays defensible.
const TAGLINE = "Producer & engineer behind 70M+ collective views and streams";

const SUBMIT_FAILURE_MESSAGE =
  "Your inquiry couldn't be sent. Please try again, or email commissions@taoseto.com.";
// The backend's messages for these statuses are written for visitors; anything
// else (a 5xx, a network drop) would only leak internals.
const STATUSES_WITH_VISITOR_COPY = [400, 429];

const describeSubmitFailure = (status, serverMessage) =>
  STATUSES_WITH_VISITOR_COPY.includes(status) && serverMessage
    ? serverMessage
    : SUBMIT_FAILURE_MESSAGE;

// `id` is the value submitted to the backend, so it stays stable even when the
// display name changes.
const SERVICES = [
  {
    id: "Mixing",
    name: "Mixing",
    includes: [
      "Balance, processing & stereo staging",
      "Mixdown, instrumental & stems",
      "5 rounds of revisions",
    ],
  },
  {
    id: "Mastering",
    name: "Mastering",
    includes: ["Final loudness, tone & format for release", "3 rounds of revisions"],
  },
  {
    id: "Mixing & Mastering",
    name: "Mixing & Mastering",
    includes: ["Everything in Mixing", "Mastering included", "Priority turnaround"],
  },
  {
    id: "Other",
    name: "Something else",
    includes: [
      "Beat & track production",
      "Pre-production arrangement",
      "Post-production editing & cleanup",
    ],
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Service is the first step above the form, so it leads the focus order.
const FIELD_ORDER = ["service", "name", "email", "message"];
const SERVICES_SECTION_ID = "services";
const CREDITS_SECTION_ID = "credits";
const DETAILS_SECTION_ID = "details";

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

  const selectService = (serviceId) => {
    setFormData((prev) => ({ ...prev, service: serviceId }));
    clearFieldError("service");
  };

  // "Choose" is the shortcut past the cards: pick, then go straight to the
  // first field that still needs typing.
  const chooseService = (serviceId) => {
    selectService(serviceId);
    document.getElementById(DETAILS_SECTION_ID)?.scrollIntoView({ block: "start" });
    document.getElementById("name")?.focus({ preventScroll: true });
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
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", service: "", message: "" });
        return;
      }
      setErrorMessage(describeSubmitFailure(response.status, data.error));
    } catch {
      setErrorMessage(SUBMIT_FAILURE_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
      {/* Each band takes its own shape (centred hero, wide credits, centred
          card row, split form) on one shared rhythm of padding and width. */}
      <div className={styles.bands}>
        <section
          className={`${styles.band} ${styles.bandCentered}`}
          aria-labelledby="page-heading"
        >
          <div className={styles.bandIntro}>
            <h1 id="page-heading" className={styles.pageHeading}>Commissions</h1>
            <p className={styles.tagline}>{TAGLINE}</p>
          </div>
          {/* Links rather than buttons: they move to a place on the page, and
              the global smooth scroll (off under reduced motion) animates it. */}
          <div className={styles.heroActions}>
            <a href={`#${SERVICES_SECTION_ID}`} className={styles.bandCta}>
              Start a commission
            </a>
            <a href={`#${CREDITS_SECTION_ID}`} className={styles.bandCtaSecondary}>
              Listen
            </a>
          </div>
        </section>

        {/* Left-aligned to the grid's own edge, so the heading labels the
            covers rather than joining the centred title above. */}
        <section
          id={CREDITS_SECTION_ID}
          className={`${styles.band} ${styles.bandCentered} ${styles.scrollTarget}`}
          aria-labelledby="credits-heading"
        >
          <div className={styles.credits}>
            <h2 id="credits-heading" className={styles.bandTitle}>Credits</h2>
            <CommissionsPortfolio />
          </div>
        </section>

        <section
          id={SERVICES_SECTION_ID}
          className={`${styles.band} ${styles.bandCentered} ${styles.scrollTarget}`}
          aria-labelledby="services-heading"
        >
          <div className={styles.bandIntro}>
            <h2 id="services-heading" className={styles.bandTitle}>
              Services
              <span className={styles.requiredMark} aria-hidden="true"> *</span>
            </h2>
            <p className={styles.bandText}>Pick the one closest to your project.</p>
          </div>

          <fieldset
            className={styles.servicesSection}
            aria-labelledby="services-heading"
            aria-describedby={fieldErrors.service ? "service-error" : undefined}
          >
            <ServiceCards
              services={SERVICES}
              selectedId={formData.service}
              onSelect={selectService}
              onChoose={chooseService}
              isDisabled={isSubmitting}
            />
            {fieldErrors.service && (
              <p id="service-error" className={styles.fieldError}>{fieldErrors.service}</p>
            )}
          </fieldset>
        </section>

        <section
          id={DETAILS_SECTION_ID}
          className={`${styles.band} ${styles.scrollTarget}`}
          aria-labelledby="details-heading"
        >
          <div className={styles.bandIntro}>
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
