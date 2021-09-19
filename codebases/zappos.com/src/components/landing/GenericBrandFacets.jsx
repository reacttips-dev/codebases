import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { stripSpecialChars } from 'helpers';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/genericBrandFacets.scss';

const namingConvention = {
  'Women': { title : 'Women\'s', url : 'txAttrFacet_Gender/Women' },
  'Men': { title : 'Men\'s', url : 'txAttrFacet_Gender/Men' },
  'NO_GENDER': { title : 'Departments', url : '' },
  'isNew': { title : 'New Arrivals', url : 'isNew/true' },
  'onSale': { title : 'On Sale', url : 'onSale/true' },
  'Girls': { title : 'Girls\'', url : 'txAttrFacet_Gender/Girls' },
  'Boys': { title : 'Boys\'', url : 'txAttrFacet_Gender/Boys' },
  'subBrand': { title : 'Collections', url : '' }
};

const sortOrder = ['Women\'s', 'Men\'s', 'Departments', 'New Arrivals', 'On Sale', 'Girls\'', 'Boys\'', 'Collections'];

export class GenericBrandFacets extends Component {
  state = {};

  onClick = menuIndex => {
    this.setState({ [menuIndex]: !this.state[menuIndex] });
  };

  loopLevels(tree, prevUrl = '', catName, title, testId) {
    const { onTaxonomyComponentClick, slotIndex } = this.props;
    const childs = tree.map(v => {
      const { displayName, level, value, children } = v;
      const menuIndex = `${title}-${value}`;
      const expand = <button
        type="button"
        onClick={this.onClick.bind(this, menuIndex)}
        aria-label={`expand or collapse ${menuIndex}`}
        aria-expanded={!!this.state[menuIndex]}
        data-test-id={testId(`expandButton_${stripSpecialChars(menuIndex)}`)}>
      </button>;
      const encodedValue = encodeURIComponent(`"${value}"`);
      const newUrl = catName === 'Collections' ? `${prevUrl}/filter/brandNameFacet/${encodedValue}` : `${prevUrl}/zc${level}/${encodedValue}`;
      const facetLink = <Link
        to={newUrl}
        onClick={onTaxonomyComponentClick}
        data-eventlabel={title}
        data-eventvalue={value}
        data-slotindex={slotIndex}
        className={css.facetLink}
        data-test-id={testId(`facetLink_${stripSpecialChars(title)}_${stripSpecialChars(value)}`)}>{displayName || value}</Link>;

      return <li key={menuIndex}>
        {!!children.length && expand}
        {facetLink}
        {children?.length > 0 && this.loopLevels(children, newUrl, catName, menuIndex, testId)}
      </li>;
    });

    if (childs.length > 0) {
      return (
        <ul>
          {childs}
        </ul>
      );
    }
  }

  compare = (a, b) => sortOrder.indexOf(a.name.title) - sortOrder.indexOf(b.name.title);

  getTopUrl = (title, id, url) => {
    switch (title) {
      case 'Collections':
        return { url: `/search/brand/${id}`, title };
      case 'Departments':
        return { url: `/search/null/filter/brandId/${id}`, title };
      default:
        return { url: `/search/null/filter/brandId/${id}/${url}`, title };
    }
  };

  makeMenu = (facetTree, id, testId) => {
    const { onTaxonomyComponentClick, slotIndex } = this.props;
    const newTree = facetTree.reduce((acc, item) => {
      const { name, facetTreeNodes } = item;
      if (facetTreeNodes.length > 0) {
        acc.push({
          name: namingConvention[name],
          facetTreeNodes: item.facetTreeNodes
        });
      }
      return acc;
    }, []);
    const sortedArray = newTree.sort(this.compare);
    return sortedArray.map(t => {
      const { name: { title, url }, facetTreeNodes } = t;
      const data = [];
      const { url: baseUrl, title: catName } = this.getTopUrl(title, id, url);

      data.push(
        <div key={title} className={css.flexCell}>
          <a
            href={baseUrl}
            data-test-id={testId(`mainNavigationButton_${stripSpecialChars(title)}`)}
            onClick={onTaxonomyComponentClick}
            data-eventlabel="category"
            data-slotindex={slotIndex}
            data-eventvalue={title}>
            <h3 className={css.title}>{title}</h3>
          </a>{this.loopLevels(facetTreeNodes, baseUrl, catName, title, testId)}
        </div>);
      return data;
    });
  };

  render() {
    const { slotDetails: { facetTree: tree, monetateId } } = this.props;
    if (!tree) {
      return null;
    }
    const { name, facetTree, id } = tree;
    const { testId } = this.context;
    const hasTrees = facetTree.some(v => v.facetTreeNodes.length);

    return hasTrees && (
      <div className={css.menuBlock} data-monetate-id={monetateId}>
        <h2>Shop by {name} category</h2>
        <div className={css.nav}>
          {this.makeMenu(facetTree, id, testId)}
        </div>
      </div>
    );
  }
}

GenericBrandFacets.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('GenericBrandFacets', GenericBrandFacets);
