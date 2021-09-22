import { get } from '@pipedrive/fetch';

const appendPictureToPerson = (person, pictures) => {
	if (!pictures) {
		return person;
	}

	if (person.picture_id in pictures) {
		person.picture = pictures[person.picture_id].pictures['128'];
	}
};

const fetchPersonData = async (personId) => {
	const response = await get(`/api/v1/persons/${personId}`);
	const person = response.data;
	const pictures = response.related_objects.picture;

	appendPictureToPerson(person, pictures);

	return person;
};

export default fetchPersonData;