import React from 'react';
import store from 'js/lib/coursera.store';
import user from 'js/lib/user';
import PropTypes from 'prop-types';
import epicClient from 'bundles/epic/client';
import Media from 'react-media';
import { TABLET_SCREEN_WIDTH } from './__constants__';
import SlideContainer from './__components/SlideContainer';
import { PanelLookupDetails, TabsMapKeys } from './__types__';
import { TabIconType, Tabs } from './__components/VerticalTabs/__types__';
import { ResourcePanelTabsV1 } from './__providers__/TabsDataProvider/__types__';
import TabsDataProvider from './__providers__/TabsDataProvider';
import VerticalTabs from './__components/VerticalTabs';
import TabForumPosts from './__tabs__/TabForumPosts';

const tabsMap: Record<TabsMapKeys, TabIconType> = {
  ForumPosts: TabForumPosts,
};

const TabEventingMap = {
  ForumPosts: 'forum_posts',
};

type TabsResponse = [string, TabIconType];

function tabs(resourcePanelTabs: ResourcePanelTabsV1): Tabs {
  const mappedTabs = [] as TabsResponse[];
  for (let i = 0; i < resourcePanelTabs.length; i += 1) {
    const key = resourcePanelTabs[i];
    if (key in tabsMap) {
      const castKey = key as TabsMapKeys;

      mappedTabs.push([TabEventingMap[castKey], tabsMap[castKey]]);
    }
  }
  return mappedTabs;
}

export default class ResourcePanel extends React.Component<PanelLookupDetails> {
  static childContextTypes = {
    itemId: PropTypes.string,
    courseId: PropTypes.string,
    courseSlug: PropTypes.string,
  };

  dataFetchingBoundary = true;

  private sliderOpen = true; // application state to manage cross component management without rerendering lines 65:74

  constructor(args: PanelLookupDetails) {
    super(args);
    this.sliderOpen = store.get('resourcePanelContext_slider');
  }

  getChildContext = () => {
    return {
      itemId: this.props.itemId,
      courseId: this.props.courseId,
      courseSlug: this.props.courseSlug,
    };
  };

  setSliderMemory = (open: boolean) => {
    this.sliderOpen = open;
    store.set('resourcePanelContext_slider', open);
  };

  getSliderInitialOpenState = (isMobile: boolean) => {
    const memoryState = store.get('resourcePanelContext_slider');
    return memoryState === undefined ? !isMobile : memoryState; // if it is mobile return false ;
  };

  render() {
    const { courseId, itemId } = this.props;
    const { id: userId } = user.get();

    return (
      <TabsDataProvider courseId={courseId} itemId={itemId}>
        {({ data: resourcePanelTabs }) => {
          store.set('resourcePanelContext', { courseId, itemId, userId });
          if (resourcePanelTabs && Array.isArray(resourcePanelTabs) && resourcePanelTabs.length > 0) {
            return (
              <Media query={{ maxWidth: TABLET_SCREEN_WIDTH }}>
                {(isMobile) => {
                  return (
                    <SlideContainer
                      open={this.getSliderInitialOpenState(isMobile)}
                      onClose={() => {
                        this.setSliderMemory(false);
                      }}
                      onOpen={() => {
                        this.setSliderMemory(true);
                      }}
                    >
                      {({ toggle }: { toggle: () => void }) => {
                        return (
                          <VerticalTabs
                            onTabClick={() => {
                              if (!this.sliderOpen) {
                                toggle();
                              }
                            }}
                            tabs={tabs(resourcePanelTabs)}
                          />
                        );
                      }}
                    </SlideContainer>
                  );
                }}
              </Media>
            );
          }
          return null;
        }}
      </TabsDataProvider>
    );
  }
}

export class ResourcePanelContextProvider extends React.Component {
  static contextTypes = {
    itemId: PropTypes.string,
    courseId: PropTypes.string,
    courseSlug: PropTypes.string,
  };

  render() {
    if (this.props.children && typeof this.props.children === 'function') {
      return this.props.children({
        itemId: this.context.itemId,
        courseId: this.context.courseId,
        courseSlug: this.context.courseSlug,
      });
    }
    return <span>{this.props.children}</span>;
  }
}

export const epics = {
  enabledResourcePanelToPublic: (): boolean => {
    if (window && window.location) {
      if (window.location.search.match('enabledResourcePanelToPublic=true')) {
        return true;
      }
    }
    return epicClient.get('Flex', 'enabledResourcePanelToPublic');
  }, // https://tools.coursera.org/epic/experiment/vPv8MPGlEeqFtTfFw04C0w
};
