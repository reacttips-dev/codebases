import React, { cloneElement, useEffect, useMemo, useState } from 'react';
import { useRoutes, createRoutesFromChildren } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'ViewStackRoutes');

const mapOtherPathsToRoutes = (routes) => {
	return routes.reduce((acc, route) => {
		acc.push(route);

		if (route.element.props.otherPaths) {
			route.element.props.otherPaths.forEach((path) => {
				if (route.path === path) {
					return;
				}

				const element = cloneElement(route.element, {
					...route.element.props,
					path,
				});

				acc.push({
					...route,
					element,
					path,
				});
			});
		}

		return acc;
	}, []);
};

const StackItem = styled.div<{ visible: boolean }>`
	flex: 1 1 auto;
	width: 100%;
	${(props) => !props.visible && 'display: none;'}
`;

interface Props {
	basename?: string;
	caseSensitive?: boolean;
	children: React.ReactNode;
	viewStackLimit?: number;
}

export const ViewStackVisible = React.createContext(false);

const Routes = ({ basename = '', children, viewStackLimit = 10 }: Props) => {
	const [viewStack, setViewStack] = useState(new Map());
	const routes = useMemo(() => mapOtherPathsToRoutes(createRoutesFromChildren(children)), [children]);

	const match = useRoutes(routes, basename);
	const [matchParams, setMatchParams] = useState(null);
	const { viewStackKey } = match.props.children.props;

	useEffect(() => {
		try {
			const jsonParams = JSON.stringify(match.props?.value?.params);

			if (matchParams !== jsonParams) {
				setMatchParams(jsonParams);
			}
		} catch (e) {
			logger.info('Unable to parse params for route', e);
		}
	}, [match.props?.value?.params]);

	useEffect(() => {
		if (!viewStackKey) {
			return;
		}

		// Always update match & lastUsed, otherwise it doesn't propagate the context
		const newViewStack = new Map(viewStack);

		newViewStack.set(viewStackKey, {
			lastUsed: moment(),
			match,
		});

		setViewStack(newViewStack);

		if (!viewStack.has(viewStackKey)) {
			if (newViewStack.size > viewStackLimit) {
				const iterator = newViewStack.keys();

				let next = newViewStack.keys().next();
				let key = next.value;
				let value = newViewStack.get(next.value);

				while (!next.done) {
					next = iterator.next();
					const newValue = newViewStack.get(next.value);

					/* eslint-disable max-depth */
					if (newValue?.lastUsed.isBefore(value?.lastUsed)) {
						value = newValue;
						key = next.value;
					}
					/* eslint-enable */
				}

				newViewStack.delete(key);
				setViewStack(newViewStack);
			}
		}
	}, [viewStackKey, match.props.children, matchParams]);

	const result = [];

	viewStack.forEach(({ match: item }, key) => {
		const visible = key === viewStackKey;

		result.push(
			<StackItem visible={visible} key={key}>
				<ViewStackVisible.Provider value={visible}>{item}</ViewStackVisible.Provider>
			</StackItem>,
		);
	});

	return (
		<>
			{result}
			{!viewStackKey && <StackItem visible>{match}</StackItem>}
		</>
	);
};

export default Routes;
