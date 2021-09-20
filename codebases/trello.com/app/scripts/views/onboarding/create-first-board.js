/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Browser = require('@trello/browser');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'onboarding',
);
const { l } = require('app/scripts/lib/localize');
const { trackUe } = require('@trello/analytics');
const {
  BOARD_NAME,
  LIST_NAME,
  CARD_NAME,
  CHECKITEM_NAME,
  CARD_DRAG,
  initialData,
  translatedCardDragFileMap,
  translatedCardBackFileMap,
} = require('app/scripts/views/onboarding/constants');
const { getTranslatedFile } = require('app/scripts/views/onboarding/helpers');
const { CreateFirstBoardIds } = require('@trello/test-ids');
const Language = require('@trello/locale');
const uuidv4 = require('uuid/v4');

const isInternetExplorer = Browser.isIE() || Browser.isEdgeLegacy();

const contentId = uuidv4();

class CreateFirstBoardComponent extends React.Component {
  static initClass() {
    this.prototype.render = t.renderable(function () {
      const { currentStep } = this.state;

      return t.div('.first-board-container', () => {
        // mock board
        t.div(
          '.first-board-column.first-board-image.board-name-background',
          {
            role: 'presentation',
            'aria-hidden': true,
          },
          () => {
            return t.div('.first-board-image-wrapper', () => {
              return t.div(
                '.first-board-image-base',
                {
                  className: t.classify({
                    'first-board-image-base--mod-card-drag':
                      currentStep === CARD_DRAG,
                    'first-board-image-base--mod-ie':
                      currentStep === CHECKITEM_NAME && isInternetExplorer,
                  }),
                },
                () => {
                  return this.renderPreview();
                },
              );
            });
          },
        );

        return t.div('.first-board-column.first-board-content-wrapper', () => {
          return t.div('.first-board-content', () => {
            t.nav('.first-board-navigation', () => {
              t.a(
                '.skip-nav',
                {
                  href: `#${contentId}`,
                  ref: (r) => {
                    return (this.skipRef = r);
                  },
                },
                () => t.format('skip-nav'),
              );
              return this.steps.map((step, index) => {
                return t.createElement('button', {
                  key: `nav${index}`,
                  className: t.classify({
                    'current-step': step === currentStep,
                  }),
                  onClick: () =>
                    this.goToStep(step, 'by clicking navigation dot'),
                  'aria-label': t.l(`go-to-step:${step}`),
                });
              });
            });
            return t.div(
              '.first-board-text-wrapper',
              { 'aria-live': 'polite' },
              () => {
                return t.div('.first-board-text', { id: contentId }, () => {
                  this.renderStepChildren();
                  return this.renderFooter();
                });
              },
            );
          });
        });
      });
    });
  }

  constructor(props) {
    super(...arguments);

    this.steps = [BOARD_NAME, LIST_NAME, CARD_NAME, CHECKITEM_NAME, CARD_DRAG];

    this.state = {
      currentStep: BOARD_NAME,
      board: initialData,
      saving: false,
      hasStarted: false,
    };

    this.handleClickBack = this.handleClickBack.bind(this);
  }

  skipToContent() {
    return this.skipRef != null ? this.skipRef.click() : undefined;
  }

  validate() {
    const { currentStep, board } = this.state;

    if (currentStep === BOARD_NAME) {
      return board.name !== '';
    } else if (currentStep === LIST_NAME) {
      return (
        board.lists.filter((list) => list.name !== '').length ===
        initialData.lists.length
      );
    } else if (currentStep === CARD_NAME) {
      return board.lists[0].cards[0].name !== '';
    } else if (currentStep === CHECKITEM_NAME) {
      // Allow user to pass this step, some may not want to enter a checkitem
      return true;
    } else {
      return true;
    }
  }

  continue() {
    if (this.isLastStep()) {
      return this.submit();
    } else {
      return this.goToStep(
        this.steps[this.steps.indexOf(this.state.currentStep) + 1],
        'by clicking on continue footer',
      );
    }
  }

  submit(isSkip) {
    let index;
    if (isSkip == null) {
      isSkip = false;
    }
    if (this.state.saving) {
      return;
    }

    // before sending data to the submit callback, make sure to sanitize any data
    // like spaces in titles or empty inputs
    const data = this.state.board;
    if (data.name.trim() === '') {
      data.name = initialData.defaultValue;
    }

    for (index = 0; index < data.lists.length; index++) {
      const list = data.lists[index];
      if (list.name.trim() === '') {
        list.name = initialData.lists[index].name;
      }
    }

    for (index = 0; index < data.lists[0].cards.length; index++) {
      const card = data.lists[0].cards[index];
      if (card.name.trim() === '') {
        card.name = initialData.lists[0].cards[index].defaultValue || '';
      }
    }

    if (data.checkItem.trim() === '') {
      data.checkItem = '';
    }

    trackUe(
      'create first board view',
      'creates',
      'board',
      '',
      '',
      isSkip ? 'by clicking skip' : 'by clicking on the submit footer',
      {
        currentStep: this.state.currentStep,
        stepCompleted: this.validate(),
      },
    );
    return this.setState(
      {
        saving: true,
      },
      () => this.props.onSubmit(data),
    );
  }

  isLastStep() {
    return this.steps.indexOf(this.state.currentStep) === this.steps.length - 1;
  }

  goToStep(step, method) {
    trackUe(
      'create first board view',
      'navigates',
      '',
      '',
      'to new step',
      method,
      {
        currentStep: this.state.currentStep,
        nextStep: step,
        stepCompleted: this.validate(),
      },
    );

    const nextState = this.state;
    // Some views we show more cards than others...
    if (step !== BOARD_NAME && step !== LIST_NAME) {
      nextState.board.lists[1].cards = [];
      nextState.board.lists[2].cards = [];
    } else {
      nextState.board.lists[1].cards = initialData.lists[1].cards;
      nextState.board.lists[2].cards = initialData.lists[2].cards;
    }

    nextState.currentStep = step;
    nextState.hasStarted = true;

    this.setState(nextState);
    return this.skipToContent();
  }

  handleClickBack() {
    return window.history.back();
  }

  updateBoard(value) {
    return this.setState({
      board: Object.assign(this.state.board, { name: value }),
    });
  }

  updateList(index, value) {
    const nextState = this.state;
    return this.setState(() => {
      nextState.board.lists[index] = {
        name: value,
        cards: this.state.board.lists[index].cards,
      };
      return nextState;
    });
  }

  updateCard(index, value) {
    const nextState = this.state;
    return this.setState(() => {
      nextState.board.lists[0].cards[index] = {
        name: value,
      };
      return nextState;
    });
  }

  updateCheckItem(value) {
    const nextState = this.state;
    return this.setState(() => {
      nextState.board.checkItem = value;
      return nextState;
    });
  }

  handleClickFooter(e) {
    // https://github.com/facebook/react/issues/3907
    if (e.detail === 0) {
      return;
    }
    return this.continue();
  }

  handleKeyPressSubmit(e) {
    if (this.validate() && e.key === 'Enter') {
      return this.continue();
    }
  }

  handleListKeyPress(e, index) {
    if (this.validate() && e.key === 'Enter') {
      if ([0, 1].includes(index)) {
        return this[`listInputRef${index + 1}`].select();
      } else {
        return this.continue();
      }
    }
  }

  renderStepChildren() {
    const { currentStep, board } = this.state;
    if (currentStep === BOARD_NAME) {
      return t.section(`.${BOARD_NAME}`, () => {
        t.h1(() => {
          return t.format(`${BOARD_NAME}:title`);
        });
        t.p(() => {
          t.format(`${BOARD_NAME}:description`);
          t.span(
            '.show-point-right',
            { role: 'presentation', 'aria-hidden': true },
            () => {
              return t.format('that-thing-over-there');
            },
          );
          return t.span(
            '.show-point-up',
            { role: 'presentation', 'aria-hidden': true },
            () => {
              return t.format('that-thing-up-there');
            },
          );
        });
        t.p(() => {
          return t.format(`${BOARD_NAME}:instructions`);
        });
        return t.input({
          type: 'text',
          placeholder: t.l(`${BOARD_NAME}:placeholder:0`),
          maxLength: '32',
          value: board.name,
          onChange: (e) => this.updateBoard(e.target.value),
          onKeyPress: (e) => this.handleKeyPressSubmit(e),
          'data-test-id': CreateFirstBoardIds.BoardNameInput,
          ref: (r) => {
            return (this.ref0 = r);
          },
          'aria-label': t.l('board-name'),
        });
      });
    } else if (currentStep === LIST_NAME) {
      return t.section(`.${LIST_NAME}`, () => {
        t.h1(() => {
          return t.format(`${LIST_NAME}:title`);
        });
        t.p(() => {
          return t.format(`${LIST_NAME}:description`);
        });
        t.p(() => {
          return t.format(`${LIST_NAME}:instructions`);
        });
        t.input({
          type: 'text',
          value: board.lists[0].name,
          maxLength: '16',
          onChange: (e) => this.updateList(0, e.target.value),
          onKeyPress: (e) => this.handleListKeyPress(e, 0),
          'data-test-id': CreateFirstBoardIds.ListNameInput,
          ref: (r) => {
            return (this.listInputRef0 = r);
          },
          'aria-label': t.l('list-name', { list_number: 1 }),
        });
        t.input({
          type: 'text',
          value: board.lists[1].name,
          maxLength: '16',
          onChange: (e) => this.updateList(1, e.target.value),
          onKeyPress: (e) => this.handleListKeyPress(e, 1),
          ref: (r) => {
            return (this.listInputRef1 = r);
          },
          'aria-label': t.l('list-name', { list_number: 2 }),
        });
        t.div('.third-input', () => {
          t.span(() => {
            return t.format('and');
          });
          return t.input({
            type: 'text',
            maxLength: '16',
            value: board.lists[2].name,
            onChange: (e) => this.updateList(2, e.target.value),
            onKeyPress: (e) => this.handleListKeyPress(e, 2),
            ref: (r) => {
              return (this.listInputRef2 = r);
            },
            'aria-label': t.l('list-name', { list_number: 3 }),
          });
        });
        return t.p('.post-input', () => {
          return t.format('go-ahead-and-rename-your-lists-if-youd-like-a11y');
        });
      });
    } else if (currentStep === CARD_NAME) {
      return t.section(`.${CARD_NAME}`, () => {
        t.h1(() => {
          return t.format(`${CARD_NAME}:title`);
        });
        t.p(() => {
          return t.format(`${CARD_NAME}:description`);
        });
        t.p(() => {
          return t.span({
            dangerouslySetInnerHTML: {
              __html: t.l(`${CARD_NAME}:instructions`, {
                listName: board.lists[0].name,
              }),
            },
          });
        });
        t.input({
          type: 'text',
          placeholder: t.l(`${CARD_NAME}:placeholder:0`),
          maxLength: '32',
          value: board.lists[0].cards[0].name,
          onChange: (e) => this.updateCard(0, e.target.value),
          onKeyPress: (e) => this.handleKeyPressSubmit(e),
          'data-test-id': CreateFirstBoardIds.CardNameInput,
          ref: (r) => {
            return (this.ref0 = r);
          },
          'aria-label': t.l('card-name', { card_number: 1 }),
        });
        t.input({
          type: 'text',
          placeholder: t.l(`${CARD_NAME}:placeholder:1`),
          maxLength: '32',
          value: board.lists[0].cards[1].name,
          onChange: (e) => this.updateCard(1, e.target.value),
          onKeyPress: (e) => this.handleKeyPressSubmit(e),
          'aria-label': t.l('card-name', { card_number: 2 }),
        });
        return t.div('.third-input', () => {
          t.span(() => {
            return t.format('and');
          });
          return t.input({
            type: 'text',
            placeholder: t.l(`${CARD_NAME}:placeholder:2`),
            maxLength: '32',
            value: board.lists[0].cards[2].name,
            onChange: (e) => this.updateCard(2, e.target.value),
            onKeyPress: (e) => this.handleKeyPressSubmit(e),
            'aria-label': t.l('card-name', { card_number: 3 }),
          });
        });
      });
    } else if (currentStep === CHECKITEM_NAME) {
      return t.section(`.${CHECKITEM_NAME}`, () => {
        t.h1(() => {
          return t.format(`${CHECKITEM_NAME}:title`);
        });
        t.p(() => {
          return t.format(`${CHECKITEM_NAME}:description`);
        });
        t.p({
          dangerouslySetInnerHTML: {
            __html: t.l(`${CHECKITEM_NAME}:instructions`, {
              cardName: board.lists[0].cards[0].name,
            }),
          },
        });
        return t.div('.checklist-item', () => {
          t.div('.checklist-box');
          return t.input({
            type: 'text',
            placeholder: t.l(`${CHECKITEM_NAME}:placeholder:0`),
            maxLength: '28',
            value: board.checkItem,
            onChange: (e) => this.updateCheckItem(e.target.value),
            onKeyPress: (e) => this.handleKeyPressSubmit(e),
            'data-test-id': CreateFirstBoardIds.ChecklistInput,
            ref: (r) => {
              return (this.ref0 = r);
            },
            'aria-label': t.l('checklist-name'),
          });
        });
      });
    } else if (currentStep === CARD_DRAG) {
      return t.section(`.${CARD_DRAG}`, () => {
        // No changes to content based on vertical, just use default
        t.h1(() => {
          return t.format(`${CARD_DRAG}:title`);
        });
        return t.p(() => {
          return t.format(`${CARD_DRAG}:description`);
        });
      });
    }
  }

  renderPreview() {
    const { currentStep, board, hasStarted } = this.state;
    const firstList = board.lists[0];
    const firstCard = firstList.cards[0];

    if (currentStep === CARD_DRAG) {
      t.img({
        src: getTranslatedFile(
          translatedCardDragFileMap,
          Language.currentLocale,
        ),
      });
      return t.div(() => {
        t.h2(() => {
          return t.format('one-last-tip');
        });
        return t.p(() => {
          return t.format('get-those-cards-moving');
        });
      });
    } else {
      t.div('.board-name-display', () => {
        return t.p(
          {
            className: t.classify({
              'is-active': !!board.name,
            }),
            'data-test-id': CreateFirstBoardIds.BoardNameDisplay,
          },
          () => t.text(board.name),
        );
      });
      t.div('.first-board-image-list-container', () => {
        return (() => {
          const result = [];
          for (const li in board.lists) {
            const list = board.lists[li];
            result.push(
              t.div(
                '.first-board-image-list.list-name-display',
                {
                  className: t.classify({
                    'first-board-image-list-empty': list.cards.length === 0,
                  }),
                },
                () => {
                  t.p(
                    {
                      className: t.classify({
                        'is-active': hasStarted && list.name !== '',
                      }),
                      'data-test-id':
                        li === '0'
                          ? CreateFirstBoardIds.ListNameDisplay
                          : undefined,
                    },
                    () => {
                      if (hasStarted) {
                        return t.text(list.name);
                      }
                    },
                  );
                  return (() => {
                    const result1 = [];
                    for (const ci in list.cards) {
                      const card = list.cards[ci];
                      result1.push(
                        t.div(
                          '.first-board-image-card.card-name-display',
                          {
                            className: t.classify({
                              large: !!card.large,
                            }),
                          },
                          () => {
                            return t.p(
                              {
                                className: t.classify({
                                  'is-active': !!card.name,
                                }),
                                'data-test-id':
                                  li === '0' && ci === '0'
                                    ? CreateFirstBoardIds.CardNameDisplay
                                    : undefined,
                              },
                              () => t.text(card.name),
                            );
                          },
                        ),
                      );
                    }
                    return result1;
                  })();
                },
              ),
            );
          }
          return result;
        })();
      });
      if (currentStep === CHECKITEM_NAME) {
        return t.div('.first-board-card-back', () => {
          t.img({
            src: getTranslatedFile(
              translatedCardBackFileMap,
              Language.currentLocale,
            ),
            className: 'check-name-image',
          });
          return t.div('.check-name-display', () => {
            t.p(() => t.text(firstCard.name || l('untitled card')));
            if (!board.checkItem) {
              return t.p('.check-name-placeholder', () => {
                return t.format('add-an-item');
              });
            } else {
              return t.p(
                {
                  'data-test-id': CreateFirstBoardIds.ChecklistDisplay,
                },
                () => t.text(board.checkItem),
              );
            }
          });
        });
      }
    }
  }

  renderFooter() {
    const { currentStep, saving } = this.state;

    return t.button(
      {
        key: `next-button:${currentStep}`,
        className: t.classify({
          'first-board-continue-footer': true,
          'is-active': this.validate() && !saving,
          'submit-footer': this.isLastStep(),
          disabled: !this.validate() || saving,
        }),
        onClick: (e) => this.handleClickFooter(e),
        onKeyDown: (e) => this.handleKeyPressSubmit(e),
        'data-test-id': CreateFirstBoardIds.ContinueButton,
        disabled: !this.validate() || saving,
        ref: (r) => {
          return (this.footer = r);
        },
        'aria-label': this.isLastStep()
          ? t.l('go-to-my-board')
          : t.l('next-step'),
      },
      () => {
        if (this.isLastStep()) {
          return t.format('now-youre-a-pro-keep-building-your-board');
        } else {
          return t.icon('down', {
            role: 'presentation',
            'aria-hidden': true,
          });
        }
      },
    );
  }
}

CreateFirstBoardComponent.initClass();
module.exports = CreateFirstBoardComponent;
