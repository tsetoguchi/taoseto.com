import { useCallback, useEffect, useRef, useState } from "react";

const FULL_VOLUME = 1;

// Shared across players for the visit, so reopening a track keeps the level
// the listener last set instead of jumping back to full.
let sessionVolume = FULL_VOLUME;

const attachListeners = (audio, listeners) => {
  Object.entries(listeners).forEach(([event, handler]) =>
    audio.addEventListener(event, handler)
  );
  return () =>
    Object.entries(listeners).forEach(([event, handler]) =>
      audio.removeEventListener(event, handler)
    );
};

// Pausing alone leaves the request running; it holds Chrome's cache entry and
// the next player for the same file fails to load (seen under StrictMode's
// mount-unmount-mount). Dropping the source aborts it.
const releaseAudio = (audio) => {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
};

// `timeupdate` fires only about four times a second, which steps the seek bar
// visibly. While playing, read the clock once per frame instead.
const useFrameClock = (audioRef, isPlaying, setCurrentTime) => {
  useEffect(() => {
    if (!isPlaying) return undefined;
    let frameId;
    const tick = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [audioRef, isPlaying, setCurrentTime]);
};

// Owns one <audio> for `src`, created on mount and stopped on unmount, so
// closing whatever holds the player always silences it.
export const useAudioPlayer = (src, { shouldAutoplay = false } = {}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = sessionVolume;
    // Play state follows the element's own events, so media keys and the OS
    // pausing playback keep the controls in step. `timeupdate` still syncs
    // the clock when paused, after a seek, and at the end.
    const detach = attachListeners(audio, {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
    });
    audioRef.current = audio;
    // The opening click still counts as a user gesture here; if the browser
    // refuses anyway, the play button is right there.
    if (shouldAutoplay) audio.play().catch(() => setIsPlaying(false));
    return () => {
      detach();
      releaseAudio(audio);
      audioRef.current = null;
    };
  }, [src, shouldAutoplay]);

  useFrameClock(audioRef, isPlaying, setCurrentTime);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  return { audioRef, isPlaying, currentTime, duration, toggle, seek };
};

// Level and mute for a player from useAudioPlayer.
export const useVolumeControl = (audioRef) => {
  const [volume, setVolumeState] = useState(sessionVolume);
  const [isMuted, setIsMuted] = useState(false);

  // Moving the fader also unmutes, as on any mixer channel.
  const setVolume = useCallback(
    (level) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = level;
      audio.muted = false;
      sessionVolume = level;
      setVolumeState(level);
      setIsMuted(false);
    },
    [audioRef]
  );

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, [audioRef]);

  return { volume, isMuted, setVolume, toggleMute };
};
