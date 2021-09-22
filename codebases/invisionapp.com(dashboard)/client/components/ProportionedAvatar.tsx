import * as React from 'react'
import styled from 'styled-components'
import { Avatar } from '@invisionapp/helios'
import { AvatarProps } from '@invisionapp/helios/components/Avatar/index'

/* brought over from Helios's Avatar */
const getSize = ({ size, exactSize }: ProportionedAvatarProps) => {
  if (exactSize !== undefined) {
    return exactSize
  }

  if (size === 'larger') {
    return 40
  }
  if (size === 'smaller') {
    return 28
  }
  return 36
}

const exprBase64 = new RegExp('data:image/(png|PNG|gif|GIF|jp[e]?g|JP[E]?G);base64')
const isInlineImage = (src?: string) => {
  if (src === 'undefined' || !src) return false
  return exprBase64.test(src)
}

type ProportionedAvatarProps = AvatarProps & {
  exactSize?: number
}

type ProportionedAvatarState = {
  loading: boolean
  error: boolean
}

class ProportionedAvatar extends React.PureComponent<
  ProportionedAvatarProps,
  ProportionedAvatarState
> {
  state = {
    loading: true,
    error: false
  }

  handleLoad() {
    this.setState({ loading: false })
  }

  handleError() {
    this.setState(() => ({ error: true }))
  }

  render() {
    const { exactSize, ...props } = this.props

    // const showImage = this.props.src && !this.state.error && !this.state.loading
    const showImage = props.src && !this.state.error && !this.state.loading

    // Multiplied by 2 to ensure we get a crisp image
    const size = getSize(this.props) * 2

    const src =
      props.src && !isInlineImage(props.src)
        ? // This information is brought over from the Fastly docs (as linked to from the assets-api)
          // https://docs.fastly.com/api/imageopto/fit
          // https://github.com/InVisionApp/assets-api/blob/a10484fb73db217ed17796f66d9ad4acc36a2145/swagger.yml#L105
          `${props.src}?width=${size}&height=${size}&fit=crop&auto=webp`
        : props.src

    return showImage ? (
      <AvatarContainer {...props}>
        <img
          src={src}
          alt={props.alt}
          onLoad={() => this.handleLoad()}
          onError={() => this.handleError()}
        />
      </AvatarContainer>
    ) : (
      <Avatar {...props} src={src} onImageLoad={() => this.handleLoad()} />
    )
  }
}

const AvatarContainer = styled.div<ProportionedAvatarProps>`
  display: flex;
  overflow: hidden;
  width: ${props => getSize(props)}px;
  height: ${props => getSize(props)}px;
  border-radius: ${({ theme, order }) =>
    order === 'user' ? theme.radii.circled : theme.radii.rounded};

  img {
    max-width: 100%;
    object-fit: cover;
  }
`

export default ProportionedAvatar
