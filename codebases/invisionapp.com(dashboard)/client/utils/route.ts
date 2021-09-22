import { RouterState, PlainRoute } from 'react-router'

// NOTE: This is bare bones and doesn't account for nested routes. There could be some weird
// side effects with nested routes. Just be aware. BE AWARE!
export const onChangeHasModals = (
  prevState: RouterState,
  nextState: RouterState,
  replace: any,
  callback: () => void
) => {
  const route = prevState.routes[prevState.routes.length - 1] as PlainRoute & {
    modal: boolean
  }
  // Let the modal close animation finish before changing route

  setTimeout(() => callback(), route.modal ? 200 : 0)
}
