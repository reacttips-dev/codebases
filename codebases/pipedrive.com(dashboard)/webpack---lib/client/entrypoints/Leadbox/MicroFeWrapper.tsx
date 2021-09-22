import styled from 'styled-components';
import { PDMetrics } from '@pipedrive/react-utils';
import { createRelayEnvironment, Observable, Store } from '@pipedrive/relay';
import { FFContextDataType, getFFContextData } from '@pipedrive/form-fields';
import { CompanyUsers, ComponentLoader, FrootRouter, UserSelf } from '@pipedrive/types';
import Backbone from 'backbone';
import { ErrorBoundary } from 'Components/Error/ErrorBoundary';
import { TranslatorContextProvider } from 'Components/TranslatorContextProvider/TranslatorContextProvider';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';
import { PipedriveHandlerProvider } from 'Relay/PipedriveHandlerProvider';
import { activityHandler } from 'Relay/subscriptions/activityHandler';
import { ContextualView } from 'Types/types';
import { LEADBOX_FACILITY_NAME } from 'Utils/logger/logError';
import { Logger } from 'Utils/logger/Logger';
import { LoggerProvider } from 'Utils/logger/LoggerProvider';
import { LeadboxFiltersProvider } from 'Leadbox/LeadboxFiltersContext';
import { Main as Leadbox } from 'Leadbox/Main';

const MainWrapper = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	overflow: hidden;
`;

export interface MicroFeProps {
	readonly userSelf: UserSelf;
	readonly companyUsers: CompanyUsers;
	readonly logger: Logger;
	readonly pdMetrics: PDMetrics;
	readonly router: FrootRouter;
	readonly componentLoader: ComponentLoader;
	readonly frootProps: FrootProps;
	readonly socketHandler: Backbone.Events;
	readonly relayStore: Store;
	readonly contextualView: ContextualView;
	readonly relayEnvironment: RelayModernEnvironment;
	readonly ffContext: FFContextDataType;
	readonly modelCollectionFactory: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type FrootProps = { visible: boolean };

const LeadSuite = async (componentLoader: ComponentLoader) => {
	const [
		userSelf,
		companyUsers,
		pdMetrics,
		router,
		socketHandler,
		contextualView,
		relayStore,
		ffContext,
		ErrorPage,
		modelCollectionFactory,
		withDragDropContext,
	] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:router'),
		componentLoader.load<Backbone.Events>('webapp:socket-handler'),
		componentLoader.load('froot:contextualView'),
		componentLoader.load('leadbox-fe:relay-store'),
		getFFContextData(componentLoader),
		componentLoader.load('froot:ErrorPage'),
		componentLoader.load('webapp:model-collection-factory'),
		componentLoader.load('froot:dragDropContext'),
	]);

	await modelCollectionFactory.initAsync();

	const logger = new Logger(LEADBOX_FACILITY_NAME, {
		company_id: userSelf.get('company_id'),
		user_id: userSelf.get('id'),
	});

	const relayEnvironment = createRelayEnvironment({
		handlerProvider: PipedriveHandlerProvider,
		store: relayStore,
		onError: (errors) =>
			errors.map((err) => logger.warning('GraphQL call error', { cid: err.extensions?.cid, ...err })),
		subscribe: () => {
			return Observable.create((sink) => {
				activityHandler(socketHandler, sink.next);
			});
		},
	});

	const LeadboxWrapper = (props: { frootProps: FrootProps }) => {
		return (
			<Leadbox
				userSelf={userSelf}
				companyUsers={companyUsers}
				pdMetrics={pdMetrics}
				router={router}
				socketHandler={socketHandler}
				ffContext={ffContext}
				contextualView={contextualView}
				frootProps={props.frootProps}
				relayStore={relayStore}
				logger={logger}
				componentLoader={componentLoader}
				relayEnvironment={relayEnvironment}
				modelCollectionFactory={modelCollectionFactory}
			/>
		);
	};

	const MicroFEComponent = (props: FrootProps) => {
		return (
			<React.StrictMode>
				<LoggerProvider logger={logger}>
					<TranslatorContextProvider userLanguage={userSelf.getLanguage()} projectName="leadbox">
						<ErrorBoundary
							logger={logger.pipedriveLogger}
							facility={LEADBOX_FACILITY_NAME}
							ErrorPage={<ErrorPage />}
						>
							<MainWrapper>
								{/*
									This context needs to exist when Leads is hidden (user is on different page)
									so it's not put into the default state when the user navigates back to Leads.
									This way the filters stay initialized when the route changes
								*/}
								<LeadboxFiltersProvider>
									<Routes>
										<Route path={'/:uuid'} element={<LeadboxWrapper frootProps={props} />} />
										<Route path={'/'} element={<LeadboxWrapper frootProps={props} />} />
									</Routes>
								</LeadboxFiltersProvider>
							</MainWrapper>
						</ErrorBoundary>
					</TranslatorContextProvider>
				</LoggerProvider>
			</React.StrictMode>
		);
	};

	MicroFEComponent.isMicroFEComponent = true;

	return withDragDropContext(MicroFEComponent);
};

export default LeadSuite;
