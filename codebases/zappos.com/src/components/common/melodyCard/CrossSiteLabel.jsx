import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/crossSiteLabel.scss';

const CrossSiteLabel = ({ storeName }) => {
  const { testId } = useMartyContext();
  if (storeName) {
    return (
      <p
        className={cn(
          css.crossSiteLabel,
          { [css.zenCrossSiteLabel]: storeName.includes('zen') },
          { [css.vrsnlCrossSiteLabel]: storeName.includes('vrsnl') })}
        data-test-id={testId('crossSiteLabel')}
        aria-label={`Available on ${storeName}.com`}>
        {`${storeName}.com`}
      </p>
    );
  }
  return null;
};

export default CrossSiteLabel;
