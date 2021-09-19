import Item from 'components/checkout/splitReview/Item';

export const ReviewGroup = props => {
  const {
    groupDetails,
    isForEGC,
    lineItemIds = [],
    productsByLineItem,
    showFormControls,
    showItemLevelErrors
  } = props;

  if (isForEGC) {
    return (
      <Item
        groupDetails={groupDetails}
        lineItem={productsByLineItem[lineItemIds[0]]}
        showFormControls={showFormControls}
        showItemLevelErrors={showItemLevelErrors}
        type="digital"
      />
    );
  }

  return (
    <>
      {
        lineItemIds.map((lineItemId, i) => (
          <Item
            groupDetails={groupDetails}
            key={lineItemId}
            lineItem={productsByLineItem[lineItemId]}
            showFormControls={showFormControls}
            showItemLevelErrors={showItemLevelErrors}
            showItemTopBorder={i > 0 && i < lineItemIds.length }
            type="retail"
          />
        ))
      }
    </>
  );
};

export default ReviewGroup;
