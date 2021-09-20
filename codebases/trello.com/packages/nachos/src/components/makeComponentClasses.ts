export const makeComponentClasses = (component: string) => {
  return {
    componentCx: (block?: string, mod?: string) => {
      let componentClass = `nch-${component.toLowerCase()}`;

      if (block) {
        componentClass += `__${block}`;
      }

      if (mod) {
        componentClass += `--${mod}`;
      }

      return componentClass;
    },
  };
};
