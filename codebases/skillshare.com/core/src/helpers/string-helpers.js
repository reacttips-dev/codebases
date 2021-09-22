

const StringHelpers = {

  formatPossessive: function(str) {
    // If last char is an s, then return with ', otherwise append 's
    return (str.slice(-1) === 's') ? str + '\'' : str + '\'s';
  },

  // Convert new lines to <br/> tags
  addHTMLLineBreaks: function(str) {
    return str.replace(/(\r\n?|\n)/g, '<br />');
  },

  // http://stackoverflow.com/a/196991
  toTitleCase: function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

};

export default StringHelpers;

