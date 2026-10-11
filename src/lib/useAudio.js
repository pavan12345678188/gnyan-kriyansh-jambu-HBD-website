import { useCallback, useEffect, useRef, useState } from "react";

export function useAudio(src = "/audio/birthday_song_chinni.mp3", volume = 0.4) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wanted, setWanted] = useState(true);
  const [available, setAvailable] = useState(true);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume;

      audio.addEventListener("error", () => {
        setAvailable(false);
        setPlaying(false);
      });

      audioRef.current = audio;
    }

    return audioRef.current;
  }, [src, volume]);

  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (audio, target, duration, onComplete) => {
      stopFade();

      const initialVolume = audio.volume;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min(
          (now - startTime) / duration,
          1
        );

        audio.volume =
          initialVolume + (target - initialVolume) * progress;

        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(animate);
        } else {
          fadeRef.current = null;
          onComplete?.();
        }
      };

      fadeRef.current = requestAnimationFrame(animate);
    },
    [stopFade]
  );

  const play = useCallback(async () => {
    try {
      const audio = getAudio();

      audio.volume = 0;
      await audio.play();

      setAvailable(true);
      setPlaying(true);

      fadeVolume(audio, volume, 1800);
    } catch (error) {
      console.error("Birthday music playback failed:", error);
      setAvailable(false);
      setPlaying(false);
    }
  }, [getAudio, fadeVolume, volume]);

  const enter = useCallback(() => {
    setStarted(true);

    if (wanted) {
      play();
    }
  }, [wanted, play]);

  const toggle = useCallback(() => {
    if (!started) {
      setWanted((previous) => !previous);
      return;
    }

    const audio = audioRef.current;

    if (audio && !audio.paused) {
      fadeVolume(audio, 0, 500, () => {
        audio.pause();
        setPlaying(false);
      });
    } else {
      play();
    }
  }, [started, fadeVolume, play]);

  useEffect(() => {
    return () => {
      stopFade();

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopFade]);

  return {
    on: started ? playing : wanted,
    available,
    toggle,
    enter,
  };
}