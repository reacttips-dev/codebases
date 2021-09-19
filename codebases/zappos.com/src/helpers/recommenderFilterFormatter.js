/* eslint-disable */
//SHAMELESSLY RIPPED FROM   https://code.amazon.com/packages/ZapposFrontendGatewayAssets/blobs/mainline/--/zappos-desktop/scripts/recommenderFilterFormatter.js
/**
 * Applies additional formmatting to be passed into Recommender.
 *
 * @param {Object} filters Contains a number of filters and any applicable genders.
 */
var RecommenderFilterFormatter = function RecommenderFilterFormatter (filters) {
  /*jshint camelcase: false */

  if (!(this instanceof RecommenderFilterFormatter)) {
    return new RecommenderFilterFormatter(filters);
  }

  var self = this;
  self.filters = filters;
  self.recommenderType = '';
  self.filterString = '';
  self.pageType = 'zap';
  self.genders = filters.txAttrFacet_Gender;
};

/**
 * RecommenderFilterFormatter prototype properties/methods
 */
RecommenderFilterFormatter.prototype = {

  /**
   * Sets the state of the all variables used throughout the class
   * and prioritizes whether certain filters take prescendent.
   */
  setState: function () {
    var self = this,
      filterString = '',
      genderString = '';
    // First, we set up the category filter.
    filterString += self.getCategoryFilter();

    // Now we handle the gender, since it's second.
    genderString += self.getGenderFilter();
    if (filterString !== '' && genderString !== '') {
      filterString += '&&';
    }
    filterString += genderString;

    // Use other filters only if no other filters are applied.
    // Adding other filters breaks some calls so only using them if they
    // are the only ones used
    if (filterString === '') {
      filterString += self.getOtherFilter();
    }

    self.filterString = filterString;

    return self;
  },

  /**
   * Gathers the recommender name for the landing page based upon
   * what has been set in setState().
   *
   * @returns {String} The recommender name sent off to Amazon.
   */
  getRecommenderName: function () {
    var self = this,
      output = [self.pageType, ((self.recommenderType) ? '_' + self.recommenderType : '')];
    if (self.genders !== undefined) {
      output.push('_g');
    }
    return output.join('');
  },

  /**
   * Formats category filters by translating our taxonomy name to
   * Amazon's format.
   *
   * @returns {String} The category filter sent off to Amazon.
   */
  getCategoryFilter: function () {
    var self = this,
      // The categories to filter by
      filters = self.filters,
      // A single filter in the set of filters, used for iteration
      filter,
      // Translating out taxonomy to Amazon's terms.
      filterOptions = {
        'zc1' : 'z_cat_name_1',
        'zc2' : 'z_cat_name_2'
      },
      // An array to hold the sorted filters
      filtersSorted = [],
      // The number of filters to iterate through
      filterLength,
      // Iterator used for looping through the sorted filters
      i = 0,
      // The filter name to match in the filter options
      filterName,
      // The constructed filter string to return
      filterString = '';

    // Insert the filter names into an array so that we can sort them.
    // We want to sort them because we only need the highest zc* number.
    for (filter in filters) {
      if (filters.hasOwnProperty(filter)) {
        filtersSorted.push(filter);
      }
    }
    filtersSorted = filtersSorted.sort().reverse();
    filterLength = filtersSorted.length;

    for (i = 0; i < filterLength; i++) {
      filterName = filtersSorted[i];
      if (filterOptions[filterName]) {
        // Use that filter name as our recommender type.
        self.recommenderType = filterName;
        filterString += filterOptions[filterName] + '==' + filters[filterName];
        break;
      }
    }
    return filterString;
  },

  /**
   * Formats gender filters based on Amazon's rules.
   *
   * @returns {String} The gender filter sent off to Amazon.
   */
  getGenderFilter: function () {
    // The genders to filter by
    var self = this,

      genders = self.genders,
      // Number of genders to filter by
      genderLength = '',
      // Iterator used for looping through the gender
      i = 0,
      // The constructed filter string to return
      filterString = '';

    if (genders !== undefined) {
      genderLength = genders.length;
      for (i; i < genderLength; i++) {
        // If there's more than one gender, do an "or" between them.
        if (filterString !== '') {
          filterString += '||';
        }
        filterString += 'tx_gender==' + genders[i];
      }
    }
    return filterString;
  },

  /**
   * @returns {String} Filter string for other filters.
   */
  getOtherFilter: function() {
    var self = this,
      // Get filters
      allFilters = Object.keys(self.filters),
      // index variablez
      i, j,
      // The constructed filter string to return
      filterString = '';

    // Loop through all the filters
    for (i = 0; i < allFilters.length; i++) {
      var filter = allFilters[i];
      var otherFilterType = self.filters[filter];
      // Nested loop through all the filters of this particular type
      for (j = 0; j < otherFilterType.length; j++) {
        // Add || for multiple types of the same filter
        if (j > 0) {
          filterString += '||';
        }
        // Add filters string
        filterString += filter + '==' + otherFilterType[j];
      }
    }
    return filterString;
  }
};

module.exports = RecommenderFilterFormatter;
