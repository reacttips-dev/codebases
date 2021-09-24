import React, {useState} from 'react';
import {Query} from 'react-apollo';

export const HAS_STACK = 'has-stack';
export const FIVE_TOOLS_FOLLOWED = 'five-tools-followed';
export const KEEPING_UP_WITH_TOOLS = 'keeping-up-with-tools';
export const COMPANY_MEMBER = 'company-member';
export const UPVOTED_THREE_DECISIONS = 'upvoted-three-decisions';
export const SHARED_DECISION = 'shared-decision';

export const ChecklistContext = React.createContext({});

export const withChecklist = query => Component => {
  function OnboardingChecklist(props) {
    const [action, setAction] = useState('');
    const [itemLoading, setItemLoading] = useState('');

    return (
      <Query query={query}>
        {({loading, error, data}) => {
          let checklist = {};
          if (loading) {
            checklist.loading = true;
          } else if (!error) {
            checklist = data.onboardingChecklist;
          }
          return (
            <ChecklistContext.Provider
              value={{
                checklist,
                checklistAction: action,
                onChecklistAction: action => setAction(action),
                resetChecklistAction: () => setAction(''),
                checklistItemLoading: itemLoading,
                onChecklistItemLoading: () => setItemLoading(action),
                resetChecklistItemLoading: () => setItemLoading('')
              }}
            >
              <Component {...props} />
            </ChecklistContext.Provider>
          );
        }}
      </Query>
    );
  }

  return OnboardingChecklist;
};

export const withChecklistContext = Component => props => (
  <ChecklistContext.Consumer>
    {checklistContext => <Component {...props} checklistContext={checklistContext} />}
  </ChecklistContext.Consumer>
);
