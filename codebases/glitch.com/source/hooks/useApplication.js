import {
    useContext
} from 'react';
import {
    applicationContext
} from '../components/ApplicationProvider';

export default function useApplication() {
    const application = useContext(applicationContext);

    if (!application) {
        return new Error('useApplication can only be used in a child of the Application component.');
    }

    return application;
}