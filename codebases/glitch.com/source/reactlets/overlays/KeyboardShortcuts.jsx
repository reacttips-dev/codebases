import React from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

function Shortcuts({ isMac, all = [], mac = [], nonMac = [] }) {
  const platformSpecificShortcuts = isMac
    ? mac.map((shortcut) => (
        <div key={shortcut} className="key mac-shortcut">
          {shortcut}
        </div>
      ))
    : nonMac.map((shortcut) => (
        <div key={shortcut} className="key all-shortcut">
          {shortcut}
        </div>
      ));
  const allPlatformsShortcuts = all.map((shortcut) => (
    <div key={shortcut} className="key all-shortcut">
      {shortcut}
    </div>
  ));
  return <div className="shortcuts">{allPlatformsShortcuts.concat(platformSpecificShortcuts)}</div>;
}

function ShortcutSection({ title, isMac = false, all = [], mac = [], nonMac = [] }) {
  return (
    <div className="shortcut">
      {title}: <Shortcuts isMac={isMac} all={all} mac={mac} nonMac={nonMac} />
    </div>
  );
}

export default function KeyboardShortcuts() {
  const application = useApplication();
  const visible = useObservable(application.keyboardShortcutsOverlayVisible);
  const isMac = application.isAppleDevice;

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay keyboard-shortcuts-overlay">
        <section className="info">
          <h1>
            Keyboard Shortcuts <Icon icon="musicalKeyboard" />
          </h1>
        </section>

        <section className="info">
          <h2>Global</h2>

          <ShortcutSection title="Show this list" isMac={isMac} all={['?']} />
          <ShortcutSection title="Show app in new window" isMac={isMac} mac={['⌘–Shift–R']} nonMac={['Ctrl–Shift–R']} />
          <ShortcutSection title="Show app next to the code" isMac={isMac} mac={['⌘–Shift–U']} nonMac={['Ctrl–Shift–U']} />
          <ShortcutSection title="Project search" isMac={isMac} mac={['⌘–P', '⌘–K']} nonMac={['Ctrl–P', 'Ctrl–K', 'Ctrl–;']} />
          <ShortcutSection title="Sidebar toggle" isMac={isMac} mac={['⌘–I']} nonMac={['Ctrl–I']} />
          <ShortcutSection title="Rewind toggle" isMac={isMac} mac={['⌘–Shift–M']} nonMac={['Ctrl–Shift–M']} />
          <ShortcutSection title="Close dialog" all={['ESC']} />
        </section>

        <section className="info">
          <h2>Advanced</h2>

          <ShortcutSection title="Export to GitHub" isMac={isMac} mac={['⌘–Shift–E']} nonMac={['Ctrl–Shift–E']} />
          <ShortcutSection title="Logs toggle" isMac={isMac} mac={['⌘–Shift–L']} nonMac={['Ctrl–Shift–L']} />
          <ShortcutSection title="Open console" isMac={isMac} mac={['⌘–Shift–X']} nonMac={['Ctrl–Shift–X']} />
        </section>

        <section className="info">
          <h2>Text Editing</h2>

          <ShortcutSection title="Find text" isMac={isMac} mac={['⌘–F']} nonMac={['Ctrl–F']} />
          <ShortcutSection title="Find and replace" isMac={isMac} mac={['⌘-⌥–F']} nonMac={['Ctrl–Alt–F']} />
          <ShortcutSection title="Jump to line" all={['Ctrl–G']} />
          <ShortcutSection title="Search files" isMac={isMac} mac={['⌘–Shift–F']} nonMac={['Ctrl–Shift–F']} />
          <ShortcutSection title="Format file/selection" isMac={isMac} mac={['⌘-⌥–S']} nonMac={['Ctrl–Alt-S']} />
        </section>

        <section className="info">
          <p>(Text editing shortcuts are mostly like Sublime Text)</p>
        </section>
      </dialog>
    </div>
  );
}
