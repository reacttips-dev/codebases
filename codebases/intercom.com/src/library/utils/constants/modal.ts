export const OVERLAY_COLOR = 'rgba(0,0,0,0.5)'

export const REACT_MODAL_CONTENT_STYLES: React.CSSProperties = {
  border: 'none',
  borderRadius: '0',
  bottom: 'auto',
  boxShadow: 'rgba(90, 90, 90, 0.15) 0px 5px 20px',
  overflow: 'auto',
  padding: '0',
  position: 'static',
  right: 'auto',
  width: '100%',
  top: '0',
  left: '0',
}

export const REACT_MODAL_OVERLAY_STYLES = {
  backgroundColor: OVERLAY_COLOR,
  overflowY: 'auto',
}

export const REACT_MODAL_BODY_OPEN_CLASSNAME = 'ReactModal__Body--open'

export const TRANSITION_SPEED = 400

export const TRANSITION_STYLE = `opacity ${TRANSITION_SPEED}ms ease-in-out`
