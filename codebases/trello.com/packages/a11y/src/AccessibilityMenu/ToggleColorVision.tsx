/* eslint-disable jsx-a11y/no-onchange */
// Based on https://developers.google.com/web/updates/2020/11/cvd
// Based on https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/css/vision_deficiency.cc;l=41;drc=25c9d397f8ece542feaf21ad680b71f161edf47b

import { Checkbox } from '@trello/nachos/checkbox';
import { useSharedState } from '@trello/shared-state';
import React, { useCallback } from 'react';
import uuid from 'uuid/v4';
import { a11yMenuState } from './a11yMenuState';

import styles from './AccessibilityMenu.less';

enum VisionMode {
  Achromatopsia = 'Achromatopsia',
  BlurredVision = 'Blurred Vision',
  Deuteranopia = 'Deuteranopia',
  Protanopia = 'Protanopia',
  Tritanopia = 'Tritanopia',
}

const filters: Map<string, string> = new Map([
  [
    VisionMode.Achromatopsia,
    `<feColorMatrix values="
        0.213  0.715  0.072  0.000  0.000
        0.213  0.715  0.072  0.000  0.000
        0.213  0.715  0.072  0.000  0.000
        0.000  0.000  0.000  1.000  0.000
      " />`,
  ],
  [VisionMode.BlurredVision, '<feGaussianBlur stdDeviation="2" />'],
  [
    VisionMode.Deuteranopia,
    `<feColorMatrix values="
        0.367  0.861 -0.228  0.000  0.000
        0.280  0.673  0.047  0.000  0.000
        -0.012  0.043  0.969  0.000  0.000
        0.000  0.000  0.000  1.000  0.000
      " />`,
  ],
  [
    VisionMode.Protanopia,
    `<feColorMatrix values="
        0.152  1.053 -0.205  0.000  0.000
        0.115  0.786  0.099  0.000  0.000
        -0.004 -0.048  1.052  0.000  0.000
        0.000  0.000  0.000  1.000  0.000
      " />`,
  ],
  [
    VisionMode.Tritanopia,
    `<feColorMatrix values="
        1.256 -0.077 -0.179  0.000  0.000
        -0.078  0.931  0.148  0.000  0.000
        0.005  0.691  0.304  0.000  0.000
        0.000  0.000  0.000  1.000  0.000
      " />`,
  ],
]);

// TODO: (option 1) move to shared state so it can be used with the gear menu collapsed
// TODO: (option 2) migrate to a toolbar like tota11y

export const ToggleColorVision: React.FunctionComponent = () => {
  const [
    {
      colorVisionMode,
      isColorVisionEnabled,
      isTota11yInstalled,
      isTota11yEnabled,
    },
    setA11yMenuState,
  ] = useSharedState(a11yMenuState);

  const onChangeCheckbox: React.ChangeEventHandler<HTMLInputElement> = useCallback(() => {
    setA11yMenuState({
      colorVisionMode,
      isColorVisionEnabled: !isColorVisionEnabled,
      isTota11yInstalled,
      isTota11yEnabled,
    });
  }, [
    setA11yMenuState,
    colorVisionMode,
    isColorVisionEnabled,
    isTota11yInstalled,
    isTota11yEnabled,
  ]);

  const onChangeSelect = useCallback(
    ({ target: { value } }) =>
      setA11yMenuState({
        colorVisionMode: value,
        isColorVisionEnabled,
        isTota11yInstalled,
        isTota11yEnabled,
      }),
    [
      setA11yMenuState,
      isColorVisionEnabled,
      isTota11yInstalled,
      isTota11yEnabled,
    ],
  );

  const id = uuid();

  return (
    <>
      <label htmlFor={id} className={styles.colorVisionLabel}>
        Color vision emulation
      </label>
      <div className={styles.colorVisionOptions}>
        <Checkbox
          className={styles.checkbox}
          isChecked={isColorVisionEnabled}
          onChange={onChangeCheckbox}
          id={id}
        />

        <select
          disabled={!isColorVisionEnabled}
          className={styles.select}
          aria-label="Color vision emulation options"
          onChange={onChangeSelect}
          defaultValue={colorVisionMode}
        >
          <option disabled value="">
            Select an emulation
          </option>
          {[...filters.keys()].map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export const ColorVisionOptions: React.FunctionComponent = () => {
  const [{ colorVisionMode, isColorVisionEnabled }] = useSharedState(
    a11yMenuState,
  );

  // Trimming whitespace for rendering everything into a single line in the CSS rule block
  const svgFilter = filters.get(colorVisionMode)?.replace(/(\n|^\s|\s$)/g, '');

  const id = uuid();

  return isColorVisionEnabled && svgFilter ? (
    <style>
      {`#trello-root {
      filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="${id}">${svgFilter}</filter></svg>#${id}');
    }`}
    </style>
  ) : null;
};
