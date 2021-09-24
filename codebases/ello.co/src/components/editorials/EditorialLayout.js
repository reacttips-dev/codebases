import React from 'react'
import PropTypes from 'prop-types'
import EditorialContainer from '../../containers/EditorialContainer'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------
// Row

const rowStyle = css(
  s.fullWidth,
  media(s.minBreak3, s.mb20, s.flex, s.flexWrap),
  media(s.minBreak4, s.mb40),
)

const Row = props => (
  <div className={rowStyle}>
    {props.children}
  </div>
)
Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
}
Row.defaultProps = {
  children: null,
}


// -------------------------------------
// Cells

const cellStyle = css(
  s.flex,
  s.flexWrap,
  s.fullWidth,
  { height: '100vw' },
  s.overflowHidden,
  s.pb10,
  media(s.minBreak3, s.fullHeight, s.pb0),
)

const Cell = props =>
  (<div className={`${cellStyle} ${props.className}`}>
    {props.children}
  </div>)

Cell.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
}
Cell.defaultProps = {
  className: null,
  children: null,
}

// -------------------------------------
// Grid (Cell modifiers)

const height1 = media(s.minBreak3, { height: 420 })
const height2 = media(s.minBreak3, { height: 840 })
const halfHeight = css(
  media(s.minBreak3, { height: 'calc(50% - 10px)' }),
  media(s.minBreak4, { height: 'calc(50% - 20px)' }),
)

const width1 = media(s.minBreak3, { width: '33.333333%' })
const width2 = media(s.minBreak3, { flex: 1 })
const halfWidth = media(s.minBreak3, { flex: 2 })

const pushRight = css(
  media(s.minBreak3, s.pr20),
  media(s.minBreak4, s.pr40),
)

const alignEnd = media(s.minBreak3, s.selfEnd)

// -------------------------------------
// Layout

const sectionStyle = css(
  s.flex,
  s.flexWrap,
  s.mxAuto,
  s.maxSiteWidth,
)

const EditorialLayout = ({ ids }) => (
  <section className={sectionStyle}>
    { /* Row 1 */ }
    { ids.get(0) &&
      <Row>
        <Cell className={`${width2} ${height1} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(0)} size="2x1" position={1} />
        </Cell>
        <Cell className={`${width1} ${height1}`}>
          { ids.get(1) &&
            <EditorialContainer editorialId={ids.get(1)} size="1x1" position={2} />
          }
        </Cell>
      </Row>
    }

    { /* Row 2 */ }
    { ids.get(2) &&
      <Row>
        <Cell className={`${width1} ${height1} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(2)} size="1x1" position={3} />
        </Cell>
        <Cell className={`${width1} ${height1} ${pushRight}`}>
          { ids.get(3) &&
            <EditorialContainer editorialId={ids.get(3)} size="1x1" position={4} />
          }
        </Cell>
        <Cell className={`${width1} ${height1}`}>
          { ids.get(4) &&
            <EditorialContainer editorialId={ids.get(4)} size="1x1" position={5} />
          }
        </Cell>
      </Row>
      }

    { /* Row 3 */ }
    { ids.get(5) &&
      <Row>
        <Cell className={`${width2} ${height2} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(5)} size="2x2" position={6} />
        </Cell>
        { ids.get(6) &&
          <Cell className={`${width1} ${height2}`}>
            <Cell className={halfHeight}>
              <EditorialContainer editorialId={ids.get(6)} size="1x2" position={7} />
            </Cell>
            <Cell className={`${halfHeight} ${alignEnd}`}>
              { ids.get(7) &&
                <EditorialContainer editorialId={ids.get(7)} size="1x1" position={8} />
              }
            </Cell>
          </Cell>
        }
      </Row>
    }

    { /* Row 4 */ }
    { ids.get(8) &&
      <Row>
        <Cell className={`${width1} ${height2} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(8)} size="1x2" position={9} />
        </Cell>
        { ids.get(9) &&
          <Cell className={`${width2} ${height2}`}>
            <Cell className={halfHeight}>
              <EditorialContainer editorialId={ids.get(9)} size="2x1" position={10} />
            </Cell>
            <Cell className={`${halfWidth} ${halfHeight} ${pushRight} ${alignEnd}`}>
              { ids.get(10) &&
                <EditorialContainer editorialId={ids.get(10)} size="1x1" position={11} />
              }
            </Cell>
            <Cell className={`${halfWidth} ${halfHeight} ${alignEnd}`}>
              { ids.get(11) &&
                <EditorialContainer editorialId={ids.get(11)} size="1x1" position={12} />
              }
            </Cell>
          </Cell>
        }
      </Row>
      }

    { /* Reverse */ }

    { /* Row 5 (1) */ }
    { ids.get(12) &&
      <Row>
        <Cell className={`${width1} ${height1} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(12)} size="1x1" position={13} />
        </Cell>
        <Cell className={`${width2} ${height1}`}>
          { ids.get(13) &&
            <EditorialContainer editorialId={ids.get(13)} size="2x1" position={14} />
          }
        </Cell>
      </Row>
      }

    { /* Row 6 (2) */ }
    { ids.get(14) &&
      <Row>
        <Cell className={`${width1} ${height1} ${pushRight}`}>
          <EditorialContainer editorialId={ids.get(14)} size="1x1" position={15} />
        </Cell>
        <Cell className={`${width1} ${height1} ${pushRight}`}>
          { ids.get(15) &&
            <EditorialContainer editorialId={ids.get(15)} size="1x1" position={16} />
          }
        </Cell>
        <Cell className={`${width1} ${height1}`}>
          { ids.get(16) &&
            <EditorialContainer editorialId={ids.get(16)} size="1x1" position={17} />
          }
        </Cell>
      </Row>
      }

    { /* Row 7 (3) */ }
    { ids.get(17) &&
      <Row>
        <Cell className={`${width1} ${height2} ${pushRight}`}>
          <Cell className={halfHeight}>
            <EditorialContainer editorialId={ids.get(17)} size="1x1" position={18} />
          </Cell>
          <Cell className={`${halfHeight} ${alignEnd}`}>
            { ids.get(18) &&
              <EditorialContainer editorialId={ids.get(18)} size="1x1" position={19} />
            }
          </Cell>
        </Cell>
        <Cell className={`${width2} ${height2}`}>
          { ids.get(19) &&
            <EditorialContainer editorialId={ids.get(19)} size="2x2" position={20} />
          }
        </Cell>
      </Row>
      }

    { /* Row 8 (4) */ }
    { ids.get(20) &&
      <Row>
        <Cell className={`${width2} ${height2} ${pushRight}`}>
          <Cell className={halfHeight}>
            <EditorialContainer editorialId={ids.get(20)} size="2x1" position={21} />
          </Cell>
          <Cell className={`${halfWidth} ${halfHeight} ${pushRight} ${alignEnd}`}>
            { ids.get(21) &&
              <EditorialContainer editorialId={ids.get(21)} size="1x1" position={22} />
            }
          </Cell>
          <Cell className={`${halfWidth} ${halfHeight} ${alignEnd}`}>
            { ids.get(22) &&
              <EditorialContainer editorialId={ids.get(22)} size="1x1" position={23} />
            }
          </Cell>
        </Cell>
        <Cell className={`${width1} ${height2}`}>
          { ids.get(23) &&
            <EditorialContainer editorialId={ids.get(23)} size="1x2" position={24} />
          }
        </Cell>
      </Row>
      }
  </section>
)

EditorialLayout.propTypes = {
  ids: PropTypes.object.isRequired,
}

export default EditorialLayout
