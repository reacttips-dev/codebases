import React from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import UserAgent from 'js/lib/useragent';
import isHotkey from 'is-hotkey';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import { Editor, getEventTransfer } from 'slate-react';
import { Value, Block, KeyUtils, Document } from 'slate';
import type { Schema, Mark } from 'slate';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import AssetAdminModalV2 from 'bundles/asset-admin/components/AssetAdminModalV2';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import AssetManager from 'js/lib/AssetManager';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import HtmlSerializer from 'slate-html-serializer';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import editList from 'slate-edit-list';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import editTable from 'slate-edit-table';
import { Notification } from '@coursera/coursera-ui';
import type { Asset as AssetType } from 'bundles/asset-admin/types/assets';

import type {
  CmlContent,
  CodeBlockOptions,
  AssetAdminOptions,
  ImageUploadOptions,
  OptionsContext,
} from 'bundles/cml/types/Content';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';
import _t from 'i18n!nls/authoring';
import {
  Paragraph,
  Text,
  Heading,
  Link,
  BulletList,
  NumberList,
  ListItem,
  Image,
  Asset,
  Code,
  CodeV2,
  Loader,
  Table,
  TableRow,
  TableCell,
  PersonalizationTag,
} from '../renderers';
import type { LinkProps } from '../renderers/Link';
import type { TableProps } from '../renderers/Table';
import type { CodeProps } from '../renderers/Code';
import type { CodeV2Props } from '../renderers/CodeV2';
import MacrosIndicator from './MacrosIndicator';
import { EditorToolbar } from './toolbar';
import { MARKS, BLOCK_TYPES, EDITOR_SCHEMA } from '../constants';
import { slateToCml, cmlToSlate } from '../utils/contentUtils';
import HTML_PASTE_RULES from '../rules';
import { boldPlugin, Bold } from '../plugins/Bold';
import { italicPlugin, Italic } from '../plugins/Italic';
import { underlinePlugin, Underline } from '../plugins/Underline';
import { variablePlugin, Variable, isVariableHotkey } from '../plugins/Variable';
import { ListUtils } from '../plugins/List';
import { linkPlugin, hasLink } from '../plugins/Link';
import { TableUtils } from '../plugins/Table';
import { getAttributes } from '../utils/slateUtils';
import type {
  SlateValue,
  SlateSchema,
  CustomEventType,
  SlateChange,
  SlateNodeJSON,
  SlateEventTransfer,
  SlateBlock,
  SlateRenderNodeProps,
} from '../types';

import 'css!./__styles__/CMLEditorV2';

// all supported plugins for editor
const plugins = [
  boldPlugin(),
  italicPlugin(),
  underlinePlugin(),
  linkPlugin(),
  variablePlugin(),
  editList({
    types: [BLOCK_TYPES.BULLET_LIST, BLOCK_TYPES.NUMBER_LIST],
    typeItem: BLOCK_TYPES.LIST_ITEM,
  }),
  editTable({
    typeTable: BLOCK_TYPES.TABLE,
    typeRow: BLOCK_TYPES.TABLE_ROW,
    typeCell: BLOCK_TYPES.TABLE_CELL,
    typeContent: BLOCK_TYPES.PARAGRAPH,
  }),
];

const isTabHotKey = isHotkey('tab');
const isBackSpaceKey = isHotkey('backspace');
const isShiftTabHotKey = isHotkey('shift+tab');
const isEnterHotKey = isHotkey('return');
const isShiftEnterHotKey = isHotkey('shift+return');
const isModEnterHotKey = isHotkey('mod+return');

const INVALID_CML_MESSAGE_DURATION = 5000; // milliseconds to show transient notification for.
const SLATE_EDITOR_CLASS = 'slate-editor';

export type Props = {
  initialCML?: CmlContent;
  onContentChange: (cml: CmlContent) => void;
  contentId?: string;
  shouldDebounceChanges?: boolean; // debounce upstream changes assuming they make API calls to update cml
  enableHtmlPaste?: boolean; // whether we want to handle pasted content as html
  isToolbarAtTop?: boolean; // whether to render toolbar at top or bottom
  isToolbarCompact?: boolean; // whether to render toolbar in compact style
  isToolbarBottomSticky?: boolean; // whether to render toolbar fixed to bottom of page
  debounceDuration?: number; // milliseconds to wait before updating upstream, based on https://ux.stackexchange.com/questions/95336/how-long-should-the-debounce-timeout-be
  focusOnLoad?: boolean; // force focus on editor when it mounts. Disabled by default since multiple editors could be rendered on the same page.
  customTools?: Array<React.ReactElement> | null; // custom list of toolbar buttons to use instead of the default. See EditableFAQItem.jsx for example usage.
  placeholder?: string;
  codeBlockOptions?: CodeBlockOptions;
  uploadOptions?: {
    image?: ImageUploadOptions;
    asset?: AssetAdminOptions;
  };
  /** isLearnerUpload:
    - controls elements to hide in the case of learner-side uploads on forums, false by default.
    - TODO: make this the default instead to minimize impact if someone forgets to enable it for a non-partner use case
      - this would involve updating all partner instances via InplaceCMLEditor and others
      - alternately, we could have this editor read the current route/app and set the flag automatically
    [fe-tech-debt] since we're now using this editor on learner-side as well (ForumsCmlEditor), we should refactor out the
    common logic into a base component and only leave the authoring-specific overrides in here, such as asset contexts.
  */
  isLearnerUpload?: boolean;
  macros?: Array<string>;
  enableMonospace?: boolean; // whether to allow monospaced font, enabled by default
  enableSoftBreaks?: boolean; // adds newline when shift+Enter is pressed - enabled by default
  ariaLabel?: string;
  ariaRequired?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

type State = {
  value: SlateValue;
  assetIds: Array<string>;
  assetMap: Record<string, AssetType>;
  showAssetModal: boolean;
  isUploadingImage: boolean;
  handleAssetModalSelect: ((selectedAssets: Array<AssetType>) => void) | undefined;
  handleAssetModalCancel: (() => void) | undefined;
  showECBConfigModal: boolean;
  ECBModalComponent: React.ReactElement | null;
  isReadOnly: boolean;
  isFocused: boolean;
  invalidCMLMessage: string; // shows a notification with the message. used for invalid copy-paste messaging.
  useAutoCorrectSpellChecks: boolean; // default enabled, and disabled temporarily for Safari (see CP-4581)
};

/*
 * A Slate cml editor wrapper that interfaces with CML.
 * Takes care of cml <> slate data conversion so that any CML passed as props is rendered as
 * editable slate content, and any content changes are passed back upstream as a CML object.
 *
 */
class CMLEditorV2 extends React.Component<Props, State> {
  schema: SlateSchema;

  useMonacoEditor: boolean;

  assetManager: AssetManager;

  serializer: HtmlSerializer | null = null;

  editorNode: Editor | null = null;

  static defaultProps = {
    shouldDebounceChanges: true,
    enableHtmlPaste: true,
    isToolbarAtTop: false,
    isToolbarCompact: false,
    isToolbarBottomSticky: false,
    debounceDuration: 500,
    focusOnLoad: false,
    customTools: null,
    placeholder: '',
    enableMonospace: true,
    enableSoftBreaks: true,
    ariaLabel: '',
    ariaLabelledBy: '',
    macros: [],
  };

  constructor(props: Props) {
    super(props);

    this.state = this.resetState(props);

    // setup editor schema: https://docs.slatejs.org/slate-core/schema
    this.schema = Object.assign({}, EDITOR_SCHEMA);
    this.useMonacoEditor = isMonacoEnabled();

    // setup single asset manager instance per editor
    this.assetManager = new AssetManager();
  }

  componentWillMount() {
    const { shouldDebounceChanges, enableHtmlPaste, debounceDuration } = this.props;

    if (shouldDebounceChanges) {
      this.onChange = debounce(this.onChange, debounceDuration);
    }

    if (enableHtmlPaste) {
      // deserializes pasted html as determined by schema at './rules.js'
      this.serializer = new HtmlSerializer({ rules: HTML_PASTE_RULES });
    }
  }

  componentDidMount() {
    const { focusOnLoad, ariaLabelledBy, ariaLabel, ariaDescribedBy, ariaRequired } = this.props;

    const editor = document.querySelector(`.${SLATE_EDITOR_CLASS} div[data-slate-editor="true"]`);
    const formPartQuestionGroup = document.querySelector(`.rc-FormPartsQuestion[aria-labelledby="${ariaLabelledBy}"]`);

    // add a11y attributes manually because Slate does not currently support
    // a11y props beyond the "role" attribute (https://github.com/ianstormtaylor/slate/issues/2572)
    if (editor) {
      if (ariaLabel) {
        editor.setAttribute('aria-label', ariaLabel);
      }

      if (ariaDescribedBy) {
        editor.setAttribute('aria-describedby', ariaDescribedBy);
      }

      if (ariaRequired) {
        editor.setAttribute('aria-required', ariaRequired);
      }

      /* remove the formPart question group aria-label and manually
         set an aria-label for the editor to ensure the editor passes
         axe's test that expects every contenteditable to have an aria-label
      */
      if (formPartQuestionGroup && ariaLabelledBy) {
        formPartQuestionGroup.removeAttribute('aria-labelledby');
        editor.setAttribute('aria-labelledby', ariaLabelledBy);
      }
    }

    if (focusOnLoad && this.editorNode) {
      this.editorNode.focus();
      this.setState({
        isFocused: true,
      });
    }

    // temp disable autocorrect+spellchecks for Safari, see CP-4581
    const isSafari = new UserAgent(navigator.userAgent).browser.name === 'Safari';
    this.setState({ useAutoCorrectSpellChecks: !isSafari });

    // custom event target for html copy-paste, see `rules.ts` for the dispatchEvent()
    // typecast to generic EventListener since this is a CustomEvent fired from `rules.ts`
    document.addEventListener('onInvalidCml', this.handleOnInvalidCML as EventListener);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { contentId, initialCML } = this.props;
    const { showAssetModal, value, showECBConfigModal, assetIds, assetMap, invalidCMLMessage } = this.state;

    return (
      nextProps.contentId !== contentId ||
      CMLUtils.getValue(nextProps.initialCML) !== CMLUtils.getValue(initialCML) ||
      !nextState.value.equals(value) || // Immutable Record equality check
      nextState.showAssetModal !== showAssetModal ||
      nextState.showECBConfigModal !== showECBConfigModal ||
      nextState.assetIds.length !== assetIds.length ||
      !isEqual(nextState.assetMap, assetMap) ||
      nextState.invalidCMLMessage !== invalidCMLMessage
    );
  }

  componentWillUnmount() {
    // typecast to generic EventListener since this is a CustomEvent fired from `rules.ts`
    document.removeEventListener('onInvalidCml', this.handleOnInvalidCML as EventListener);
  }

  // callback for every edit inside slate editor
  handleChange = ({ value }: { value: SlateValue }) => {
    const { value: stateValue } = this.state;
    // only propagate actual changes to document to upstream
    if (!value.document.equals(stateValue.document)) {
      // onChange will be debounced to actually convert Slate -> CML and save upstream
      this.onChange({ value });
    }

    // disable editing while content is loading, represented by the presence of at least one LOADER
    if (value.blocks.some((block: SlateBlock) => block.type === BLOCK_TYPES.LOADER)) {
      this.setState({
        isReadOnly: true,
      });
    } else {
      this.setState({
        isReadOnly: false,
      });
    }

    // update editor state so changes are reflected on editing
    this.setState({ value });
  };

  handleOnInvalidCML = ({ detail }: CustomEventType) => {
    this.setState({
      invalidCMLMessage: detail ? detail.message : '',
    });
  };

  // convert `value` to cml for upstream consumption
  onChange = ({ value }: { value: SlateValue }) => {
    const { onContentChange, initialCML, contentId, enableMonospace } = this.props;

    if (!onContentChange) {
      return;
    }

    const cml: CmlContent = {
      typeName: 'cml',
      definition: {
        dtdId: CMLUtils.getDtdId(initialCML) || '',
        value: `<co-content>${slateToCml(value.document?.nodes, enableMonospace)}</co-content>`,
      },
    };
    console.info('[CMLEditorV2] contentId: ', contentId); // eslint-disable-line no-console
    console.info('[CMLEditorV2] final cml: ', cml.definition.value); // eslint-disable-line no-console

    onContentChange(cml);
  };

  onFocus = (event: Event, change: SlateChange) => {
    const { onFocus } = this.props;

    this.setState({
      isFocused: true,
    });

    if (onFocus) {
      onFocus();
    }

    return change.focus();
  };

  onBlur = () => {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }
  };

  // handle html pastes
  onPaste = (event: Event, change: SlateChange): boolean | undefined => {
    const { enableHtmlPaste } = this.props;
    const transfer = getEventTransfer(event) as SlateEventTransfer;

    // eslint-disable-next-line no-console
    console.info(
      '[CMLEditorV2] Pasted content: ',
      JSON.stringify({
        type: transfer.type,
        content: transfer.html || transfer.fragment || transfer.text,
      })
    );

    // handle pasting from within the editor or between editors
    if (transfer.type === 'fragment' && transfer.fragment) {
      change.insertFragment(transfer.fragment);
      return true;
    }

    // handle plain text pasting
    if (transfer.type === 'text') {
      change.insertText(transfer.text || '');
      return true;
    }

    if (transfer.type === 'html' && this.serializer) {
      if (!enableHtmlPaste) {
        // paste as plaintext when html pasting is disabled
        change.insertText(transfer.text || '');
        return true;
      }

      if ((transfer.html || '').includes('<math>')) {
        // TODO: surface as UX-friendly error message, with suggestion such as "make sure to wrap with $$ again"
        console.info('[CMLEditorV2] Pasted content contained math and thus was pasted as plain-text'); // eslint-disable-line no-console
        this.handleOnInvalidCML({
          detail: {
            message: _t(
              'The pasted content contained some math, and was handled as plain-text. Please make sure to re-add the "$$" delimiters to maintain any MathJax formatting.'
            ),
          },
        });

        change.insertText(transfer.text || '');
        return true;
      }

      // handle pasting from html
      const { document } = this.serializer.deserialize(transfer.html || '');
      const spacerBlock = new Block({
        key: KeyUtils.create(),
        type: BLOCK_TYPES.PARAGRAPH,
      });

      // add a spacer block after pasted content so there's always room to keep editing
      change.insertFragment(new Document({ nodes: document.nodes.push(spacerBlock) }));
      return true;
    }
  };

  // customize behavior for certain keypresses in the editor
  onKeyDown = (event: Event, change: SlateChange) => {
    const { enableMonospace } = this.props;
    const { enableSoftBreaks } = this.props;

    if (isBackSpaceKey(event as KeyboardEvent)) {
      if (change.value.blocks.some((block) => block.type === BLOCK_TYPES.CODE) && this.useMonacoEditor) {
        // eslint-disable-next-line no-alert
        if (!window.confirm(_t('Are you sure you want to remove this code block?'))) {
          return false;
        }
      }
    }

    // prevent tabbing for lists since we don't support nested lists right now
    if (
      (isTabHotKey(event as KeyboardEvent) || isShiftTabHotKey(event as KeyboardEvent)) &&
      ListUtils.isSelectionInList(change.value)
    ) {
      return false;
    }

    // handle Enter presses for block types
    if (
      isEnterHotKey(event as KeyboardEvent) ||
      isShiftEnterHotKey(event as KeyboardEvent) ||
      isModEnterHotKey(event as KeyboardEvent)
    ) {
      // on a HEADING block, reset the block type to PARAGRAPH
      if (change.value.blocks.some((block) => block.type === BLOCK_TYPES.HEADING)) {
        return change.insertBlock(BLOCK_TYPES.PARAGRAPH);
      }

      // disables Enters within a table since we only support single-lined content inside
      if (isEnterHotKey(event as KeyboardEvent) && TableUtils.isSelectionInTable(change.value)) {
        return false;
      }

      if (isShiftEnterHotKey(event as KeyboardEvent)) {
        if (enableSoftBreaks) {
          return change.insertText('\n');
        }
        return false;
      }
    }

    // disable monospaced font hotkey (backtick)
    // TODO: remove after we enable <a>/<var> combo on backend DTD
    if (!enableMonospace || hasLink(change.value)) {
      if (isVariableHotkey(event as KeyboardEvent)) {
        return false;
      }
    }
  };

  // construct Value data for slate editor
  getValue = (nodes: Array<SlateNodeJSON>) => Value.fromJSON({ document: { nodes } });

  // used by renderers to fetch asset information by assetId
  async getAsset(assetId: string): Promise<{ [key: string]: AssetType }> {
    const { assetMap } = this.state;

    if (!assetMap[assetId]) {
      const assetData = await this.fetchAssets([assetId]);

      this.setState({ assetMap: Object.assign(assetMap, { [assetId]: assetData }) });

      return {
        ...assetData,
      };
    }

    return assetMap;
  }

  async fetchAssets(assetIds: Array<string>): Promise<Record<string, AssetType>> {
    // fetch asset info from ids
    const assetMap = await this.assetManager.getAssetMap(assetIds);

    return assetMap;
  }

  toggleAssetModal = (
    showAssetModal = false,
    isUploadingImage = false,
    handleAssetModalSelect: ((selectedAssets: Array<AssetType>) => void) | undefined,
    handleAssetModalCancel: (() => void) | undefined
  ) => {
    /*
      Sets the modal component to render for a child Asset block when a modal is opened.
      Currently this is from AssetAdminModalV2.tsx
      The modal needs to be rendered outside the of Asset.jsx renderer block, since it is a 'void' slate node.
    */
    this.setState({ showAssetModal, isUploadingImage, handleAssetModalSelect, handleAssetModalCancel });
  };

  toggleEcbConfigModal = (showECBConfigModal = false, ECBModalComponent: React.ReactElement | null = null) => {
    /*
      Sets modal component to render for a child ECB when the config is opened. Currently this is
      either from CMLCodeEditorEvaluatorConfig.tsx or CMLCodeEditorEvaluatorDropdown.tsx.
      The modal needs to be rendered outside the of Code.jsx renderer block, since it is a 'void' slate node.
    */
    this.setState({ showECBConfigModal, ECBModalComponent });
  };

  resetState = (props: Props) => {
    const { slateNodes, assetIds } = cmlToSlate(
      CMLUtils.isEmpty(props.initialCML) ? '' : CMLUtils.getValue(props.initialCML)
    );

    return {
      value: this.getValue(slateNodes),
      assetIds,
      assetMap: {},
      showAssetModal: false,
      isUploadingImage: false,
      handleAssetModalSelect: undefined,
      handleAssetModalCancel: undefined,
      showECBConfigModal: false,
      ECBModalComponent: null,
      isReadOnly: false,
      isFocused: false,
      invalidCMLMessage: '', // shows a notification with the message. used for invalid copy-paste messaging.
      useAutoCorrectSpellChecks: true,
    };
  };

  resetInvalidCMLMessage = () => this.setState({ invalidCMLMessage: '' });

  // custom marks renderer
  renderMark = (props: { mark: Mark; attributes: React.HTMLAttributes<HTMLElement>; children: React.ReactNode }) => {
    const { enableMonospace } = this.props;
    switch (props.mark.type) {
      case MARKS.BOLD:
        return <Bold {...props} />;
      case MARKS.ITALIC:
        return <Italic {...props} />;
      case MARKS.UNDERLINE:
        return <Underline {...props} />;
      case MARKS.VARIABLE:
        return <Variable {...props} enableMonospace={enableMonospace || false} />;
      default:
        return null;
    }
  };

  // custom node renderer
  renderNode = (props: SlateRenderNodeProps) => {
    const { codeBlockOptions } = this.props;

    switch (props.node.type) {
      case BLOCK_TYPES.PARAGRAPH:
        return <Paragraph {...props} />;
      case BLOCK_TYPES.LINK:
        return <Link {...(props as LinkProps)} />;
      case BLOCK_TYPES.HEADING:
        return <Heading {...props} />;
      case BLOCK_TYPES.BULLET_LIST:
        return <BulletList {...props} />;
      case BLOCK_TYPES.NUMBER_LIST:
        return <NumberList {...props} />;
      case BLOCK_TYPES.LIST_ITEM:
        return <ListItem {...props} />;
      case BLOCK_TYPES.IMAGE:
        return <Image {...props} getAsset={(assetId) => this.getAsset(assetId)} />;
      case BLOCK_TYPES.ASSET:
        // render image assets as inline images (https://coursera.atlassian.net/browse/CP-1419)
        return getAttributes(props.node).assetType === 'image' ? (
          <Image {...props} getAsset={(assetId) => this.getAsset(assetId)} />
        ) : (
          <Asset {...props} getAsset={(assetId) => this.getAsset(assetId)} />
        );
      case BLOCK_TYPES.TABLE:
        return <Table {...(props as TableProps)} />;
      case BLOCK_TYPES.TABLE_ROW:
        return <TableRow {...props} />;
      case BLOCK_TYPES.TABLE_CELL:
        return <TableCell {...props} />;
      case BLOCK_TYPES.CODE:
        return this.useMonacoEditor ? (
          <CodeV2
            {...(props as CodeV2Props)}
            codeBlockOptions={codeBlockOptions}
            toggleEcbConfigModal={this.toggleEcbConfigModal}
          />
        ) : (
          <Code
            {...(props as CodeProps)}
            codeBlockOptions={codeBlockOptions}
            toggleEcbConfigModal={this.toggleEcbConfigModal}
          />
        );
      case BLOCK_TYPES.TEXT:
        return <Text {...props} />;
      case BLOCK_TYPES.LOADER:
        return <Loader {...props} />;
      case BLOCK_TYPES.PERSONALIZATION_TAG:
        return <PersonalizationTag {...props} />;
      case BLOCK_TYPES.PLACEHOLDER:
      default:
        return <span {...props.attributes}>{props.children}</span>;
    }
  };

  renderEditorToolbar = () => {
    const {
      isToolbarAtTop,
      isToolbarCompact,
      isToolbarBottomSticky,
      uploadOptions,
      codeBlockOptions,
      customTools,
      enableMonospace,
    } = this.props;
    const { value, isReadOnly, isFocused } = this.state;
    const editorProps = {
      value,
      onChange: this.handleChange,
      assetManager: this.assetManager,
      uploadOpts: uploadOptions,
      toggleAssetModal: this.toggleAssetModal,
      isToolbarAtTop,
      isToolbarBottomSticky,
      isDisabled: isReadOnly || !isFocused,
      isToolbarCompact,
      codeBlockOptions,
      enableMonospace,
    };

    if (customTools) {
      // custom tools are passed as children
      return <EditorToolbar {...editorProps}>{customTools}</EditorToolbar>;
    }

    return <EditorToolbar {...editorProps} />;
  };

  render() {
    const {
      isToolbarAtTop,
      isToolbarBottomSticky,
      uploadOptions,
      contentId,
      macros,
      placeholder,
      enableMonospace,
      isLearnerUpload,
      initialCML,
    } = this.props;
    const {
      value,
      showAssetModal,
      isUploadingImage,
      isReadOnly,
      showECBConfigModal,
      ECBModalComponent,
      handleAssetModalSelect,
      handleAssetModalCancel,
      invalidCMLMessage,
      useAutoCorrectSpellChecks,
    } = this.state;

    return (
      <div
        className={cx('rc-CMLEditorV2', {
          'toolbar-top': isToolbarAtTop,
          'toolbar-bottom-sticky': isToolbarBottomSticky,
          'show-placeholder': CMLUtils.isEmpty(initialCML) && !!placeholder,
        })}
        key={contentId}
      >
        {invalidCMLMessage && (
          <div className="notifications-container">
            <div className="notification">
              <Notification
                type="warning"
                message={invalidCMLMessage}
                style={{ width: 700 }}
                isTransient={true}
                transientDuration={INVALID_CML_MESSAGE_DURATION}
                isDismissible={true}
                onDismiss={this.resetInvalidCMLMessage}
              />
            </div>
          </div>
        )}
        <div className={SLATE_EDITOR_CLASS}>
          {isToolbarAtTop && this.renderEditorToolbar()}
          <Editor
            readOnly={isReadOnly}
            value={value}
            placeholder={placeholder}
            schema={this.schema as Schema} // safely typecast SchemaProperties to Schema, based on current working behavior.
            onChange={this.handleChange}
            onPaste={this.onPaste}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
            plugins={plugins}
            key={contentId}
            ref={(node) => {
              this.editorNode = node;
            }}
            autoCorrect={useAutoCorrectSpellChecks} // separate flags on the editor,
            spellCheck={useAutoCorrectSpellChecks} // but we control them together
          />
          {!isToolbarAtTop && !isToolbarBottomSticky && this.renderEditorToolbar()}
          <MacrosIndicator macros={macros || []} cml={slateToCml(value.document?.nodes, enableMonospace)} />
        </div>
        {isToolbarBottomSticky && this.renderEditorToolbar()}
        {/* render modals from void block types */}
        {showAssetModal && uploadOptions && (
          <AssetAdminModalV2
            assetContext={uploadOptions.asset?.context as OptionsContext}
            // use learner-specific asset creation endpoints when passed in
            assetCreationUrl={
              isLearnerUpload
                ? uploadOptions.asset?.assetCreationUrl || uploadOptions.image?.assetCreationUrl
                : undefined
            }
            title={isUploadingImage ? _t('Embed Images') : _t('Attach Assets')}
            onConfirmHandler={handleAssetModalSelect}
            onCancel={handleAssetModalCancel}
            assetType={isUploadingImage ? 'image' : undefined}
            allowMultiple={true}
            helperLinkId={isLearnerUpload ? undefined : '360039540792'} // hide "Learn More" for learners until we have a learner-specific article
            hideAssetLibraryLink={isLearnerUpload}
            disablePluginSources={isLearnerUpload}
            description={
              isLearnerUpload
                ? _t(
                    'You can add {fileTypes, plural, =0 {an image} other {images}} to your content by importing {fileTypes, plural, =0 {a file} other {one or more files}} here.'
                  )
                : undefined
            }
          />
        )}
        {showECBConfigModal && ECBModalComponent}
      </div>
    );
  }
}

export default deferToClientSideRender(CMLEditorV2);
