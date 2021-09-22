import { browserHistory } from 'react-router'
// import { Text } from '@invisionapp/helios'
// import ModalContent from '../Modal/ModalContent'
// import Wrapper from './components/Wrapper'

// NOTE: there's a lot commented out here until the illutration is done

const NotAuthorized = () => {
  // REMOVE ME: redirects to people until illustration/icon is ready
  browserHistory.replace('/teams/people')

  return null
  // return (
  //   <ModalContent
  //     backButton
  //     closePortal={browserHistory.goBack}
  //     isVisible
  //     onBack={browserHistory.goBack}
  //   >
  //     <Wrapper>
  //       <Text align="center" order="title">
  //         Not authorized.
  //       </Text>
  //     </Wrapper>
  //   </ModalContent>
}

export default NotAuthorized
