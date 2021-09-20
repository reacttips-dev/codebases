import React from "react";
import classNames from "classnames";

const PREFIX = "vds-avatar";

/** Avatar props */
export interface AvatarProps {
  /** The user's name. Used as `alt` or `title` text. First character will be displayed if an `image` is not provided */
  name: string;

  /** The border color around the avatar */
  borderColor?:
    | "none"
    | "white"
    | "cerulean"
    | "red"
    | "orange"
    | "green"
    | "blue"
    | "purple"
    | "yellow"
    | "teal"
    | "magenta";

  /** Hide the Avatar when paired with text for accessibility using `aria-hidden="true"` */
  hidden?: boolean;

  /** Url or path to avatar image. The image will take precedence over `initials` if both are supplied */
  image?: string;

  /** The user's initials, best displayed as two characters */
  initials?: string;

  /** Size of avatar */
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

/** Avatars are used to represent a person. It displays an image or initials. */

const Avatar: React.FC<AvatarProps> = ({
  borderColor = "none",
  hidden = false,
  image,
  initials,
  name,
  size = "md"
}: AvatarProps) => {
  const className = classNames(
    PREFIX,
    borderColor !== "none" && `${PREFIX}--${borderColor}`,
    size && `${PREFIX}--${size}`
  );

  return (
    <div className={className} aria-label={name} aria-hidden={hidden}>
      {image ? (
        <img src={image} alt={name} title={name} />
      ) : (
        <abbr title={name}>{initials || name.charAt(0)}</abbr>
      )}
    </div>
  );
};

export default Avatar;
