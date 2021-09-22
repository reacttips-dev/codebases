import { createSelector } from 'reselect'

const getSpaces = state => state.spaces.spaces
const getSpacesLoading = state => state.spaces.isLoading
const getSpace = state => state.space
const getSpacesMembersDetail = state => state.spaces.spacesMembers
export const getSpaceId = createSelector(getSpace, space => {
  if (space) {
    return space.id
  }
})

export const spaceData = (state, ownProps) => createSelector(
  getSpaces,
  getSpacesLoading,
  getSpace,
  getSpacesMembersDetail,
  (spaces, spacesLoading, space, spacesMembers) => {
    // TODO: Remove block when feature flag pagingEnabled is fully rolled out
    if (ownProps.config.pagingEnabled) {
      if (!space.isLoading && !spacesMembers.isLoading && spacesMembers) {
        const spaceMembers = spacesMembers[ownProps.spaceId]

        if (!space || (!spaceMembers && !space.members)) {
          return {
            isLoading: !space.isLoading || !spaceMembers.isLoading,
            isLoadingFull: true
          }
        }

        const returnSpace = {
          ...space,
          members: spaceMembers ? space.members.concat(spaceMembers.members) : space.members
        }

        if (returnSpace) {
          return {
            isLoading: space.isLoading || spacesMembers.isLoading,
            isLoadingFull: true,
            isDescriptionEditing: space.isDescriptionEditing,
            isDescriptionSaving: space.isDescriptionSaving,
            id: ownProps.spaceId,
            cuid: ownProps.spaceId,
            description: returnSpace.description,
            documentCount: returnSpace.documentCount,
            hasProjects: returnSpace.hasProjects,
            members: returnSpace.members,
            title: returnSpace.title,
            isPublic: returnSpace.isPublic,
            permissions: {
              addDocuments: space.permissions && space.permissions.addDocuments ? space.permissions.addDocuments : false,
              deleteSpace: space.permissions && space.permissions.deleteSpace ? space.permissions.deleteSpace : false,
              editSpace: space.permissions && space.permissions.editSpace ? space.permissions.editSpace : false,
              leaveSpace: space.permissions && space.permissions.leaveSpace ? space.permissions.leaveSpace : false
            },
            reloadDocuments: space.reloadDocuments
          }
        }
      }
    } else {
      if (space.isLoading && !spacesLoading) {
        const returnSpace = spaces.find(s => s.id === space.id)
        if (returnSpace) {
          return {
            isLoading: false,
            isLoadingFull: true,
            id: space.id,
            cuid: space.id,
            description: returnSpace.data.description,
            documentCount: returnSpace.data.documents.length,
            documents: returnSpace.data.documents,
            members: returnSpace.data.members,
            hasProjects: returnSpace.hasProjects,
            title: returnSpace.data.title,
            isPublic: returnSpace.data.isPublic,
            permissions: {
              addDocuments: false,
              deleteSpace: (returnSpace.permissions && returnSpace.permissions.owns) || false,
              editSpace: false,
              leaveSpace: false
            }
          }
        }
      }
    }

    return space
  }

)(state)
