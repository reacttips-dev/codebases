import Actions from 'actions';
import ContestPlagiarismButton from './contest-plagiarism-button';
import PropTypes from 'prop-types';
import React from 'react';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';

export const PLAGIARISM_CASE_STATES = {
  UNREQUESTED: 'UNREQUESTED',
  LOADING: 'LOADING',
  SUCCESSFUL: 'SUCCESSFUL',
  ERRORED: 'ERRORED',
};
const PLAGIARISM_PAUSED = true;

const mapDispatchToProps = {
  fetchDemeritedSubmissions: Actions.fetchDemeritedSubmissions,
  createPlagiarismCase: Actions.createPlagiarismCase,
};

const mapStateToProps = (state) => {
  return {
    user: SettingsHelper.State.getUser(state),
  };
};

export function ContestPlagiarismButtonContainer({
  fetchDemeritedSubmissions,
  createPlagiarismCase,
  user,
  children,
}) {
  const [demeritedSubmissions, setDemeritedSubmissions] = React.useState([]);
  const [gatewayOpen, setGatewayOpen] = React.useState(false);
  const [caseCreationStatus, setCaseCreationStatus] = React.useState(
    PLAGIARISM_CASE_STATES.UNREQUESTED
  );
  const [plagiarismCase, setPlagiarismCase] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const fetchData = React.useCallback(async () => {
    const submissions = await fetchDemeritedSubmissions(user.id);
    const sortedSubmissions = submissions.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
    setDemeritedSubmissions(sortedSubmissions);
  }, [user, fetchDemeritedSubmissions]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showsModalOnButtonClick = () => {
    setGatewayOpen(true);
  };

  const closeButtonClick = () => {
    setGatewayOpen(false);
  };

  const handleCreatePlagiarismCase = async () => {
    setCaseCreationStatus(PLAGIARISM_CASE_STATES.LOADING);
    try {
      if (!_.get(demeritedSubmissions, ['0', 'id'])) {
        throw new Error('Issue fetching user submissions');
      }
      const plagiarismCase = await createPlagiarismCase(
        demeritedSubmissions[0].id
      );
      setPlagiarismCase(plagiarismCase);
      setDemeritedSubmissions(
        demeritedSubmissions.filter((submission) => {
          return submission.id !== plagiarismCase.submission_id;
        })
      );
      setCaseCreationStatus(PLAGIARISM_CASE_STATES.SUCCESSFUL);
    } catch (e) {
      setErrorMessage(e.message);
      setCaseCreationStatus(PLAGIARISM_CASE_STATES.ERRORED);
    }
  };

  return (
    <ContestPlagiarismButton
      showsModalOnButtonClick={showsModalOnButtonClick}
      closeButtonClick={closeButtonClick}
      handleCreatePlagiarismCase={handleCreatePlagiarismCase}
      shouldDisplayPlagiarismButton={
        demeritedSubmissions.length >= 2 && !PLAGIARISM_PAUSED
      }
      caseCreationStatus={caseCreationStatus}
      gatewayOpen={gatewayOpen}
      errorMessage={errorMessage}
      plagiarismCase={plagiarismCase}
    >
      {children}
    </ContestPlagiarismButton>
  );
}

ContestPlagiarismButtonContainer.displayName =
  'common/assessments/contest-plagiarism-button/contest-plagiarism-button-container';

ContestPlagiarismButtonContainer.propTypes = {
  createPlagiarismCase: PropTypes.func,
  fetchDemeritedSubmissions: PropTypes.func,
  user: PropTypes.object,
  children: PropTypes.element,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContestPlagiarismButtonContainer);
