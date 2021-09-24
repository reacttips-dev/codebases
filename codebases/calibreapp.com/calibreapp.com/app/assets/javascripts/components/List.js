import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Badge from './Badge'
import MetadataList from './MetadataList'
import { Flex, Box } from './Grid'
import { Heading, TextLink } from './Type'
import { DragIcon, ExpandIcon } from './Icon'

const StyledList = styled.ul`
  list-style-type: none;
  min-width: 280px;
`

const List = ({ children, forwardedRef, ...props }) => (
  <StyledList ref={forwardedRef} {...props}>
    {children}
  </StyledList>
)

const StyledListItem = styled(Box)`
  overflow-x: ${({ overflowX }) => overflowX};

  &:last-child {
    border-bottom: 0;
  }
`
StyledListItem.defaultProps = {
  as: 'li',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'greyOutline',
  backgroundColor: 'white',
  overflowX: 'initial'
}

const Actions = styled.div`
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;

  > * {
    margin-left: ${props => props.theme.space[2]};
  }

  > :first-child {
    margin-left: 0;
  }
`

const Title = ({ link, title }) =>
  (link && (
    <Link to={link}>
      <Heading as="h3" level="sm" fontSize="16px">
        {title}
      </Heading>
    </Link>
  )) || (
    <Heading as="h3" level="sm" fontSize="16px">
      {title}
    </Heading>
  )

const Wrapper = styled(Flex)`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover {
    background-color: ${({ theme, onClick, expanded }) =>
      onClick && !expanded ? theme.colors.grey50 : 'none'};
  }
`
Wrapper.defaultProps = {
  p: 3
}

const Expand = styled(Box)`
  line-height: 0;
  vertical-align: unset;
  transform: rotate(${({ rotate }) => rotate});
  transform-origin: center center;
`

const ListItem = ({
  verticalAlign,
  itemType,
  preview,
  title,
  badges,
  meta,
  link,
  children,
  forwardedRef,
  onExpand,
  expanded,
  actions,
  p,
  ...props
}) => {
  return (
    <StyledListItem {...props} ref={forwardedRef}>
      <Wrapper
        alignItems={verticalAlign}
        flexWrap={['wrap', 'nowrap']}
        onClick={onExpand}
        expanded={expanded}
        p={p}
      >
        {(itemType === 'drag' && (
          <Box mr={3} className="draggable">
            <DragIcon />
          </Box>
        )) ||
          (itemType == 'expand' && (
            <Expand
              mr={3}
              px={1}
              color="grey300"
              rotate={expanded ? '180deg' : 0}
            >
              <TextLink variant="muted" as="button">
                <ExpandIcon />
              </TextLink>
            </Expand>
          )) ||
          null}
        {preview ? (
          <>
            <Box mr={3}>{preview}</Box>
            <Box flex={1} style={{ overflow: 'hidden' }} mr={3}>
              <Flex alignItems="center">
                <Box>
                  <Title title={title} link={link} />
                </Box>
                {badges.map((label, index) => (
                  <Box key={index} ml={1}>
                    <Badge type="neutral">{label}</Badge>
                  </Box>
                ))}
              </Flex>
              {meta ? <MetadataList items={meta} /> : null}
            </Box>
          </>
        ) : (
          <Box flex={1}>
            <Title title={title} link={link} />
            {meta ? <MetadataList items={meta} /> : null}
          </Box>
        )}
        <Box mt={[3, 0]} width={[1, 'auto']}>
          <Actions>{actions}</Actions>
        </Box>
      </Wrapper>
      <Box px={3}>{children}</Box>
    </StyledListItem>
  )
}

ListItem.defaultProps = {
  badges: [],
  verticalAlign: 'center'
}

export { List, ListItem }
