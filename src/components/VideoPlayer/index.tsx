import React, { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';

const VideoPlayer = ({ src, poster, videoNode, id, autoPlay, preload }: { src: string, poster: string, videoNode: any, id: string, autoPlay: boolean, preload: string }) => {
  // const videoNode = useRef<any>(null);
  let hls: Hls;
  const setupVideoPlayer = () => {
    if (Hls.isSupported() && src.includes('m3u8')) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoNode.current);
      // hls.on(Hls.Events.MANIFEST_PARSED, () => {
      //   videoNode.current.play();
      // });
    } else if (videoNode.current.canPlayType('application/vnd.apple.mpegURL')) {
      videoNode.current.src = src;
      videoNode.current.load();
    } else {
      videoNode.current.src = src;
    }
  };

  useEffect(() => {
    if (videoNode && src) {
      setupVideoPlayer();
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoNode, src]);

  return (
    <video
      loop
      src={src.includes('m3u8') ? '' : src}
      ref={videoNode}
      className="video"
      preload={preload}
      width="100%"
      style={{ objectFit: 'cover' }}
      poster={poster}
      id={id}
      autoPlay={autoPlay}
    />
  );
};

export default VideoPlayer;