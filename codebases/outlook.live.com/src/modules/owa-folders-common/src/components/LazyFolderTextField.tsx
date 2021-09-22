import * as React from 'react';
import type { FolderTextFieldProps } from './FolderTextField';

const FolderTextField = React.lazy(() => import('./FolderTextField'));

const LazyFolderTextField = (props: FolderTextFieldProps) => {
    return (
        <React.Suspense fallback={<div className={props.className} />}>
            <FolderTextField {...props} />
        </React.Suspense>
    );
};

export default LazyFolderTextField;
