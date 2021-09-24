import React, { FC } from 'react'

import { Skeleton, Text } from 'tribe-components'

const styles = {
  pl: { base: 5, sm: 0 },
}

const SettingsGroupHeader: FC = ({ children, ...props }) => {
  return (
    <Skeleton data-testid="settings-group-header">
      <Text
        pl={styles.pl}
        mb={5}
        mt={[6, 8]}
        color="label.secondary"
        textStyle="medium/large"
        {...props}
      >
        {children}
      </Text>
    </Skeleton>
  )
}

export default SettingsGroupHeader
