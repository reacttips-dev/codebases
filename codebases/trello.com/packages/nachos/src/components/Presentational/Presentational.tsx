export const truncateText = (withEllipsis: boolean = true) => ({
  ...(withEllipsis && { textOverflow: 'ellipsis' }),
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
