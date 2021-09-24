/** @jsx jsx */
import { Box, Grid as BaseGrid, jsx, SxProps } from 'theme-ui'

const colsPerBk = [4, 8, 8, 12, 12]
const mx = [20, 48, 80, 'auto', 'auto']
const maxWidth = ['auto', 'auto', 'auto', '1000px', '1260px']
const gap = '12px'

function mapValueOrArray(
  x: number | number[],
  fn: (x: number) => number | string,
): number | string | (number | string)[] {
  if (Array.isArray(x)) {
    return x.map(fn)
  }

  return fn(x)
}

type IOuterGrid = {
  sx: SxProps
}

type IGridItem = {
  sx: SxProps
  columns: number | number[]
  offset: number | number[]
}

export const OuterGrid = ({ sx, ...props }: IOuterGrid): JSX.Element => (
  <BaseGrid
    columns={colsPerBk}
    gap={gap}
    mx={mx}
    sx={{ maxWidth, ...sx }}
    {...props}
  />
)

export const InnerGrid = ({
  columns,
  offset = [0],
  sx,
  ...props
}: IGridItem): JSX.Element => (
  <BaseGrid
    columns={columns}
    gap={gap}
    sx={{
      gridColumnStart: mapValueOrArray(offset, (o) => o + 1),
      gridColumnEnd: mapValueOrArray(columns, (col) => `span ${col}`),
      ...sx,
    }}
    {...props}
  />
)

export const GridItem = ({
  columns,
  offset = [0],
  sx,
  ...props
}: IGridItem): JSX.Element => (
  <Box
    sx={{
      gridColumnStart: mapValueOrArray(offset, (o) => o + 1),
      gridColumnEnd: mapValueOrArray(columns, (col) => `span ${col}`),
      ...sx,
    }}
    {...props}
  />
)
