import * as React from "react"
import secureTargetBlankLink from "../../utils/helpers/secureTargetBlankLink"

export type BaseAnchorProps = Omit<JSX.IntrinsicElements["a"], "ref">

export const BaseAnchor = React.forwardRef<HTMLAnchorElement, BaseAnchorProps>(
  (
    { role, target = `_blank`, rel, children, ...rest }: BaseAnchorProps,
    ref
  ) => (
    <a
      target={target}
      role={role}
      rel={secureTargetBlankLink({ rel, target })}
      {...rest}
      ref={ref}
    >
      {children}
    </a>
  )
)
