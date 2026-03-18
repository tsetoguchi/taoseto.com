import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./CommissionsPortfolio.module.css";

// ─── Track data ───────────────────────────────────────────────────────────────
// Drop audio files in /public/audio/commissions/ and cover art in
// /public/audio/commissions/covers/ then reference them below.
// - artist: null       →  renders as "Private client"
// - coverArt: null     →  renders a placeholder square
// - beforeAudioSrc: omit or set null for finished-only tracks
const TRACKS = [
  {
    id: 1,
    title: "Track Title",
    artist: "Artist Name",
    service: "Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track1.jpg",
    audioSrc: "/audio/commissions/track1.mp3",
    beforeAudioSrc: "/audio/commissions/track1-before.mp3",
  },
  {
    id: 2,
    title: "Track Title",
    artist: "Artist Name",
    service: "Mixing",
    coverArt: "/audio/commissions/covers/track2.jpg",
    audioSrc: "/audio/commissions/track2.mp3",
    beforeAudioSrc: null,
  },
  {
    id: 3,
    title: "Track Title",
    artist: null,
    service: "Mastering",
    coverArt: null,
    audioSrc: "/audio/commissions/track3.mp3",
    beforeAudioSrc: null,
  },
  {
    id: 4,
    title: "Track Title",
    artist: "Artist Name",
    service: "Mixing & Mastering",
    coverArt: "/audio/commissions/covers/track4.jpg",
    audioSrc: "/audio/commissions/track4.mp3",
    beforeAudioSrc: "/audio/commissions/track4-before.mp3",
  },
  {
    id: 5,
    title: "Track Title",
    artist: null,
    service: "Mixing",
    coverArt: null,
    audioSrc: "/audio/commissions/track5.mp3",
    beforeAudioSrc: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const CommissionsPortfolio = () => {
  const [activeId, setActiveId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("after"); // "after" | "before"
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const activeTrack = TRACKS.find((t) => t.id === activeId) ?? null;

  // Resolve the src for the current mode
  const resolvedSrc = activeTrack
    ? mode === "before" && activeTrack.beforeAudioSrc
      ? activeTrack.beforeAudioSrc
      : activeTrack.audioSrc
    : null;

  // Load new src whenever it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!resolvedSrc) {
      audio.pause();
      return;
    }
    audio.src = resolvedSrc;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [resolvedSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowClick = (track) => {
    if (activeId === track.id) {
      // Toggle play/pause on same track
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      // Switch to new track
      setActiveId(track.id);
      setMode("after");
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    }
  };

  const handleModeSwitch = (e, newMode) => {
    e.stopPropagation();
    if (newMode === mode) return;
    const prevTime = audioRef.current?.currentTime ?? 0;
    setMode(newMode);
    // Restore position after src swap (handled in next effect)
    pendingSeekRef.current = prevTime;
  };

  const pendingSeekRef = useRef(null);

  const handleLoaded = () => {
    const audio = audioRef.current;
    setDuration(audio.duration);
    if (pendingSeekRef.current !== null) {
      audio.currentTime = Math.min(pendingSeekRef.current, audio.duration);
      pendingSeekRef.current = null;
    }
    if (isPlaying) audio.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = useCallback((e) => {
    e.stopPropagation();
    const bar = progressRef.current;
    if (!bar || !audioRef.current) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  }, [duration]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.section}>
      <p className={styles.label}>Selected work</p>

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoaded}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className={styles.trackList}>
        {TRACKS.map((track, index) => {
          const isActive = activeId === track.id;
          return (
            <div
              key={track.id}
              className={[styles.row, isActive ? styles.active : ""].join(" ")}
              onClick={() => handleRowClick(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleRowClick(track)}
            >
              {/* Left: cover art + meta */}
              <div className={styles.meta}>
                <div className={[styles.cover, isActive ? styles.coverActive : ""].join(" ")}>
                  {track.coverArt ? (
                    <img src={track.coverArt} alt={`${track.title} cover`} className={styles.coverImg} />
                  ) : (
                    <div className={styles.coverPlaceholder} />
                  )}
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.title}>{track.title}</span>
                  <span className={styles.artist}>
                    {track.artist ?? (
                      <span className={styles.privateArtist}>Private client</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Right: service tag + controls */}
              <div className={styles.right}>
                <span className={styles.serviceTag}>{track.service}</span>

                {isActive ? (
                  <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
                    {/* Before/After toggle */}
                    {track.beforeAudioSrc && (
                      <div className={styles.toggle}>
                        <button
                          className={[styles.toggleBtn, mode === "before" ? styles.toggleActive : ""].join(" ")}
                          onClick={(e) => handleModeSwitch(e, "before")}
                        >
                          Before
                        </button>
                        <button
                          className={[styles.toggleBtn, mode === "after" ? styles.toggleActive : ""].join(" ")}
                          onClick={(e) => handleModeSwitch(e, "after")}
                        >
                          After
                        </button>
                      </div>
                    )}

                    {/* Time */}
                    <span className={styles.time}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Scrubber */}
                    <div
                      className={styles.scrubber}
                      ref={progressRef}
                      onClick={handleProgressClick}
                    >
                      <div className={styles.scrubberFill} style={{ width: `${progress}%` }} />
                    </div>

                    {/* Play/Pause */}
                    <button className={styles.playBtn} onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                      {isPlaying ? (
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                          <rect x="0" y="0" width="3" height="12" />
                          <rect x="7" y="0" width="3" height="12" />
                        </svg>
                      ) : (
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                          <polygon points="0,0 10,6 0,12" />
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className={styles.playHint}>
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor">
                      <polygon points="0,0 8,5 0,10" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
