import { useEffect, useState } from 'react';

import useUnsavedGoal from './useUnsavedGoal';
import { validateFormFields, validateUserInput } from './goalValidationUtils';
import { GoalValidationError } from '../../types/goals';

const useGoalValidation = () => {
	const { unsavedGoal } = useUnsavedGoal();

	const [errors, setErrors] = useState<GoalValidationError>({});
	const [areRequiredFieldsFilled, setAreRequiredFieldsFilled] =
		useState<boolean>(false);

	useEffect(() => {
		setAreRequiredFieldsFilled(validateFormFields(unsavedGoal));
	}, [unsavedGoal]);

	const validateInputFields = (callback?: Function) => {
		const validationResult = validateUserInput(unsavedGoal);

		setErrors(validationResult);

		if (callback && Object.keys(validationResult).length === 0) {
			callback();
		}
	};

	return {
		validateInputFields,
		areRequiredFieldsFilled,
		errors,
	};
};

export default useGoalValidation;
