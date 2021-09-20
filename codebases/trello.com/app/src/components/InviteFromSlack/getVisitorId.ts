import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getVisitorId = async () => {
  // Get the visitor identifier when you need it.
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  const { canvas, ...components } = result.components;
  // we need to get rid of this parameter because of the Safari
  // bug that prevents us from getting the same fingreprint
  // both for the web and the PUp
  // @ts-ignore
  delete canvas.value.text;
  // This is the visitor identifier:
  const visitorId = FingerprintJS.hashComponents({
    ...components,
    canvas,
  });
  return visitorId;
};
