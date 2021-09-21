import * as React from 'react';
import { Context } from './injectIntl';
import { invariantIntlContext } from '../utils';
export default function useIntl() {
    var intl = React.useContext(Context);
    invariantIntlContext(intl);
    return intl;
}
