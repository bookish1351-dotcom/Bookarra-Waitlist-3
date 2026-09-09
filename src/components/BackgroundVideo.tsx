import { useEffect, useRef, useState } from 'react';

const DEFAULT_VIDEO_URL =
  'https://videotourl.com/videos/1788742577065-92f143cf-40d8-42eb-aa68-cd1f160aad30.mp4';
const FALLBACK_VIDEO_URL = '/Background.mp4';
const SENSITIVITY = 0.8;

export function BackgroundVideo({ videoSrc = DEFAULT_VIDEO_URL }: { videoSrc?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState<string>(videoSrc);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video doesn't autoplay and is paused
    video.pause();

    const handleLoadedMetadata = () => {
      targetTimeRef.current = video.currentTime;
      video.pause();
    };

    const handleSeeked = () => {
      const vid = videoRef.current;
      if (!vid || !vid.duration || isNaN(vid.duration)) {
        isSeekingRef.current = false;
        return;
      }

      // Check if targetTime has moved while seeking, queue next seek if needed
      if (Math.abs(vid.currentTime - targetTimeRef.current) > 0.01) {
        vid.currentTime = targetTimeRef.current;
      } else {
        isSeekingRef.current = false;
      }
    };

    const updateScrub = (currentX: number) => {
      const vid = videoRef.current;
      if (!vid || !vid.duration || isNaN(vid.duration)) return;

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * vid.duration;
      let newTargetTime = targetTimeRef.current + timeOffset;
      newTargetTime = Math.max(0, Math.min(vid.duration, newTargetTime));
      targetTimeRef.current = newTargetTime;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        vid.currentTime = newTargetTime;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateScrub(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updateScrub(e.touches[0].clientX);
      }
    };

    const handleResetX = () => {
      prevXRef.current = null;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleResetX);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleResetX);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleResetX);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleResetX);
    };
  }, []);

  return (
    <video
      id="bg-video"
      ref={videoRef}
      src={activeSrc}
      muted
      playsInline
      preload="auto"
      className="w-full h-full pointer-events-none"
      onError={() => {
        if (activeSrc !== FALLBACK_VIDEO_URL) {
          setActiveSrc(FALLBACK_VIDEO_URL);
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        objectFit: 'cover',
        objectPosition: '70% center',
      }}
    />
  );
}
