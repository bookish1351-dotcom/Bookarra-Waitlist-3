import { useState, useEffect } from 'react';

export function useTypewriter(
  text: string,
  speed: number = 38,
  startDelay: number = 600
) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;
    let currentIndex = 0;

    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayed(text.slice(0, currentIndex));
        } else {
          setDone(true);
          window.clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
