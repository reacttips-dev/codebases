import React, { useEffect, useRef, useMemo } from 'react';
import times from 'lodash/times';

const scaleMin = 0.4;
const scaleMax = 1;
const maxAnimationDurationInSeconds = 3;
const framesPerSecond = 60;
const maxAnimationDurationInFrames = maxAnimationDurationInSeconds * framesPerSecond;
const maxSparkleCount = 500;

export const randomBetween = (min, max) => Math.random() * (max - min) + min;

export const randomChoose = (choice1, choice2) => (Math.round(Math.random()) ? choice1 : choice2);

export const transition = (start, end, progress) => start + (end - start) * progress;

export const clip = (number) => Math.max(0, Math.min(number, 1));

export const setMatrix = (x, y, scale, rotate, context) => {
  const xAx = Math.cos(rotate) * scale;
  const xAy = Math.sin(rotate) * scale;
  context.setTransform(xAx, xAy, -xAy, xAx, x, y);
};

const generateRandomSparkleProps = () => {
  const scaleStart = randomBetween(scaleMin, scaleMax);
  const xPercent = randomBetween(0, 1);
  const yStartPercent = randomBetween(0, 0.8);
  const yDistancePercent = randomBetween(0.5, 1) + scaleStart;
  const size = 16;
  const animationDurationInFrames = randomBetween(maxAnimationDurationInFrames * 0.6, maxAnimationDurationInFrames);

  return {
    xPercent,
    yStartPercent,
    yDistancePercent,
    size,
    scaleStart,
    scaleEnd: 0,
    rotateStart: randomBetween(0, size * 0.2),
    rotateEnd: randomBetween(size * 0.4, size * 0.8),
    rotateDirection: randomChoose(-1, 1),
    hue: randomBetween(0, 360),
    animationDurationInFrames,
  };
};

const generateSparkles = (count) => times(count, generateRandomSparkleProps);

const sparkleCountToFillArea = (canvasWidth, canvasHeight) => {
  const sparkleCountDivisor = 4000;
  const containerArea = canvasWidth * canvasHeight;
  return Math.min(Math.round(containerArea / sparkleCountDivisor), maxSparkleCount);
};

const setCanvasSize = (canvasRef) => {
  const { width, height } = canvasRef.current.getBoundingClientRect();

  canvasRef.current.width = width;
  canvasRef.current.height = height;

  return [width, height];
};

export default function FullScreenSparkles({ onAnimationComplete }) {
  const canvasRef = useRef();
  const frame = useRef(0);
  const sparkleData = useMemo(() => generateSparkles(maxSparkleCount), []);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    const [canvasWidth, canvasHeight] = setCanvasSize(canvasRef);
    const sparkleCount = sparkleCountToFillArea(canvasWidth, canvasHeight);
    let requestAnimationFrameID;

    const drawFrame = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < sparkleCount; i += 1) {
        const {
          xPercent,
          yStartPercent,
          yDistancePercent,
          size,
          scaleStart,
          scaleEnd,
          rotateStart,
          rotateEnd,
          rotateDirection,
          hue,
          animationDurationInFrames,
        } = sparkleData[i];

        context.save();

        const progress = clip(frame.current / animationDurationInFrames);
        const opacityProgress = clip(frame.current / (maxAnimationDurationInFrames * 0.05));

        const opacity = transition(0, 1, opacityProgress);
        context.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;

        const xPixel = xPercent * canvasWidth;
        const yStartPixel = yStartPercent * canvasHeight;
        const yDistanceMultiplier = canvasHeight / 4;
        const yEndPixel = yStartPixel + yDistancePercent * yDistanceMultiplier;

        setMatrix(
          xPixel,
          transition(yStartPixel, yEndPixel, progress),
          transition(scaleStart, scaleEnd, progress),
          transition(rotateDirection * rotateStart, rotateDirection * rotateEnd, progress),
          context,
        );

        const strokeWidth = 1.5;
        const centerOffset = size / 2 - strokeWidth / 2;

        context.fillRect(-centerOffset, 0, size, strokeWidth);
        context.fillRect(0, -centerOffset, strokeWidth, size);

        context.restore();
      }

      if (frame.current < maxAnimationDurationInFrames) {
        frame.current += 1;
        requestAnimationFrameID = window.requestAnimationFrame(drawFrame);
      } else {
        onAnimationComplete();
      }
    };

    drawFrame();

    return () => window.cancelAnimationFrame(requestAnimationFrameID);
  }, [onAnimationComplete, sparkleData]);

  return (
    <div className="full-screen-sparkle-effect">
      <canvas ref={canvasRef} />
    </div>
  );
}
