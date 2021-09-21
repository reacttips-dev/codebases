import React from "react"

export const GatsbyCloudFunctionsIcon = ({
  height = 16,
  width = 16,
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        clipRule="evenodd"
        d="m8 16c4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8zm-1.42406-11.16667.42081.79642-2.87419 6.78695h1.95646l1.99942-4.73191 2.24446 4.24701c.1437.3011.4816.4849.8437.4849h1.5833v-1.5834h-.9925l-3.7485-7.10644c-.15027-.29813-.48611-.47686-.84231-.47686h-1.58333v1.58333z"
        fill="currentColor"
        fillOpacity=".7"
        fillRule="evenodd"
      />
    </svg>
  )
}
