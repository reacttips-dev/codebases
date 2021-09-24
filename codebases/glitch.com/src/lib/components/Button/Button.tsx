/** @jsx jsx */
import { Button as ThemeButton, jsx } from 'theme-ui'

export interface IButtonProps {
  variant?: string
  children: JSX.Element
}

export const Button: React.FC<IButtonProps> = ({
  variant = 'secondary',
  children,
  ...props
}) => (
  <ThemeButton variant={variant} {...props}>
    <span sx={{ position: 'relative', zIndex: 1 }}>{children}</span>
  </ThemeButton>
)

export const Link: React.FC<IButtonProps> = ({ children, ...props }) => (
  <ThemeButton as="a" variant="link" {...props}>
    <span sx={{ position: 'relative', zIndex: 1 }}>{children}</span>
  </ThemeButton>
)
