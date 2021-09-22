import { useId as useReachId } from '@reach/auto-id';

/**
 * Private module reserved for @coursera/cds-core package.
 *
 * Autogenerate IDs to facilitate WAI-ARIA and server rendering.
 *
 * A string can be supplied as an argument to useId in lieu of the auto-generated ID.
 * This is handy for accepting user-provided prop IDs that need to be deterministic.
 *
 * The initial ID returned is an empty string on the first render. This ensures that the server and
 * client have the same markup. After the mounting, the components are patched with a auto-generated ID.
 * @see @reach/auto-id https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx
 *
 * This method is designed to ensure SSR compatibility.
 */
const useId = (idFromProps?: string): string | undefined => {
  const id = useReachId();

  if (idFromProps) {
    return idFromProps;
  }

  if (!id) {
    return undefined;
  }

  return `cds-${id}`;
};

export default useId;
