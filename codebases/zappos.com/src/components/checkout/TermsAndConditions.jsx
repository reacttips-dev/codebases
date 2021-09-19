import css from 'styles/components/checkout/termsAndConditions.scss';

const TermsAndConditions = () => (
  <div className={css.termsAndConditionsWapper}>
    <div className={css.title}>Free 365 Day Returns</div>
    <p>
      If you are not 100% satisfied with your purchase, you have 365 days to return. Here are some tips on returning item(s):
    </p>
    <ul className={css.termList}>
      <li className={css.item1}>
        Item is unworn, unwashed and undamaged.
      </li>
      <li className={css.item2}>
        Item is in original condition, with any hygiene strips, packaging, labels or tags intact.
      </li>
      <li className={css.item3}>
        Items returned in unacceptable condition may not qualify for a refund.
      </li>
    </ul>
  </div>
);

export default TermsAndConditions;
