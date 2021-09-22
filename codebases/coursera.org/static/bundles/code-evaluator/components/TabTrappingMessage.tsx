import React, { useState, useEffect, useCallback } from 'react';
import type monaco from 'monaco-editor';
import { Notification } from '@coursera/coursera-ui';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { isMonacoEditorFocused } from 'bundles/code-evaluator/utils/MonacoUtils';
import _t from 'i18n!nls/code-evaluator';

type Props = {
  editor: monaco.editor.IStandaloneCodeEditor | null;
};

/**
 * Tab Trapping
 *
 *   Tab trapping is when an input overrides the default behavior of the Tab key and prevents
 *   navigation using Tab while inside of it. This makes keyboard navigation impossible once
 *   a user has entered the input.
 *
 *   CodeBlock traps Tabs necessarily because it is a code editor. However, it does provide
 *   a way to revert to the default behavior of Tab and allow further navigation.
 *
 *   This message is displayed when a user focuses the given editor using the Tab key
 *   and explains how to revert to the default behavior of Tab.
 *
 * Focus with Tab
 *
 *   As it turns out, the browser's `focus` event does not include information about how an
 *   input was focused. Thus, there is no standard way of detecting when an input has been
 *   tabbed into.
 *
 *   We solve this problem by using two events in conjunction: a keydown on the document
 *   and a keyup on the input.
 *
 *   The job of the document keydown listener is to detect whether the input is already focused.
 *   If it is not, then the next keyup on the input means we have just focused it.
 *
 *   The job of the input keyup listener is to check whether the input was already focused
 *   (thanks to the document keydown listener) and to also check whether the key that was
 *   pressed was the Tab key. If the input was not already focused (we've been newly focused)
 *   and the key was the Tab key, then we have "focused with Tab". At this point, our help
 *   message is displayed.
 *
 * Monaco Editor
 *
 *   This component has a hard dependency on the Monaco editor. This can't be avoided.
 *   Some code somewhere has to know about monaco's API, has to register events in
 *   monaco's special way, has to use monaco's KeyCode constants, etc. The idea behind
 *   this component was to encapsulate all of that away from CodeBlock.
 *
 *   If we ever switch editor libraries, this component will need to be modified.
 */
const TabTrappingMessage: React.FC<Props> = ({ editor }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [wasFocusedOnKeyDown, setWasFocusedOnKeyDown] = useState(false);
  const [initiatedByKeyDownOnDocument, setInitiatedByKeyDownOnDocument] = useState(false);

  // This function is called when the innerworkings of this component decide that the editor
  // has been focused using the Tab key.
  const handleTabFocus = useCallback(() => {
    setShowMessage(true);
  }, []);

  const handleDocumentKeyDown = useCallback(() => {
    setWasFocusedOnKeyDown(isMonacoEditorFocused(editor));

    // Necessary for when tab is pressed and held, generating multiple events.
    setInitiatedByKeyDownOnDocument(true);
  }, [editor]);

  // Ignore any keypress events on the input, unless they are a press-and-hold initiated
  // on the document.
  const handleEditorKeyDown = useCallback(
    (event: monaco.IKeyboardEvent) => {
      if (
        // We don't care about this event.
        event.code !== 'Tab' ||
        // This is likely a press-and-hold initiated on the document.
        initiatedByKeyDownOnDocument
      ) {
        return;
      }

      setWasFocusedOnKeyDown(true);
    },
    [initiatedByKeyDownOnDocument]
  );

  const handleEditorKeyUp = useCallback(
    (event: monaco.IKeyboardEvent) => {
      // Reset this value for the next time, in case it's a press-and-hold.
      setInitiatedByKeyDownOnDocument(false);

      if (
        // The input was already focused on key down, so it can't have been tabbed into on this event.
        wasFocusedOnKeyDown ||
        // The Tab key was not pressed, so we don't care about this event.
        event.keyCode !== 2 || // monaco.KeyCode.Tab - Can't use this here because the editor hasn't been loaded yet.
        // Fail safe. The input is not focused. This shouldn't happen.
        !isMonacoEditorFocused(editor)
      ) {
        return;
      }

      // The input was just focused and Tab was used to focus it.
      handleTabFocus();
    },
    [editor, setInitiatedByKeyDownOnDocument, wasFocusedOnKeyDown, initiatedByKeyDownOnDocument, handleTabFocus]
  );

  const handleEditorBlur = useCallback(() => {
    // Always hide this message when the editor is blurred. We only need it when Tabs are trapped.
    setShowMessage(false);
  }, []);

  useEffect(() => {
    if (editor) {
      document.addEventListener('keydown', handleDocumentKeyDown);
      const editorKeyDownListener = editor.onKeyDown(handleEditorKeyDown);
      const editorKeyUpListener = editor.onKeyUp(handleEditorKeyUp);
      const editorBlurListener = editor.onDidBlurEditorText(handleEditorBlur);

      // This return function is called the next time this useEffect handler is run (presumably
      // with a different, or null, editor instance).
      return () => {
        document.removeEventListener('keydown', handleDocumentKeyDown);
        editorKeyDownListener.dispose();
        editorKeyUpListener.dispose();
        editorBlurListener.dispose();
      };
    }

    return () => {
      /* Do nothing if there is no editor. */
    };
  }, [editor, handleDocumentKeyDown, handleEditorKeyDown, handleEditorKeyUp, handleEditorBlur]);

  if (!showMessage) {
    return null;
  }

  // eslint-disable no-warning-comments
  // HACK(wbowers): This is an undocumented feature of Monaco, but also the only way I could
  // find to get this information. I find this preferrable to having to detect the user's OS
  // and hardcoding key commands.
  // eslint-enable no-warning-comments
  // eslint-disable-next-line typescript-eslint/no-explicit-any
  const untypedEditor: any = editor; // Necessary to get the private `_standaloneKeybindingService` property.
  const keyCommand = untypedEditor._standaloneKeybindingService
    ?.lookupKeybinding?.('editor.action.toggleTabFocusMode')
    ?.getAriaLabel();

  // TODO(wbowers): Send an event when we can't get the key command. I can't do this right now because
  // this is creating build issues, specifically:
  //
  //   - static/bundles/next/lib/i18n/client.ts#L13 - TS2687: All declarations of 'locale' must have identical modifiers.
  //   - static/js/lib/sentry.ts#L17 - TS2687: All declarations of 'locale' must have identical modifiers.
  //   - static/js/lib/sentry.ts#L17 - TS2717: Subsequent property declarations must have the same type.  Property 'locale' must be of type 'string', but here has type 'string | undefined'.
  //
  // if (!keyCommand && getShouldLoadRaven()) {
  //   raven.captureMessage(
  //     `Unable to get toggleTabFocusMode keybinding. We have likely upgraded Monaco to a version that has changed this undocumented API.`,
  //     {
  //       extra: {
  //         type: 'Monaco Failure',
  //         expectedMonacoVersion: '0.20.0',
  //       },
  //       level: 'critical',
  //       tags: { source: 'static/bundles/code-evaluator/components/TabTrappingMessage.tsx' },
  //     }
  //   );
  // }

  return (
    <Notification
      type="info"
      message={
        keyCommand ? (
          <FormattedMessage
            message={_t(
              // This is the exact message found in monaco's own a11y help screen.
              'Pressing Tab in the current editor will insert the tab character. Toggle this behavior by pressing {keyCommand}.'
            )}
            keyCommand={keyCommand}
          />
        ) : (
          // Hopefully this never happens, but just in case we can't get a label for the
          // toggleTabFocusMode command keybinding, at least we can direct the user to the
          // accessibility help screen built into the editor.
          <FormattedMessage
            message={_t(
              `Pressing Tab in the current editor will insert the tab character. View this editor's accessibility help for more information.`
            )}
          />
        )
      }
      isTransient={false}
      isDismissible={false}
    />
  );
};

export default TabTrappingMessage;
