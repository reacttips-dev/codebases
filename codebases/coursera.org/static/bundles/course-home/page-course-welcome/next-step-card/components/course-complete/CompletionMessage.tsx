import React from 'react';

import _t from 'i18n!nls/course-home';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import 'css!./__styles__/CompletionMessage';

type Props = {
  course: {
    id: string;
    name: string;
  };

  s12n?: {
    courseIds: Array<string>;
  };
};

const CompletionMessage: React.SFC<Props> = (props) => {
  const {
    course: { id, name },
    s12n,
  } = props;

  let completionMessage = (
    <FormattedHTMLMessage
      message={_t('<span>You\'ve successfully completed </span><span class="bold">{name}</span><span>!</span>')}
      name={name}
    />
  );

  if (s12n) {
    completionMessage = (
      <FormattedHTMLMessage
        message={_t(
          `
            <span>You've successfully completed Course {index} of {totalCount}:</span>
            <span class="bold">{name}</span><span>!</span>
          `
        )}
        name={name}
        index={s12n.courseIds.indexOf(id) + 1}
        totalCount={s12n.courseIds.length}
      />
    );
  }

  return <div className="rc-CompletionMessage">{completionMessage}</div>;
};

export default CompletionMessage;
