/* eslint-disable react/prop-types -- the site doesn't use prop-types; the one
   caller passes the SERVICES list. */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./ServiceCards.module.css";

const renderIncludes = (items) => (
  <ul className={styles.includes}>
    {items.map((item) => (
      <li key={item} className={styles.includeItem}>
        <FontAwesomeIcon icon={faCheck} className={styles.check} aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

// Native radios keep one choice enforced and let the arrow keys move between
// cards. The button sits outside the <label>: a label may not hold a second
// interactive control.
const renderCard = (service, index, props) => {
  const isSelected = props.selectedId === service.id;
  return (
    <div
      key={service.id}
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      // Pointer convenience only; keyboard users select through the radio.
      onClick={() => !props.isDisabled && props.onSelect(service.id)}
    >
      <label className={styles.choice}>
        <input
          type="radio"
          name="service"
          /* The first radio is what an unanswered "select a service" error
             focuses. */
          id={index === 0 ? "service" : undefined}
          value={service.id}
          checked={isSelected}
          onChange={() => props.onSelect(service.id)}
          disabled={props.isDisabled}
          className={styles.radio}
        />
        {/* Selection fills the ring, a shape change and not only colour. */}
        <span className={styles.marker} aria-hidden="true" />
        <span className={styles.name}>{service.name}</span>
      </label>
      {renderIncludes(service.includes)}
      <button
        type="button"
        className={styles.chooseButton}
        onClick={() => props.onChoose(service.id)}
        disabled={props.isDisabled}
      >
        Choose {service.name}
      </button>
    </div>
  );
};

export const ServiceCards = (props) => (
  <div className={styles.cards}>
    {props.services.map((service, index) => renderCard(service, index, props))}
  </div>
);
