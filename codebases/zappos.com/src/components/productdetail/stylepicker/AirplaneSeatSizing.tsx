import React, { useEffect, useReducer } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Select from 'react-select';
import cn from 'classnames';
import { Location } from 'history';

import { productAgeGroupChanged, productGenderChanged, productSizeUnitChanged } from 'actions/productDetail';
import { capitalize } from 'helpers/index';
import useMartyContext from 'hooks/useMartyContext';
import GenericSizeBiasReco from 'components/productdetail/stylepicker/GenericSizeBiasReco';
import RecommendedSizing from 'components/productdetail/stylepicker/RecommendedSizing';
import { AirplaneCache, AirplaneCacheSizeOption, AirplaneCacheStock } from 'reducers/detail/airplaneCache';
import { FormattedProductBundle, FormattedProductSizing, ProductDetailState } from 'reducers/detail/productDetail';
import { AirplaneSizingOption, SizingValue } from 'types/cloudCatalog';

import css from 'styles/components/productdetail/airplaneSeatSizing.scss';

/** FormattedProductSizing except the `airplaneCache` field is required */
export type AirplaneProductSizing = Omit<FormattedProductSizing, 'airplaneCache'> & Required<Pick<FormattedProductSizing, 'airplaneCache'>>;

interface OwnProps {
  sizing: AirplaneProductSizing;
  product: ProductDetailState;
  onDemandSizingGender: string | null;
  showRecommendedSizing: boolean | '' | undefined;
  onSizeChange: (options: SizingValue[], event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => void;
  onOpenModal: () => void;
  onCloseModal: () => void;
  handleSetRecommendedFit: (predictedSize: string) => void;
  selectedSize: string | undefined;
  location: Location;
  handleCalculateSizeClick: () => void;
  hydraBlueSkyPdp: boolean;
  isOnDemandSizingModalOpen: boolean;
  isDesktopView: boolean;
  sizingPredictionId?: string | null;
  isSelectSizeTooltipVisible: boolean;
  isSingleShoe: boolean;
  showGenericSizeBiasReco: boolean;
}

interface State {
  interactive: boolean;
  ageGroupSelectionId: AirplaneCacheStock['ageGroup'];
  genderSelectionId: AirplaneCacheStock['gender'];
  unitSelectionId?: AirplaneCacheStock['countryOrUnit'];
  sizeSelectionId: number;
  sizeSelectionIndex: number;
  widthSelectionIndex: number;
  focusIndex: number;
  focusType: string;
}

type Props = OwnProps & PropsFromRedux;

const reducer = (state: State, action: AirplaneSeatActions) => {
  switch (action.type) {
    case 'unSetInteractive': {
      return {
        ...state,
        interactive: false
      };
    }
    case 'setInteractive': {
      return {
        ...state,
        interactive: true
      };
    }
    case 'setAgeGroupSelectionIndex': {
      const { id } = action.payload;
      return {
        ...state,
        ageGroupSelectionId: id,
        sizeSelectionId: -1,
        sizeSelectionIndex: -1,
        widthSelectionIndex: -1
      };
    }
    case 'setGenderSelectionIndex': {
      const { id } = action.payload;
      return {
        ...state,
        genderSelectionId: id,
        sizeSelectionId: -1,
        sizeSelectionIndex: -1,
        widthSelectionIndex: -1
      };
    }
    case 'setSizeSelectionIndex': {
      const { id, index } = action.payload;
      return {
        ...state,
        sizeSelectionIndex: index,
        sizeSelectionId: id
      };
    }
    case 'setUnitSelectionId': {
      const { id } = action.payload;
      return {
        ...state,
        sizeSelectionId: -1,
        sizeSelectionIndex: -1,
        unitSelectionId: id,
        widthSelectionIndex: -1
      };
    }
    case 'setWidthSelectionIndex': {
      const { index } = action.payload;
      return {
        ...state,
        widthSelectionIndex: index
      };
    }
    case 'setFocus': {
      const { focusIndex, focusType } = action.payload;
      return {
        ...state,
        focusIndex,
        focusType
      };
    }
    default: {
      return state;
    }
  }
};

type SetDimensionSelectionActionType =
  | 'setAgeGroupSelectionIndex'
  | 'setGenderSelectionIndex'
  | 'setSizeSelectionIndex'
  | 'setUnitSelectionId'
  | 'setWidthSelectionIndex';

type AirplaneSeatActions =
  | { type: 'unSetInteractive'; payload?: {index?: number; id?: number } }
  | { type: 'setInteractive'; payload?: { index?: number; id?: number } }
  | { type: 'setAgeGroupSelectionIndex'; payload: { id: AirplaneCacheStock['ageGroup'] } }
  | { type: 'setGenderSelectionIndex'; payload: { id: AirplaneCacheStock['gender'] } }
  | { type: 'setSizeSelectionIndex'; payload: { index: number; id: number } }
  | { type: 'setUnitSelectionId'; payload: { id: AirplaneCacheStock['countryOrUnit'] } }
  | { type: 'setWidthSelectionIndex'; payload: { index: number; id?: number } }
  | { type: 'setFocus'; payload: { focusIndex: number; focusType: string } };

interface MakeButtonOptions {
  airplaneCacheOptionId?: string;
  isChecked: boolean;
  isOos?: boolean;
}

type MakeButtonFnType = (
  typeKey: 'ageGroup' | 'gender' | 'size' | 'width',
  index: number,
  optionId: string,
  classSetting: string,
  value: string,
  options: MakeButtonOptions
) => any;

const DEFAULT_SIZE_LEGEND_HEADING = 'Size:';
const GENDERED_SIZE_LEGEND_HEADING: Record<string, string> = {
  boys: 'Boy\'s Sizes:',
  girls: 'Girl\'s Sizes:',
  men: 'Men\'s Sizes:',
  women: 'Women\'s Sizes:'
};
const AGE_GROUP_SIZE_LEGEND_HEADING: Record<AirplaneSizingOption['ageGroup'], string> = {
  'adult': DEFAULT_SIZE_LEGEND_HEADING,
  'big-kids': 'Big Kid Size:',
  'infant': 'Infant Size:',
  'kids': 'Kids Size:',
  'little-kids': 'Little Kid Size:',
  'toddler': 'Toddler Size:'
};

function shouldShowGenderOptions(airplaneCache: AirplaneCache): boolean {
  const { ageGroups, genderOptions } = airplaneCache.all;
  if (ageGroups.length > 1) {
    return false;
  }
  if (ageGroups.length === 1 && ageGroups[0].id !== 'adult') {
    return false;
  }
  return genderOptions.length > 1;
}

/**
 * Creates the data-test-id for the gender, size, and width legends.
 *
 * Tags for people grepping the codebase:
 * airplaneSeatSizeSelectAgeGroupLegend, airplaneSeatSizeSelectAgeGroupLegendWarning,
 * airplaneSeatSizeSelectGenderLegend, airplaneSeatSizeSelectGenderLegendWarning,
 * airplaneSeatSizeSelectSizeLegend, airplaneSeatSizeSelectSizeLegendWarning,
 * airplaneSeatSizeSelectWidthLegend, airplaneSeatSizeSelectWidthLegendWarning
 */
function makeLegendDataTestId(legendKey: 'AgeGroup' | 'Gender' | 'Size' | 'Width', isSelectSizeTooltipVisible: boolean) {
  if (isSelectSizeTooltipVisible) {
    return `airplaneSeatSizeSelect${legendKey}LegendWarning`;
  }
  return `airplaneSeatSizeSelect${legendKey}Legend`;
}

/**
 * Creates the data-test-id for the gender, size, and width option containers.
 *
 * Tags for people grepping the codebase:
 * airplaneSeatSizeOptionGroupForAgeGroup, airplaneSeatSizeOptionGroupForGender,
 * airplaneSeatSizeOptionGroupForSize, airplaneSeatSizeOptionGroupForWidth
 */
function makeOptionGroupDataTestId(key: 'AgeGroup' | 'Gender' | 'Size' | 'Width') {
  return `airplaneSeatSizeOptionGroupFor${key}`;
}

function makeSizeLegendHeading(genderLabel: string): string {
  const key = genderLabel.toLowerCase();
  if (key in GENDERED_SIZE_LEGEND_HEADING) {
    return GENDERED_SIZE_LEGEND_HEADING[key];
  }
  return DEFAULT_SIZE_LEGEND_HEADING;
}

function makeSizeLegendHeadingFromState(props: Props, state: State) {
  const { airplaneCache } = props.sizing;
  const { ageGroupSelectionId, genderSelectionId } = state;

  const showGenderOptions = shouldShowGenderOptions(airplaneCache);
  const genderLabel = airplaneCache.all.genderOptions.find(option => option.id === genderSelectionId)?.label;
  if (!showGenderOptions) {
    return genderLabel ? makeSizeLegendHeading(genderLabel) : AGE_GROUP_SIZE_LEGEND_HEADING[ageGroupSelectionId];
  }
  if (!genderLabel) {
    return DEFAULT_SIZE_LEGEND_HEADING;
  }
  return makeSizeLegendHeading(genderLabel);
}

function makeAgeGroupOptions(props: Props, state: State, makeButton: MakeButtonFnType) {
  const {
    sizing: { airplaneCache }
  } = props;
  const { focusIndex, focusType, ageGroupSelectionId } = state;
  return airplaneCache.all.ageGroups.map((option, index) => {
    const isChecked = option.id === ageGroupSelectionId;
    const classSetting = cn(css.gridLookOption, {
      [css.selected]: isChecked,
      [css.focus]: (focusIndex === index && focusType === 'setAgeGroupSelectionIndex')
    });
    return (
      <React.Fragment key={option.id}>
        {makeButton('ageGroup', index, option.id, classSetting, option.label, { isChecked })}
      </React.Fragment>
    );
  });
}

function makeGenderOptions(props: Props, state: State, makeButton: MakeButtonFnType) {
  const {
    sizing: { airplaneCache }
  } = props;
  const { focusIndex, focusType, genderSelectionId } = state;
  return airplaneCache.all.genderOptions.map((option, index) => {
    const isChecked = option.id === genderSelectionId;
    const classSetting = cn(css.gridLookOption, {
      [css.selected]: isChecked,
      [css.focus]: (focusIndex === index && focusType === 'setGenderSelectionIndex')
    });
    return (
      <React.Fragment key={option.id}>
        {makeButton('gender', index, option.id, classSetting, option.label, { isChecked })}
      </React.Fragment>
    );
  });
}

function makeSizeOption(
  props: Props,
  state: State,
  makeButton: MakeButtonFnType,
  option: AirplaneCacheSizeOption,
  index: number,
  key: string
) {
  const {
    product: { selectedSizing },
    sizing: { airplaneCache }
  } = props;
  const {
    focusIndex,
    focusType,
    sizeSelectionIndex
  } = state;

  const { countryOrUnit, d3 } = option;
  if (airplaneCache.constraints.countryOrUnit && countryOrUnit !== airplaneCache.constraints.countryOrUnit) {
    return null;
  }
  const isChecked = !!(selectedSizing.d3 && selectedSizing.d3 === d3);
  const isInStock = airplaneCache.available.sizeOptions.includes(option.d3);

  const classSetting = cn(css.gridLookOption, {
    [css.selected]: ((index === sizeSelectionIndex) || (isChecked && sizeSelectionIndex === -1)),
    [css.oos]: !isInStock,
    [css.focus]: (focusIndex === index && focusType === 'setSizeSelectionIndex')
  });

  return (
    <React.Fragment key={key}>
      {makeButton('size', index, d3, classSetting, option.label, { airplaneCacheOptionId: option.id, isChecked, isOos: !isInStock })}
    </React.Fragment>
  );
}

function AirplaneSeatSizing(props: Props) {
  const {
    handleCalculateSizeClick,
    handleSetRecommendedFit,
    hydraBlueSkyPdp,
    isDesktopView,
    isOnDemandSizingModalOpen,
    isSelectSizeTooltipVisible,
    location,
    onDemandSizingGender,
    onCloseModal,
    onOpenModal,
    onSizeChange,
    product,
    productAgeGroupChanged,
    productGenderChanged,
    productSizeUnitChanged,
    selectedSize,
    showGenericSizeBiasReco,
    showRecommendedSizing,
    sizing: { airplaneCache, allUnits, dimensions }
  } = props;
  const { testId } = useMartyContext();
  const { genericSizeBiases, selectedSizing, detail } = product;
  const { productId } = detail as FormattedProductBundle;
  const [ { values: sizeOptions } = { values: undefined }, { values: widthOptions } = { values: undefined } ] = allUnits;
  const [{ units: [ { values: dimensionValues = [] } ] }] = dimensions;

  const initialState: State = {
    interactive: false,
    ageGroupSelectionId: airplaneCache.all.ageGroups[0].id,
    genderSelectionId: airplaneCache.constraints.gender,
    widthSelectionIndex: -1,
    sizeSelectionIndex: -1,
    sizeSelectionId: -1,
    focusIndex: -1,
    focusType: ''
  };

  const sizeUnitId = airplaneCache.constraints.countryOrUnit;
  if (sizeUnitId) {
    const selectedOption = airplaneCache.all.countryOrUnitOptions.find(option => option.id === sizeUnitId);
    initialState.unitSelectionId = selectedOption?.id;
  }

  const [state, componentDispatch] = useReducer(reducer, initialState);

  const sizeLegendHeading = makeSizeLegendHeadingFromState(props, state);

  useEffect(() => {
    /*
     * Only able to repro on dev but when switching colors, there
     * is a small delay while the page repaints before the sizing call is updated.
     * This tmp blocks interaction until sizes update.
     */
    componentDispatch({ type: 'unSetInteractive' });

    setTimeout(() => {
      componentDispatch({ type: 'setInteractive' });
    });
  }, [onSizeChange, selectedSizing, widthOptions]);

  const shouldShowSelectDimensionWarning = (section: 'size' | 'width') => {
    const dimensionValue = section === 'size' ? selectedSizing.d3 : selectedSizing.d4;
    return isSelectSizeTooltipVisible && !dimensionValue;
  };

  const makeTitleString = (section: 'size' | 'width') => {
    if (shouldShowSelectDimensionWarning(section)) {
      return `Please select a ${section}:`;
    }
    return section === 'size' ? sizeLegendHeading : 'Width Options:';
  };

  const BUTTON_ARIA_LABEL_PREFIXES = {
    ageGroup: 'Age Group',
    gender: 'Gender',
    size: 'Size',
    width: 'Width'
  };

  const makeAriaLabel = (
    initialValue: string,
    secondLineValue: string,
    Oos: 'Oos' | '',
    typeKey: 'ageGroup' | 'gender' | 'size' | 'width'
  ) => {
    const prefix = BUTTON_ARIA_LABEL_PREFIXES[typeKey];
    let str = `${prefix} ${initialValue}`;
    if (secondLineValue) {
      str = `${str}, ${secondLineValue}`;
    }
    if (Oos === 'Oos') {
      str = `${str} is Out of Stock`;
    }
    return str;
  };

  const imitateFocus = (focusIndex: number, focusType: string) => {
    componentDispatch({
      type: 'setFocus',
      payload: {
        focusIndex,
        focusType
      }
    });
  };

  const getRadioButtonName = (typeKey: 'ageGroup' | 'gender' | 'size' | 'width') => {
    const dimName = dimensions.find(({ name }) => (name === typeKey))?.id;
    return dimName ? `d${dimName}` : typeKey;
  };

  /**
   * Code search keywords:
   * airplaneSeatGender, airplaneSeatSize, airplaneSeatWidth,
   * airplaneSeatGenderOos, airplaneSeatSizeOos, airplaneSeatWidthOos
   */
  const makeButton = (
    typeKey: 'ageGroup' | 'gender' | 'size' | 'width',
    index: number,
    optionId: string,
    classSetting: string,
    value: string,
    options: MakeButtonOptions
  ) => {
    const {
      airplaneCacheOptionId,
      isChecked,
      isOos = false
    } = options;
    const type = `set${capitalize(typeKey)}SelectionIndex` as SetDimensionSelectionActionType;
    const displayArr = value.split(',');
    const [ initialValue, secondLineValue ] = displayArr;
    const Oos = isOos ? 'Oos' : '';
    const ariaLabel = makeAriaLabel(initialValue, secondLineValue, Oos, typeKey);

    return (
      <div key={`${type}-${index}`} className={classSetting}>
        <input
          type="radio"
          id={`radio-${optionId}`}
          data-test-id={testId(`airplaneSeat${capitalize(typeKey)}${Oos}Radio`)}
          aria-label={ariaLabel}
          name={getRadioButtonName(typeKey)}
          value={optionId}
          data-airplane-cache-option-id={airplaneCacheOptionId}
          data-label={value}
          data-track-label={typeKey}
          onClick={event => {
            if (isChecked) {
              setItemSelection(event, index, type);
            }
          }}
          onChange={event => {
            setItemSelection(event, index, type);
          }}
          onFocus={event => {
            imitateFocus(index, type);
            setItemSelection(event, index, type);
          }}
          onBlur={() => imitateFocus(-1, '')}
          defaultChecked={isChecked}
        />
        <label
          htmlFor={`radio-${optionId}`}
          data-test-id={testId(`airplaneSeat${capitalize(typeKey)}${Oos}`)}
        >
          {hydraBlueSkyPdp ? (
            <span>{initialValue} {secondLineValue}</span>
          ) : (
            <>
              {initialValue}
              {secondLineValue && <span className={css.spanbr}>{secondLineValue}</span> }
            </>
          )}
        </label>
      </div>
    );
  };

  const makeSizeOptions = () => {
    const { airplaneCache } = props.sizing;
    const { ageGroupSelectionId, genderSelectionId } = state;

    const options = airplaneCache.all.sizeOptions[genderSelectionId];

    if (airplaneCache.all.ageGroups.length > 1) {
      const ageGroup = airplaneCache.all.ageGroups.find(ageGroup => ageGroup.id === ageGroupSelectionId);
      const ageGroupId = ageGroup!.id;
      const options = airplaneCache.all.sizeOptionsByAgeGroup[ageGroupId];
      return options!.map(
        (option, index) => makeSizeOption(
          props,
          state,
          makeButton,
          option,
          index,
          `${ageGroupId}-${option.id}`
        )
      );
    }

    return options.map(
      (option, index) => makeSizeOption(props, state, makeButton, option, index, option.id)
    );
  };

  const makeWidthOptions = () => {
    const { airplaneCache } = props.sizing;
    const { genderSelectionId } = state;
    const options = airplaneCache.all.widthOptions[genderSelectionId];
    const { focusIndex, focusType } = state;

    return options.map((option, index) => {
      const { countryOrUnit, d4, label } = option;
      const { widthSelectionIndex } = state;

      if (airplaneCache.constraints.countryOrUnit && countryOrUnit !== airplaneCache.constraints.countryOrUnit) {
        return null;
      }

      const isChecked = !!(selectedSizing.d4 && d4 === selectedSizing.d4);
      const isInStock = airplaneCache.available.widthOptions.includes(option.d4);

      const classSetting = cn(css.gridLookOption, {
        [css.selected]: ((index === widthSelectionIndex) || (isChecked && widthSelectionIndex === -1)),
        [css.focus]: (focusIndex === index && focusType === 'setWidthSelectionIndex'),
        [css.oos]: !isInStock
      });

      return makeButton('width', index, d4, classSetting, label, { airplaneCacheOptionId: option.id, isChecked, isOos: !isInStock });
    });
  };

  const dispatchSelectionIndex = (type: 'setSizeSelectionIndex' | 'setWidthSelectionIndex', index: number, id: number) => {
    componentDispatch({
      type, payload: {
        index,
        id
      }
    });
  };

  const setItemSelection = (
    event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    index: number,
    type: SetDimensionSelectionActionType
  ) => {
    if (!state.interactive) {
      return false;
    }
    const target = event.target as HTMLInputElement;
    if (type === 'setAgeGroupSelectionIndex') {
      const id = target.value as AirplaneCacheStock['ageGroup'];
      productAgeGroupChanged(id);
      componentDispatch({ type, payload: { id } });
      return;
    } else if (type === 'setGenderSelectionIndex') {
      const id = target.value as AirplaneCacheStock['gender'];
      productGenderChanged(id);
      componentDispatch({ type, payload: { id } });
      return;
    } else if (type === 'setUnitSelectionId') {
      const id = target.id as AirplaneCacheStock['countryOrUnit'];
      productSizeUnitChanged(id);
      componentDispatch({ type, payload: { id } });
      return;
    }
    const options = (type === 'setSizeSelectionIndex') ? sizeOptions : widthOptions;
    if (options) {
      dispatchSelectionIndex(type, index, parseInt(target.value));
      onSizeChange(options, event);
    }
  };

  const unitOptions = airplaneCache.all.countryOrUnitOptions;

  const { unitSelectionId } = state;
  const selectedUnitOption = unitOptions.find(option => option.id === unitSelectionId);

  const showGenderOptions = shouldShowGenderOptions(airplaneCache);
  const showAgeGroupOptions = airplaneCache.all.ageGroups.length > 1;

  return (
    <div>
      {showGenericSizeBiasReco && genericSizeBiases && (
        <GenericSizeBiasReco currentProductId={productId} genericSizeBiases={genericSizeBiases} />
      )}
      {showRecommendedSizing &&
        <RecommendedSizing
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
          product={product}
          gender={onDemandSizingGender}
          handleSetRecommendedFit={handleSetRecommendedFit}
          selectedSize={selectedSize}
          location={location}
          handleCalculateSizeClick={handleCalculateSizeClick}
          isOnDemandSizingModalOpen={isOnDemandSizingModalOpen}
          isDesktopView={isDesktopView}/>
      }
      {showAgeGroupOptions && (
        <fieldset key="ageGroup">
          <legend data-test-id={testId(makeLegendDataTestId('AgeGroup', isSelectSizeTooltipVisible))} className={css.title}>Size Group:</legend>
          <div className={css.airplaneSizingContainer}>
            {makeAgeGroupOptions(props, state, makeButton)}
          </div>
        </fieldset>
      )}
      {showGenderOptions && (
        <fieldset key="gender">
          <legend data-test-id={testId(makeLegendDataTestId('Gender', isSelectSizeTooltipVisible))} className={css.title}>Gender:</legend>
          <div
            className={css.airplaneSizingContainer}
            data-test-id={testId(makeOptionGroupDataTestId('Gender'))}>
            {makeGenderOptions(props, state, makeButton)}
          </div>
        </fieldset>
      )}
      {allUnits.map(({ id, name, values = [] }, index) => {
        // not my fault. will clean up later. giving this a sensible name
        // should help a little bit in the interim
        const renderingSizeOptions = index === 0;
        const applyWarningStyles = shouldShowSelectDimensionWarning(renderingSizeOptions ? 'size' : 'width');
        return (
          <fieldset key={`${name}-${id}`}>
            {dimensionValues.length >= 1 && values.length >= 1 &&
              <legend
                id={renderingSizeOptions ? 'sizingChooser' : 'widthChooser'}
                data-test-id={testId(makeLegendDataTestId(renderingSizeOptions ? 'Size' : 'Width', isSelectSizeTooltipVisible))}
                className={cn(css.title, { [css.warning]: applyWarningStyles })}>
                {makeTitleString(renderingSizeOptions ? 'size' : 'width')}
                {renderingSizeOptions && unitOptions.length > 1 && (
                  <Select
                    className={css.countryOrUnitDropdown}
                    classNamePrefix="martyReactSelect"
                    isSearchable={false}
                    onChange={option => {
                      setItemSelection({ target: { id: option?.id || unitOptions[0].id } } as React.ChangeEvent<HTMLInputElement>, -1, 'setUnitSelectionId');
                    }}
                    options={unitOptions}
                    value={selectedUnitOption} />
                )}
              </legend>
            }
            <div
              className={cn(css.airplaneSizingContainer, { [css.sizeOptions]: renderingSizeOptions })}
              data-test-id={testId(makeOptionGroupDataTestId(renderingSizeOptions ? 'Size' : 'Width'))}>
              {renderingSizeOptions
                ? values && makeSizeOptions()
                : values && makeWidthOptions()
              }
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

const mapDispatchToProps = {
  productAgeGroupChanged,
  productGenderChanged,
  productSizeUnitChanged
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AirplaneSeatSizing);
