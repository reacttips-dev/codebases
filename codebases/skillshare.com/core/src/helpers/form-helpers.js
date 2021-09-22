import SelectView from 'core/src/views/modules/select-menu';
import CharLimitView from 'core/src/views/modules/char-limit';
import toggleFieldHelpTip from 'core/src/utils/field-help-tip';
import 'jquery-ui/widgets/datepicker';

const FormHelpers = {

  validateEmail(email) {
    const pattern = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(email);
  },

  initRichTextareas(context) {
    const richTextareas = context.find('textarea.rich');

    if (!richTextareas.length) {
      return Promise.resolve(false);
    }

    return import('core/src/utils/rich-textarea').then(({ default: RichTextarea }) => {
      richTextareas.each(function(index, element) {
        RichTextarea.initWithTextarea($(element));
      });

      $(RichTextarea).off('init')
        .on('init', function() {
          $(FormHelpers).trigger('form:render');
        });

      return true;
    });
  },

  initFlatEditor(context) {
    const flatEditors = context.find('.flat-editor');

    if (!flatEditors.length) {
      return Promise.resolve(false);
    }

    return import('core/src/utils/flat-editor').then(({ default: FlatEditor }) => FlatEditor.init(flatEditors));
  },

  initPlaceholders(context) {
    context.find('input, textarea').each(function(index, element) {
      const el = $(element);
      if (!el.hasClass('initialized')) {
        const copy = el.attr('data-ss-placeholder-copy');
        if (copy) {
          const elContent = el.val();
          if (!elContent || elContent === copy) {
            el.addClass('placeholder');
            el.val(copy);
          }
          //  Events
          el.on('focus', function() {
            if (el.val() === copy || el.hasClass('placeholder')) {
              el.removeClass('placeholder');
              el.val('');
            }
          });
          el.on('blur', function() {
            if (el.val() === '') {
              el.addClass('placeholder');
              el.val(copy);
            }
          });
          el.closest('form').on('submit', function() {
            if (el.val() === copy) {
              el.val('');
            }
          });
        }
        el.addClass('initialized');
      }
    });
  },

  initInputsAndSelectMenus(context) {
    // All select menus
    context.find('select').each(function(index, element) {
      if (!$(element).parent()
        .hasClass('ss-select-wrapper') && !$(element).parents()
        .hasClass('js-select-menu-off')) {
        new SelectView({ el: element });
      }
    });
    // Activate all char count fields
    context.find('input.limit-chars').each(function(index, el) {
      const element = $(el);
      //  Only init if it hasn't already been configured
      if (!element.prev().hasClass('char-limit')) {
        //  Construct tree for first time
        const span = $('<span class="char-limit" />').insertBefore(element);
        span.next().andSelf()
          .wrapAll('<div class="char-limit-input-wrapper" />');
        new CharLimitView({ 'el': element.closest('.char-limit-input-wrapper') });
      }
    });
    // Datepicker inputs
    context.find('.datepicker').each(function(index, element) {
      $(element).datepicker({
        'dateFormat': 'mm/dd/yy',
        'language': 'en',
        'minDate': ($(element).data('min-date') || '0'),
        'showAnim': '',
        'showOtherMonths': true,
      });
    });

    // Events for both
    context.find('input, select, textarea').on('focus blur', function(e) {
      toggleFieldHelpTip($(e.currentTarget), e.type);
    });
  },

  revealHiddenFieldsetWithControl(aEl) {
    const lbl = aEl.html();
    const fieldsetEl = aEl.closest('fieldset');
    fieldsetEl.prepend('<label>' + lbl + '</label>');
    aEl.parent().remove();
    fieldsetEl.find('.hidden').show();
  },

  initRevealControls(context) {
    context.find('.reveal-control a').each(function(_, el) {
      // If the hidden fieldset's inputs aren't empty, we want to show the hidden fields
      let hasData = false;
      $(el).closest('fieldset')
        .find('input, textarea')
        .each(function(index, element) {
          const fieldEl = $(element);
          if (fieldEl.val() !== '') {hasData = true;}
        });
      if (hasData) {
        FormHelpers.revealHiddenFieldsetWithControl($(el));
      } else {
        // Otherwise, fields remain hidden until clicked
        $(el).on('click', function(e) {
          FormHelpers.revealHiddenFieldsetWithControl($(e.currentTarget));
        });
      }
    });

    context.find('input[type="checkbox"][data-ss-reveal]').on('change', function(e) {
      const el = $(e.currentTarget);
      const targetClass = '.' + el.attr('data-ss-reveal');
      const contentEl = el.closest('fieldset').find(targetClass);
      contentEl.slideToggle('fast');
    });

    context.find('input[type="radio"][data-ss-reveal]').each(function(index, element) {
      const el = $(element);
      const targetClass = '.' + el.attr('data-ss-reveal');
      // Handle default checked
      if (el.is(':checked')) {
        const contentEl = el.closest('fieldset').find(targetClass);
        contentEl.show();
      }
      el.on('change', function() {
        // See if we have other sections to hide first
        const altEl = el.closest('fieldset').find('.hidden')
          .not(targetClass);
        altEl.slideUp('fast', function() {
          const contentEl = el.closest('fieldset').find(targetClass);
          contentEl.slideDown('fast');
        });
      });
    });
  },

  /*
     * Show an individual error on an input field
     */
  showFieldMessage(inputEl, message, aOptions) {
    const options = !_.isUndefined(aOptions) ? aOptions : {};
    const inErrorState = options.inErrorState || true;
    const overrideMessage = options.overrideMessage || false;
    let errorMessageEl = options.errorMessageEl || null;

    // Style classes
    const errorClass = (inErrorState) ? 'error' : 'warning';
    const messageClass = errorClass + '-message';

    // draw a red box around the field / fieldsets
    if (inputEl.hasClass('rich')) {
      inputEl.prev().removeClass('error warning');
      inputEl.prev().addClass(errorClass);
    } else if (inputEl.hasClass('ss-token-input')) {
      inputEl.prev().removeClass('error warning')
        .addClass(errorClass);
    } else if (inputEl.is('select')) {
      inputEl.next().removeClass('error warning')
        .addClass(errorClass);
    } else if (inputEl.is('input, textarea')) {
      inputEl.removeClass('error warning').addClass(errorClass);
    } else {
      // Input is foreign, so we don't need to handle any error message on it
      // Instead just continue and handle any error message that might still exist
    }

    // use the error message element if one passed in
    if (!errorMessageEl || !errorMessageEl.length) {

      // the .error-messsage el can either exist on the .fields element or as the
      // direct child of the fieldset
      const nearestParent = inputEl.closest('.fields, fieldset');
      if (nearestParent.is('fieldset')) {
        errorMessageEl = nearestParent.find('.error-message, .warning-message');
      } else {
        errorMessageEl = nearestParent.children('.error-message, .warning-message');
      }
    }

    // update the message
    const alreadyHasMessage = (errorMessageEl.text().length !== 0);
    // If doesn't exist in markup
    if (overrideMessage || !alreadyHasMessage) {
      // Update message with response from server
      errorMessageEl.text(message);
    }
    // attach the specific error class
    errorMessageEl.removeClass('error-message warning-message');
    errorMessageEl.addClass(messageClass);
    errorMessageEl.css('display', 'block');
  },

  hideFieldMessage(inputEl) {
    // the .error-messsage el can either exist on the .fields element or as the
    // direct child of the fieldset
    let errorMessageEl = $(inputEl).closest('.fields')
      .find('.error-message');
    if (!errorMessageEl.length) {
      errorMessageEl = $(inputEl).closest('fieldset')
        .children('.error-message');
    }
    // Remove styling from input itself
    $(inputEl).removeClass('error warning');
    errorMessageEl.hide();
  },

  clearFormErrors(formEl) {
    const _this = this;
    $(formEl).find('input, textarea, .ss-select')
      .each(function(e, el) {
        _this.hideFieldMessage($(el));
      });

    $(formEl).find('.rich')
      .each(function(e, el) {
        $(el).prev()
          .removeClass('error warning');
      });
  },

  formDataToJSON(formEl) {
    const data = formEl.serializeArray();
    const json = {};

    _.map(data, function(n) {
      json[n.name] = n.value;
    });

    return json;
  },

  // takes an optional jQuery object context. if empty, will default to body el
  renderForm(ctx) {
    const context = !(ctx instanceof $) ? $('body') : ctx;
    FormHelpers.initRichTextareas(context);
    FormHelpers.initPlaceholders(context);
    FormHelpers.initInputsAndSelectMenus(context);
    FormHelpers.initRevealControls(context);
  },

  restorePlaceholders(context) {
    const formEls = context.find('input[type="text"], textarea:not([class="rich"])');
    formEls.each(function(index, element) {
      const input = $(element);
      if (input.val() === '') {
        input.val(input.attr('data-ss-placeholder-copy'));
      }
    });
  },

  clean(context) {
    const formEls = context.find('input[type="text"], textarea:not([class="rich"])');
    //  Clean all inputs
    formEls.each(function(index, element) {
      //  Handle placeholder copy as empty fields
      const input = $(element);
      if (input.val() == input.attr('data-ss-placeholder-copy')) {
        input.val('');
      }
    });
  },
  // take an object and format it so it can be processed
  // by request()->getPost(formName) on the server
  // e.g dictionaryToFormFormat('EmailListForm', {first_name: 'Mikhail', last_name: 'Grothendieck'}) =>
  // [{name: 'EmailListForm[first_name]', value: 'Mikhail'}, {name: 'EmailListForm[last_name]', value: 'Grothendieck'}]
  dictionaryToFormFormat(formName, data) {
    return _.map(_.keys(data), function(key) {
      const name = formName + '[' + key + ']';
      return {
        name: name,
        value: data[key],
      };
    });
  },
};

export default FormHelpers;
