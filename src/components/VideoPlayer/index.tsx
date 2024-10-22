import videoJs from 'video.js';
import { useRef, useEffect } from 'react';

type VideoPlayerType = {
  src: string,
  poster: string
}

const VideoPlayer = ({ src, poster }: VideoPlayerType) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoNode: any = videoRef.current;
    const player = videoJs(videoNode, {
      // 配置options  
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return <video ref={videoRef} className="video-js" src={src} poster={poster} />;
};

export default VideoPlayer;