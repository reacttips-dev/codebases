const FormValidation = {
  validate: function(inputs) {
    let problems = {required: [], invalid: []};
    inputs.each((i, v) => {
      v = $(v);
      if (v.attr('required') && v.val() === '') {
        problems.required.push(v.prev().text());
        v.addClass('error');
      } else if (v.attr('required') && !v.val().match(new RegExp(v.attr('pattern')))) {
        problems.invalid.push(v.prev().text());
        v.addClass('error');
      }
    });
    if (problems.required.length > 0 || problems.invalid.length > 0) {
      let errorMsg = '';
      if (problems.required.length > 0)
        errorMsg = `${problems.required.join(', ')} ${
          problems.required.length === 1 ? 'is' : 'are'
        } required. `;
      if (problems.invalid.length > 0)
        errorMsg = `${errorMsg}Please input a valid ${problems.invalid.join(', ')}.`;
      $(document).trigger('errorMsg', errorMsg);
      return false;
    }
    return true;
  },
  parseErrors: function(errors) {
    let errorText = '';
    for (let key in errors) {
      $(`input[name=${key}]`).addClass('error');
      let capKey = `${key[0].toUpperCase()}${key.substr(1)}`;
      errorText += `${capKey} ${errors[key].join(', ')}.`;
    }
    $(document).trigger('errorMsg', errorText);
  }
};

export default FormValidation;
