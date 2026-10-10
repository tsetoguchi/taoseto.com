/* eslint-disable react/prop-types -- the site doesn't use prop-types; the one
   caller passes a TRACKS entry. */
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./TrackModal.module.css";
import { useAudioPlayer, useVolumeControl } from "./useAudioPlayer";

const SECONDS_PER_MINUTE = 60;
// "any" lets the thumb sit at the exact playhead; a fixed step snaps it.
const SMOOTH_STEP = "any";
const VOLUME_STEP = 0.01;
const VOLUME_LOW_THRESHOLD = 0.5;
const HEADING_ID = "track-modal-title";

const formatTime = (seconds) => {
  const whole = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  const minutes = Math.floor(whole / SECONDS_PER_MINUTE);
  const rest = String(whole % SECONDS_PER_MINUTE).padStart(2, "0");
  return `${minutes}:${rest}`;
};

const pickVolumeIcon = (level, isMuted) => {
  if (isMuted || level === 0) return faVolumeXmark;
  return level < VOLUME_LOW_THRESHOLD ? faVolumeLow : faVolumeHigh;
};

// Native ranges give keyboard control (arrows, Home, End) for free; --fill
// paints the played or set part of the track.
const renderSeek = (player) => (
  <div className={styles.seekRow}>
    <input
      type="range"
      className={styles.range}
      min={0}
      max={player.duration || 0}
      step={SMOOTH_STEP}
      value={player.currentTime}
      onChange={(e) => player.seek(Number(e.target.value))}
      aria-label="Seek"
      aria-valuetext={formatTime(player.currentTime)}
      style={{ "--fill": player.duration ? player.currentTime / player.duration : 0 }}
    />
    <div className={styles.times}>
      <span>{formatTime(player.currentTime)}</span>
      <span>{formatTime(player.duration)}</span>
    </div>
  </div>
);

const renderVolume = (volumeControl) => {
  const level = volumeControl.isMuted ? 0 : volumeControl.volume;
  return (
    <div className={styles.volume}>
      <button
        type="button"
        className={styles.muteButton}
        onClick={volumeControl.toggleMute}
        aria-label={volumeControl.isMuted ? "Unmute" : "Mute"}
      >
        <FontAwesomeIcon icon={pickVolumeIcon(volumeControl.volume, volumeControl.isMuted)} />
      </button>
      <input
        type="range"
        className={`${styles.range} ${styles.fader}`}
        min={0}
        max={1}
        step={VOLUME_STEP}
        value={level}
        onChange={(e) => volumeControl.setVolume(Number(e.target.value))}
        aria-label="Volume"
        aria-valuetext={`${Math.round(level * 100)}%`}
        style={{ "--fill": level }}
      />
    </div>
  );
};

const renderPlayer = (track, player, volumeControl) => (
  <div className={styles.player}>
    {renderSeek(player)}
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.playButton}
        onClick={player.toggle}
        aria-label={`${player.isPlaying ? "Pause" : "Play"} ${track.title}`}
      >
        <FontAwesomeIcon icon={player.isPlaying ? faPause : faPlay} />
      </button>
      {renderVolume(volumeControl)}
    </div>
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
  const isPressOnBackdropRef = useRef(false);
  const player = useAudioPlayer(track.preview, { shouldAutoplay: true });
  const volumeControl = useVolumeControl(player.audioRef);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Close only when the press also began on the backdrop: dragging a fader
  // and letting go outside the panel fires a click on the dialog too.
  const handlePointerDown = (e) => {
    isPressOnBackdropRef.current = e.target === dialogRef.current;
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current && isPressOnBackdropRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={HEADING_ID}
      onClose={onClose}
      onPointerDown={handlePointerDown}
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
        {track.coverArt ? (
          <img src={track.coverArt} alt="" className={styles.cover} />
        ) : (
          <div className={`${styles.cover} ${styles.coverPlaceholder}`} />
        )}
        <div className={styles.body}>
          {renderDetails(track, artistLabel)}
          {renderPlayer(track, player, volumeControl)}
        </div>
      </div>
    </dialog>
  );
};
