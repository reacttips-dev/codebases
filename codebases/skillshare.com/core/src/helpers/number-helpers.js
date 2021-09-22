

const NumberHelpers = {

  formatWithCommas: function(number) {
    if (_.isUndefined(number)) {return;}
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  formatAbbreviated: function(num) {
    // Return if not supplied
    if (_.isUndefined(num)) {return;}

    // Ensure int
    const number = parseInt(num, 10);

    if (number >= 1000000000000) {
      return (Math.floor((number / 100000000000)) / 10) + 'T';
    } else if (number >= 1000000000) {
      return (Math.floor((number / 100000000)) / 10) + 'B';
    } else if (number >= 1000000) {
      return (Math.floor((number / 100000)) / 10) + 'M';
    } else if (number >= 1100) {
      return (Math.floor((number / 100)) / 10) + 'K';
    } else if (number >= 1000) {
      return '1,000';
    }

    return number.toFixed(1);
  },

  stripCommas: function(number) {
    if (_.isUndefined(number)) {return;}
    return parseInt(number.toString().replace(',', ''), 10);
  },

  pluralize: function(number, pluralStr) {
    let num = parseInt(number, 10);
    const str = num === 1 ? pluralStr : pluralStr + 's';
    num = NumberHelpers.formatWithCommas(num);
    return num + ' ' + str;
  },

};

export default NumberHelpers;

