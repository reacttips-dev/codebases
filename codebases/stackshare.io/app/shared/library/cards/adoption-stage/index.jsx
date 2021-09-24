import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {ASH, CHARCOAL} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import glamorous from 'glamorous';
import {ReferenceBox, PopperBox, ArrowContainer} from '../../popovers/hint/styles';
import Arrow from '../../popovers/hint/arrow.svg';
import RenameIcon from '../../icons/edit.svg';
import {adopt} from 'react-adopt';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import {updateStageMutation, linkStageMutation} from '../../../../data/adoption-stage/mutations';
import {adoptionStagesQuery, toolAdoptionStageQuery} from '../../../../data/adoption-stage/queries';
import {Query} from 'react-apollo';
import StageContainer from './stage-container';
import AssignStageIcon from '../../icons/assign-stage.svg';
import Circular, {BUTTON} from '../../../../shared/library/indicators/indeterminate/circular';
import {privateMode} from '../../../../data/shared/queries';

const OverrideButton = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: 0.2,
  color: CHARCOAL,
  display: 'flex',
  border: `1px solid ${ASH}`,
  borderRadius: 9,
  outline: 'none',
  background: 'none',
  paddingLeft: 10,
  paddingRight: 10,
  alignItems: 'center',
  cursor: 'pointer',
  textDecoration: 'none',
  boxSizing: 'border-box',
  height: 18,
  justifyContent: 'space-between',
  margin: '0 10px',
  fontSize: 10,
  '> svg': {
    width: 8,
    height: 8
  },
  ':hover': {
    color: CHARCOAL,
    border: `1px solid ${ASH}`
  },
  ' span': {
    fontWeight: 600,
    marginRight: 10
  },
  '.viewMode': {
    ' span': {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      '> svg': {
        width: 13,
        height: 13
      }
    }
  }
});

const Spinner = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  padding: '25px'
});

const Container = glamorous.div({
  position: 'relative',
  display: 'flex'
});

const AssignStageContainer = glamorous.div({
  display: 'flex',
  margin: '4px 0 0 13px',
  cursor: 'pointer'
});

const actions = {
  updateStage: 'UPDATE_STAGE',
  stageToolLink: 'LINK_STAGE_TOOL',
  stageToolUnlink: 'UNLINK_STAGE_TOOL'
};

let Manager = null;
let Reference = null;
let Popper = null;

const AdoptionStage = ({toolSlug, toolAdoptionStage, canEdit, sectionName}) => {
  const client = useContext(ApolloContext);
  const [showStageMenu, setStageMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeAdoptionStage, setActiveAdoptionStage] = useState(toolAdoptionStage);

  /* eslint-disable react/prop-types */
  const Composed = adopt({
    stages: ({render}) => (
      <Query query={adoptionStagesQuery} fetchPolicy="network-only">
        {render}
      </Query>
    ),
    toolAdoption: ({render}) => (
      <Query query={toolAdoptionStageQuery} variables={{id: toolSlug}} fetchPolicy="network-only">
        {render}
      </Query>
    )
  });
  /* eslint-enable react/prop-types */

  useEffect(() => {
    import(/* webpackChunkName: "react-popper" */ 'react-popper').then(module => {
      Manager = module.Manager;
      Reference = module.Reference;
      Popper = module.Popper;
      setReady(true);
    });
    if (sectionName) localStorage.setItem(`adoption-stage-${sectionName}`, false);
  }, []);

  useEffect(() => {
    const check = toolAdoptionStage ? {...toolAdoptionStage} : toolAdoptionStage;
    setActiveAdoptionStage(check);
  }, [toolAdoptionStage]);

  useEffect(() => {
    if (toolSlug) {
      setStageMenu(false);
    }
  }, [toolSlug]);
  // eslint-disable-next-line no-unused-vars
  let container = null;
  const handleStageClick = event => {
    event.stopPropagation();
    let checkInLocal = localStorage.getItem(`adoption-stage-${sectionName}`);
    if (sectionName && checkInLocal === 'false') {
      localStorage.setItem(`adoption-stage-${sectionName}`, true);
      setStageMenu(true);
    }

    if (!sectionName) setStageMenu(true);
  };

  const handleStageDismiss = event => {
    event.stopPropagation();
    if (sectionName) localStorage.setItem(`adoption-stage-${sectionName}`, false);
    setStageMenu(false);
  };

  const updateStages = (action, data, tempStage) => {
    let getMutation,
      variables = {};
    setStageMenu(false);
    if (sectionName) localStorage.setItem(`adoption-stage-${sectionName}`, false);
    switch (action) {
      case actions.updateStage:
        if (tempStage) {
          getMutation = linkStageMutation;
          variables = {
            companyAdoptionStages: data.map(stage => {
              return {
                id: stage.id,
                name: stage.name
              };
            }),
            toolAdoptionStageLink: {
              toolSlug: toolSlug,
              stageName: tempStage && tempStage.name
            }
          };
          break;
        } else {
          getMutation = updateStageMutation;
          variables = {
            companyAdoptionStages: data.map(stage => {
              return {
                id: stage.id,
                name: stage.name
              };
            })
          };
          break;
        }
      case actions.stageToolLink:
        getMutation = linkStageMutation;
        variables = {
          companyAdoptionStages: data.map(stage => {
            return {
              id: stage.id,
              name: stage.name
            };
          }),
          toolAdoptionStageLink: {
            toolSlug: toolSlug,
            stageName: tempStage && tempStage.name
          }
        };
        break;

      case actions.stageToolUnlink:
        getMutation = linkStageMutation;
        variables = {
          companyAdoptionStages: data.map(stage => {
            return {
              id: stage.id,
              name: stage.name
            };
          }),
          toolAdoptionStageLink: {
            toolSlug: toolSlug,
            stageName: null
          }
        };
        break;
    }

    client
      .mutate({
        mutation: getMutation,
        variables: variables,
        refetchQueries: [{query: privateMode}],
        awaitRefetchQueries: true
      })
      // eslint-disable-next-line no-unused-vars
      .then(async result => {
        const updateToolAdoption = await client.query({
          query: toolAdoptionStageQuery,
          variables: {id: toolSlug},
          fetchPolicy: 'network-only'
        });

        let toolAdoptionStage =
          updateToolAdoption &&
          updateToolAdoption.data &&
          updateToolAdoption.data.tool &&
          updateToolAdoption.data.tool.adoptionStage;
        if (toolAdoptionStage) {
          setActiveAdoptionStage(toolAdoptionStage);
        } else setActiveAdoptionStage(null);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        // console.log('GQL error', error);
      });
  };

  if (ready) {
    // eslint-disable-next-line no-unused-vars
    return (
      <>
        <Container innerRef={el => (container = el)} onClick={e => e.stopPropagation()}>
          <Manager>
            <Reference>
              {({ref}) =>
                canEdit ? (
                  activeAdoptionStage ? (
                    <ReferenceBox innerRef={ref} onClick={handleStageClick}>
                      <CTAButton
                        name={activeAdoptionStage.name}
                        icon={<RenameIcon />}
                        className="editMode"
                      />
                    </ReferenceBox>
                  ) : (
                    <ReferenceBox innerRef={ref} onClick={handleStageClick}>
                      <AssignStageContainer>
                        <AssignStageIcon />
                      </AssignStageContainer>
                    </ReferenceBox>
                  )
                ) : activeAdoptionStage ? (
                  <ReferenceBox innerRef={ref} onClick={() => {}}>
                    <CTAButton name={activeAdoptionStage.name} className="viewMode" />
                  </ReferenceBox>
                ) : null
              }
            </Reference>
            {showStageMenu && (
              <Popper
                placement="bottom"
                modifiers={{
                  flip: {enabled: false},
                  preventOverflow: {escapeWithReference: true}
                }}
              >
                {({ref, style, placement, arrowProps}) => (
                  <PopperBox
                    innerRef={ref}
                    style={{
                      ...style,
                      padding: 0,
                      alignItems: 'flex-start',
                      width: '224px',
                      marginTop: 9,
                      borderRadius: 2
                    }}
                    data-placement={placement}
                  >
                    <Composed>
                      {({stages, toolAdoption}) => {
                        if (stages.loading || toolAdoption.loading)
                          return (
                            <Spinner>
                              <Circular size={BUTTON} />
                            </Spinner>
                          );
                        let getStages =
                          stages &&
                          stages.data &&
                          stages.data.currentPrivateCompany &&
                          stages.data.currentPrivateCompany.adoptionStages;

                        let toolAdoptionStage =
                          toolAdoption &&
                          toolAdoption.data &&
                          toolAdoption.data.tool &&
                          toolAdoption.data.tool.adoptionStage;

                        let finalStages = [...getStages];
                        if (toolAdoptionStage) {
                          finalStages = getStages.map(stage => {
                            return {
                              ...stage,
                              chosen: stage.id === toolAdoptionStage.id ? true : false
                            };
                          });
                          setActiveAdoptionStage(toolAdoptionStage);
                        }
                        return (
                          <StageContainer
                            handleStageDismiss={handleStageDismiss}
                            stages={finalStages}
                            toolAdoption={toolAdoptionStage}
                            updateStages={updateStages}
                          />
                        );
                      }}
                    </Composed>

                    <ArrowContainer
                      innerRef={arrowProps.ref}
                      data-placement={placement}
                      style={arrowProps.style}
                    >
                      <Arrow />
                    </ArrowContainer>
                  </PopperBox>
                )}
              </Popper>
            )}
          </Manager>
        </Container>
      </>
    );
  } else return null;
};

const CTAButton = ({name, icon, className}) => {
  return (
    <OverrideButton className={className}>
      <>
        <span>{name}</span>
        {icon ? icon : null}
      </>
    </OverrideButton>
  );
};

CTAButton.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.any,
  className: PropTypes.string
};

AdoptionStage.propTypes = {
  toolSlug: PropTypes.string,
  adoptionStages: PropTypes.arrayOf(PropTypes.object),
  toolAdoptionStage: PropTypes.object,
  canEdit: PropTypes.bool,
  sectionName: PropTypes.string
};

AdoptionStage.defaultProps = {
  adoptionStages: [],
  toolAdoptionStage: null,
  canEdit: false,
  sectionName: ''
};

export default AdoptionStage;
