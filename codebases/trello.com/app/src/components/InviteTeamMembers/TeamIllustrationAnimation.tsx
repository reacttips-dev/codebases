import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './TeamIllustrationAnimation.less';

const EmptyBoard = require('resources/images/organization/empty-board.svg');
const GreenFace = require('resources/images/organization/green-face.svg');
const BlueFace = require('resources/images/organization/blue-face.svg');
const PurpleFace = require('resources/images/organization/purple-face.svg');
const RedFace = require('resources/images/organization/red-face.svg');
const WavyBorder = require('resources/images/create-team/wavy-border.svg');

interface TeamIllustrationAnimationProps {
  animationStep: number;
}

export const preloadData = () => {
  new Image().src = EmptyBoard;
  new Image().src = GreenFace;
  new Image().src = BlueFace;
  new Image().src = PurpleFace;
  new Image().src = RedFace;
  new Image().src = WavyBorder;
};

export const TeamIllustrationAnimation: React.FunctionComponent<TeamIllustrationAnimationProps> = ({
  animationStep,
}) => {
  const [wiggle, setWiggle] = useState(false);
  useEffect(() => {
    if (animationStep > 4) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 2000);
    }
  }, [animationStep]);

  return (
    <div className={styles.illustrationWrapper}>
      <img
        width={342}
        height={256}
        src={EmptyBoard}
        alt=""
        role="presentation"
      />
      <img
        className={
          animationStep > 0
            ? classNames(styles.greenFaceVisible, {
                [styles.greenFaceWiggle]: wiggle,
              })
            : styles.greenFaceHidden
        }
        src={GreenFace}
        alt=""
        role="presentation"
      />
      <img
        className={
          animationStep > 1
            ? classNames(styles.redFaceVisible, {
                [styles.redFaceWiggle]: wiggle,
              })
            : styles.redFaceHidden
        }
        src={RedFace}
        alt=""
        role="presentation"
      />
      <img
        className={
          animationStep > 2
            ? classNames(styles.blueFaceVisible, {
                [styles.blueFaceWiggle]: wiggle,
              })
            : styles.blueFaceHidden
        }
        src={BlueFace}
        alt=""
        role="presentation"
      />
      <img
        className={
          animationStep > 3
            ? classNames(styles.purpleFaceVisible, {
                [styles.purpleFaceWiggle]: wiggle,
              })
            : styles.purpleFaceHidden
        }
        src={PurpleFace}
        alt=""
        role="presentation"
      />
    </div>
  );
};
