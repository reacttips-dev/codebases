export const ORIGINAL = { title: "None", id: "none" };

const defaultSlideTransition = {
  motion: "still",
  trans_duration: 1000,
  delay: 0,
  easing: "easeInOutCubic",
  direction: "normal",
  start_time: 0,
  end_time: 1000,
};

const defaultEnterPayload = {
  motion: "enter",
  loop: false,
  autoplay: true,
  trans_duration: 1000,
  delay: 0,
  easing: "easeOutQuart",
  direction: "normal",
  start_time: 0,
  end_time: 1000,
};

const defaultExitPayload = {
  motion: "exit",
  loop: false,
  autoplay: true,
  trans_duration: 1000,
  delay: 0,
  easing: "easeInOutCubic",
  direction: "normal",
  start_time: 5000,
  end_time: 6000,
};

export const STILL_ANIMATION = {
  title: "Still",
  id: "still",
  variants: [
    {
      title: "Still",
      enter: {
        type: "still",
        motion: "still",
        ...defaultEnterPayload,
        trans_duration: 5000,
        start_time: 1000,
        end_time: 6000,
      },
    },
  ],
};

const defaultExitPagePayload = {
  duration: 500,
  easing: "easeInQuad",
  direction: "normal",
};

export const slideTransitions = [
  ORIGINAL,
  {
    title: "Dissolve",
    id: "dissolve",
    video: "https://assets.simplified.co/videos/transitions/dissolve.mp4",
    variants: [
      {
        enter: {
          type: "dissolve",
          ...defaultSlideTransition,
        },
        exit: {
          type: "dissolve",
          ...defaultExitPagePayload,
        },
      },
    ],
  },
  // {
  //   title: "Wipe",
  //   id: "wipe",
  //   video:
  //     "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.mp4",
  //   image:
  //     "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.png",

  //   variants: [
  //     {
  //       title: "Top",
  //       enter: {
  //         type: "wipe_in_top",
  //         ...defaultSlideTransition,
  //       },
  //       exit: {
  //         type: "wipe_out_bottom",
  //         ...defaultExitPagePayload,
  //       },
  //     },
  //     {
  //       title: "bottom",
  //       enter: {
  //         type: "wipe_in_bottom",
  //         ...defaultSlideTransition,
  //       },
  //       exit: {
  //         type: "wipe_out_top",
  //         ...defaultExitPagePayload,
  //       },
  //     },
  //     {
  //       title: "left",
  //       enter: {
  //         type: "wipe_in_left",
  //         ...defaultSlideTransition,
  //       },
  //       exit: {
  //         type: "wipe_out_right",
  //         ...defaultExitPagePayload,
  //       },
  //     },
  //     {
  //       title: "right",
  //       enter: {
  //         type: "wipe_in_right",
  //         ...defaultSlideTransition,
  //       },
  //       exit: {
  //         type: "wipe_out_left",
  //         ...defaultExitPagePayload,
  //       },
  //     },
  //   ],
  // },
  {
    title: "Slide",
    id: "slide",
    video: "https://assets.simplified.co/videos/transitions/slide.mp4",
    variants: [
      {
        title: "Left",
        enter: {
          type: "slide_left",
          ...defaultSlideTransition,
        },
        exit: {
          type: "slide_right",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Right",
        enter: {
          type: "slide_right",
          ...defaultSlideTransition,
        },
        exit: {
          type: "slide_left",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Top",
        enter: {
          type: "slide_top",
          ...defaultSlideTransition,
        },
        exit: {
          type: "slide_bottom",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Bottom",
        enter: {
          type: "slide_bottom",
          ...defaultSlideTransition,
        },
        exit: {
          type: "slide_top",
          ...defaultExitPagePayload,
        },
      },
    ],
  },
  {
    title: "Push",
    id: "push",
    video: "https://assets.simplified.co/videos/transitions/push.mp4",
    variants: [
      {
        title: "Left",
        enter: {
          type: "push_left",
          ...defaultSlideTransition,
        },
        exit: {
          type: "push_right",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Right",
        enter: {
          type: "push_right",
          ...defaultSlideTransition,
        },
        exit: {
          type: "push_left",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Top",
        enter: {
          type: "push_top",
          ...defaultSlideTransition,
        },
        exit: {
          type: "push_bottom",
          ...defaultExitPagePayload,
        },
      },
      {
        title: "Bottom",
        enter: {
          type: "push_bottom",
          ...defaultSlideTransition,
        },
        exit: {
          type: "push_top",
          ...defaultExitPagePayload,
        },
      },
    ],
  },
  {
    title: "Zoom",
    id: "zoom",
    video: "https://assets.simplified.co/videos/transitions/zoom.mp4",
    variants: [
      {
        title: "Zoom",
        enter: {
          type: "simple_zoom",
          ...defaultSlideTransition,
        },
      },
    ],
  },
  {
    title: "Linear Wipe",
    id: "smooth",
    video:
      "https://assets.simplified.co/videos/transitions/transition_smooth_wipe.mp4",
    variants: [
      {
        title: "Left",
        enter: {
          type: "smooth_wipe_left",
          ...defaultEnterPayload,
        },
      },
      {
        title: "Right",
        enter: {
          type: "smooth_wipe_right",
          ...defaultEnterPayload,
        },
      },
      {
        title: "Top",
        enter: {
          type: "smooth_wipe_top",
          ...defaultEnterPayload,
        },
      },
      {
        title: "Bottom",
        enter: {
          type: "smooth_wipe_bottom",
          ...defaultEnterPayload,
        },
      },
    ],
  },
  {
    title: "Circular Wipe",
    id: "circle_open",
    video: "https://assets.simplified.co/videos/transitions/circle_open.mp4",
    variants: [
      {
        title: "Circle Open",
        enter: {
          type: "circle_open",
          ...defaultEnterPayload,
        },
      },
    ],
  },
  {
    title: "Radial Wipe",
    id: "radial",
    video: "https://assets.simplified.co/videos/transitions/radial_smooth.mp4",
    variants: [
      {
        enter: {
          type: "radial",
          ...defaultSlideTransition,
        },
      },
    ],
  },
  {
    title: "Dooropen",
    id: "doorway_open",
    video: "https://assets.simplified.co/videos/transitions/door_open.mp4",
    variants: [
      {
        title: "Horizontal",
        enter: {
          type: "doorway_open_horizontal",
          ...defaultSlideTransition,
        },
      },
      {
        title: "Vertical",
        enter: {
          type: "doorway_open_vertical",
          ...defaultSlideTransition,
        },
      },
    ],
  },
  {
    title: "Doorclose",
    id: "doorway_close",
    video: "https://assets.simplified.co/videos/transitions/door_close.mp4",
    variants: [
      {
        title: "Horizontal",
        enter: {
          type: "doorway_close_horizontal",
          ...defaultSlideTransition,
        },
      },
      {
        title: "Vertical",
        enter: {
          type: "doorway_close_vertical",
          ...defaultSlideTransition,
        },
      },
    ],
  },
];

const FADE_OUT = {
  type: "fade_out",
  ...defaultExitPayload,
};

const FADE = {
  title: "Fade",
  id: "fade",
  characterLevel: false,

  variants: [
    {
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/fade.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/fade.png",
      enter: {
        type: "fade_in",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const WIPE = {
  title: "Wipe",
  id: "wipe",
  characterLevel: false,

  variants: [
    {
      title: "Top",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipetop.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipetop.png",
      enter: {
        type: "wipe_in_top",
        ...defaultEnterPayload,
      },
      exit: {
        type: "wipe_out_bottom",
        ...defaultExitPayload,
      },
    },
    {
      title: "bottom",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.png",
      enter: {
        type: "wipe_in_bottom",
        ...defaultEnterPayload,
      },
      exit: {
        type: "wipe_out_top",
        ...defaultExitPayload,
      },
    },
    {
      title: "left",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipeleft.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipeleft.png",
      enter: {
        type: "wipe_in_left",
        ...defaultEnterPayload,
      },
      exit: {
        type: "wipe_out_right",
        ...defaultExitPayload,
      },
    },
    {
      title: "right",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wiperight.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wiperight.png",
      enter: {
        type: "wipe_in_right",
        ...defaultEnterPayload,
      },
      exit: {
        type: "wipe_out_left",
        ...defaultExitPayload,
      },
    },
  ],
};

const BLOCK_REVEAL = {
  title: "Block Reveal",
  id: "block",
  characterLevel: false,

  variants: [
    {
      title: "Top",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipetop.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipetop.png",
      enter: {
        type: "block_in_top",
        ...defaultEnterPayload,
      },
      exit: {
        type: "block_out_bottom",
        ...defaultExitPayload,
      },
    },
    {
      title: "bottom",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipebottom.png",
      enter: {
        type: "block_in_bottom",
        ...defaultEnterPayload,
      },
      exit: {
        type: "block_out_top",
        ...defaultExitPayload,
      },
    },
    {
      title: "left",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipeleft.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wipeleft.png",
      enter: {
        type: "block_in_left",
        ...defaultEnterPayload,
      },
      exit: {
        type: "block_out_right",
        ...defaultExitPayload,
      },
    },
    {
      title: "right",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wiperight.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/wiperight.png",
      enter: {
        type: "block_in_right",
        ...defaultEnterPayload,
      },
      exit: {
        type: "block_out_left",
        ...defaultExitPayload,
      },
    },
  ],
};

const ZOOM = {
  title: "Zoom in",
  id: "zoom",
  characterLevel: false,

  variants: [
    {
      title: "zoom",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoomin.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoomin.png",
      enter: {
        type: "zoom_in",
        ...defaultEnterPayload,
      },
      exit: {
        type: "zoom_out",
        ...defaultExitPayload,
      },
    },
    {
      title: "bounce",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoominbounce.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoominbounce.png",
      enter: {
        type: "zoom_in_bounce",
        ...defaultEnterPayload,
        easing: "easeOutBounce",
      },
      exit: {
        type: "zoom_out_bounce",
        ...defaultExitPayload,
        easing: "easeOutQuart",
      },
    },
  ],
};

const STOMP = {
  title: "Stomp",
  id: "stomp",
  characterLevel: false,
  // video: "https://assets.simplified.co/videos/text/text_great_thinker.gif",
  variants: [
    {
      video: "https://assets.simplified.co/videos/text/text_new_production.gif",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoomin.png",
      enter: {
        type: "stomp",
        ...defaultEnterPayload,
        start_time: 0,
        trans_duration: 500,
        end_time: 500,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
        start_time: 500,
        trans_duration: 5500,
        end_time: 6000,
      },
    },
  ],
};

const BREATHE = {
  title: "Breathe",
  id: "breathe",
  characterLevel: false,

  variants: [
    {
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoomin.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/zoomin.png",
      enter: {
        type: "breathe",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const FLY = {
  title: "Fly in",
  id: "fly",
  characterLevel: false,

  variants: [
    {
      enter: {
        type: "fly_in_top",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fly_out_bottom",
        ...defaultExitPayload,
      },
    },
    {
      title: "bottom",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.png",

      enter: {
        type: "fly_in_bottom",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fly_out_top",
        ...defaultExitPayload,
      },
    },
    {
      title: "left",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.png",

      enter: {
        type: "fly_in_left",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fly_out_right",
        ...defaultExitPayload,
      },
    },
    {
      title: "right",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.png",

      enter: {
        type: "fly_in_right",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fly_out_left",
        ...defaultExitPayload,
      },
    },
  ],
};

const SHIFT = {
  title: "Shift",
  id: "shift",
  characterLevel: false,

  variants: [
    {
      enter: {
        type: "shift_top",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
    {
      title: "bottom",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.png",

      enter: {
        type: "shift_bottom",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
    {
      title: "left",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.png",

      enter: {
        type: "shift_left",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
    {
      title: "right",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.png",

      enter: {
        type: "shift_right",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const REVEAL = {
  title: "Reveal",
  id: "reveal",
  characterLevel: false,

  variants: [
    {
      enter: {
        type: "reveal_in_top",
        ...defaultEnterPayload,
      },
      exit: {
        type: "reveal_out_bottom",
        ...defaultExitPayload,
      },
    },
    {
      title: "bottom",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfrombottom.png",

      enter: {
        type: "reveal_in_bottom",
        ...defaultEnterPayload,
      },
      exit: {
        type: "reveal_out_top",
        ...defaultExitPayload,
      },
    },
    {
      title: "left",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromleft.png",

      enter: {
        type: "reveal_in_left",
        ...defaultEnterPayload,
      },
      exit: {
        type: "reveal_out_right",
        ...defaultExitPayload,
      },
    },
    {
      title: "right",
      video:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.mp4",
      image:
        "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flyfromright.png",

      enter: {
        type: "reveal_in_right",
        ...defaultEnterPayload,
      },
      exit: {
        type: "reveal_out_left",
        ...defaultExitPayload,
      },
    },
  ],
};

const FLICKER = {
  title: "Flicker",
  id: "flicker",
  characterLevel: false,

  variants: [
    {
      title: "Flicker",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flicker.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/flicker.png",
      enter: {
        type: "flicker",
        ...defaultEnterPayload,
        trans_duration: 600,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const PULSE = {
  title: "Pulse",
  id: "pulse",
  characterLevel: false,

  variants: [
    {
      title: "Pulse",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.png",
      enter: {
        type: "pulse",
        ...defaultEnterPayload,
        trans_duration: 3000,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

export const GLITCH = {
  title: "Glitch",
  id: "glitch",
  characterLevel: false,

  variants: [
    {
      title: "Glitch",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.png",
      enter: {
        type: "glitch",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const DISCO = {
  title: "Disco",
  id: "disco",
  characterLevel: false,

  variants: [
    {
      title: "Disco",
      video: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.mp4",
      image: "https://tldrassets.s3-us-west-2.amazonaws.com/anim/v/pulse.png",
      enter: {
        type: "disco",
        ...defaultEnterPayload,
      },
      exit: {
        type: "fade_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const GREAT_THINKER = {
  title: "Great Thinker",
  id: "great_thinker",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_great_thinker.gif",
  variants: [
    {
      title: "great thinker",
      video: null,
      image: null,
      enter: {
        type: "great_thinker",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const SUNNY_MORNINGS = {
  title: "Sunny Mornings",
  id: "sunny_mornings",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_sunny_morning.gif",
  variants: [
    {
      title: "sunny mornings",
      video: null,
      image: null,
      enter: {
        type: "sunny_mornings",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const RISING_STRONG = {
  title: "Rising Strong",
  id: "rising_strong",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_rising_strong.gif",

  variants: [
    {
      title: "rising strong",
      video: null,
      image: null,
      enter: {
        type: "rising_strong_in",
        ...defaultEnterPayload,
      },
      exit: {
        type: "rising_strong_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const MADE_WITH_LOVE = {
  title: "Made With Love",
  id: "made_with_love",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_made_with_love.gif",

  variants: [
    {
      title: "made with love",
      video: null,
      image: null,
      enter: {
        type: "made_with_love",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const BEAUTIFUL_QUESTIONS = {
  title: "Beautiful Questions",
  id: "beautiful_questions",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_beautiful_questions.gif",

  variants: [
    {
      title: "beautiful questions",
      video: null,
      image: null,
      enter: {
        type: "beautiful_questions",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const DOMINO_DREAMS = {
  title: "Domino Dreams",
  id: "domino_dreams",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_domino_dreams.gif",

  variants: [
    {
      title: "domino dreams",
      video: null,
      image: null,
      enter: {
        type: "domino_dreams",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const FIND_YOUR_ELEMENT = {
  title: "Find Your Element",
  id: "find_your_element",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_find_your_element.gif",

  variants: [
    {
      title: "find your element",
      video: null,
      image: null,
      enter: {
        type: "find_your_element",
        ...defaultEnterPayload,
        trans_duration: 2000,
      },
      exit: FADE_OUT,
    },
  ],
};

const THURSDAY = {
  title: "Thursday",
  id: "thursday",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_thursday.gif",

  variants: [
    {
      title: "thursday",
      video: null,
      image: null,
      enter: {
        type: "thursday",
        ...defaultEnterPayload,
        trans_duration: 2000,
      },
      exit: FADE_OUT,
    },
  ],
};

const HELLO_GOODBYE = {
  title: "Hello Goodbye",
  id: "hello_goodbye",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_hello_goodbye.gif",

  variants: [
    {
      title: "hello goodbye",
      video: null,
      image: null,
      enter: {
        type: "hello_goodbye",
        ...defaultEnterPayload,
        trans_duration: 2000,
      },
      exit: FADE_OUT,
    },
  ],
};

const COFFEE_MORNINGS = {
  title: "Coffee Mornings",
  id: "coffee_mornings",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_coffee_morning.gif",

  variants: [
    {
      title: "coffee mornings",
      video: null,
      image: null,
      enter: {
        type: "coffee_mornings",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

const A_NEW_PRODUCTION = {
  title: "A New Production",
  id: "a_new_production",
  characterLevel: true,
  // video: "https://assets.simplified.co/videos/text/text_new_production.gif",
  variants: [
    {
      title: "a new production",
      video: null,
      image: null,
      enter: {
        type: "a_new_production_in",
        ...defaultEnterPayload,
      },
      exit: {
        type: "a_new_production_out",
        ...defaultExitPayload,
      },
    },
  ],
};

const SIGNALS_NOISES = {
  title: "Signals & Noises",
  id: "signals_noises",
  characterLevel: true,

  variants: [
    {
      title: "signals noises",
      video: null,
      image: null,
      enter: {
        type: "signals_noises",
        ...defaultEnterPayload,
      },
      exit: FADE_OUT,
    },
  ],
};

export const layerInTransitions = [
  ORIGINAL,
  FADE,
  WIPE,
  ZOOM,
  STOMP,
  BREATHE,
  FLY,
  SHIFT,
  REVEAL,
  BLOCK_REVEAL,
  FLICKER,
  PULSE,
  GLITCH,
  DISCO,
  GREAT_THINKER,
  SUNNY_MORNINGS,
  RISING_STRONG,
  MADE_WITH_LOVE,
  BEAUTIFUL_QUESTIONS,
  DOMINO_DREAMS,
  FIND_YOUR_ELEMENT,
  THURSDAY,
  HELLO_GOODBYE,
  COFFEE_MORNINGS,
  A_NEW_PRODUCTION,
  // SIGNALS_NOISES,
];

export const layerOutTransitions = [ORIGINAL, FADE, WIPE, ZOOM, FLY, REVEAL];

export const easingOptions = [
  // { value: "linear", label: "linear" },

  // { value: "easeInQuad", label: "easeInQuad" },
  // { value: "easeOutQuad", label: "easeOutQuad" },
  // { value: "easeInOutQuad", label: "easeInOutQuad" },

  // { value: "easeInCubic", label: "easeInCubic" },
  { value: "easeOutCubic", label: "easeOutCubic" },
  // { value: "easeInOutCubic", label: "easeInOutCubic" },

  // { value: "easeInQuart", label: "easeInQuart" },
  { value: "easeOutQuart", label: "easeOutQuart" },
  { value: "easeInOutQuart", label: "easeInOutQuart" },

  // { value: "easeInQuint", label: "easeInQuint" },
  { value: "easeOutQuint", label: "easeOutQuint" },
  // { value: "easeInOutQuint", label: "easeInOutQuint" },

  // { value: "easeInSine", label: "easeInSine" },
  // { value: "easeOutSine", label: "easeOutSine" },
  // { value: "easeInOutSine", label: "easeInOutSine" },

  // { value: "easeInExpo", label: "easeInExpo" },
  // { value: "easeOutExpo", label: "easeOutExpo" },
  // { value: "easeInOutExpo", label: "easeInOutExpo" },

  // { value: "easeInCirc", label: "easeInCirc" },
  { value: "easeOutCirc", label: "easeOutCirc" },
  // { value: "easeInOutCirc", label: "easeInOutCirc" },

  // { value: "easeInBack", label: "easeInBack" },
  // { value: "easeOutBack", label: "easeOutBack" },
  // { value: "easeInOutBack", label: "easeInOutBack" },

  // { value: "easeInBounce", label: "easeInBounce" },
  // { value: "easeOutBounce", label: "easeOutBounce" },
  // { value: "easeInOutBounce", label: "easeInOutBounce" },
];

export const directionOptions = [
  { value: "normal", label: "normal" },
  { value: "reverse", label: "reverse" },
  { value: "alternate", label: "alternate" },
];

export const predefinedSpeeds = [
  {
    title: "Slow",
    value: 2000,
  },
  {
    title: "Normal",
    value: 1000,
  },
  {
    title: "Fast",
    value: 500,
  },
];

export const variantDirectionOptions = [
  {
    title: "Top",
    id: "top",
  },
  {
    title: "Bottom",
    id: "bottom",
  },
  {
    title: "Left",
    id: "left",
  },
  {
    title: "Right",
    id: "right",
  },
];
