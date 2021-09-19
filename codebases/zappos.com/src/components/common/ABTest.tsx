import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getAssignmentGroup, triggerAssignment } from 'actions/ab';
import { AppState } from 'types/app';

/**
 * Test with treatment and null control
 *
 * <ABTest
 *  test={HYDRA_MY_AWESOME_TEST}
 *  treatment={() => <CashMoneyComponent />}
 * />
 *
 *
 * Test with control and multiple treatments:
 *
 * <ABTest
 *  test={HYDRA_MY_AWESOME_TEST}
 *  control={() => <BoringComponent />}
 *  treatments={[
 *    () => <ContribProfitBooster />,
 *    () => <ConversionBooster />
 *  ]}
 * />
 *
 *
 * Test with a specific trigger condition
 *
 * <ABTest
 *  test={HYDRA_MY_AWESOME_TEST}
 *  treatment={() => <CashMoneyComponent />}
 *  triggerCondition={recognizedCustomer}
 * />
 */

interface OwnProps {
  test: string;
  control?: () => JSX.Element | null;
  treatment?: () => JSX.Element;
  treatments?: (() => JSX.Element)[];
  triggerCondition: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const ABTest = ({
  group,
  test,
  triggerAssignment,
  control = () => null,
  treatments = [],
  treatment,
  triggerCondition = true
}: Props) => {
  useEffect(() => {
    if (triggerCondition) {
      triggerAssignment(test);
    }
  }, [test, triggerAssignment, triggerCondition]);

  treatments = treatment ? [treatment] : treatments;
  const renderer = group > 0 ? treatments[group - 1] : control;
  return renderer ? renderer() : null;
};

const mapStateToProps = (state: AppState, { test }: OwnProps) => ({
  group: getAssignmentGroup(test, state) as number || 0
});

const mapDispatchToProps = {
  triggerAssignment
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ABTest);
