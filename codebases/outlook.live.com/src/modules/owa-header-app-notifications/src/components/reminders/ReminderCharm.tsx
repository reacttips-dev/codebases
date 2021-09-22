import * as React from 'react';
import { CharmControl, CharmControlProps, CharmControlColorPattern } from 'owa-charmcontrol';
import { getPalette } from 'owa-theme';
import { observer } from 'mobx-react-lite';

export type ReminderCharmProps = Pick<CharmControlProps, 'iconId' | 'className'>;

export default observer((props: ReminderCharmProps) => (
    <CharmControl
        {...props}
        colorProps={{
            colorPattern: CharmControlColorPattern.Normal,
            calPrimary: getPalette().themePrimary,
            calDark: getPalette().themeDark,
            calDarkAlt: getPalette().themeDarkAlt,
            textColor: getPalette().neutralPrimary,
        }}
    />
));
