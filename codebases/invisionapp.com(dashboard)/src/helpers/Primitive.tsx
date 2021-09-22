import React, { Component, Children, cloneElement, isValidElement } from 'react'
import cx from 'classnames'

export interface PrimitiveProps {
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

type TGetClasses = {
  props: PrimitiveProps
  child: any
}

const getClasses = ({ props, child }: TGetClasses): string => {
  const childClassName: string =
    child && child.props && child.props.className
      ? child.props.className
      : undefined

  return cx(props.className, childClassName)
}

class Primitive extends Component<PrimitiveProps> {
  render() {
    const { children, ...props } = this.props
    return Children.map(children, child => {
      // If each child of this component is a valid React component, we can
      // clone and add the correct className to give the correct styles.
      if (isValidElement(child)) {
        return cloneElement<any>(child, {
          ...props,
          className: getClasses({ props, child }),
        })
        // If you have some condition inside the component it will set `props` to
        // the value `true`/`false` and props.children is going to return null in
        // that case.
      }
      if (child == null) {
        return null
      }
      // If it is just a text node, we wrap the child in a <div> element so we
      // can apply styling to it.
      return (
        <div {...props} className={getClasses({ props, child })}>
          {child}
        </div>
      )
    })
  }
}

export default Primitive
