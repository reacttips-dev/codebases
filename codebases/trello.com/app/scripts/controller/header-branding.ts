import { headerState } from 'app/gamma/src/components/header/headerState';

interface HeaderOptions {
  headerBrandingColor?: string;
  headerBrandingLogo?: string;
  headerBrandingName?: string;
}

export const headerBranding = (opts: HeaderOptions) => {
  if (opts.headerBrandingName) {
    headerState.setValue({
      brandingName: opts.headerBrandingName,
    });
  } else {
    headerState.setValue({
      brandingName: undefined,
    });
  }
};
