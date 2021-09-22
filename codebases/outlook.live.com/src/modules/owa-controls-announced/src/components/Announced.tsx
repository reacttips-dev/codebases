import { observer } from 'mobx-react-lite';
import { Announced as FabricAnnounced, IAnnouncedProps } from '@fluentui/react/lib/Announced';
import * as React from 'react';

// This component is responsible for rendering the Announced component for Narrator assistance
const Announced = observer(function Announced(props: IAnnouncedProps) {
    return <FabricAnnounced {...props} />;
});

export default Announced;
