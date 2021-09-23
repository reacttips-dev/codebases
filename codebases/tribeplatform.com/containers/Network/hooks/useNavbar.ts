import useGetNetwork from 'containers/Network/useGetNetwork'

const useNavbar = (): { hasNavbar: boolean; loading: boolean } => {
  const { network, loading } = useGetNetwork()

  const hasNavbar = network?.topNavigation?.enabled === true

  return {
    hasNavbar,
    loading,
  }
}

export default useNavbar
