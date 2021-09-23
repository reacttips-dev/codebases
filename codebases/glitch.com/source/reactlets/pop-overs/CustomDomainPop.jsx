import React, { useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { Button, Icon, IconButton, Loader, Notification, useNotifications } from '@glitchdotcom/shared-components';
import useGlitchApi from '../../hooks/useGlitchApi';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

const MAX_PROJECT_CUSTOM_DOMAINS = 5;
const HELP_CENTER_URL = 'https://glitch.com/help/kb/article/9-how-do-i-add-a-custom-domain-a-cname-or-a-record-for-my-custom-domain/';

function useCustomDomainList() {
  const application = useApplication();
  const glitchApi = useGlitchApi();
  const [domains, setDomains] = useState([]);

  const canAddDomain = domains.length < MAX_PROJECT_CUSTOM_DOMAINS;
  const projectId = application.currentProjectId();

  useEffect(() => {
    if (!projectId) return;
    glitchApi.getProjectDomains(projectId).then((res) => {
      setDomains(res.items.map((item) => item.hostname));
    });
  }, [glitchApi, projectId]);

  async function addDomain(domain) {
    await glitchApi.addProjectDomain(projectId, domain);
    setDomains((ds) => [domain, ...ds]);
  }

  async function removeDomain(domain) {
    await glitchApi.removeProjectDomain(projectId, domain);
    setDomains((ds) => ds.filter((d) => d !== domain));
  }

  const visibleDomains = useMemo(() => domains.slice(0, MAX_PROJECT_CUSTOM_DOMAINS), [domains]);

  return { domains: visibleDomains, canAddDomain, addDomain, removeDomain };
}

const AddedCustomDomainNotification = (props) => (
  <Notification
    persistent
    variant="success"
    message="Custom domain added. Go to your DNS provider and point your domain to glitch.edgeapp.net"
    className="custom-domain-pop__notification"
    {...props}
  >
    <p>We added your custom domain to your project!</p>
    <p>Last step — go to your DNS provider and point your domain to:</p>
    <p>glitch.edgeapp.net</p>
    <Button size="small" as="a" href={HELP_CENTER_URL} target="_blank" rel="noopener noreferrer">
      Learn More <Icon icon="arrowRight" />
    </Button>
  </Notification>
);

const RemovedCustomDomainNotification = (props) => (
  <Notification variant="success" message="We removed your custom domain from this project." className="custom-domain-pop__notification" {...props} />
);

export default function CustomDomainPop() {
  const application = useApplication();
  const visible = useObservable(application.customDomainPopVisible);
  const [domainInput, setDomainInput] = useState('');
  const { domains, canAddDomain, addDomain, removeDomain } = useCustomDomainList();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { createNotification } = useNotifications();

  const hideCustomDomainPop = () => {
    application.customDomainPopVisible(false);
    application.toolsPopVisible(true);
    setDomainInput('');
    setErrors([]);
  };

  const onDomainInputChange = (e) => {
    setDomainInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await addDomain(domainInput);
      setDomainInput('');
      createNotification((props) => <AddedCustomDomainNotification {...props} />);
    } catch (error) {
      try {
        const data = await error.response.json();
        const newErrors = data.errors ? data.errors.map(({ title }) => title) : [error.response.statusText || 'An unknown error has occurred.'];
        setErrors(newErrors);
      } catch (_e) {
        setErrors(['An unknown error has occurred.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRemove = (domain) => {
    removeDomain(domain);
    createNotification((props) => <RemovedCustomDomainNotification {...props} />);
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog className="custom-domain-pop pop-over">
      {/* ESLINT-CLEAN-UP */}
      {/* eslint-disable-next-line */}
      <section role="presentation" className="info clickable-label" onClick={hideCustomDomainPop}>
        <div className="back icon" />
        <h1>
          Custom Domains <Icon icon="globeWithMeridians" />
        </h1>
      </section>
      {canAddDomain ? (
        <section className="actions">
          <p>Add a domain that you've already purchased elsewhere</p>
          {loading && <Loader />}

          <form onSubmit={onSubmit}>
            <div className="input-wrap">
              <input
                className={cn('input', { 'field-error': errors && errors.length > 0 })}
                placeholder="www.my-domain.com"
                value={domainInput}
                onChange={onDomainInputChange}
              />
              {errors.length > 0 && (
                <div className="field-error-message">
                  {errors.map((error, i) => (
                    <div key={/* eslint-disable react/no-array-index-key */ i /* eslint-enable react/no-array-index-key */}>{error}</div>
                  ))}
                </div>
              )}
            </div>
            <button className="button add-domain">Add Domain</button>
          </form>
        </section>
      ) : (
        <section className="actions">
          <p>You already have the maximum number of custom domains. Remove an existing custom domain to add another.</p>
        </section>
      )}
      <section className="actions">
        {domains.length > 0 && (
          <>
            <p>Custom domains currently registered to this project</p>
            <ul className="custom-domain-pop__domain-list">
              {domains.map((domain) => (
                <li key={domain}>
                  <span className="custom-domain-pop__domain-item">{domain}</span>
                  <IconButton icon="x" label="remove domain" onClick={() => onRemove(domain)} />
                </li>
              ))}
            </ul>
          </>
        )}
        <p>
          For more information on setting up custom domains, see the{' '}
          <a href={HELP_CENTER_URL} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'normal' }}>
            Help Center
          </a>
        </p>
      </section>
    </dialog>
  );
}
