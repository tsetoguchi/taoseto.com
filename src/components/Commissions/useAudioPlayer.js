import { useCallback, useEffect, useRef, useState } from "react";

// Owns one <audio> for `src`, created on mount and stopped on unmount, so
// closing whatever holds the player always silences it.
export const useAudioPlayer = (src, { shouldAutoplay = false } = {}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(src);
    // Play state follows the element's own events, so media keys and the OS
    // pausing playback keep the controls in step.
    const listeners = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
    };
    Object.entries(listeners).forEach(([event, handler]) =>
      audio.addEventListener(event, handler)
    );
    audioRef.current = audio;
    // The opening click still counts as a user gesture here; if the browser
    // refuses anyway, the play button is right there.
    if (shouldAutoplay) audio.play().catch(() => setIsPlaying(false));
    return () => {
      Object.entries(listeners).forEach(([event, handler]) =>
        audio.removeEventListener(event, handler)
      );
      audio.pause();
      // Dropping the source aborts the in-flight request; left running, it
      // holds Chrome's cache entry and the next player for the same file
      // fails to load (seen under StrictMode's mount-unmount-mount).
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [src, shouldAutoplay]);

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

  return { isPlaying, currentTime, duration, toggle, seek };
};
