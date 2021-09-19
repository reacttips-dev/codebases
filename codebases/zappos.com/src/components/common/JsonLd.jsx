import sanitizer from 'sanitizer';

export const returnVideoObjectMeta = data => {
  const metaArray = Object.entries(data).filter(pair => {
    const [key, value] = pair;
    if (key !== '@type' && value) {
      return pair;
    }
  }).reduce((acc, pair) => {
    const [key, value] = pair;
    acc.push(<meta key={`microdata-${key}-${value}`} itemProp={key} content={value} />);
    return acc;
  }, []);

  return metaArray;
};

function JsonLd({ data, videoAsMeta = false }) {
  if (videoAsMeta) {
    return <div itemProp="subjectOf" itemScope itemType={`http://schema.org/${data['@type']}`}>
      { returnVideoObjectMeta(data) }
    </div>;
  } else {
    return <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(JSON.stringify({ '@context': 'http://schema.org', ...data })) }}
    />;
  }
}

export default JsonLd;
