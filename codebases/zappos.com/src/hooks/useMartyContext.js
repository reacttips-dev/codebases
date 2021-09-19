import { useContext } from 'react';

import { MartyContext } from 'utils/context';

const useMartyContext = () => useContext(MartyContext);

export default useMartyContext;
