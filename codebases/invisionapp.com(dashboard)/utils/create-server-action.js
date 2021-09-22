const createRequestFunction = (action, args) => (...props) => {
  const data = {}

  args.forEach((arg, idx) => {
    data[arg] = typeof props[idx] !== 'undefined' ? props[idx] : null
  })

  return {
    type: action.REQUEST,
    data
  }
}

const createSuccessFunction = action => data => ({
  type: action.SUCCESS,
  data
})

const createFailureFunction = action => data => ({
  type: action.FAILURE,
  data
})

export default function createServerAction (action, requestParams = []) {
  return {
    request: createRequestFunction(action, requestParams),
    success: createSuccessFunction(action),
    failure: createFailureFunction(action)
  }
}
