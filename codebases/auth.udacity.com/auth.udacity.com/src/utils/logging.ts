export const LOGGING_PREFIX = "VERITAS";

// -------------------------------------
// Logging Utils
// -------------------------------------

export default {
  deprecationWarning: (
    componentName: string,
    property: string,
    message?: string
  ): void => {
    console.warn(
      `[${LOGGING_PREFIX}] DEPRECATION WARNING: ${componentName} "${property}" is deprecated. ${message}`
    );
  },

  warning: (componentName: string, message: string): void => {
    console.warn(`[${LOGGING_PREFIX}] ${componentName}: ${message}`);
  },

  throwError: (componentName: string, message: string): void => {
    throw new Error(`${LOGGING_PREFIX} [${componentName}]: ${message}`);
  }
};
