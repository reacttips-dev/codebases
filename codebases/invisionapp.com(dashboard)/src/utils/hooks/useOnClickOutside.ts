import { RefObject, useEffect } from "react";

const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: (e: MouseEvent) => void
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref || !ref.current) {
        return;
      }

      // clicked outside
      if (!ref.current.contains(e.target as Node) && handler) {
        handler(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
