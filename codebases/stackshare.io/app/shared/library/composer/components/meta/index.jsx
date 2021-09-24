import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import LinkChip from './link-meta';
import CompanyMeta from './company-meta';
import StackMeta from './stack-meta';
import {ASH} from '../../../../style/colors';
import {CurrentUserContext} from '../../../../enhancers/current-user-enhancer';
import {PrivateModeContext} from '../../../../../shared/enhancers/private-mode-enchancer';
import {privateMode} from '../../../../../data/shared/queries';
import {withPrivateMode} from '../../../../../shared/enhancers/private-mode-enchancer';
import {userStacks} from '../../utils';

const PARENT_PADDING = 16;

const Container = glamorous.div({
  marginLeft: -PARENT_PADDING,
  marginRight: -PARENT_PADDING,
  marginBottom: -PARENT_PADDING,
  borderBottomRightRadius: 4,
  borderBottomLeftRadius: 4,
  display: 'flex',
  position: 'relative'
});

const AutoWrapLayout = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  flexGrow: 1,
  '>div': {
    borderTop: `1px solid ${ASH}`,
    minWidth: 250,
    background: 'white'
  }
});

const Meta = ({
  taggedCompany,
  taggedStack,
  linkUrl,
  onLinkChange,
  onTagCompany,
  onTagStack,
  isPrivate
}) => {
  const user = useContext(CurrentUserContext);
  const privateMode = useContext(PrivateModeContext);
  const myCompanies = user ? user.companies : [];
  const myStacks = userStacks(user);
  const [stack, setStack] = useState({});

  if (privateMode && privateMode.id && isPrivate) {
    let privateCompany = myCompanies.find(c => {
      return c.id === privateMode.id;
    });

    taggedCompany = privateCompany;
  }

  useEffect(() => {
    setStack(taggedStack);
  }, [taggedStack]);

  useEffect(() => {
    if (privateMode && privateMode.id) {
      setStack(null);
    }
  }, [isPrivate]);

  const privateStacks = myStacks.filter(i => i.private).map(i => i);
  const publicStacks = myStacks.filter(i => !i.private).map(i => i);
  return (
    <Container>
      <AutoWrapLayout>
        <LinkChip onChange={onLinkChange} linkUrl={linkUrl} />
        <CompanyMeta
          company={taggedCompany}
          onChange={onTagCompany}
          myCompanies={myCompanies}
          disabled={Boolean(privateMode.id) && isPrivate}
        />
        <StackMeta
          taggedStack={stack}
          onChange={onTagStack}
          myStacks={isPrivate ? privateStacks : publicStacks}
          isPrivate={isPrivate}
        />
      </AutoWrapLayout>
    </Container>
  );
};

Meta.propTypes = {
  taggedCompany: PropTypes.object,
  taggedStack: PropTypes.object,
  linkUrl: PropTypes.string,
  onLinkChange: PropTypes.func,
  onTagCompany: PropTypes.func,
  onTagStack: PropTypes.func,
  isPrivate: PropTypes.bool
};

export default withPrivateMode(privateMode)(Meta);
