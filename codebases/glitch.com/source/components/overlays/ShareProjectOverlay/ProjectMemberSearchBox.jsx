import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import randomColor from 'randomcolor';
import isEmail from 'validator/lib/isEmail';
import algoliasearch from 'algoliasearch/lite';
import { Grid, Cell } from 'styled-css-grid';
import uuid from 'uuid/v4';
import {
  Button,
  Notification,
  ResultInfo,
  ResultItem,
  ResultDescription,
  ResultName,
  SearchResults,
  useNotifications,
} from '@glitchdotcom/shared-components';
import { captureException } from '../../../sentry';

import useApplication from '../../../hooks/useApplication';
import useGlitchApi from '../../../hooks/useGlitchApi';
import UserAvatar from '../../icons/UserAvatar';
import { access } from '../../../const';

const StyledSearchResults = styled(SearchResults)`
  min-width: 80%;
  display: flex;
`;

const FullWidthText = styled.span`
  grid-column: 1/-1;
  align-self: end;
  font-size: 14px;
  margin-bottom: 4px;
`;

const StyledButton = styled(Button)`
  width: max-content;
  justify-self: start;
  @media (min-width: 499px) {
    justify-self: end;
  }
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px 16px;

  @media (min-width: 499px) {
    grid-template-columns: 60% max-content;
    justify-content: space-between;
  }
`;

export default function ProjectMemberSearchBox({ currentProjectPrivacy, pendingInvites, pendingInviteDispatch }) {
  const [query, setQuery] = useState('');
  const glitchApi = useGlitchApi();
  const application = useApplication();
  const projectMembers = application.currentProject().users();
  const { createNotification } = useNotifications();

  const [searchIndex, setSearchIndex] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  useEffect(() => {
    if (!glitchApi) {
      return;
    }

    (async () => {
      const { id, searchKey, indexPrefix } = await glitchApi.getSearchCreds();
      const newSearchClient = algoliasearch(id, searchKey);
      setSearchIndex(newSearchClient.initIndex(`${indexPrefix}search_users`));
    })();
  }, [glitchApi]);

  const [filteredResults, setFilteredResults] = useState([]);
  useEffect(() => {
    if (!searchIndex) {
      return () => {};
    }

    if (!query) {
      setFilteredResults([]);
      return () => {};
    }

    if (selectedResult) {
      setFilteredResults([selectedResult]);
      return () => {};
    }

    let cancelled = false;
    (async () => {
      const results = await searchIndex.search(query, {
        hitsPerPage: 3,
      });
      if (!cancelled) {
        setFilteredResults(
          results.hits
            .map((result) => ({
              ...result,
              id: Number(result.objectID.replace('user-', '')),
            }))
            .filter((result) => {
              // filter out users that already exist in currentProject().users() or pendingInvites
              // this prevents users from accidentally adding themselves, an existing project member, or a pending user
              return projectMembers.every((member) => member.id !== result.id) && pendingInvites.every((invite) => invite.login !== result.login);
            }),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchIndex, selectedResult, query, projectMembers, pendingInvites]);

  const sendInvite = () => {
    const id = uuid();

    let sentInvite = null;
    let email = null;

    // send if query is an email
    if (isEmail(query)) {
      email = query;
      sentInvite = application.inviteEmailToProject(query);
    }

    // send if query is a username
    else if (selectedResult) {
      sentInvite = application.inviteUserToProject(selectedResult.id);
    }

    if (sentInvite) {
      createNotification((props) => <Notification message="An invite has been sent by email" {...props} />);
      pendingInviteDispatch({
        type: 'PENDING_SEND_INVITE',
        invite: {
          id,
          login: selectedResult?.login,
          email,
          state: 'pending',
          color: randomColor({ luminosity: 'light' }),
          // For now you can only add pending members as editors.
          // TODO: pass in the appropriate permission once you can add people at different access levels
          projectPermission: { accessLevel: access.MEMBER },
        },
      });
      sentInvite.then(
        (invite) =>
          pendingInviteDispatch({
            type: 'SUCCESS_SEND_INVITE',
            id,
            invite,
          }),
        (error) => {
          captureException(error);
          pendingInviteDispatch({
            type: 'FAILURE_SEND_INVITE',
            id,
          });
        },
      );
      setFilteredResults([]);
      setQuery('');
    }
  };

  const getActionTextForProject = () => {
    if (currentProjectPrivacy === 'private_project') {
      return 'to access your project.';
    }
    return 'to edit your code.';
  };

  const matchingUser = filteredResults.filter((result) => result.login === query)[0];

  return (
    <HeaderGrid>
      <FullWidthText>
        <strong>Invite project members</strong> {getActionTextForProject()}
      </FullWidthText>
      {/* We need to force this to be in its own element on the grid */}
      <form
        id="project-member-search"
        onSubmit={() => {
          setSelectedResult(matchingUser);
          sendInvite();
        }}
      >
        <StyledSearchResults
          label="user search"
          value={query}
          onChange={(value) => {
            setQuery(value);
            setSelectedResult(null);
          }}
          options={filteredResults}
        >
          {({ item, buttonProps }) => (
            <ResultItem
              onMouseDown={(e) => {
                setQuery(item.login);
                setSelectedResult(item);
                e.currentTarget.blur();
              }}
              {...buttonProps}
            >
              <ResultInfo>
                <Grid columns="1fr 6fr" rows={2} gap="0">
                  <Cell width={1} height={2}>
                    <UserAvatar avatarUrl={item.avatarThumbnailUrl} color={item.coverColor} />
                  </Cell>
                  <Cell width={1}>
                    <ResultName>{item.name}</ResultName>
                  </Cell>
                  <Cell width={1} left={2} top={2}>
                    <ResultDescription>@{item.login}</ResultDescription>
                  </Cell>
                </Grid>
              </ResultInfo>
            </ResultItem>
          )}
        </StyledSearchResults>
      </form>
      {/* we keep the button disabled until there's a valid email or the typed user name matches one in the dropdown list */}
      <StyledButton
        disabled={!(matchingUser || isEmail(query))}
        size="small"
        onClick={(e) => {
          e.preventDefault();
          setSelectedResult(matchingUser);
          sendInvite(query);
          application.analytics.track('Project Invite Sent');
        }}
        type="submit"
        form="project-member-search"
      >
        Send invite
      </StyledButton>
    </HeaderGrid>
  );
}
