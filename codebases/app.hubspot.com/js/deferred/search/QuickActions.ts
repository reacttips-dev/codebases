import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _quickActions;

import RESULT_TYPES from './const/RESULT_TYPES';
export var quickActions = (_quickActions = {
  create_company: 'create_company',
  create_contact: 'create_contact'
}, _defineProperty(_quickActions, RESULT_TYPES.CONTACT, [{
  id: 'call',
  text: 'Call',
  href: function href(hero) {
    return hero.url + "?interaction=call";
  }
}, {
  id: 'note',
  text: 'Note',
  href: function href(hero) {
    return hero.url + "?interaction=note";
  }
}, {
  id: 'email',
  text: 'Email',
  href: function href(hero) {
    return hero.url + "?interaction=email";
  }
}]), _defineProperty(_quickActions, RESULT_TYPES.COMPANY, [{
  id: 'call',
  text: 'Call',
  href: function href(hero) {
    return hero.url + "?interaction=call";
  }
}, {
  id: 'note',
  text: 'Note',
  href: function href(hero) {
    return hero.url + "?interaction=note";
  }
}, {
  id: 'email',
  text: 'Email',
  href: function href(hero) {
    return hero.url + "?interaction=email";
  }
}]), _defineProperty(_quickActions, RESULT_TYPES.DEAL, [{
  id: 'call',
  text: 'Call',
  href: function href(hero) {
    return hero.url + "?interaction=call";
  }
}, {
  id: 'note',
  text: 'Note',
  href: function href(hero) {
    return hero.url + "?interaction=note";
  }
}, {
  id: 'email',
  text: 'Email',
  href: function href(hero) {
    return hero.url + "?interaction=email";
  }
}]), _defineProperty(_quickActions, RESULT_TYPES.TICKET, [{
  id: 'call',
  text: 'Call',
  href: function href(hero) {
    return hero.url + "?interaction=call";
  }
}, {
  id: 'note',
  text: 'Note',
  href: function href(hero) {
    return hero.url + "?interaction=note";
  }
}, {
  id: 'email',
  text: 'Email',
  href: function href(hero) {
    return hero.url + "?interaction=email";
  }
}]), _quickActions);
export default quickActions;