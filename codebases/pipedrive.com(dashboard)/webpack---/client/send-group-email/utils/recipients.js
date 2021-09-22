export const getRecipientsFromMessages = (messages, recipientsFieldErrors) =>
	messages.reduce((persons, { person: { id, picture }, name, email, deal, activity }, index) => {
		let person = persons.find((person) => person.id === id);

		if (!person) {
			person = {
				id,
				name,
				email,
				picture,
				deals: [],
				fieldErrors: [],
				activities: []
			};

			persons.push(person);
		}

		if (deal) {
			person.deals.push(deal);
		}

		if (activity) {
			person.activities.push(activity);
		}

		const personFieldErrors = recipientsFieldErrors[index];

		if (personFieldErrors) {
			person.fieldErrors.push(...recipientsFieldErrors[index]);
		}

		return persons;
	}, []);
