export default function toggleFieldHelpTip(fieldEl, type) {
  // We need the closest fieldset for calculations
  const fieldsetEl = fieldEl.closest('fieldset');

  let helpTipEl;

  // See if there's a help tip associated with this field
  // Try closest by .fields
  if (fieldEl.closest('.fields').find('.help-tip').length !== 0) {
    helpTipEl = fieldEl.closest('.fields').find('.help-tip');
  } else {
    // Otherwise use fieldset as marker
    // Especially useful for columns that share the same tip
    helpTipEl = fieldsetEl.find('.help-tip');
  }
  if (helpTipEl.length !== 0) {
    // Calc start position of tooltip based on form element
    // Handle columns
    const columnWrapperEl = fieldsetEl.find('.column-wrapper');
    const handleColumns = columnWrapperEl.length !== 0;
    let xPos;

    if (handleColumns) {
      // Get the last el (currently only inputs)
      const lastEl = columnWrapperEl.find('.column:last').find('input');
      xPos = lastEl.outerWidth();
    } else {
      // Handle radio list
      if (fieldEl.is(':radio')) {
        xPos = fieldEl.parent().outerWidth();
        helpTipEl.addClass('for-radio-list');
      } else if (fieldEl.is('textarea') && fieldEl.hasClass('rich')) {
        xPos = fieldEl.width();
      } else {
        xPos = fieldEl.outerWidth();
      }
    }
    // Toggle visibility
    if (type === 'focus') {
      // Show
      // If this same tooltip is trying to animate out
      // stop hiding animation and keep shown
      if (helpTipEl.hasClass('visible')) {
        helpTipEl.stop();
      } else {
        helpTipEl.css({ 'left': xPos });
        helpTipEl.animate({ 'left': xPos + 20, 'opacity': '1' }, 'fast', function() {
          helpTipEl.addClass('visible');
        });
      }
    } else {
      // Hide
      helpTipEl.animate({ 'opacity': '0' }, 'fast', function() {
        helpTipEl.css({ 'left': '-9000em' });
        helpTipEl.removeClass('visible');
      });
    }
  }
}
