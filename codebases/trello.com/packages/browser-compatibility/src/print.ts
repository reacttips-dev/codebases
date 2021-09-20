export const print = () => {
  if (navigator.vendor.includes('Apple')) {
    // A safari bug prevents window.print() from working while there is an
    // active EventSource
    // https://bugs.webkit.org/show_bug.cgi?id=195769
    document.execCommand('print');
  } else {
    window.print();
  }
};
