import { generateThumbnailUrl } from './thumbnailUrlHelper'

// This would be better as a srcset, but Helios does not currently
// allow for this.
export const DEFAULT_AVATAR_SIZE = 64

export default function sortMembersAvatars (members, cloudflareEnabled = false, pagingEnabled = false) {
  if (!members || !members.length) {
    return []
  }

  // UX requirements:
  // - At most 5 avatars
  // - Sort by users with thumbnails
  let listOfMembers = members

  if (!pagingEnabled) {
    // Exclude invited users, as those don't have email, name neither an avatar url
    listOfMembers = members.filter(member => member.inviteId === 0)
  }

  return listOfMembers
    .map(member => {
      const { avatarURL, email, name } = member
      return {
        src: generateThumbnailUrl(avatarURL, '', DEFAULT_AVATAR_SIZE, DEFAULT_AVATAR_SIZE, cloudflareEnabled),
        tooltip: name && email
          ? `${name} (${email})`
          : name || email,
        ...member
      }
    })
    .sort((a, b) => {
      if (a && a.src) {
        return -1 // prefer a
      }

      if (b && b.src) {
        return 1 // prefer b
      }

      return 0
    })
}
