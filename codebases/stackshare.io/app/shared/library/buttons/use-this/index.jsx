import React, {Fragment, useContext, useEffect, useState, useRef} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import PlusIcon from '../follow/plus.svg';
import SimpleButton from '../base/simple';
import {userStacks} from '../../../../data/shared/queries';
import {flattenEdges} from '../../../utils/graphql';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import PopoverWithAnchor from '../../popovers/base-v2';
import Circular, {MEDIUM} from '../../indicators/indeterminate/circular';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {ASH} from '../../../style/colors';
import * as PLACEMENTS from '../../../constants/placements';
import AddButton from './add-button';
import {CurrentUserContext} from '../../../enhancers/current-user-enhancer';
import {SIGN_IN_PATH} from '../../../../shared/constants/paths';
import {NavigationContext} from '../../../enhancers/router-enhancer';

const Button = glamorous(SimpleButton)({
  flexGrow: 0,
  flexShrink: 0
});

const CreateStackButton = glamorous(SimpleButton)({
  margin: '0 auto'
});

const List = glamorous.ul({
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  margin: 0,
  padding: 0
});

const Stack = glamorous.li({
  padding: 10,
  display: 'flex',
  alignItems: 'center',
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  textAlign: 'left',
  ':hover': {
    backgroundColor: 'rgba(0,0,0,0.03)'
  },
  '>button': {
    width: 65,
    marginRight: 10
  }
});

const Label = glamorous.label({
  ...BASE_TEXT,
  fontSize: 11,
  fontWeight: WEIGHT.BOLD,
  textTransform: 'uppercase',
  letterSpacing: 0.1,
  width: '93%',
  marginTop: 10,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  borderBottom: `1px solid ${ASH}`,
  paddingTop: 5,
  paddingBottom: 2,
  paddingLeft: 0,
  textAlign: 'left'
});

const Loading = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 30
});

const Heading = glamorous.div({
  ...BASE_TEXT,
  marginTop: 15,
  marginBottom: 15
});

const ScrollDiv = glamorous.div({
  height: 400,
  minWidth: 200,
  overflowY: 'scroll',
  overflowX: 'hidden'
});

const getStacks = load => {
  const client = useContext(ApolloContext);
  const [stacks, setStacks] = useState(null);
  useEffect(() => {
    if (load || stacks === null) {
      client.query({query: userStacks}).then(({data}) => {
        let stacks = [];
        if (data.me) {
          stacks.push({label: 'Personal', items: flattenEdges(data.me.stacks)});
          if (data.me.companies) {
            data.me.companies.forEach(company => {
              stacks.push({label: company.name, items: company.stacks});
            });
          }
        }
        setStacks(stacks);
      });
    } else {
      setStacks(null);
    }
  }, [load]);
  return stacks;
};

const stackHasService = (stack, serviceId) => Boolean(stack.services.find(s => s.id === serviceId));

const UseThisButton = ({serviceId, customStyle}) => {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useContext(NavigationContext);
  const [active, setActive] = useState(false);
  const stacks = getStacks(active);
  const popoverRef = useRef(null);

  useEffect(() => {
    const deactivate = event => {
      if (active && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener('click', deactivate, false);
    return () => document.removeEventListener('click', deactivate, false);
  }, [active]);

  const button = (
    <Button
      data-testid="iUseThis"
      onClick={event => {
        event.stopPropagation();
        if (currentUser === null || currentUser === false) {
          navigate(SIGN_IN_PATH);
        } else {
          setActive(!active);
        }
      }}
    >
      <PlusIcon />
      &nbsp;I use this
    </Button>
  );

  return (
    <PopoverWithAnchor
      anchor={button}
      customStyle={customStyle}
      hidden={!active}
      padding={0}
      placement={PLACEMENTS.TOP}
    >
      <List innerRef={popoverRef}>
        {stacks && <Heading>Add this tool to your stack</Heading>}
        <ScrollDiv>
          {stacks ? (
            stacks.map(({label, items}) => (
              <Fragment key={label}>
                <Label>{label} Stacks</Label>
                {items.length === 0 ? (
                  <CreateStackButton onClick={() => window.open('/create-stack/scan')}>
                    Create Stack
                  </CreateStackButton>
                ) : (
                  items.map(stack => {
                    const added = stackHasService(stack, serviceId);
                    return (
                      <Stack key={stack.id}>
                        <AddButton added={added} serviceId={serviceId} stackId={stack.id} />
                        {stack.name}
                      </Stack>
                    );
                  })
                )}
              </Fragment>
            ))
          ) : (
            <Loading>
              <Circular size={MEDIUM} />
            </Loading>
          )}
        </ScrollDiv>
      </List>
    </PopoverWithAnchor>
  );
};

UseThisButton.propTypes = {
  serviceId: PropTypes.any,
  customStyle: PropTypes.any
};

export default UseThisButton;
