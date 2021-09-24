import { escape } from 'unified-navigation-ui/utils/escape';
export function accountItem(account) {
  return account && account !== {} ? "\n<li class=\"navAccount\">\n  <a data-tracking=\"click\" id=\"otherAccount\" href=\"" + encodeURI(account.appDomain + "/home-beta?portalId=" + account.id) + "\">\n    <div class=\"navAccount-accountName\">" + escape(account.name) + ":</div>\n    <div class=\"navAccount-portalId\">" + escape(account.id) + "</div>\n  </a>\n</li>" : '';
}
export function accountListTemplate(accounts) {
  return "\n<ul class=\"navAccountSwitcher-list\">" + (accounts ? accounts.map(accountItem).join('') : '') + "\n</ul>";
}