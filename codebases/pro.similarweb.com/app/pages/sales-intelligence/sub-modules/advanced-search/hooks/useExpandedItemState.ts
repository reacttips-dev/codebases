import React from "react";

const useExpandedItemState = (initialExpandedIndex = -1): [number, (i: number) => void] => {
    const [expandedIndex, setExpandedIndex] = React.useState(initialExpandedIndex);

    const handleExpandToggle = (index: number) => {
        setExpandedIndex(index === expandedIndex ? -1 : index);
    };

    return [expandedIndex, handleExpandToggle];
};

export default useExpandedItemState;
