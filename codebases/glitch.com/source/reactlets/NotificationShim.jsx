import React, { useEffect, useState } from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

// Each NotificationShim element takes a template component as a prop. From the template
// it can derive the observable name and watch the observable to keep it in sync with the
// NotificationProvider's state.
export default function NotificationShim({ template: Template, templateName }) {
  const { createNotification, removeNotification } = useNotifications();

  const application = useApplication();
  const observableName = `notify${templateName}`;
  const observable = application[observableName];
  const value = useObservable(observable); // get the observable value

  // null if notification isn't visible, otherwise it's the id of the notification
  const [id, setId] = useState(null);

  useEffect(() => {
    const shouldBeVisible = Boolean(value);
    const currentlyVisible = id !== null;

    if (shouldBeVisible === true && currentlyVisible === false) {
      const nextId = createNotification((props) => (
        <Template
          application={application}
          {...props}
          data-testid={observableName}
          onAnimationEnd={() => {
            props.onClose();
            observable(false);
          }}
          onClose={() => {
            props.onClose();
            observable(false);
          }}
        />
      )).id;
      setId(nextId);
    } else if (shouldBeVisible === false && currentlyVisible === true) {
      removeNotification(id);
      setId(null);
    }
  }, [application, createNotification, id, observableName, observable, removeNotification, setId, value, Template]);

  return null;
}
