import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {flattenEdges} from '../../utils/graphql';
import glamorous from 'glamorous';
import DefaultPersonalStackIcon from '../../../bundles/stack-profile/components/nav/icons/empty-logo-circle.svg';
import DefaultCompanyStackIcon from '../icons/default-company-icon.svg';
import {
  STRUCTURES,
  STRUCTURE_FREEFORM,
  STRUCTURE_GET_ADVICE,
  STRUCTURE_GIVE_ADVICE,
  STRUCTURE_MIGRATION,
  STRUCTURE_PROTIP,
  STRUCTURE_TOOL,
  IMAGE_TYPE_STACK,
  IMAGE_TYPE_USER,
  IMAGE_TYPE_COMPANY,
  STACK_OWNER_TYPE_COMPANY,
  STACK_OWNER_TYPE_USER
} from './constants';

const ICON_SIZE = 32;

const StyledDefaultPersonalStackIcon = glamorous(DefaultPersonalStackIcon)({
  height: ICON_SIZE,
  width: ICON_SIZE,
  borderRadius: '50%'
});

const StyledDefaultCompanyStackIcon = glamorous(DefaultCompanyStackIcon)({
  height: ICON_SIZE,
  width: ICON_SIZE
});

export const tagsPresenter = (key, tags) => {
  if (tags) {
    return {
      [key + '.total']: tags.length,
      [key + '.name']: tags.map(t => t.name),
      [key + '.id']: tags.map(t => t.id)
    };
  }
  return {};
};

export const stackResultsPresenter = (key, results) => {
  if (results) {
    return {
      [key + '.total']: results.length,
      [key + '.name']: results.map(r => r.name),
      [key + '.id']: results.map(r => r.id),
      [key + '.identifier']: results.map(r => r.identifier),
      [key + '.stackOwner']: results.map(r => r.stackOwner),
      [key + '.stackOwnerType']: results.map(r => r.stackOwnerType),
      [key + '.stackOwnerSlug']: results.map(r => r.stackOwnerSlug)
    };
  }
  return {};
};

export const companyPresenter = (key, company) => {
  if (company) {
    return {
      [key + '.id']: company.id,
      [key + '.name']: company.name,
      [key + '.myRole']: company.myRole
    };
  }
  return {};
};

export const stackPresenter = (key, stack) => {
  if (stack) {
    return {
      [key + '.id']: stack.id,
      [key + '.name']: stack.name,
      [key + '.identifier']: stack.identifier,
      [key + '.stackOwner']: stack.stackOwner,
      [key + '.stackOwnerType']: stack.stackOwnerType,
      [key + '.stackOwnerSlug']: stack.stackOwnerSlug
    };
  }
  return {};
};

const slugs = tool => tool.slug;

//ONLY USED FOR GIVE ADVICE RIGHT NOW
const getChosenToolSlug = state => {
  const chosenTools =
    state && state.tools && state.tools.tools && state.tools.tools.filter(tool => tool.chosen);
  return chosenTools ? chosenTools.map(tool => tool.slug) : [];
};

export const createMutationToolsPayload = state => {
  switch (state.selectedStructure) {
    case STRUCTURE_MIGRATION:
      return {
        migration: {
          fromTools: state.tools.fromTools.map(slugs),
          toTools: state.tools.toTools.map(slugs)
        }
      };
    case STRUCTURE_PROTIP:
      return {
        protip: {
          tools: state.tools.tools.map(slugs)
        }
      };
    case STRUCTURE_TOOL:
      return {
        tool: {
          fromTools: state.tools.fromTools.map(slugs),
          toTools: state.tools.toTools.map(slugs)
        }
      };
    case STRUCTURE_GET_ADVICE:
      return {
        getAdvice: {
          tools: state.tools.tools.map(slugs)
        }
      };
    case STRUCTURE_GIVE_ADVICE:
      return {
        giveAdvice: {
          parentDecisionId: state.parentId,
          chosenTools: getChosenToolSlug(state)
        }
      };
    case STRUCTURE_FREEFORM:
      return {
        freeform: {
          tools: state.tools.tools.map(slugs)
        }
      };
    default:
      return null;
  }
};

export const buildPostFromDecision = decision => {
  const {decisionType} = decision;
  let type = decisionType ? decisionType : STRUCTURE_FREEFORM;
  let subjectTools = decision.subjectTools;
  if (type === STRUCTURE_GIVE_ADVICE) {
    subjectTools = subjectTools.map(tool => ({...tool, chosen: true}));
  }
  return {...decision, decisionType: type, subjectTools};
};

export const userStacks = user => {
  if (!user || !user.stacks) {
    return [];
  }
  const personalStacks = flattenEdges(user.stacks).map(stack => {
    const imageType = stack.imageUrl ? IMAGE_TYPE_STACK : IMAGE_TYPE_USER;
    const imageUrl = stack.imageUrl ? stack.imageUrl : user.imageUrl;
    return {
      ...stack,
      stackOwner: 'Personal',
      stackOwnerType: STACK_OWNER_TYPE_USER,
      stackOwnerSlug: user.username,
      imageUrl,
      imageType
    };
  });
  const companyStacks = user.companies.reduce(
    (allStacks, company) =>
      allStacks.concat(
        company.stacks.reduce(
          (stacks, stack) =>
            stacks.concat({
              ...stack,
              stackOwner: company.name,
              stackOwnerType: STACK_OWNER_TYPE_COMPANY,
              stackOwnerSlug: company.slug,
              imageUrl: stack.imageUrl ? stack.imageUrl : company.imageUrl,
              imageType: stack.imageUrl ? IMAGE_TYPE_STACK : IMAGE_TYPE_COMPANY
            }),
          []
        )
      ),
    []
  );
  return [...personalStacks, ...companyStacks];
};

export const stackLabel = ({stack, bold = false}) => {
  const {name, stackOwner} = stack;
  return bold ? (
    <Fragment>
      <b>{stackOwner}</b>
      {`, ${name}`}
    </Fragment>
  ) : (
    `${stackOwner}, ${name}`
  );
};

stackLabel.propTypes = {
  stack: PropTypes.object,
  bold: PropTypes.bool
};

export const stackImage = imageType => {
  return imageType === IMAGE_TYPE_USER ? (
    <StyledDefaultPersonalStackIcon />
  ) : (
    <StyledDefaultCompanyStackIcon />
  );
};

export const taggableStack = stack => {
  const {imageUrl: stackImageUrl, owner} = stack;
  const ownerType = owner.__typename;
  const imageType = stackImageUrl
    ? IMAGE_TYPE_STACK
    : ownerType === STACK_OWNER_TYPE_COMPANY
    ? IMAGE_TYPE_COMPANY
    : IMAGE_TYPE_USER;
  const imageUrl = stackImageUrl ? stackImageUrl : owner.imageUrl;
  const stackOwner = ownerType === STACK_OWNER_TYPE_COMPANY ? owner.name : 'Personal';
  const stackOwnerType =
    ownerType === STACK_OWNER_TYPE_COMPANY ? STACK_OWNER_TYPE_COMPANY : STACK_OWNER_TYPE_USER;
  const stackOwnerSlug = ownerType === STACK_OWNER_TYPE_COMPANY ? owner.slug : owner.username;
  return {...stack, stackOwner, imageUrl, imageType, stackOwnerType, stackOwnerSlug};
};

export const getStructureDetails = structure => STRUCTURES.find(o => o.key === structure);

export const chosenTool = tools => {
  let tool = null;
  const chosenTool = tools.tools.find(tool => tool.chosen);
  if (chosenTool) {
    tool = chosenTool;
  } else if (tools.toTools.length > 0) {
    tool = tools.toTools[0];
  }
  return tool;
};

export const createAnalyticsPayload = state => {
  switch (state.selectedStructure) {
    case STRUCTURE_MIGRATION:
      return {
        fromTools: state.tools.fromTools.map(slugs).join(', '),
        toTools: state.tools.toTools.map(slugs).join(', ')
      };
    case STRUCTURE_PROTIP:
      return {
        tools: state.tools.tools.map(slugs).join(', ')
      };
    case STRUCTURE_TOOL:
      return {
        fromTools: state.tools.fromTools.map(slugs).join(', '),
        toTools: state.tools.toTools.map(slugs).join(', ')
      };
    case STRUCTURE_GET_ADVICE:
      return {
        tools: state.tools.tools.map(slugs).join(', ')
      };
    case STRUCTURE_GIVE_ADVICE:
      return {
        tools: getChosenToolSlug(state).join(', ')
      };
    case STRUCTURE_FREEFORM:
      return {
        tools: state.tools.tools.map(slugs).join(', ')
      };
    default:
      return null;
  }
};
