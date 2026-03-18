import React from "react";
import styles from "./CommissionsPortfolio2.module.css";

// ─── Track data ───────────────────────────────────────────────────────────────
// Drop cover art in /public/audio/commissions/covers/ and reference below.
// - artist: null    →  renders as "Private client"
// - coverArt: null  →  renders a placeholder
const TRACKS = [
  {
    id: 1,
    title: "ZEDD - Inside Out (Remix)",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track1.png",
  },
  {
    id: 2,
    title: "Be Myself",
    artist: "Konac & Cenji",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track2.png",
  },
  {
    id: 3,
    title: "Home",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track3.jpg",
  },
  {
    id: 4,
    title: "Peppermint Lips (feat. Slyleaf)",
    artist: "Krizin",
    service: "Mastering",
    coverArt: "/audio/commissions/covers/track4.jpg",
  },
  {
    id: 5,
    title: "Won't Let Go (feat. juu)",
    artist: "Konac",
    service: "Production, Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track5.jpg",
  },
];

export const CommissionsPortfolio2 = () => {
  return (
    <div className={styles.section}>
      <p className={styles.label}>Selected work</p>

      <div className={styles.grid}>
        {TRACKS.map((track) => (
          <div key={track.id} className={styles.card}>
            <div className={styles.artwork}>
              {track.coverArt ? (
                <img src={track.coverArt} alt={`${track.title} cover`} className={styles.artworkImg} />
              ) : (
                <div className={styles.artworkPlaceholder} />
              )}
            </div>

            <div className={styles.info}>
              <span className={styles.title}>{track.title}</span>
              <div className={styles.meta}>
                <span className={styles.artist}>
                  {track.artist ?? <span className={styles.privateArtist}>Private client</span>}
                </span>
                <span className={styles.dot}>·</span>
                <span className={styles.serviceTag}>{track.service}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
