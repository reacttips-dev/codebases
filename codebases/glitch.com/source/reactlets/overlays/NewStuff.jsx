import React, { useEffect, useRef, useCallback } from 'react';
import { Mark } from '@glitchdotcom/shared-components';
import * as Markdown from '../../utils/markdown';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useUserPref from '../../hooks/useUserPref';

const SHOW_NEW_STUFF = 'showNewStuff';
const NEW_STUFF_READ_ID = 'newStuffReadId';
const MAX_UPDATES = 3;

const colorArray = [{ color: '#FFFE01' }, { color: '#C5BCF0' }, { color: '#6DE9A9' }];

export default function NewStuff() {
  const application = useApplication();
  const visible = useObservable(application.newStuffOverlayVisible);
  const [keepShowingMeThese, setKeepShowingMeThese] = useUserPref(SHOW_NEW_STUFF, true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref(NEW_STUFF_READ_ID, 0);

  const updates = useObservable(
    useCallback(() => {
      const entries = application.newStuffLog.updates();
      const totalEntries = application.newStuffLog.totalUpdates();
      const amountUnread = totalEntries - newStuffReadId;
      return entries.slice(0, Math.min(amountUnread, MAX_UPDATES) || MAX_UPDATES);
    }, [application.newStuffLog, newStuffReadId]),
  );

  const prevVisible = useRef(visible);
  useEffect(() => {
    if (prevVisible.current && !visible && updates.length > 0) {
      setNewStuffReadId(updates[0].id);
    }
    prevVisible.current = visible;
  }, [setNewStuffReadId, updates, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay new-stuff-overlay overlay-narrow">
        <section className="info">
          <figure className="new-stuff-doggo" />
          <h1>New Stuff</h1>
          <div className="button-wrap">
            <label className="button" htmlFor="keep-showing-me-these-checkbox">
              <input
                type="checkbox"
                id="keep-showing-me-these-checkbox"
                className="input"
                checked={keepShowingMeThese}
                onChange={(e) => setKeepShowingMeThese(e.target.checked)}
              />
              Keep showing me these
            </label>
          </div>
        </section>
        {updates.map((update, i) => (
          <section className="info" key={update.id}>
            <Mark {...colorArray[i % colorArray.length]}>
              <h2>{update.title}</h2>
            </Mark>
            {/* the content comes from source/new-stuff-log.js, so we can use .renderUnsafe() here */}
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: Markdown.renderUnsafe(update.body) }} />
            {update.link && (
              <p>
                <a className="link" href={update.link}>
                  Read the blog post →
                </a>
              </p>
            )}
          </section>
        ))}
      </dialog>
    </div>
  );
}
