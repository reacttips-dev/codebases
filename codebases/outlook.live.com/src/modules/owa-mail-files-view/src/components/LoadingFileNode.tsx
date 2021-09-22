import { observer } from 'mobx-react-lite';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { gettingAttachmentsText } from './FilesViewStrings.locstring.json';
import loc from 'owa-localize';

export interface LoadingFileNodeProps {
    index: string;
}

const LoadingFileNode = observer(function LoadingFileNode(props: LoadingFileNodeProps) {
    function renderSpinner() {
        return <Spinner size={SpinnerSize.small} title="" />;
    }

    function preventDefault(event: any) {
        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <TreeNode
            displayName={loc(gettingAttachmentsText)}
            isRootNode={false}
            key={props.index}
            isDroppedOver={false}
            onClick={preventDefault}
            isSelected={false}
            onContextMenu={preventDefault}
            renderRightCharm={renderSpinner}
        />
    );
});
export default LoadingFileNode;
