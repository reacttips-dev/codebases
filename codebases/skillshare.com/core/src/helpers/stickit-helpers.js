import FormHelpers from 'core/src/helpers/form-helpers';

const StickitHelpers = {
  // find the correct form element and container name, using the key of the response
  // JSON's `errors` property as the model attribute, and finds its selector by looking
  // at the view's bindings (or optional alternateBindings)
  //
  // options:
  //   - showErrors (bool): whether to actually display the errors. if false, will
  //       mark the view as invalid (i.e. set view.hasErrors to true), but not actually show
  //       error messages
  //   - alternateBindings (hash): a stickit bindings hash. used to explicitly pass in
  //       a specific stickit binding. if not set, defaults to view.bindings (a la stickit)
  // Also passes along any options to FormHelpers.showFieldMessage, specifically:
  //   - inErrorState (bool): denotes whether we should show warning or error styles
  //   - overrideMessage (bool): use the passed in message instead of the message in the markup

  /*
    * modelErrors must be in the form:
    * { field_name: [
        'this is an error message',
        'this can potentially be another on the same field'
      ] }
    */
  handleValidationErrors: function(view, modelErrors = {}, options = {}) {
    const showError = options.showErrors || true;

    // A stickit hash: {'#field-selector': 'attr-on-model'}
    let bindings = options.bindings || options.alternateBindings || view.bindings || {};

    // if there are special error only bindings defined
    if (view.errorBindings) {bindings = _.extend(bindings, view.errorBindings);}

    // bindings are either in the form '#selector' : 'attr' or
    // '#selector': { observe: 'attr '}. normalize to the former.
    const copy = {};
    const errorMessages = {};
    _.each(bindings, function(attr, sel) {
      // handle case of '#selector': 'attr'
      if (_.isString(attr)) {
        copy[sel] = attr;
        return;
      }

      // otherwise, it's in the form '#selector': {observe: 'attr'}
      copy[sel] = attr.observe;

      // store the error message el if present
      if (attr.errorMessageEl) {errorMessages[sel] = attr.errorMessageEl;}
    });
    bindings = copy;

    // Find the intersection of the error-filled attributes and the current bindings
    // so we don't look through unused bindings.
    const modelAttrs = _.intersection(_.keys(modelErrors), _.values(bindings));
    const errors = _.pick(modelErrors, modelAttrs);

    // loop through each error on the bindings.
    _.each(errors, function(messages, attrName) {

      // used to determine dirty state (e.g. for save/continue case)
      view.hasErrors = true;

      if (showError) {
        // use bindings as a hash, keyed by attrName
        const selector = _.invert(bindings)[attrName];

        // attempt to find the field in our current view
        const inputEl = view.$(selector);

        // coherence check: short-circuit early if field not in our current view
        if (!inputEl.length) {return;}

        // look for an error messages element, if one passed in
        const errorMessageEl = view.$(errorMessages[selector]);

        // show the error on the input
        FormHelpers.showFieldMessage(inputEl, messages.join('\n'), _.extend(options, {
          errorMessageEl: errorMessageEl,
          overrideMessage: true,
        }));
      }
    });

    // alert any listeners (e.g. sidebar nav) that the view is invalid
    if (view.hasErrors) {view.trigger('view:invalid');}
  },
};

export default StickitHelpers;

