import {observable} from 'mobx';

export default class NavStore {
  @observable backRoute;
  @observable forwardRoute;
}
