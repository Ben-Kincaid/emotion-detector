import React, { useRef } from "react";
import "./FAImage.scss";
import { detectAllFaces, draw, createCanvasFromMedia } from "face-api.js";
interface FAImageProps {
  alt?: string;
  src?: string;
}

function FAImage(props: FAImageProps) {
  const { alt, src } = props;

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleImageLoad = async (
    evt: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const image = imageRef.current as HTMLImageElement;

    const canvas = createCanvasFromMedia(image);
    const container = containerRef.current as HTMLDivElement;

    container.appendChild(canvas);

    const fullFaceDescriptions = await detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
    draw.drawDetections(canvas, fullFaceDescriptions);
  };

  return (
    <div className="fa-image" ref={containerRef}>
      {/* <canvas
        width={imageRef.current ? imageRef.current.width : 0}
        height={imageRef.current ? imageRef.current.height : 0}
        ref={canvasRef}
      /> */}
      <img src={src} onLoad={handleImageLoad} alt={alt} ref={imageRef} />
    </div>
  );
}

export default FAImage;
