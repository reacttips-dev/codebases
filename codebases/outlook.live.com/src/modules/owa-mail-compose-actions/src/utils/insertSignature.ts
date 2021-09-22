import type BodyType from 'owa-service/lib/contract/BodyType';
import convertInlineCssForHtml from './convertInlineCssForHtml';
import getDefaultComposeContentBlock from './getDefaultComposeContentBlock';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import setIsDirty from '../actions/setIsDirty';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import { ComposeType } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import {
    ComposeViewState,
    ComposeOperation,
    InsertSignatureTask,
    PostOpenTaskType,
} from 'owa-mail-compose-store';
import { ContentPosition, InsertOption, PositionType } from 'roosterjs-editor-types';
import { format } from 'owa-localize';
import { getStore as getRoamingSignatureStore } from 'owa-mail-signature/lib/store/signatureStore';
import { lazyOperateContent } from 'owa-editor';
import type { Signature as RoamingSignature } from 'owa-mail-signature/lib/store/schema/SignatureStore';
import { lazyLoadFromAttachmentServiceUrl } from 'owa-inline-image-loader';
import { convertAllContentIdToAttachmentUrl } from 'owa-inline-image';
import isRoamingSignatureEnabled from 'owa-roaming-signature-option/lib/utils/isRoamingSignatureEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

// The capital 'S' is important to match jsMVVM
// TODO:45086 Move away from ID and use class to have properly formatted HTML.
const SIGNATURE_ID = 'Signature';
const SIGNATURE_SELECTOR = '#' + SIGNATURE_ID;

function insertSignature(
    viewState: ComposeViewState,
    param?: InsertSignatureTask | string | RoamingSignature,
    replaceExisting?: boolean
): Promise<void> {
    const {
        bodyType,
        operation,
        useSmartResponse,
        addin: { draftComposeType },
    } = viewState;
    const task = isInsertSignatureTask(param) ? param : undefined;
    const isAutoSignature = !!task;
    const forceInsertSignatureOperation = task ? task.forceInsertSignatureOperation : undefined;
    const signatureOperation =
        forceInsertSignatureOperation === undefined ? operation : forceInsertSignatureOperation;
    let signature =
        typeof param === 'string'
            ? param
            : isRoamingSignature(param)
            ? getRoamingSignature(param, bodyType)
            : getDefaultSignature(
                  bodyType,
                  signatureOperation == ComposeOperation.Reply ||
                      signatureOperation == ComposeOperation.ReplyAll ||
                      signatureOperation == ComposeOperation.Forward
              );
    return !replaceExisting && isSignatureEmpty(signature, bodyType)
        ? Promise.resolve()
        : lazyOperateContent.import().then(async operateContent => {
              const loadFromAttachmentServiceUrl = await lazyLoadFromAttachmentServiceUrl.import();

              // Flush any existing content into viewState then let's check if it is dirty now.
              // Later we can reset viewState to not dirty according to this result if necessary
              updateContentToViewState(viewState);
              const isDirty = viewState.isDirty;

              operateContent(
                  viewState,
                  (editor, range) => {
                      const defaultContent = getDefaultComposeContentBlock();
                      const insertOption: InsertOption = {
                          position: ContentPosition.SelectionStart,
                          updateCursor: false,
                          replaceSelection: true,
                          insertOnNewLine: true,
                      };

                      signature = format(
                          // Adding extra layer of div so that duplicate "Signature ID" issue doesn't exist
                          //In current Scenario, if we press enter from middle of signature, it inserts a new div with Signature ID
                          "<div id='{0}'><div>{1}</div></div>",
                          SIGNATURE_ID,
                          signature
                      );

                      editor.addUndoSnapshot(() => {
                          if (replaceExisting) {
                              // This will delete only the node with id "Signature", it doesn't affect the quoted body
                              // because for quoted body, server will change the element id from "Signature" to "x_Signature"
                              const nodes = editor.queryElements(SIGNATURE_SELECTOR);
                              if (nodes.length !== 0) {
                                  editor.select(nodes[0], PositionType.Before);
                                  for (var i = 0; i < nodes.length; i++) {
                                      editor.deleteNode(nodes[i]);
                                  }
                              } else {
                                  // We'd like to replace existing signature but no signature is found, so we can try to insert at end if possible
                                  // When smart response is used (quoted body is not in editor), or this is a new message (no quoted body)
                                  // we can insert at the end
                                  if (useSmartResponse || draftComposeType == ComposeType.New) {
                                      insertOption.position = ContentPosition.End;
                                  } else if (
                                      insertOption.position == ContentPosition.SelectionStart &&
                                      !editor.getSelectionRange()
                                  ) {
                                      insertOption.position = ContentPosition.Begin;
                                  }

                                  signature = defaultContent + signature;
                              }
                          } else {
                              signature = defaultContent + signature;

                              if (editor.getContent() == '') {
                                  // Add one more empty line if editor is empty so there can be
                                  // an empty line between signature and user's new content
                                  signature = defaultContent + signature;
                              }

                              if (isAutoSignature) {
                                  if (viewState.operation == ComposeOperation.EditDraft) {
                                      insertOption.position = ContentPosition.Begin;
                                  } else {
                                      insertOption.position = ContentPosition.End;
                                  }
                              }
                          }

                          if (
                              insertOption.position == ContentPosition.SelectionStart &&
                              !editor.getSelectionRange()
                          ) {
                              // Focus to editor to make sure it has a position to insert the signature
                              editor.focus();
                          }

                          signature = convertInlineCssForHtml(signature, 'HTML');
                          editor.insertContent(signature, insertOption);

                          if (!isFeatureEnabled('cmp-inlineImageV2')) {
                              convertAllContentIdToAttachmentUrl(
                                  editor,
                                  viewState.attachmentWell,
                                  loadFromAttachmentServiceUrl
                              );
                          }
                      }, 'Signature');
                      return range;
                  },
                  (content, selectionStart, selectionEnd) => ({
                      value:
                          content.substr(0, selectionEnd) +
                          '\n\n' +
                          signature +
                          content.substr(selectionEnd),
                      selectionStart,
                      selectionEnd,
                      focus: true,
                  })
              );

              if (!isDirty && isAutoSignature) {
                  // For auto signature scenario, if the viewState was not dirty before inserting signature,
                  // we should not make the viewState dirty since it is just an automatic operation.
                  // It should be safe to discard this draft without warning
                  setIsDirty(viewState, false /*isDirty*/);
              }
          });
}

export default insertSignature;

function getRoamingSignature(signature: RoamingSignature, bodyType: BodyType): string {
    let sigObj = bodyType == 'HTML' ? signature?.html : signature?.txt;

    return sigObj?.value || '';
}

function getDefaultSignature(bodyType: BodyType, isReplyOrForward: boolean): string {
    if (isRoamingSignatureEnabled()) {
        const store = getRoamingSignatureStore();

        let roamingSignatureName = isReplyOrForward
            ? store.defaultReplySignatureName
            : store.defaultSignatureName;

        if (store.roamingSignatureMap.size) {
            if (roamingSignatureName === '') {
                return '';
            } else {
                let signatureObj = store.roamingSignatureMap.get(roamingSignatureName);
                return getRoamingSignature(signatureObj, bodyType);
            }
        }

        return '';
    } else {
        const userOptions = getUserConfiguration().UserOptions;
        return (bodyType == 'HTML' ? userOptions.SignatureHtml : userOptions.SignatureText) || '';
    }
}

function isSignatureEmpty(signature: string, bodyType: BodyType): boolean {
    if (bodyType == 'HTML') {
        // DOMParser returns a HTML document. Need to get the HTML document element;
        const checkEl = new DOMParser().parseFromString(signature, 'text/html').documentElement;
        const signatureImgElList = checkEl?.querySelectorAll('img[src]:not([src=""])') || [];
        const signatureInnerText = checkEl?.textContent.replace(/(\t|\n|\r|\v|\f)/g, '');

        return !signatureInnerText && signatureImgElList.length == 0;
    } else {
        return !signature;
    }
}

function isRoamingSignature(obj: any): obj is RoamingSignature {
    return (<RoamingSignature>obj)?.html !== undefined;
}

function isInsertSignatureTask(obj: any): obj is InsertSignatureTask {
    return (<InsertSignatureTask>obj)?.type === PostOpenTaskType.InsertSignature;
}
