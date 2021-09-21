import * as React from "react"
import IconSkeleton from "./IconSkeleton"
import { IconProps } from "./types"

export default function CheckIcon(props: IconProps) {
  return (
    <IconSkeleton {...props} iconName="CheckIcon" applyColorToStroke={false}>
      <path d="M9.3 16.7l-3.1-4.3A1 1 0 0 1 7.8 11l3.7 3.9c.6.6.6 1.6 0 2.1-.7.5-1.7.4-2.2-.3z" />
      <path d="M9.6 17c-.7-.6-.7-1.5-.2-2.2l7.3-8a1 1 0 0 1 1.6 1.3l-6.6 8.6c-.5.7-1.5.8-2.1.3z" />
      <path d="M9.7 13c.4.5.7.8 1.1.3.5-.5-.1 1.3-.1 1.3l-1.5-.5.5-1z" />
    </IconSkeleton>
  )
}
