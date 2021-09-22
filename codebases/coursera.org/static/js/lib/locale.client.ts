declare global {
  interface Window {
    locale?: string;
  }
}

const get = () => window.locale || 'en';

export default get;
