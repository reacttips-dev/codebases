import React from 'react';
import Header from './Header';
import Board from './Board/Board';

const PipelineApp: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<Header />
			<Board />
		</React.Fragment>
	);
};

export default PipelineApp;
