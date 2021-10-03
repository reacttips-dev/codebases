export const ORIGINAL = { title: "None", id: "none" };

export const defaultEnterPayload = {
  motion: "enter",
  loop: false,
  delay: 0,
  easing: "easeOutQuart",
  direction: "normal",
  start_time: 0,
  trans_duration: 1000,
  end_time: 1000,
};

const defaultExitPayload = {
  motion: "exit",
  trans_duration: 1000,
  delay: 0,
  easing: "easeOutQuart",
  direction: "normal",
  start_time: 5000,
  end_time: 6000,
};

export const STILL_EFFECT = {
  type: "still",
  motion: "still",
  ...defaultEnterPayload,
  trans_duration: 5000,
  start_time: 1000,
  end_time: 6000,
};

// Breathe animation
const BREATHE_IN = {
  title: "Breathe",
  type: "breathe",
  ...defaultEnterPayload,
  trans_duration: 4000,
  start_time: 0,
  end_time: 4000,
};

// Fly effect
const FLY_IN_LEFT = {
  title: "Left",
  type: "fly_in_left",
  ...defaultEnterPayload,
};

const FLY_IN_RIGHT = {
  title: "Right",
  type: "fly_in_right",
  ...defaultEnterPayload,
};

const FLY_IN_TOP = {
  title: "Top",
  type: "fly_in_top",
  ...defaultEnterPayload,
};

const FLY_IN_BOTTOM = {
  title: "Bottom",
  type: "fly_in_bottom",
  ...defaultEnterPayload,
};

const FLY_IN = {
  title: "Fly In",
  id: "fly",
  variants: [FLY_IN_LEFT, FLY_IN_RIGHT, FLY_IN_TOP, FLY_IN_BOTTOM],
};

const FLY_OUT_LEFT = {
  title: "Left",
  type: "fly_out_left",
  ...defaultExitPayload,
};
const FLY_OUT_RIGHT = {
  title: "Right",
  type: "fly_out_right",
  ...defaultExitPayload,
};

const FLY_OUT_TOP = {
  title: "top",
  type: "fly_out_top",
  ...defaultExitPayload,
};

const FLY_OUT_BOTTOM = {
  title: "Bottom",
  type: "fly_out_bottom",
  ...defaultExitPayload,
};

const FLY_OUT = {
  title: "Fly Out",
  id: "fly",
  variants: [FLY_OUT_LEFT, FLY_OUT_RIGHT, FLY_OUT_TOP, FLY_OUT_BOTTOM],
};

// Shift effect
const SHIFT_LEFT = {
  title: "Left",
  type: "shift_left",
  ...defaultEnterPayload,
};

const SHIFT_RIGHT = {
  title: "Right",
  type: "shift_right",
  ...defaultEnterPayload,
};

const SHIFT_TOP = {
  title: "Top",
  type: "shift_top",
  ...defaultEnterPayload,
};

const SHIFT_BOTTOM = {
  title: "Bottom",
  type: "shift_bottom",
  ...defaultEnterPayload,
};

const SHIFT = {
  title: "SHIFT",
  id: "shift",
  variants: [SHIFT_LEFT, SHIFT_RIGHT, SHIFT_TOP, SHIFT_BOTTOM],
};

// Fade effect.
const FADE_OUT = {
  title: "Fade Out",
  id: "fade_out",

  variants: [
    {
      title: "Fade out",
      type: "fade_out",
      ...defaultEnterPayload,
    },
  ],
};

const FADE_IN = {
  title: "Fade In",
  id: "fade",

  variants: [
    {
      title: "Fade in",
      type: "fade_in",
      ...defaultEnterPayload,
      easing: "linear",
    },
  ],
};

// Wipe effect
const WIPE_IN_LEFT = {
  title: "Left",
  type: "wipe_in_left",
  ...defaultEnterPayload,
};

const WIPE_IN_RIGHT = {
  title: "Right",
  type: "wipe_in_right",
  ...defaultEnterPayload,
};

const WIPE_IN_TOP = {
  title: "Top",
  type: "wipe_in_top",
  ...defaultEnterPayload,
};

const WIPE_IN_BOTTOM = {
  title: "Bottom",
  type: "wipe_in_bottom",
  ...defaultEnterPayload,
};

const WIPE_IN = {
  title: "Wipe In",
  id: "wipe",
  variants: [WIPE_IN_LEFT, WIPE_IN_RIGHT, WIPE_IN_TOP, WIPE_IN_BOTTOM],
};

const WIPE_OUT_LEFT = {
  title: "Left",
  type: "wipe_out_left",
  ...defaultExitPayload,
};
const WIPE_OUT_RIGHT = {
  title: "Right",
  type: "wipe_out_right",
  ...defaultExitPayload,
};

const WIPE_OUT_TOP = {
  title: "top",
  type: "wipe_out_top",
  ...defaultExitPayload,
};

const WIPE_OUT_BOTTOM = {
  title: "Bottom",
  type: "wipe_out_bottom",
  ...defaultExitPayload,
};

const WIPE_OUT = {
  title: "Wipe Out",
  id: "wipe",
  variants: [WIPE_OUT_LEFT, WIPE_OUT_RIGHT, WIPE_OUT_TOP, WIPE_OUT_BOTTOM],
};

//Zoom effect

const ZOOM_IN = {
  title: "Zoom In",
  type: "zoom_in",
  ...defaultEnterPayload,
};

// const ZOOM_IN_BOUNCE = {
//   title: "Bounce",
//   type: "zoom_in_bounce",
//   ...defaultEnterPayload,
//   easing: 'easeOutBounce',
// };

// const ZOOM_IN = {
//   title: "Zoom In",
//   id: "zoom",
//   variants: [ZOOM, ZOOM_IN_BOUNCE],
// };

const ZOOM_OUT_EFFECT = {
  title: "Zoom Out",
  type: "zoom_out",
  ...defaultExitPayload,
};

// const ZOOM_OUT_BOUNCE = {
//   title: "Bounce",
//   type: "zoom_out_bounce",
//   ...defaultExitPayload,
// };

// const ZOOM_OUT = {
//   title: "Zoom Out",
//   id: "zoom",
//   variants: [ZOOM_OUT_EFFECT, ZOOM_OUT_BOUNCE],
// };

// Reveal Effect
const REVEAL_IN_LEFT = {
  title: "Left",
  type: "reveal_in_left",
  ...defaultEnterPayload,
};

const REVEAL_IN_RIGHT = {
  title: "Right",
  type: "reveal_in_right",
  ...defaultEnterPayload,
};

const REVEAL_IN_TOP = {
  title: "Top",
  type: "reveal_in_top",
  ...defaultEnterPayload,
};

const REVEAL_IN_BOTTOM = {
  title: "Bottom",
  type: "reveal_in_bottom",
  ...defaultEnterPayload,
};

const REVEAL_IN = {
  title: "Reveal In",
  id: "reveal",
  variants: [REVEAL_IN_LEFT, REVEAL_IN_RIGHT, REVEAL_IN_TOP, REVEAL_IN_BOTTOM],
};

const REVEAL_OUT_LEFT = {
  title: "Left",
  type: "reveal_out_left",
  ...defaultExitPayload,
};
const REVEAL_OUT_RIGHT = {
  title: "Right",
  type: "reveal_out_right",
  ...defaultExitPayload,
};

const REVEAL_OUT_TOP = {
  title: "top",
  type: "reveal_out_top",
  ...defaultExitPayload,
};

const REVEAL_OUT_BOTTOM = {
  title: "Bottom",
  type: "reveal_out_bottom",
  ...defaultExitPayload,
};

const REVEAL_OUT = {
  title: "Reveal",
  id: "reveal",
  variants: [
    REVEAL_OUT_LEFT,
    REVEAL_OUT_RIGHT,
    REVEAL_OUT_TOP,
    REVEAL_OUT_BOTTOM,
  ],
};

// Ficker effect
const FLICKER = {
  title: "Flicker",
  id: "flicker",
  variants: [
    {
      title: "Flicker",
      type: "flicker",
      ...defaultEnterPayload,
    },
  ],
};

// Pulse effect
const PULSE = {
  title: "Pulse",
  id: "pulse",
  variants: [
    {
      title: "Pulse",
      type: "pulse",
      ...defaultEnterPayload,
    },
  ],
};

// Disco effect
const DISCO = {
  title: "Disco",
  id: "disco",
  variants: [
    {
      title: "Disco",
      type: "disco",
      ...defaultEnterPayload,
    },
  ],
};

// Glitch effect
const GLITCH = {
  title: "Glitch",
  id: "glitch",
  variants: [
    {
      title: "glitch",
      type: "glitch",
      ...defaultEnterPayload,
    },
  ],
};

// Stomp effect
const STOMP = {
  title: "Stomp",
  id: "stomp",
  variants: [
    {
      title: "stomp",
      type: "stomp",
      ...defaultEnterPayload,
      start_time: 0,
      trans_duration: 500,
      end_time: 500,
    },
  ],
};

const BLOCK_REVEAL_IN_LEFT = {
  title: "Left",
  type: "block_in_left",
  ...defaultEnterPayload,
};

const BLOCK_REVEAL_IN_RIGHT = {
  title: "Right",
  type: "block_in_right",
  ...defaultEnterPayload,
};

const BLOCK_REVEAL_IN_TOP = {
  title: "Top",
  type: "block_in_top",
  ...defaultEnterPayload,
};

const BLOCK_REVEAL_IN_BOTTOM = {
  title: "Bottom",
  type: "block_in_bottom",
  ...defaultEnterPayload,
};

const BLOCK_REVEAL_IN = {
  title: "Block Reveal In",
  id: "block",
  variants: [
    BLOCK_REVEAL_IN_LEFT,
    BLOCK_REVEAL_IN_RIGHT,
    BLOCK_REVEAL_IN_TOP,
    BLOCK_REVEAL_IN_BOTTOM,
  ],
};

const BLOCK_REVEAL_OUT_LEFT = {
  title: "Left",
  type: "block_out_left",
  ...defaultExitPayload,
};
const BLOCK_REVEAL_OUT_RIGHT = {
  title: "Right",
  type: "block_out_right",
  ...defaultExitPayload,
};

const BLOCK_REVEAL_OUT_TOP = {
  title: "top",
  type: "block_out_top",
  ...defaultExitPayload,
};

const BLOCK_REVEAL_OUT_BOTTOM = {
  title: "Bottom",
  type: "block_out_bottom",
  ...defaultExitPayload,
};

const BLOCK_REVEAL_OUT = {
  title: "Block Reveal",
  id: "block",
  variants: [
    BLOCK_REVEAL_OUT_LEFT,
    BLOCK_REVEAL_OUT_RIGHT,
    BLOCK_REVEAL_OUT_TOP,
    BLOCK_REVEAL_OUT_BOTTOM,
  ],
};

export const enterEffects = [
  ORIGINAL,
  FLY_IN,
  FADE_IN,
  WIPE_IN,
  ZOOM_IN,
  REVEAL_IN,
  BLOCK_REVEAL_IN,
  SHIFT,
  FLICKER,
  PULSE,
  GLITCH,
  DISCO,
  STOMP,
];

export const exitEffects = [
  ORIGINAL,
  FLY_OUT,
  FADE_OUT,
  WIPE_OUT,
  // ZOOM_OUT,
  REVEAL_OUT,
  BLOCK_REVEAL_OUT,
];

// Presets
// const FLY_IN_BOUNCE = {
//   title: "Top",
//   type: "fly_in_top",
//   ...defaultEnterPayload,
// };

// const BOUNCE_PRESET = {
//   title: "Bounce",
//   id: "bounce",

//   sequence: [
//     {
//       ...FLY_IN_TOP,
//       easing: "easeOutBounce",
//     },
//     STILL_EFFECT,
//   ],
// };

const FADE_PRESET = {
  title: "Fade",
  id: "fade",
  video: "https://assets.simplified.co/videos/presets/fade4.mp4",
  sequence: [FADE_IN["variants"][0], STILL_EFFECT],
};

const ZOOM_PRESET = {
  title: "Zoom",
  id: "zoom",
  video: "https://assets.simplified.co/videos/presets/zoom4.mp4",
  sequence: [ZOOM_IN, STILL_EFFECT],
};

const TEXT_BLOCK_PRESET = {
  title: "Text Block",
  id: "text_block",
  video: "https://assets.simplified.co/videos/presets/text_block4.mp4",
  sequence: [BLOCK_REVEAL_IN_LEFT, STILL_EFFECT],
};

const TEXT_POP_PRESET = {
  title: "Text Pop",
  id: "textPop",
  video: "https://assets.simplified.co/videos/presets/text_pop4.mp4",
  sequence: [ZOOM_IN, STILL_EFFECT],
};

const TEXT_BASELINE_PRESET = {
  title: "Text Baseline",
  id: "textBaseline",
  video: "https://assets.simplified.co/videos/presets/text_baseline4.mp4",
  sequence: [REVEAL_IN_BOTTOM, STILL_EFFECT],
};

const POP_PRESET = {
  title: "Pop",
  id: "pop",
  video: "https://assets.simplified.co/videos/presets/pop4.mp4",
  sequence: [ZOOM_IN, STILL_EFFECT],
};

const BASELINE_PRESET = {
  title: "Baseline",
  id: "baseline",
  video: "https://assets.simplified.co/videos/presets/baseline4.mp4",
  sequence: [REVEAL_IN_BOTTOM, STILL_EFFECT],
};

const NEON_FLICKER_PRESET = {
  title: "Neon Flicker",
  id: "neon",
  video: "https://assets.simplified.co/videos/presets/neon_flicker4.mp4",
  sequence: [FLICKER["variants"][0], STILL_EFFECT],
};

const DASH_PRESET = {
  title: "Dash",
  id: "dash",
  video: "https://assets.simplified.co/videos/presets/dash4.mp4",
  sequence: [FLY_IN_LEFT, STILL_EFFECT],
};

const LOCOMOTION_PRESET = {
  title: "Locomotion",
  id: "locomotion",
  video: "https://assets.simplified.co/videos/presets/locomotion4.mp4",
  sequence: [FLY_IN_LEFT, STILL_EFFECT],
};

const RISE_PRESET = {
  title: "Rise",
  id: "rise",
  video: "https://assets.simplified.co/videos/presets/rise4.mp4",
  sequence: [SHIFT_BOTTOM, STILL_EFFECT],
};

const PAN_PRESET = {
  title: "Pan",
  id: "pan",
  video: "https://assets.simplified.co/videos/presets/pan4.mp4",
  sequence: [SHIFT_LEFT, STILL_EFFECT],
};

const BREATHE_PRESET = {
  title: "Breathe",
  id: "breathe_preset",
  video: "https://assets.simplified.co/videos/presets/breathe4.mp4",
  sequence: [BREATHE_IN, STILL_EFFECT],
};

// export const presets = [ORIGINAL, BOUNCE_PRESET, FADE_PRESET, RISE_NOW, BUMPY, BLOCK_PRESET, POP_PRESET];
export const presets = [
  ORIGINAL,
  POP_PRESET,
  BASELINE_PRESET,
  DASH_PRESET,
  FADE_PRESET,
  ZOOM_PRESET,
  LOCOMOTION_PRESET,
  NEON_FLICKER_PRESET,
  RISE_PRESET,
  PAN_PRESET,
  BREATHE_PRESET,
  TEXT_BLOCK_PRESET,
  TEXT_POP_PRESET,
  TEXT_BASELINE_PRESET,
];
