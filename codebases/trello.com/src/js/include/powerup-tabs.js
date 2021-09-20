const clearStatus = function(sibling) {
  $(sibling)
    .parent()
    .children('.butler-status')
    .transition('hide');
};

const getCurrentTab = function() {
  return $('.dashboard-tabs .item.active')
    .attr('data-tab')
    .substr('tab-'.length);
};

const showStatus = function(show) {
  clearStatus(show);
  $(show).transition('fade down');
};

const showTab = function(tab, animate) {

  const newTabName = `tab-${tab}`;
  let newTargetName;
  const items = $('.dashboard-tabs .item');
  const tabs = $('.dashboard-tab-content').children('.ui.tab');
  items.each(function() {
    const tabName = $(this).attr('data-tab');
    const targetName = $(this).attr('data-target-tab') || tabName;
    if (tabName !== newTabName) {
      $(this).removeClass('active');
      const childText = $(this).children('.child-text');
      if (childText.length) {
        // De-select dropdown parent. It will be selected again if relevant when we get to the child.
        childText.text(childText.attr('data-default'));
        $(this).removeClass('child-active');
      }
      if (targetName !== newTargetName)
        tabs
          .filter(`.ui.tab[data-tab="${targetName}"]`)
          .removeClass('active')
          .filter(':not(.hidden)')
          .transition('hide');
    } else {
      const dropdown = $(this).closest('.ui.dropdown');
      if (dropdown.length) {
        dropdown.children('.child-text').text($(this).text());
        if (!dropdown.hasClass('child-active')) dropdown.addClass('child-active');
        dropdown.find('.menu').transition('hide');
      }
      if (!$(this).hasClass('active')) $(this).addClass('active');
      if (animate)
        tabs
          .filter(`.ui.tab[data-tab="${targetName}"]`)
          .transition('hide')
          .transition('slide down');
      else tabs.filter(`.ui.tab.hidden[data-tab="${targetName}"]`).transition('show');
      newTargetName = targetName;
    }
  });

};

// until everything is modularized, make sure we don't break anything
window.clearStatus = clearStatus;
window.getCurrentTab = getCurrentTab;
window.showStatus = showStatus;
window.showTab = showTab;

module.exports = {
  clearStatus,
  getCurrentTab,
  showStatus,
  showTab,
};
