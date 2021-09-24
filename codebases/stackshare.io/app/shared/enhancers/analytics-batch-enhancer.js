import React from 'react';

export const defaultGenerateKey = c => `${c.type}|${c.id}`;

export const withBatchTracking = (
  mapPropsToContent,
  track,
  generateKey = defaultGenerateKey
) => Component => {
  const _tracked = new Set(); // store tracked items

  const processBatch = (props, prevProps) => {
    // Content is in the form: {type: 'article', id: '123'}
    const prevContent = mapPropsToContent(prevProps);
    const content = mapPropsToContent(props);

    if (content.length > 0 && content.length !== prevContent.length) {
      let batch = content.filter(c => c && !_tracked.has(generateKey(c, props)));
      if (batch.length) {
        track(batch, props);
        batch.forEach(c => _tracked.add(generateKey(c, props)));
      }
    }
  };

  return class Tracker extends React.Component {
    componentDidMount() {
      processBatch(this.props, {});
    }

    componentDidUpdate(prevProps) {
      processBatch(this.props, prevProps);
    }

    render() {
      return <Component {...this.props} />;
    }
  };
};
