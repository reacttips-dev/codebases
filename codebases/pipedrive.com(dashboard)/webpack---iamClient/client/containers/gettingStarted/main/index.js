import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, goBack } from 'react-router-redux';
import { has, some } from 'lodash';
import * as fullscreenActions from 'actions/fullscreen';
import { getArticle, saveSidebarWidth } from 'actions/gettingStarted';
import routes from 'constants/gettingStarted/routes';
import options from 'constants/gettingStarted/options';
import ToggleButtonComponent from 'components/gettingStarted/toggleButton';
import PanelComponent from 'components/gettingStarted/panel';
import ScrollComponent from 'components/sidebar/section';
import HeaderComponent from 'components/sidebar/header';
import FooterComponent from 'components/gettingStarted/footer';
import ArticleSummaryComponent from 'components/gettingStarted/articleSummary';
import SectionComponent from 'components/gettingStarted/section';
import IndexComponent from 'components/gettingStarted/index';
import VideoSummaryComponent from 'components/gettingStarted/videoSummary';
import Separator from 'components/gettingStarted/separator';
import translate from 'containers/translation';
import FullscreenContainer from 'containers/fullscreen';
import ArticleContainer from 'containers/gettingStarted/article';
import zIndex from 'containers/zIndex';
import getArticles from 'constants/gettingStarted/articles';

export class GettingStarted extends Component {
	constructor(props) {
		super(props);
		this.articles = getArticles(props.gettext, props.completeStage);
		this.PositionedPanelComponent = zIndex(props.appearance && props.appearance.zIndex)(PanelComponent);

		const zIndexToggleButton = props.appearance && (props.appearance.zIndexCollapsed || props.appearance.zIndex);

		this.PositionedToggleButtonComponent = zIndex(zIndexToggleButton)(ToggleButtonComponent);
	}

	isArticleView() {
		if (this.props.location) {
			return !!this.props.location.pathname && this.props.location.pathname.indexOf(routes.ARTICLE) > -1;
		}

		return false;
	}

	render() {
		// Getting Started needs to be suppressed while Onboarding Tour is happening
		if (this.props.suppressed) {
			return false;
		}

		const videoUrl = '//play.vidyard.com/t5zTptSeW59ZZrEXaP3Y7b';
		const GSVersion = { gs_version: 'v1', gs_name: 'old' };

		return (
			<ConnectedRouter history={this.props.history}>
				<div>
					<FullscreenContainer />
					<this.PositionedPanelComponent
						display={this.props.displaySidebar}
						exposedClass={this.props.exposedClassSidebar}
					>
						<ScrollComponent scrollable={false} width={this.props.width}>
							<HeaderComponent
								title={this.isArticleView() ? '' : this.props.gettext('Set up Pipedrive')}
								iconStyle='arrow-down'
								displayBack={this.isArticleView()}
								goBack={this.props.goBack}
								hide={this.props.collapse}
								closeIconLabel={this.props.gettext('Minimize')}
								goBackIconLabel={this.props.gettext('Back')}
							/>
						</ScrollComponent>
						<ScrollComponent scrollable={true} width={this.props.width} contentOffset={true}>
							<Switch>
								<Route exact path={routes.INDEX} component={() => (
									<IndexComponent
										saveSidebarWidth={this.props.saveSidebarWidth}
										shouldSaveSidebarWidth={typeof this.props.width !== 'number'}
									>
										<VideoSummaryComponent
											expand={this.props.expand}
											title={this.props.gettext('Watch a short overview')}
											subtitle={this.props.gettext('1 minute')}
											url={videoUrl}
											trackArgs={[null, 'video', videoUrl, GSVersion]}
										/>
										<Separator />
										<SectionComponent>
											{
												this.props.requestedStages.map((stage, stageNumber) => {
													return stage.target === 'video' ? (
														<VideoSummaryComponent
															key={`${stageNumber}${stage.id}`}
															expand={this.props.expand}
															trackArgs={[null, 'video', stage.url, GSVersion]}
															{...stage}
														/>
													) :
														(
															<ArticleSummaryComponent
																key={`${stageNumber}${stage.id}`}
																open={this.props.openArticle}
																{...stage}
																trackArgs={[null, 'link', stage.url, GSVersion]}
																completed={!!stage.completed}
															/>
														);
												})
											}
										</SectionComponent>
									</IndexComponent>
								)}/>
								<Route path={`${routes.ARTICLE}/:articleId/:locale`} component={({ match }) => {
									const articleId = parseInt(match.params.articleId, 10);
									const articleSummary = this.articles.find((article) => {
										return article.articleId === articleId || article.legacyId === articleId;
									});

									return (
										<ArticleContainer
											articleSummary={articleSummary}
											articleId={articleId}
											openArticle={this.props.openArticle}
										/>
									);
								}}/>
							</Switch>
						</ScrollComponent>
						<ScrollComponent scrollable={false} width={this.props.width}>
							<FooterComponent
								hide={this.props.hide}
								hideLabel={this.props.gettext('Close')}
								stages={this.props.requestedStages}
							/>
						</ScrollComponent>
					</this.PositionedPanelComponent>
					<this.PositionedToggleButtonComponent
						displayButton={this.props.displayButton}
						toggle={this.props.toggle}
						hide={this.props.hide}
						stages={this.props.requestedStages}
						exposedClass={this.props.exposedClassButton}
					/>
				</div>
			</ConnectedRouter>
		);
	}
}

GettingStarted.propTypes = {
	displaySidebar: PropTypes.bool.isRequired,
	displayButton: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	hide: PropTypes.func.isRequired,
	collapse: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object,
	gettext: PropTypes.func.isRequired,
	exposedClassSidebar: PropTypes.string.isRequired,
	exposedClassButton: PropTypes.string.isRequired,
	appearance: PropTypes.object,
	stages: PropTypes.array.isRequired,
	requestedStages: PropTypes.array.isRequired,
	completeStage: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
	openArticle: PropTypes.func.isRequired,
	expand: PropTypes.func.isRequired,
	saveSidebarWidth: PropTypes.func,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	links: PropTypes.array,
	suppressed: PropTypes.bool,
};

GettingStarted.defaultProps = {
	exposedClassSidebar: `${options.EXPOSED_CLASS} ${options.EXPOSED_CLASS_OPEN}`,
	exposedClassButton: `${options.EXPOSED_CLASS} ${options.EXPOSED_CLASS_COLLAPSED}`,
};

export const mapStateToProps = (state, ownProps) => {
	const defaultStages = getArticles(ownProps.gettext, ownProps.completeStage);
	const { isAdmin, importEnabled, companyFeatures } = state.user;
	const permissionFilter = (item) => {
		const visibleForAll = typeof item.importEnabled === 'undefined' && typeof item.forAdmins === 'undefined';

		return visibleForAll || item.importEnabled === importEnabled || item.forAdmins === isAdmin;
	};
	const companyFeaturesFilter = item => !has(item, 'forFeatures') || some([companyFeatures], item.forFeatures);

	return {
		displaySidebar: state.gettingStarted.displaySidebar,
		displayButton: state.gettingStarted.displayButton,
		location: state.router.location,
		width: state.gettingStarted.width,
		requestedStages: ownProps.stages.map((requestedStage) => {
			let stage;

			if (typeof requestedStage === 'string') {
				stage = defaultStages
					.filter(permissionFilter)
					.filter(companyFeaturesFilter)
					.find((item) => item.stageKey === requestedStage);
			} else {
				stage = requestedStage;
			}

			if (!stage) {
				return;
			}

			const completed = stage.completed || state.gettingStarted.stages[stage.stageKey];

			return Object.assign({}, stage, { completed });
		}).filter((validStage) => !!validStage).filter(permissionFilter).filter(companyFeaturesFilter),
		suppressed: state.gettingStarted.suppressed,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		expand: (el) => {
			dispatch(fullscreenActions.show(el));
		},
		openArticle: (articleId, locale) => {
			dispatch(getArticle(articleId, locale));
		},
		goBack: () => {
			dispatch(goBack());
		},
		saveSidebarWidth: (width) => {
			dispatch(saveSidebarWidth(width));
		},
	};
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(GettingStarted));
