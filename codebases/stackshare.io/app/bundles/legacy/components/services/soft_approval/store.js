import {observable} from 'mobx';

export default class SoftApprovalStore {
  @observable services = [];
  @observable nonSubmittedTools = [];
  @observable pendingApprovalTools = [];
  @observable selectedTool;
  @observable openedForm = false;
  @observable submissionInProgress = false;

  constructor(props) {
    this.services = props.props.tools;
    this.nonSubmittedTools = props.props.tools.filter(t => {
      return !t.submitted_for_approval;
    });
    this.pendingApprovalTools = props.props.tools.filter(t => {
      return t.submitted_for_approval;
    });
  }
}
