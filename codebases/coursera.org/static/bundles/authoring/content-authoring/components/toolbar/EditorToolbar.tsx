import React from 'react';
import _ from 'underscore';
import cx from 'classnames';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import AssetManager from 'js/lib/AssetManager';
import { Asset } from 'bundles/asset-admin/types/assets';
import { BoldButton } from '../../plugins/Bold';
import { ItalicButton } from '../../plugins/Italic';
import { UnderlineButton } from '../../plugins/Underline';
import { VariableButton } from '../../plugins/Variable';
import { BulletListButton, NumberedListButton } from '../../plugins/List';
import { CodeButton, CodeButtonProps } from '../../plugins/Code';
import { HeadingButton } from '../../plugins/Heading';
import { LinkButton, UnlinkButton } from '../../plugins/Link';
import { ImageButton } from '../../plugins/Image';
import { AssetButton } from '../../plugins/Asset';
import { TableButton } from '../../plugins/Table';
import ToolbarDivider from './ToolbarDivider';

import { SlateValue } from '../../types';

import 'css!./__styles__/EditorToolbar';

type Props = {
  isToolbarCompact?: boolean;
  isToolbarBottomSticky?: boolean;
  enableMonospace?: boolean;
  isDisabled?: boolean;
  children?: React.ReactElement | React.ReactElement[];
  value?: SlateValue;
  onChange?: ({ value }: { value: SlateValue }) => void;
  assetManager?: AssetManager;
  toggleAssetModal?: (
    showAssetModal?: boolean,
    isUploadingImage?: boolean,
    handleAssetModalSelect?: (selectedAssets: Array<Asset>) => void,
    handleAssetModalCancel?: () => void
  ) => void;
};

/*
 * Container for editor tools, renders the tools passed down as props.children. Default: renders all tools
 */
const EditorToolbar = (props: Props) => {
  const { isToolbarCompact, isToolbarBottomSticky, enableMonospace, children } = props;

  if (children && React.Children.count(children) === 0) {
    return null;
  }

  return (
    <div
      className={cx('rc-EditorToolbar', {
        compact: isToolbarCompact,
        'toolbar-bottom-sticky': isToolbarBottomSticky,
      })}
    >
      {children && React.Children.map(children, (child) => React.cloneElement(child, { ..._(props).omit('children') }))}
      {!children && (
        <div>
          <HeadingButton level="1" {...props} />
          <HeadingButton level="2" {...props} />
          <HeadingButton level="3" {...props} />
          <ToolbarDivider />
          <BoldButton {...props} />
          <ItalicButton {...props} />
          <UnderlineButton {...props} />
          {enableMonospace && <VariableButton {...props} />}
          <ToolbarDivider />
          <LinkButton {...props} />
          <UnlinkButton {...props} />
          <ToolbarDivider />
          <BulletListButton {...props} />
          <NumberedListButton {...props} />
          <TableButton {...props} />
          <ImageButton {...props} />
          <AssetButton {...props} />
          <CodeButton {...(props as CodeButtonProps)} />
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
