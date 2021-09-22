// Maps group typename to user data type for invitation validation
// https://github.com/webedx-spark/infra-services/blob/main/services/user/app/org/coursera/group/util/UserDataValidator.scala

const exported = {
  betaTesterPrivateCommunity: 'betaTesterUserData',
  genericPrivateCommunity: 'genericUserData',
  blackboardPrivateCommunity: 'blackboardUserData',
  degreePrivateCommunity: 'degreeUserData',
  canvasPrivateCommunity: 'canvasUserData',
  moodlePrivateCommunity: 'moodleUserData',
  sakaiPrivateCommunity: 'sakaiUserData',
};

export default exported;

export const {
  betaTesterPrivateCommunity,
  genericPrivateCommunity,
  blackboardPrivateCommunity,
  degreePrivateCommunity,
  canvasPrivateCommunity,
  moodlePrivateCommunity,
  sakaiPrivateCommunity,
} = exported;
