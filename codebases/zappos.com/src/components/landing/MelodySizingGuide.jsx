import { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import cn from 'classnames';

import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { getFromSessionStorage, saveToSessionStorage } from 'helpers/ClientUtils';

import css from 'styles/components/landing/melodySizingGuide.scss';

const SIZING_GUIDE_KEY_NAME = 'sizingGuidePreferences';

const countryOptions = new Map();
countryOptions.set('usac', 'US & Canada');
countryOptions.set('uk', 'UK');
countryOptions.set('eur', 'Europe');
countryOptions.set('in', 'Inches');
countryOptions.set('cm', 'Centimeters');

const genderFacetMapping = {
  mens: { sizeFacetName: 'hc_men_size', genderFacetValue: 'Men' },
  womens: { sizeFacetName: 'hc_women_size', genderFacetValue: 'Women' }
};

export class MelodySizingGuide extends Component {
  constructor(props) {
    super(props);

    this.sizingGuide = new Map();
    this.sizingGuide.set('womens', this.mapProps('womens', 'Women\'s'));
    this.sizingGuide.set('mens', this.mapProps('mens', 'Men\'s'));
    this.sizingGuide.set('bigkids', this.mapProps('bigkids', 'Big Kids\' (7 - 12 years)'));
    this.sizingGuide.set('littlekids', this.mapProps('littlekids', 'Little Kids\' (4 - 7 years)'));
    this.sizingGuide.set('toddler', this.mapProps('toddler', 'Toddlers\' (9 month - 4 years)'));
    this.sizingGuide.set('infant', this.mapProps('infant', 'Infants\' (0 - 9 months)'));
  }

  state = {
    gender: '',
    sizeOne: '',
    typeOne: 'usac',
    sizeTwo: '',
    typeTwo: 'eur'
  };

  componentDidMount = () => {
    // to handle back/forward cache (Chrome and Safari mantain gender selection on <select>; Firefox does not)
    const preferences = getFromSessionStorage(SIZING_GUIDE_KEY_NAME);
    this.setState(preferences);
  };

  savePreferences = () => {
    const { gender, sizeOne, typeOne, sizeTwo, typeTwo } = this.state;

    if (gender && sizeOne) {
      saveToSessionStorage(SIZING_GUIDE_KEY_NAME, JSON.stringify({ gender, sizeOne, typeOne, sizeTwo, typeTwo }));
    }
  };

  mapProps = (prefix, name) => {
    const { slotDetails } = this.props;

    return {
      name,
      value: prefix,
      heading: slotDetails[`${prefix}heading`],
      link: slotDetails[`${prefix}link`],
      cta: slotDetails[`${prefix}cta`],
      table: slotDetails[`${prefix}table`]
    };
  };

  makeGenderList = () => {
    const list = [];
    this.sizingGuide.forEach(details => list.push(<option key={`genderList_${details.value}`} value={details.value}>{details.name}</option>));
    return list;
  };

  makeSizeCharts = () => {
    const tables = [];
    const { gender } = this.state;

    this.sizingGuide.forEach(details => {
      if (!gender || details.value === gender) {
        tables.push(this.makeSizeChart(details));
      }
    });

    return tables;
  };

  makeSizeChart = details => {
    const { name, value, heading, link, cta, table } = details;
    const { onComponentClick, slotIndex } = this.props;

    const linkProps = {
      'onClick': onComponentClick,
      'data-eventlabel': 'melodySizingGuide',
      'data-eventvalue': cta,
      'data-slotindex': slotIndex
    };

    return (
      <div key={`sizeChart_${value}`}>
        <section>
          <h3>{heading}</h3>
          <LandingPageLink url={link} {...linkProps}>
            {cta}
          </LandingPageLink>
        </section>

        <div className={css.tableContainer}>
          <table>
            <caption>{heading && `${heading} in various measurements`}</caption>

            <thead>
              <tr>
                <th scope="col">Unit</th>
                <th colSpan={table.usac.length} scope="col">{heading} Sizes</th>
              </tr>
            </thead>

            <tbody>
              {this.makeCountryRow(name, value, table)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  makeCountryRow = (name, value, table) => {
    const list = [];
    const { gender, sizeOne, typeOne } = this.state;
    const sizeOneIndex = this.sizingGuide.get(gender)?.table[typeOne]?.indexOf(sizeOne);

    countryOptions.forEach((country, key) => {
      list.push(<tr key={`${name}_${country}`}>
        <th scope="row">{country}</th>
        {table[key].map((size, index) => {
          const isHighlighted = (index === sizeOneIndex);
          return (
            <td
              className={cn({ [css.selected]: key === 'usac' && isHighlighted })}
              key={`${value}_${key}_${size}_${index}`}>{size}
            </td>
          );
        })}
      </tr>);
    });

    return list;
  };

  makeCountryOptions = name => {
    const list = [];
    countryOptions.forEach((country, key) => list.push(<option key={`${name}_${key}`} value={key}>{country}</option>));
    return list;
  };

  makeSizeOptions = () => {
    const { gender, typeOne } = this.state;
    return this.sizingGuide.get(gender)?.table[typeOne]?.map((unit, index) => <option key={`sizeOption_${unit}_${index}`} value={unit}>{unit}</option>);
  };

  makeConversionText = () => {
    const { gender, typeOne, sizeOne, sizeTwo, typeTwo } = this.state;
    const genderText = this.sizingGuide.get(gender).name;
    return <p>{genderText} size <strong>{sizeOne} {countryOptions.get(typeOne)}</strong> = {genderText} size <strong>{sizeTwo} {countryOptions.get(typeTwo)}</strong></p>;
  };

  makeShopNowLink = () => {
    const { gender, sizeOne, typeOne } = this.state;
    const { table } = this.sizingGuide.get(gender);
    const usacSize = typeOne === 'usac' ? sizeOne : table.usac[table[typeOne].indexOf(sizeOne)];
    const genderFacet = genderFacetMapping[gender];

    if (genderFacet && sizeOne) {
      return <Link to={`/search/null/filter/${genderFacet.sizeFacetName}/%22${usacSize}%22/txAttrFacet_Gender/%22${genderFacet.genderFacetValue}%22/zc1/%22Shoes%22/page/0/sort/recentSalesStyle/desc`}>Shop Now</Link>;
    } else {
      return <Link to="/kids-shoes">Shop Now</Link>;
    }
  };

  makeShopNow = () => {
    if (!this.state.sizeOne) {
      return;
    }

    return <div className={css.bottom}>
      {this.makeConversionText()}
      {this.makeShopNowLink()}
    </div>;
  };

  onInputChange = e => {
    const { name, value } = e.target;
    const [gender, sizeOne, typeOne, typeTwo] = ['gender', 'sizeOne', 'typeOne', 'typeTwo'].map(fieldName => (fieldName === name ? value : this.state[fieldName]));
    const sizingOption = this.sizingGuide.get(gender);
    let newSizeOne;

    if (!sizingOption) {
      return;
    }

    // update selected size one since values updated per gender/type selection; find same value or start at beginning
    if (sizeOne && ['gender', 'typeOne'].includes(name)) {
      newSizeOne = sizingOption.table[typeOne].find(value => value === sizeOne) || sizingOption.table[typeOne][0];
      this.setState({ sizeOne: newSizeOne });
    }

    const sizeOneIndex = sizingOption.table[typeOne].indexOf(newSizeOne || sizeOne);
    const sizeTwo = sizingOption.table[typeTwo][sizeOneIndex] || '';

    this.setState({ [name]: value, sizeTwo }, () => this.savePreferences());
  };

  render() {
    const { slotName, slotDetails: { bottomcopy, bottomcopybold, chartheading, dropdownheading, monetateId } } = this.props;
    const { gender, sizeOne, typeOne, sizeTwo, typeTwo } = this.state;

    return (
      <div data-slot-id={slotName} className={css.mSizingGuide} data-monetate-id={monetateId}>
        <h2>{dropdownheading}</h2>

        <div className={css.sizePicker}>
          <div className={css.top}>
            <div>
              <label htmlFor="gender">Select your gender group</label>
              <select name="gender" value={gender} onChange={this.onInputChange}>
                <option value="" disabled>Select Gender</option>
                {this.makeGenderList()}
              </select>
            </div>

            <div>
              <label htmlFor="sizeOne">Select your shoe size number</label>
              <select name="sizeOne" value={sizeOne} onChange={this.onInputChange}>
                <option value="" disabled>Select Your Size</option>
                {this.makeSizeOptions()}
              </select>

              <label htmlFor="typeOne">Select your shoe size country</label>
              <select
                name="typeOne"
                value={typeOne}
                onChange={this.onInputChange}
                className={css.typeOneSelect}>
                {this.makeCountryOptions('sizeOne')}
              </select>
            </div>

            <div className={css.arrow}>
              <p>&rarr;</p>
            </div>

            <div>
              <label htmlFor="sizeTwo">Your conversion size</label>
              <input
                name="sizeTwo"
                value={sizeTwo}
                placeholder="Converted Size"
                readOnly />

              <label htmlFor="typeTwo">Select country to convert shoe size to</label>
              <select name="typeTwo" value={typeTwo} onChange={this.onInputChange}>
                {this.makeCountryOptions('sizeTwo')}
              </select>
            </div>
          </div>

          {this.makeShopNow()}
        </div>

        <h2>{chartheading}</h2>
        {this.makeSizeCharts()}

        <p>{bottomcopy}</p>
        <p className={css.bold}>{bottomcopybold}</p>
      </div>
    );
  }
}

MelodySizingGuide.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('melodySizingGuide', MelodySizingGuide);
