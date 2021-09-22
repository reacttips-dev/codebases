import React from 'react';
import { getComponentDisplayName } from './hocs';

const { Provider, Consumer } = React.createContext();

export { Provider };

export default (Component) => {
	class ContextProvider extends React.Component {
		render() {
			return (
				<Consumer>
					{({ webappApi, translator, logger, ...props }) => {
						return (
							<Component
								webappApi={webappApi}
								translator={translator}
								logger={logger}
								{...props}
								{...this.props}
							/>
						);
					}}
				</Consumer>
			);
		}
	}

	ContextProvider.displayName = `WithContext-${getComponentDisplayName(Component)}`;

	return ContextProvider;
};
