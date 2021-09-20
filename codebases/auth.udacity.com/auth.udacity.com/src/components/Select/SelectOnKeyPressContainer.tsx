import React from "react";
import { StateChangeOptions, Callback } from "downshift";

export interface SelectOnKeyPressContainerProps {
  children: React.ReactNode;

  /** Option that is highlighted in the dropdown menu */
  highlightedIndex?: number | null;

  /** Is the select dropdown menu open */
  isOpen: boolean;

  /** List of options to choose from */
  options: { value: string | number }[];

  /** Function that sets the highlighted option */
  setHighlightedIndex(
    index: number,
    otherStateToSet?:
      | Partial<
          StateChangeOptions<{
            value: React.ReactText;
            label?: string | undefined;
          }>
        >
      | undefined,
    cb?: Callback | undefined
  ): void;
}
export default class SelectOnKeyPressContainer extends React.Component<
  SelectOnKeyPressContainerProps
> {
  constructor(props: SelectOnKeyPressContainerProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.onKeyDown, true);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onKeyDown, false);
  }

  onKeyDown(event: KeyboardEvent): void {
    const {
      options,
      isOpen,
      highlightedIndex,
      setHighlightedIndex
    } = this.props;

    if (isOpen) {
      const keyDownValue = String(event.key);
      let idx = 0;
      idx = options.findIndex(option => {
        const optionValue = String(option.value).trim();
        const firstCharacter = optionValue.charAt(0).toLowerCase();
        return firstCharacter === keyDownValue;
      });

      if (idx >= 0 && idx !== highlightedIndex) {
        setHighlightedIndex(idx);
      }
    }
  }

  render(): React.ReactNode {
    const { children } = this.props;
    return children;
  }
}
