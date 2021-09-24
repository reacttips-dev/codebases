import glamorous from 'glamorous';

const StickyPanel = glamorous.div(
  {
    position: 'sticky'
  },
  ({top = 0, marginBottom = 0}) => ({
    top,
    marginBottom
  })
);
export default StickyPanel;
