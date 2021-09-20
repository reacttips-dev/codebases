import {
    useEffect,
    useState
} from 'react';
import CatalogService from 'services/catalog-service';

export function useGetNanodegreeCatalog(ndKey) {
    const [nanodegree, setNanodegree] = useState({});

    useEffect(() => {
        const fetchNanodegree = async () => {
            try {
                const ndInfo = await CatalogService.getNDFromContentful(ndKey);
                setNanodegree(ndInfo);
            } catch (err) {
                const message = _.get(
                    err,
                    'message',
                    'An error occurred while fetching nanodegree information.'
                );
                console.error(message);
            }
        };

        fetchNanodegree();
    }, [ndKey]);

    return nanodegree;
}

export default useGetNanodegreeCatalog;