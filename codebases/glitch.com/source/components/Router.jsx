import React from 'react';
import { Router as ReactRouter, Switch, Redirect, Route } from 'react-router-dom';
import IndexRoute from './routes/IndexRoute';
import RedirectToGithubLogin from './routes/RedirectToGithubLogin';
import RedirectToFacebookLogin from './routes/RedirectToFacebookLogin';
import SignOutRoute from './routes/SignOutRoute';
import NewProjectRoute from './routes/NewProjectRoute';
import JoinProjectRoute from './routes/JoinProjectRoute';
import RemixFromProjectIdRoute from './routes/RemixFromProjectIdRoute';
import RemixProjectRoute from './routes/RemixProjectRoute';
import ImportGithubRoute from './routes/ImportGithubRoute';
import ImportGitRoute from './routes/ImportGitRoute';
import ServeProjectEmbedRoute from './routes/ServeProjectEmbedRoute';
import ServeProjectRoute from './routes/ServeProjectRoute';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

export default function Router() {
  const application = useApplication();
  const booted = useObservable(application.booted);

  if (booted === false) {
    return null;
  }

  return (
    <ReactRouter history={application.history}>
      <Switch>
        <Route exact path="/">
          <IndexRoute />
        </Route>
        <Route exact path="/sign-in">
          <RedirectToGithubLogin />
        </Route>
        <Route exact path="/sign-in/facebook">
          <RedirectToFacebookLogin />
        </Route>
        <Route exact path="/sign-up">
          <RedirectToGithubLogin />
        </Route>
        <Redirect exact from="/facebook" to="/" />
        <Redirect exact from="/email-login" to="/" />
        <Route exact path="/sign-out">
          <SignOutRoute />
        </Route>
        <Route exact path="/new-project">
          <NewProjectRoute />
        </Route>
        <Route exact path="/join/:token">
          <JoinProjectRoute />
        </Route>
        <Route exact path="/remix/:name/:projectId">
          <RemixFromProjectIdRoute />
        </Route>
        <Route exact path="/remix/:domain">
          <RemixProjectRoute />
        </Route>
        <Redirect exact from="/r/:domain" to="/remix/:domain" />
        <Redirect exact from="/project/:domain" to="/:domain" />
        <Route exact path="/import/github/:org/:repo">
          <ImportGithubRoute />
        </Route>
        <Route exact path="/import/git">
          <ImportGitRoute />
        </Route>
        <Route exact path="/embed/:domain">
          <ServeProjectEmbedRoute />
        </Route>
        <Route exact path="/:domain">
          <ServeProjectRoute />
        </Route>
      </Switch>
    </ReactRouter>
  );
}
