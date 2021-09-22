import React, { useState, useEffect, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Popover, Snackbar } from '@pipedrive/convention-ui-react';
import getTranslator from '@pipedrive/translator-client/fe';
import { ErrorBoundary } from '@pipedrive/react-utils';
import getIdProperty from './utils/get-id-property';
import { addHandler, removeHandler } from './utils/event-handlers';
import cardsConfig from './utils/cards-config';
import useFetchData from './custom-hooks/use-fetch-data';
import { UsageTrackingContext, TranslatorContext, WebappAPIContext } from './contexts';
import Logger from '@pipedrive/logger-fe';
import * as translatorCache from './utils/translator-cache';

const errorLoggingData = {
	message: 'Something went wrong.',
	facility: 'quick-info-card',
	level: 'error',
};

const PopoverOnTop = styled(Popover)`
	z-index: 10000;
`;

const ErrorContent = ({ children, error, renderOnError }) => {
	if (typeof renderOnError !== 'function') {
		return React.isValidElement(children) ? children : null;
	}

	if (error) {
		return renderOnError(error);
	}

	return renderOnError(new Error('No element to trigger quick info card provided'));
};

const QuickInfoCard = ({
	componentLoader,
	pdMetrics,
	userSelf,
	logger,
	router,
	type,
	id,
	data,
	source,
	triggerElement,
	popoverProps,
	children,
	onAddContact,
	renderOnError
}) => {
	const [translator, setTranslator] = useState(null);
	const [shouldFetchData, setShouldFetchData] = useState(false);
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const [popoverVisibleStart, setPopoverVisibleStart] = useState(0);
	const [snackbar, setSnackbar] = useState(null);

	const trackHovercardUsage = (action, context = {}) => {
		const idProperty = getIdProperty(type);
		const defaultContext = {
			source,
			type,
			...(idProperty ? {[idProperty]: id } : {}),
		};

		pdMetrics && pdMetrics.trackUsage(null, 'hovercard', action, {...defaultContext, ...context});
	};

	const popoverRef = createRef();
	const snackbarRef = createRef();

	// used to store ref to current delay timer across renders - changing its value won't cause a re-render
	const delayTimer = useRef(0);
	const DELAY_BEFORE_FETCHING_DATA = 200;

	const onMouseEnter = () => {
		// prioritize data over id
		if (!isEmpty(data)) {
			return;
		}

		const timer = setTimeout(() => {
			setShouldFetchData(true);
		}, DELAY_BEFORE_FETCHING_DATA);

		delayTimer.current = timer;
	};

	const onMouseLeave = () => {
		clearTimeout(delayTimer.current);
	};

	const getTriggerProps = ({ props: existingProps } = {}) => ({
		onMouseEnter: (e) => {
			existingProps && existingProps.onMouseEnter && existingProps.onMouseEnter(e);
			onMouseEnter();
		},
		onMouseLeave: (e) => {
			existingProps && existingProps.onMouseLeave && existingProps.onMouseLeave(e);
			onMouseLeave();
		}
	});

	const { component: Card, fetchFunction } = cardsConfig[type];

	const fetchData = async () => {
		const isPlatinum = userSelf.isPlatinum();

		return await fetchFunction(id, isPlatinum);
	};

	const { loaded, loading, data: fetchedData, error } = useFetchData(fetchData, shouldFetchData);

	// load tranlsations
	useEffect(() => {
		const loadTranslator = async () => {
			const cachedTranslatorPromise = translatorCache.get();

			if (cachedTranslatorPromise) {
				const cachedTranslator = await cachedTranslatorPromise;

				setTranslator(cachedTranslator);
			} else {
				const translatorPromise = getTranslator('quick-info-card', userSelf.getLanguage(), logger);

				translatorCache.set(translatorPromise);

				const translator = await translatorPromise;

				setTranslator(translator);
			}
		};

		loadTranslator();
	}, [logger, translator, userSelf]);

	// add event handlers to trigger element
	useEffect(() => {
		if (triggerElement) {
			addHandler(triggerElement, 'mouseenter', onMouseEnter);
			addHandler(triggerElement, 'mouseleave', onMouseLeave);

			return () => {
				removeHandler(triggerElement, 'mouseenter', onMouseEnter);
				removeHandler(triggerElement, 'mouseleave', onMouseLeave);
			};
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerElement]);

	// track 'displayed' event
	useEffect(() => {
		if (isPopoverVisible) {
			setPopoverVisibleStart(Date.now());

			return;
		} else if (popoverVisibleStart) {
			const displayedDuration = Date.now() - popoverVisibleStart;

			trackHovercardUsage('displayed', { displayed_duration: displayedDuration });
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPopoverVisible]);

	// remove snackbar from dom after default timeout (8s)
	useEffect(() => {
		if (snackbar) {
			const timeout = setTimeout(() => setSnackbar(null), 9000);

			return () => clearTimeout(timeout);
		}
	}, [snackbar]);

	const hasError = loaded && error;
	const noTriggerEl = !triggerElement && !children;

	if (hasError || noTriggerEl) {
		return (
			<ErrorContent error={error} renderOnError={renderOnError}>
				{children}
			</ErrorContent>
		);
	}

	return (
		<UsageTrackingContext.Provider value={{ trackHovercardUsage }}>
			<TranslatorContext.Provider value={translator}>
				<WebappAPIContext.Provider value={{
					componentLoader,
					userSelf,
					pdMetrics,
					logger,
					router
				}}>
					<PopoverOnTop
						onVisibilityChange={visible => setPopoverVisible(visible)}
						trigger="hover"
						spacing="none"
						forwardRef={popoverRef}
						content={({ scheduleUpdate }) => (
							<span
								onMouseEnter={() => trackHovercardUsage('interacted', {interaction: 'mouseenter'})}
								onMouseDown={() => trackHovercardUsage('interacted', {interaction: 'mousedown'})}>

								<React.Suspense fallback={<div />}>
									<Card
										onAddContact={onAddContact}
										setSnackbar={setSnackbar}
										popoverRef={popoverRef}
										data={isEmpty(data) ? fetchedData : data}
										scheduleUpdate={scheduleUpdate}
										loading={loading}/>
								</React.Suspense>
							</span>
						)}

						{...(triggerElement && {referenceElement: triggerElement})}
						{...popoverProps}>
						{(children && !triggerElement) && React.cloneElement(children, getTriggerProps(children))}
					</PopoverOnTop>
					{snackbar && <Snackbar
						forwardRef={snackbarRef}
						message={snackbar.message}
						actionText={snackbar.actionText}
						onClick={snackbar.onClick}/>
					}
				</WebappAPIContext.Provider>
			</TranslatorContext.Provider>
		</UsageTrackingContext.Provider>
	);
};

const { placement, offset, visible, onVisibilityChange, portalTo, popperProps } = Popover.propTypes;

QuickInfoCard.defaultPropTypes = {
	source: 'not_set'
};

QuickInfoCard.propTypes = {
	type: PropTypes.oneOf(['deal', 'lead', 'organization', 'person', 'user', 'addNewPerson']).isRequired,
	data: PropTypes.object,
	source: PropTypes.string,
	id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	children: PropTypes.node,
	componentLoader: PropTypes.object.isRequired,
	logger: PropTypes.func.isRequired,
	router: PropTypes.func.isRequired,
	pdMetrics: PropTypes.object,
	userSelf: PropTypes.object.isRequired,
	triggerElement: PropTypes.instanceOf(Element),
	popoverProps: PropTypes.shape({
		placement,
		offset,
		visible,
		onVisibilityChange,
		portalTo,
		popperProps
	}),
	onAddContact: PropTypes.func,
	renderOnError: PropTypes.func,
};

export default async function(componentLoader) {
	const [userSelf, pdMetrics, router] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:router')
	]);

	const logger = new Logger('quick-info-card');

	return {
		// In order to not make a breaking change to the API, must return object with default key...
		default: function QuickInfoCardWrapper(props) {
			// eslint-disable-next-line react/prop-types
			const errorFallback = React.isValidElement(props.children) ? props.children : <div />;

			return (
				<ErrorBoundary error={errorFallback} loggingData={errorLoggingData} logger={logger}>
					<QuickInfoCard
						{...props}
						componentLoader={componentLoader}
						pdMetrics={pdMetrics}
						userSelf={userSelf}
						logger={logger}
						router={router}/>
				</ErrorBoundary>
			);
		},
	};
}