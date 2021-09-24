import React, { useState, useMemo } from 'react';
import isEmail from 'validator/lib/isEmail';
import debounce from 'lodash/debounce';
import ky from 'ky';
import { Actions, Button, Icon, Info, Loader, Popover, TextArea, TextInput, Title } from '@glitchdotcom/shared-components';
import { captureException } from '../../sentry';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

function validateReason(reason) {
  if (!reason) return 'A description of the issue is required';
  return '';
}

function validateEmail(email, currentUser) {
  if (currentUser.login()) return '';
  if (!email) return 'Email is required';
  if (!isEmail(email)) return 'Please enter a valid email';
  return '';
}

function useDebouncedState(initialState, timeout) {
  const [state, setState] = useState(initialState);
  const setDebounced = useMemo(() => debounce(setState, timeout), [setState, timeout]);
  return [state, setDebounced];
}

const pickEmailForReport = (currentUser, submitterEmail) => {
  if (submitterEmail) {
    return submitterEmail;
  }
  const emailObj = Array.isArray(currentUser.emails()) && currentUser.emails().find((email) => email.primary);
  return emailObj.email;
};

function getDisplayName({ login }) {
  if (login()) {
    return `@${login()}`;
  }
  return 'Anonymous User';
}

function getUserLink({ id, login }) {
  if (login()) {
    return `@${login()}`;
  }
  return `user/${id()}`;
}

function getAbuseReportBody(currentUser, submitterEmail, login, projectName, reportedType, message, projectId) {
  const thingIdentifiers = `
  - ${reportedType} Name: ${projectName};
  
  - ${reportedType} Id: ${projectId}`;

  return `${thingIdentifiers}
  
  - Submitted by: [${getDisplayName(currentUser)}](https://glitch.com/${getUserLink(currentUser)})
  
  - Contact: ${pickEmailForReport(currentUser, submitterEmail)}
  
  - Message: ${message}`;
}

const Success = () => (
  <>
    <Title>Report Abuse</Title>
    <Actions>
      {/* will reimpliment this once update to notifications in shared component library is made */}
      {/* <Notifications persistent type="success">
        Report Sent
      </Notifications> */}
      <p>
        Thanks for helping to keep Glitch a safe, friendly community <Icon icon="park" />
      </p>
    </Actions>
  </>
);

const Failure = ({ value }) => (
  <>
    <Title>Failed to Send</Title>
    <Info>
      <p>
        But you can still send us your message by emailing the details below to <strong>support@glitch.com</strong>
      </p>
    </Info>
    <Actions>
      <textarea className="textarea" value={value} readOnly />
    </Actions>
  </>
);

function ReportAbusePop({ reportedType }) {
  const application = useApplication();
  const currentUser = useObservable(application.currentUser);
  const login = useObservable(currentUser.login());
  const name = useObservable(currentUser.name());
  const projectName = useObservable(application.projectName);
  const projectId = useObservable(application.currentProjectId());

  const [status, setStatus] = useState('ready'); // ready -> loading -> success | error

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useDebouncedState('', 200);
  const reasonOnChange = (value) => {
    setReason(value);
    setReasonError(validateReason(value, reportedType));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useDebouncedState('', 200);
  const emailOnChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value, currentUser));
  };

  const formatRaw = () => getAbuseReportBody(currentUser, email, login, projectName, reportedType, reason, projectId);

  const submitReport = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email, currentUser);
    const reasonErr = validateReason(reason, reportedType);
    if (emailErr || reasonErr) {
      setEmailError(emailErr);
      setReasonError(reasonErr);
      return;
    }

    setStatus('loading');

    console.log(formatRaw());

    try {
      await ky.post('https://support-poster.glitch.me/post', { json: { title: projectName, raw: formatRaw() } });

      setStatus('success');
    } catch (error) {
      captureException(error);
      setStatus('error');
    }
  };

  if (status === 'success') return <Success />;
  if (status === 'error') return <Failure value={formatRaw().trimStart()} />;

  return (
    <form onSubmit={submitReport}>
      <Title>Report Abuse</Title>
      <Actions>
        <TextArea
          className="report-abuse-input"
          label="Report Abuse"
          value={reason}
          placeholder="This project doesn't seem appropriate for Glitch because..."
          onChange={reasonOnChange}
          onBlur={() => reasonOnChange(reason)}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          error={reasonError}
        />
      </Actions>
      {name ? (
        <Info>
          <div className="text-align: right">
            from <strong>{name}</strong>
          </div>
        </Info>
      ) : (
        <Info>
          <TextInput
            value={email}
            onChange={emailOnChange}
            onBlur={() => emailOnChange(email)}
            placeholder="your@email.com"
            error={emailError}
            type="email"
            label="email address"
          />
        </Info>
      )}
      <Actions>
        {status === 'loading' ? (
          <Loader style={{ width: '25px' }} />
        ) : (
          <Button size="tiny" onClick={submitReport}>
            Submit Report
          </Button>
        )}
      </Actions>
    </form>
  );
}

const ReportAbusePopButton = ({ reportedType }) => (
  <Popover
    align="topLeft"
    className="wide-pop"
    renderLabel={({ onClick, ref }) => (
      <Button variant="secondary" size="tiny" onClick={onClick} ref={ref}>
        Report Abuse
      </Button>
    )}
  >
    {() => <ReportAbusePop reportedType={reportedType} />}
  </Popover>
);

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
