import EditorialPage from '../../pages/EditorialPage'

export const getComponents = (location, cb) => {
  cb(null, EditorialPage)
}

export default [
  {
    path: '/',
    getComponents,
  },
]

