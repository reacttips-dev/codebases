export { Text, BlockText } from './component'

export type SizeOptions =
  | 'heading+'
  | 'heading'
  | 'xxl+'
  | 'xxl'
  | 'xl+'
  | 'xl'
  | 'lg+'
  | 'lg'
  | 'md+'
  | 'md'
  | 'caption+'
  | 'caption'
  | 'body+'
  | 'body'
  | 'lg-eyebrow'
  | 'xxl++'
  | 'lg-percentage'

export interface IProps {
  size: SizeOptions
  children: React.ReactNode
}
