import { UserFact } from "./UserFact";

export const deserializeUserFacts = (input: any): UserFact[] => {
	let userFacts: UserFact[] = [];
	for (const key in input.UserFacts) {
		if (input.UserFacts.hasOwnProperty(key)) {
			const userFactInput = input.UserFacts[key];

			if (userFactInput) {
				userFacts.push(UserFact.deserialize(userFactInput));
			}
		}
	}

	if (userFacts.length === 0) {
		userFacts = null;
	}

	return userFacts;

};

export const validateUserFacts = (userFacts: UserFact[]): boolean => {
	if (userFacts) {
		for (const key in userFacts) {
			if (userFacts.hasOwnProperty(key) && !userFacts[key]) {
				return false;
			}
		}
	}

	return true;
};
