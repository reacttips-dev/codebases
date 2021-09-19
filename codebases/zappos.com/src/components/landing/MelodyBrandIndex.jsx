import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { buildSeoBrandString } from 'helpers/SeoUrlBuilder';

import css from 'styles/components/landing/melodyBrandIndex.scss';

export const MelodyBrandIndex = ({ pageName, slotName, slotIndex, slotDetails, onComponentClick }, { testId, marketplace }) => {
  const { landing: { melodyBrandIndex: { useSearchSlashUrls } = {} } } = marketplace;
  const { brands, index: alphaHeader, monetateId } = slotDetails;

  const makeBrandLink = ({ id, name }) => (
    <li key={id}>
      <Link
        to={useSearchSlashUrls ? `/search/null/filter/brandNameFacet/${encodeURIComponent(name)}` : buildSeoBrandString(name, id)}
        data-eventlabel="melodyBrandIndex"
        data-eventvalue={`brandId-${id}-name-${name}`}
        data-slotindex={slotIndex}
        onClick={onComponentClick}
        data-test-id={testId('melodyBrandIndexBrandname')}>
        {name}
      </Link>
    </li>
  );

  return (
    <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
      {/* Do not show the alpha header on brand pages for specific letters. i.e. '/c/brands-n' */}
      {pageName === 'brands' &&
        <h2>{alphaHeader}</h2>
      }
      <ul>
        {brands.map(brand => makeBrandLink(brand))}
      </ul>
    </div>
  );
};

MelodyBrandIndex.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object.isRequired
};

export default withErrorBoundary('MelodyBrandIndex', MelodyBrandIndex);
