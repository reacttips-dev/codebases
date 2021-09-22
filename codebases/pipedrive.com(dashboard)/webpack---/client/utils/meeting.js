export function getDescriptionWithMeetingInvitation({ publicDescription, invitation }) {
	return publicDescription ? `${publicDescription}<br>${invitation}` : invitation;
}
