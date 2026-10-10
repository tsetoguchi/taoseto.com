import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import styles from "./CommissionsPortfolio2.module.css";
import { TrackModal } from "./TrackModal";

// ─── Track data ───────────────────────────────────────────────────────────────
// Drop cover art in /public/audio/commissions/covers/ and preview clips in
// /public/audio/commissions/clips/, then reference them below.
// - artist: null    →  renders as "Private client"
// - coverArt: null  →  renders a placeholder
// - preview: null   →  the cover doesn't open the player
// Every track points at the stand-in clip until the real previews are cut.
const PLACEHOLDER_PREVIEW = "/audio/commissions/clips/placeholder.wav";
const PRIVATE_ARTIST_LABEL = "Private client";

const TRACKS = [
  {
    id: 1,
    title: "ZEDD - Inside Out (Remix)",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track1.png",
    preview: PLACEHOLDER_PREVIEW,
  },
  {
    id: 2,
    title: "Be Myself",
    artist: "Konac & Cenji",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track2.png",
    preview: PLACEHOLDER_PREVIEW,
  },
  {
    id: 3,
    title: "Home",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track3.jpg",
    preview: PLACEHOLDER_PREVIEW,
  },
  {
    id: 4,
    title: "Peppermint Lips (feat. Slyleaf)",
    artist: "Krizin",
    service: "Mastering",
    coverArt: "/audio/commissions/covers/track4.jpg",
    preview: PLACEHOLDER_PREVIEW,
  },
  {
    id: 5,
    title: "Won't Let Go (feat. juu)",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track5.jpg",
    preview: PLACEHOLDER_PREVIEW,
  },
];

const renderCoverImage = (src) =>
  src ? (
    // Empty alt: the title beside it already names the release.
    <img src={src} alt="" className={styles.artworkImg} />
  ) : (
    <div className={styles.artworkPlaceholder} />
  );

// Hidden from assistive tech: the credit under the cover already says this.
const renderCaption = (track) => (
  <span className={styles.caption} aria-hidden="true">
    <span className={styles.captionArtist}>{track.artist ?? PRIVATE_ARTIST_LABEL}</span>
    <span className={styles.captionTitle}>{track.title}</span>
  </span>
);

const renderStaticCover = (track) => (
  <div className={`${styles.artwork} ${styles.hoverable}`}>
    {renderCoverImage(track.coverArt)}
    {renderCaption(track)}
  </div>
);

const renderPlayableCover = (track, onOpen) => (
  <button
    type="button"
    className={`${styles.artwork} ${styles.hoverable} ${styles.playable}`}
    onClick={() => onOpen(track)}
    aria-haspopup="dialog"
    aria-label={`Listen to ${track.title}`}
  >
    {renderCoverImage(track.coverArt)}
    <span className={styles.playOverlay} aria-hidden="true">
      <span className={styles.playIcon}>
        <FontAwesomeIcon icon={faPlay} />
      </span>
    </span>
    {renderCaption(track)}
  </button>
);

const renderTrackInfo = (track) => (
  <div className={styles.info}>
    <span className={styles.title}>{track.title}</span>
    <span className={styles.meta}>
      {track.artist ?? <span className={styles.privateArtist}>{PRIVATE_ARTIST_LABEL}</span>}
    </span>
    <span className={styles.meta}>{track.service}</span>
  </div>
);

export const CommissionsPortfolio2 = () => {
  const [openTrack, setOpenTrack] = useState(null);
  return (
    <>
      <ul className={styles.list}>
        {TRACKS.map((track) => (
          <li key={track.id} className={styles.track}>
            {track.preview
              ? renderPlayableCover(track, setOpenTrack)
              : renderStaticCover(track)}
            {renderTrackInfo(track)}
          </li>
        ))}
      </ul>
      {/* Keyed so switching tracks remounts the modal with a fresh player. */}
      {openTrack && (
        <TrackModal
          key={openTrack.id}
          track={openTrack}
          artistLabel={openTrack.artist ?? PRIVATE_ARTIST_LABEL}
          onClose={() => setOpenTrack(null)}
        />
      )}
    </>
  );
};
