'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, List } from 'immutable';
import I18n from 'I18n';
import { connect } from 'react-redux';
import { canWrite } from 'SequencesUI/lib/permissions';
import { GYPSUM, OLAF } from 'HubStyleTokens/colors';
import { tracker, getSequenceCreateOrEditEventProperties } from 'SequencesUI/util/UsageTracker';
import { edit, index } from 'SequencesUI/lib/links';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import createSequenceFromLibrary from 'SequencesUI/util/createSequenceFromLibrary';
import sequencesLibraryData from 'SequencesUI/library/sequencesLibraryData';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import UIEditorPage from 'UIComponents/page/UIEditorPage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import SequenceCreateHeader from './SequenceCreateHeader';
import SequenceCreateSidebar from './SequenceCreateSidebar';
import SequenceCreatePreview from './SequenceCreatePreview';
import withSequencesStatus from '../../containers/withSequencesStatus';
var SequenceCreate = createReactClass({
  displayName: "SequenceCreate",
  propTypes: {
    fetchTemplateUsage: PropTypes.func.isRequired,
    saveSequences: PropTypes.func.isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      selectedOption: 0,
      readOnlyEditorLoaded: false,
      sequenceLibrary: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    if (!canWrite()) {
      this.context.router.replace(index());
      return;
    }

    var fetchTemplateUsage = this.props.fetchTemplateUsage;
    fetchTemplateUsage();
    this._isMounted = true;
    import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'SequencesUI/library/getSequencesLibraryList').then(function (getSequencesLibraryList) {
      return getSequencesLibraryList.default();
    }).then(function (sequenceLibrary) {
      if (_this._isMounted) {
        _this.setState({
          readOnlyEditorLoaded: true,
          sequenceLibrary: sequenceLibrary
        });
      }
    });
    tracker.track('pageView', {
      subscreen: 'sequence-create'
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
  },
  handleSelectOption: function handleSelectOption(selectedOption) {
    this.setState({
      selectedOption: selectedOption
    });
  },
  handleCreate: function handleCreate() {
    var _this2 = this;

    var _this$state = this.state,
        selectedOption = _this$state.selectedOption,
        sequenceLibrary = _this$state.sequenceLibrary;
    var location = this.context.router.location;

    if (selectedOption === 0) {
      this.context.router.push({
        pathname: edit('new'),
        query: getQueryParams()
      });
      return;
    }

    createSequenceFromLibrary({
      folderId: location.query.folder,
      selectedOption: selectedOption,
      sequenceLibrary: sequenceLibrary,
      saveSequences: this.props.saveSequences
    }).then(function (savedSequences) {
      var savedSequence = savedSequences[0];
      var id = savedSequence.get('id');
      var name = savedSequence.get('name');
      tracker.track('createOrEditSequence', Object.assign({
        action: 'Created a sequence',
        type: 'library',
        type_id: name
      }, getSequenceCreateOrEditEventProperties(savedSequence)));

      _this2.context.router.push({
        pathname: edit(id),
        query: Object.assign({
          library: true
        }, getQueryParams())
      });
    });
  },
  getSelectedSequence: function getSelectedSequence() {
    var _this$state2 = this.state,
        selectedOption = _this$state2.selectedOption,
        sequenceLibrary = _this$state2.sequenceLibrary;
    var sequence;

    if (selectedOption === 0) {
      sequence = ImmutableMap({
        delays: List([0]),
        steps: List()
      });
    } else {
      sequence = sequenceLibrary && sequenceLibrary.get(selectedOption);
    }

    return sequence;
  },
  renderHeader: function renderHeader() {
    var selectedOption = this.state.selectedOption;
    var header = selectedOption === 0 ? I18n.text('create.header.newSequence') : sequencesLibraryData.getIn([selectedOption, 'sequenceName']);
    return /*#__PURE__*/_jsx(SequenceCreateHeader, {
      header: header,
      onCreate: this.handleCreate,
      selectedOption: selectedOption,
      sequence: this.getSelectedSequence()
    });
  },
  renderPreview: function renderPreview() {
    var _this$state3 = this.state,
        selectedOption = _this$state3.selectedOption,
        readOnlyEditorLoaded = _this$state3.readOnlyEditorLoaded,
        sequenceLibrary = _this$state3.sequenceLibrary;

    if (selectedOption !== 0 && !sequenceLibrary) {
      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true
      });
    }

    return /*#__PURE__*/_jsx(SequenceCreatePreview, {
      sequence: this.getSelectedSequence(),
      selectedOption: selectedOption,
      readOnlyEditorLoaded: readOnlyEditorLoaded
    });
  },
  render: function render() {
    var selectedOption = this.state.selectedOption;
    return /*#__PURE__*/_jsx(UIEditorPage, {
      headerComponent: this.renderHeader(),
      mainSectionFlush: true,
      mainBackgroundColor: GYPSUM,
      sidebarBackgroundColor: OLAF,
      sidebarComponent: /*#__PURE__*/_jsx(SequenceCreateSidebar, {
        selectedOption: selectedOption,
        onSelectOption: this.handleSelectOption
      }),
      className: "sequence-create-container",
      hasScrolling: true,
      children: this.renderPreview()
    });
  }
});
export default withSequencesStatus(connect(null, {
  fetchTemplateUsage: TemplateActions.fetchTemplateUsage,
  saveSequences: SequenceActions.saveSequences
})(SequenceCreate));