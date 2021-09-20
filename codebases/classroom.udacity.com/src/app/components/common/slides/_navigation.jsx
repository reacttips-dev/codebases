import BusyButton from 'components/common/busy-button';
import { Button } from '@udacity/veritas-components';
import { IconArrowLeft } from '@udacity/veritas-icons';
import { SlidesConsumer } from './_context';
import { __ } from 'services/localization-service';

import styles from './_navigation.scss';

export const NextButton = (props) => {
  return (
    <SlidesConsumer>
      {({ nextSlide, slideIndex, slideCount }) => {
        const isLastSlide = slideIndex === slideCount - 1;
        const { onNext, autoAdvance } = props;
        const onClick = onNext
          ? () => Promise.resolve(onNext()).then(() => nextSlide())
          : nextSlide;

        if (autoAdvance) {
          onClick();
        }

        return (
          <BusyButton
            {...props}
            variant="primary"
            onClick={onClick}
            label={
              isLastSlide && props.label === __('Next')
                ? __('Done')
                : props.label
            }
          />
        );
      }}
    </SlidesConsumer>
  );
};

NextButton.displayName = 'onboarding/slides/_navigation/next-button';
NextButton.propTypes = _.omit(Button.propTypes, ['type', 'onClick']);

export const PrevButton = (props) => {
  return (
    <SlidesConsumer>
      {({ prevSlide, slideIndex }) =>
        slideIndex > 0 &&
        !props.disableBack && ( // hide prev button if there is no prev to go to or allow override
          <div className={styles['prev-button']}>
            <Button
              {...props}
              onClick={prevSlide}
              variant="minimal"
              label={__('Back')}
              icon={<IconArrowLeft />}
            />
          </div>
        )
      }
    </SlidesConsumer>
  );
};

PrevButton.displayName = 'onboarding/slides/_navigation/prev-button';
PrevButton.propTypes = _.omit(Button.propTypes, [
  'type',
  'label',
  'children',
  'onClick',
]);
