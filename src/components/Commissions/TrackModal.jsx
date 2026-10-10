/* eslint-disable react/prop-types -- the site doesn't use prop-types; the one
   caller passes a TRACKS entry. */
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./TrackModal.module.css";
import { useAudioPlayer } from "./useAudioPlayer";

const SECONDS_PER_MINUTE = 60;
const SEEK_STEP_SECONDS = 0.1;
const HEADING_ID = "track-modal-title";

const formatTime = (seconds) => {
  const whole = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  const minutes = Math.floor(whole / SECONDS_PER_MINUTE);
  const rest = String(whole % SECONDS_PER_MINUTE).padStart(2, "0");
  return `${minutes}:${rest}`;
};

const renderPlayer = (track, player) => (
  <div className={styles.player}>
    <button
      type="button"
      className={styles.playButton}
      onClick={player.toggle}
      aria-label={`${player.isPlaying ? "Pause" : "Play"} ${track.title}`}
    >
      <FontAwesomeIcon icon={player.isPlaying ? faPause : faPlay} />
    </button>
    {/* A native range gives keyboard seeking (arrows, Home, End) for free. */}
    <input
      type="range"
      className={styles.seek}
      min={0}
      max={player.duration || 0}
      step={SEEK_STEP_SECONDS}
      value={player.currentTime}
      onChange={(e) => player.seek(Number(e.target.value))}
      aria-label="Seek"
      aria-valuetext={formatTime(player.currentTime)}
      style={{ "--fill": player.duration ? player.currentTime / player.duration : 0 }}
    />
    <span className={styles.time}>
      {formatTime(player.currentTime)} / {formatTime(player.duration)}
    </span>
  </div>
);

const renderDetails = (track, artistLabel) => (
  <div className={styles.details}>
    <p className={styles.artist}>{artistLabel}</p>
    <h2 id={HEADING_ID} className={styles.title}>{track.title}</h2>
    <dl className={styles.role}>
      <dt className={styles.roleLabel}>Role</dt>
      <dd className={styles.roleValue}>{track.service}</dd>
    </dl>
  </div>
);

// Mounted only while a track is open: mounting opens the dialog and starts
// playback, unmounting stops it. A native <dialog> traps focus, closes on
// Escape and hands focus back to the cover that opened it.
export const TrackModal = ({ track, artistLabel, onClose }) => {
  const dialogRef = useRef(null);
  const player = useAudioPlayer(track.preview, { shouldAutoplay: true });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // A click whose target is the dialog itself landed on the backdrop.
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) dialogRef.current.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={HEADING_ID}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => dialogRef.current.close()}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <img src={track.coverArt} alt="" className={styles.cover} />
        <div className={styles.body}>
          {renderDetails(track, artistLabel)}
          {renderPlayer(track, player)}
        </div>
      </div>
    </dialog>
  );
};
