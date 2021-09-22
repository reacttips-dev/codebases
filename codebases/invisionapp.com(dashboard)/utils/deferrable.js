export const deferable = () => {
  let resolved, rejected
  const promise = new Promise((resolve, reject) => {
    resolved = resolve
    rejected = reject
  })
  promise.resolves = resolved
  promise.rejects = rejected
  return promise
}

export default deferable
