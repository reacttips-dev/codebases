// eslint-disable-next-line @trello/no-module-logic
const t = require('app/scripts/views/internal/teacup-with-helpers')('action');

module.exports = function (data: {
  appCreator: { name: string; idPlugin: string; iconClass: string };
  canLinkAppCreator: boolean;
}) {
  const { appCreator, canLinkAppCreator } = data;
  const integrationLinkOrName = () => {
    let output = '';
    const renderNameAndIcon = () => {
      let nameAndIcon = '';
      if (appCreator.iconClass) {
        nameAndIcon = `<span class="app-creator-icon icon-sm ${appCreator.iconClass}"></span>`;
      }
      nameAndIcon += `<span>${appCreator.name}</span>`;
      return nameAndIcon;
    };
    if (appCreator.idPlugin && canLinkAppCreator) {
      output = `<a class="quiet js-app-creator-link" href="#">${renderNameAndIcon()}</a>`;
    } else {
      output = renderNameAndIcon();
    }
    return output;
  };
  t.span(() => {
    t.text(' ');
    t.raw(
      `<span>${t.l(
        'via',
        { integrationName: integrationLinkOrName() },
        { raw: true },
      )}</span>`,
    );
  });
};
