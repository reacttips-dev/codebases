import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, push, goBack } from 'react-router-redux';
import { searchActions, sidebarActions, articleActions } from 'actions/contextualSupport';
import { getCompletedStages, gettingStartedReopened } from 'actions/gettingStarted';
import routes from 'constants/contextualSupport/routes';
import options from 'constants/contextualSupport/options.json';
import SearchResultsContainer from 'containers/contextualSupport/searchResults';
import SuggestionsContainer from 'containers/contextualSupport/suggestions';
import ArticleContainer from 'containers/contextualSupport/article';
import FullscreenContainer from 'containers/fullscreen';
import zIndex from 'containers/zIndex';
import SidebarComponent from 'components/sidebar/panel';
import QuickLinksComponent from 'components/contextualSupport/quickLinksComponent';
import HeaderComponent from 'components/sidebar/header';
import StickyFooter from 'components/sidebar/footer';
import FetchingComponent from 'components/sidebar/fetching';
import NotFoundComponent from 'components/contextualSupport/notFound';
import SearchComponent from 'components/contextualSupport/search';
import SectionComponent from 'components/sidebar/section';
import translate from 'containers/translation';
import intercom from 'utils/intercom';
import { gettingStartedStore } from '../../../store';
import NoResults from 'components/contextualSupport/noResults';
import SectionHeader from 'components/contextualSupport/sectionHeader';
import InfoMessage from 'components/contextualSupport/infoMessage';
import getInfoMessage from 'utils/getInfoMessage';
import GettingStartedBanner from '../../../components/contextualSupport/banner';
import GettingStartedV2 from 'containers/gettingStartedV2';

export class Sidebar extends Component {
	constructor(props) {
		super(props);

		this.PositionedSidebarComponent = zIndex(props.appearance && props.appearance.zIndex)(SidebarComponent);
	}

	isArticleOrFlowView() {
		if (this.props.location) {
			return !!this.props.location.pathname
				&& (this.props.location.pathname.indexOf(routes.ARTICLE) > -1
					|| this.props.location.pathname.indexOf(routes.GETTING_STARTED) > -1
					|| this.props.location.pathname.indexOf('/contextual-support/flow') > -1);
		}

		return false;
	}

	GSVersion() {
		return this.props.gettingStarted ? { gs_version: 'v1', gs_name: 'old' } : {
			gs_version: 'v3',
			gs_name: 'hvcdataimport',
		};
	}

	render() {
		const isArticleOrFlowView = this.isArticleOrFlowView();
		const GSVersion = this.GSVersion();
		const infoMessageData = getInfoMessage(
			this.props.gettext,
			isArticleOrFlowView,
			this.props.companyFeatures,
			this.props.isAdmin,
		);

		return (
			<ConnectedRouter history={this.props.history}>
				<div>
					<FullscreenContainer/>
					<this.PositionedSidebarComponent {...this.props} >
						<SectionComponent>
							<HeaderComponent
								title={
									isArticleOrFlowView ? this.props.gettext('Back to Quick Help') : this.props.gettext('Quick Help')
								}
								iconStyle='cross'
								displayBack={isArticleOrFlowView}
								goBack={this.props.goBack}
								hide={this.props.hide}
								gettingStartedClose={() => this.props.gettingStartedClose(GSVersion)}
							/>
							<SearchComponent search={this.props.search} query={this.props.searchQuery}/>
							{!!infoMessageData &&
							<InfoMessage
								data={infoMessageData}
								open={this.props.openArticle}
								clicked={this.props.clickNewNavArticle}
							/>}
						</SectionComponent>
						<SectionComponent>
							{!isArticleOrFlowView && <GettingStartedBanner
								gettext={this.props.gettext}
								toggleGettingStarted={this.props.toggleGettingStarted}
								display={this.props.display}
								gettingStartedOpen={() => this.props.gettingStartedOpen(GSVersion)}/>}
						</SectionComponent>
						<SectionComponent scrollable>
							<Switch>
								<Route exact path={routes.INDEX} component={() => {
									return (
										<>
											<SuggestionsContainer
												suggest={this.props.suggest}
												open={this.props.openArticle}
												clicked={this.props.clickArticle}
												trackExternalLink={this.props.trackExternalLink}
											/>
											<QuickLinksComponent
												trackExternalLink={this.props.trackExternalLink}
											/>
										</>
									);
								}}/>
								<Route path={routes.SEARCH_RESULTS} component={() => {
									return (
										<SearchResultsContainer
											gettext={this.props.gettext}
											open={this.props.openArticle}
											clicked={this.props.clickArticle}
											trackExternalLink={this.props.trackExternalLink}
											talkToUs={this.props.talkToUs}
										/>
									);
								}}/>
								<Route path={`${routes.ARTICLE}/:articleId/:locale`} component={({ match }) => {
									const articleId = parseInt(match.params.articleId, 10);

									return (
										<ArticleContainer
											articleId={articleId}
											locale={match.params.locale}
											clicked={this.props.clickArticle}
											query={this.props.searchQuery}
											trackExternalLink={this.props.trackExternalLink}
											talkToUs={this.props.talkToUs}
										/>
									);
								}}/>
								<Route path={routes.FETCHING} component={() => {
									return (
										<>
											<SectionHeader>Search results (0)</SectionHeader>
											<FetchingComponent/>
										</>);
								}}/>
								<Route path={routes.GETTING_STARTED} component={() => {
									return (
										<GettingStartedV2
											GSVersion={GSVersion}
											gettext={this.props.gettext}
											gettingStartedItemClick={this.props.gettingStartedItemClick}
											gettingStartedItemExpand={this.props.gettingStartedItemExpand}
										/>
									);
								}}/>
								<Route path={routes.NOTHING_FOUND} component={() => {
									return (
										<>
											<SectionHeader>Search results (0)</SectionHeader>
											<NoResults searchQuery={this.props.searchQuery}/>
											<SuggestionsContainer
												suggest={this.props.suggest}
												open={this.props.openArticle}
												clicked={this.props.clickArticle}
												trackExternalLink={this.props.trackExternalLink}
											/>
										</>
									);
								}}/>
							</Switch>
							{[routes.FETCHING, routes.SEARCH_RESULTS, routes.NOTHING_FOUND].map((url, i) => {
								return (
									<Route
										key={i}
										path={url}
										component={() => {
											return (
												<NotFoundComponent
													trackExternalLink={this.props.trackExternalLink}
													talkToUs={this.props.talkToUs}
												/>
											);
										}}/>
								);
							})}
						</SectionComponent>
						<SectionComponent>{intercom.isReady() &&
						<StickyFooter
							text={this.props.gettext('Chat with us')}
							talkToUs={this.props.talkToUs}/>}</SectionComponent>
					</this.PositionedSidebarComponent>
				</div>
			</ConnectedRouter>
		);
	}
}

Sidebar.propTypes = {
	display: PropTypes.bool.isRequired,
	hide: PropTypes.func.isRequired,
	search: PropTypes.func.isRequired,
	openArticle: PropTypes.func.isRequired,
	clickArticle: PropTypes.func.isRequired,
	clickNewNavArticle: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	goBack: PropTypes.func.isRequired,
	suggest: PropTypes.func.isRequired,
	talkToUs: PropTypes.func.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
	toggleGettingStarted: PropTypes.func,
	location: PropTypes.object,
	searchQuery: PropTypes.string,
	appearance: PropTypes.object,
	exposedClass: PropTypes.string.isRequired,
	gettext: PropTypes.func.isRequired,
	gettingStarted: PropTypes.func,
	companySize: PropTypes.string,
	userMotive: PropTypes.object,
	companyFeatures: PropTypes.object,
	isAdmin: PropTypes.bool,
	gettingStartedItemClick: PropTypes.func.isRequired,
	gettingStartedItemExpand: PropTypes.func.isRequired,
	gettingStartedClose: PropTypes.func.isRequired,
	gettingStartedOpen: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
	exposedClass: options.EXPOSED_CLASS,
};

export const mapStateToProps = (state) => ({
	display: state.support.sidebar.display,
	location: state.router.location,
	searchQuery: state.support.search.query,
	companyFeatures: state.user.companyFeatures,
	isAdmin: state.user.isAdmin,
});

export const mapDispatchToProps = (dispatch, ownProps) => {
	const { gettingStarted, companySize, userMotive } = ownProps;

	return {
		search: (query) => {
			if (query) {
				dispatch(searchActions.search(query));
			} else {
				dispatch(searchActions.searchInvalidate());
			}
		},
		goBack: () => {
			dispatch(goBack());
		},
		openArticle: (articleId, locale) => {
			dispatch(push(`${routes.ARTICLE}/${articleId}/${locale}`));
		},
		clickArticle: (articleId, ogTitle, query, eventProps) => {
			const isSuggested = !query;

			dispatch(articleActions.articleClicked(articleId, ogTitle, query, isSuggested, eventProps));
		},
		clickNewNavArticle: () => {
			dispatch(articleActions.newNavArticleClicked());
		},
		talkToUs: (source) => {
			ownProps.hide();
			intercom.show();
			dispatch(sidebarActions.talkToUsClick(source));
		},
		trackExternalLink: (url, section, source) => {
			dispatch(sidebarActions.externalLinkClick(url, section, source));
		},
		toggleGettingStarted: gettingStarted ? (ev) => {
			ev.preventDefault();

			ownProps.hide();
			dispatch(sidebarActions.gettingStartedClick());

			const standaloneGettingStarted = new ownProps.gettingStarted({
				parent: document.getElementById('main-content'),
				appearance: {
					zIndex: {
						above: '#mainmenu',
					},
					zIndexCollapsed: {
						above: '#pipelineContainer, .gridContent',
					},
				},
				companySize,
				userMotive,
			});

			if (!gettingStartedStore.getState().gettingStarted.displaySidebar) {
				dispatch(gettingStartedReopened());
			}

			standaloneGettingStarted.expand();

			gettingStartedStore.dispatch(getCompletedStages());
		} : () => {
			dispatch(push(routes.GETTING_STARTED));
		},
		gettingStartedItemClick: (type, url, GSVersion) => {
			dispatch(sidebarActions.gettingStartedItemClick(type, url, GSVersion));
		},
		gettingStartedItemExpand: (GSVersion) => {
			dispatch(sidebarActions.gettingStartedItemExpand(GSVersion));
		},
		gettingStartedClose: (GSVersion) => {
			dispatch(sidebarActions.gettingStartedClose(GSVersion));
		},
		gettingStartedOpen: (GSVersion) => {
			dispatch(sidebarActions.gettingStartedOpen(GSVersion));
		},
	};
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
