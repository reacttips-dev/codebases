import { Member, Post } from 'tribe-api/interfaces'
import { i18n } from 'tribe-translation'

export const getPostUserInfo = (
  user?: Member | null,
  isAnonymous?: Post['isAnonymous'],
) => ({
  profilePicture: isAnonymous ? null : user?.profilePicture,
  name: isAnonymous ? i18n.t('user.anonymous.name', 'Anonymous') : user?.name,
})
