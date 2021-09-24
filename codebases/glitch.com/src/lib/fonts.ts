import { createGlobalStyle } from 'styled-components'

// NOTE: current designs only use 400 & 700 weights, so remaining weights have been commented out in this stylesheet

const Fonts = createGlobalStyle`
  /* @font-face {
    font-family: 'Fira Code';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FFiraCode-Light.otf?v=1603136302219);
    font-weight: 300;
  } */
  @font-face {
    font-family: 'Fira Code';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FFiraCode-Regular.otf?v=1603136302365);
    font-weight: 400;
  }
  /* @font-face {
    font-family: 'Fira Code';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FFiraCode-Medium.otf?v=1603136302009);
    font-weight: 500;
  } */
  @font-face {
    font-family: 'Fira Code';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FFiraCode-Bold.otf?v=1603136301750);
    font-weight: 700;
  }
    /* 
https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FFiraCode-Retina.otf?v=1603136302970 */

  /* @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Light.otf?v=1603136324489);
    font-weight: 300;
  } */
  /* @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-LightItalic.otf?v=1603136324717);
    font-weight: 300;
    font-style: italic;
  } */
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Regular.otf?v=1603136326027);
    font-weight: 400;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Italic.otf?v=1603136324237);
    font-weight: 400;
    font-style: italic;
  }
  /* @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Medium.otf?v=1603136324850);
    font-weight: 500;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-MediumItalic.otf?v=1603136324983);
    font-weight: 500;
    font-style: italic;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-SemiBold.otf?v=1603136325895);
    font-weight: 600;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-SemiBoldItalic.otf?v=1603136325657);
    font-weight: 600;
    font-style: italic;
  } */
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Bold.otf?v=1603136323437);
    font-weight: 700;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-BoldItalic.otf?v=1603136323437);
    font-weight: 700;
    font-style: italic;
  }
  /* @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-ExtraBold.otf?v=1603136323983);
    font-weight: 800;
  }
  @font-face {
    font-family: 'HK Grotesk';
    src: url(https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FHKGrotesk-Black.otf?v=1603136323437);
    font-weight: 900;
  } */
`

export default Fonts
