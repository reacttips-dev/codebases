import React from 'react';
import useToolsContext from '../hooks/useToolsContext';
import useComponentLoader from '../hooks/useComponentLoader';

function ForbiddenPage() {
	const { componentLoader } = useToolsContext();

	const [ErrorPage] = useComponentLoader('froot:ErrorPage', componentLoader);

	if (!ErrorPage) {
		return null;
	}

	return <ErrorPage type="forbidden" />;
}

export default ForbiddenPage;
