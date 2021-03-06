import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  detectSingleFace,
  matchDimensions,
  resizeResults,
  FaceExpressions
} from "face-api.js";

//@ts-ignore
import Stats from "stats.js";
import "./FAWebcam.scss";

const stats = new Stats();
if (process.env.NODE_ENV === "development") {
  document.body.appendChild(stats.dom);
}
interface FAWebcamProps {
  alt?: string;
  src?: string;
  expression: string;
  onExpressionChange: Function;
}

function FAWebcam(props: FAWebcamProps) {
  const { onExpressionChange } = props;
  const [expressions, setExpressions] = useState<FaceExpressions | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onPlay = async () => {
    const videoEl = videoRef.current as HTMLVideoElement;
    if (videoEl.paused || videoEl.ended) {
      return setTimeout(() => onPlay());
    }

    const result = await detectSingleFace(videoEl)
      .withFaceLandmarks()
      .withFaceExpressions();

    if (result) {
      if (process.env.NODE_ENV === "development") stats.begin();
      const canvas = canvasRef.current as HTMLCanvasElement;
      canvas.width = 600;
      canvas.height = 600;
      const dims = matchDimensions(canvas, { width: 600, height: 600 }, true);

      // cant get this to work with Array<Point[]> - seems to expect another Point as point.y?
      const draw = (positionsObject: any) => {
        const context = canvas.getContext("2d");
        if (!context) return;
        context.beginPath();
        for (var i = 0; i < positionsObject.length; i++) {
          const positionSet = positionsObject[i];
          for (var i2 = 0; i2 < positionSet.length; i2++) {
            const prev = positionSet[i2 - 1];
            const curr = positionSet[i2];
            const next = positionSet[i2 + 1]
              ? positionSet[i2 + 1]
              : { x: positionSet[0].x, y: positionSet[1] };

            if (!prev) {
              context.moveTo(positionSet[0].x, positionSet[0].y);
            } else {
              context.moveTo(prev.x, prev.y);
            }
            if (i === 0) {
              var c = (curr.x + next.x) / 2;
              var d = (curr.y + next.y) / 2;
              context.quadraticCurveTo(curr.x, curr.y, c, d);
            } else {
              context.lineTo(curr.x, curr.y);
            }
            context.lineWidth = i === 0 ? 3 : 2;

            context.strokeStyle = i !== 0 ? "#dc5353" : "#9e0000";

            context.lineCap = "round";
          }
        }
        context.stroke();
      };

      const landmarks = resizeResults(result, dims).landmarks;
      draw([
        landmarks.getJawOutline(),
        landmarks.getNose(),
        landmarks.getMouth(),
        landmarks.getLeftEye(),
        landmarks.getRightEye(),
        landmarks.getLeftEyeBrow(),
        landmarks.getRightEyeBrow()
      ]);

      setExpressions(result.expressions);
      if (process.env.NODE_ENV === "development") stats.end();
    }
    requestAnimationFrame(onPlay);
  };

  useEffect(() => {
    const run = async () => {
      const videoEl = videoRef.current as HTMLVideoElement;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" }
      });
      videoEl.srcObject = stream;
      videoEl.play();
    };
    if (videoRef) {
      run();
    }
  }, [videoRef]);

  const callExpressionChange = useCallback(
    (expressions: any) => {
      onExpressionChange(expressions);
    },
    [onExpressionChange]
  );

  useEffect(() => {
    callExpressionChange(expressions);
  }, [expressions, callExpressionChange]);

  return (
    <div className="fa-webcam">
      <video
        onLoadedMetadata={onPlay}
        ref={videoRef}
        muted={true}
        playsInline={true}
      />
      <canvas id="overlay" height={600} width={600} ref={canvasRef} />
    </div>
  );
}

export default FAWebcam;
