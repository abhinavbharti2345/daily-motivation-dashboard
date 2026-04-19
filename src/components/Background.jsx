import { useEffect, useRef } from "react";
import bgVideo from "../assets/Video.mp4";

const Background = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleVisibility = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        className="fixed inset-0 h-full w-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="fixed inset-0 -z-10 backdrop-blur-[1px]" />
    </div>
  );
};

export default Background;
