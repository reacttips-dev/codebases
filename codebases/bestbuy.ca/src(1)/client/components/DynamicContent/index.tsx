import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import PromoBanner from "components/PromoBanner";
import * as styles from "./style.css";
import StoryBanner from "components/StoryBanner";
import {
    BackgroundWidth,
    CustomContentType,
    MarginSizes,
    MerchItem,
    SectionData,
    SectionItemTypes,
    videoProps,
} from "models";
import MerchSkuList from "components/banners/MerchSkuList";
import {LoadingSkeleton} from "@bbyca/bbyca-components";
import ImageBlock from "components/ImageBlock";
import {TopSellers} from "components/recommendations/TopSellers";
import ProductFinder from "../ProductFinder";
import {AdSlot} from "components/Advertisement";
import ErrorBoundary from "components/ErrorBoundary";
import AdvertisementList from "components/AdvertisementList";
import {classname, classIf} from "utils/classname";
import TextBlock from "components/TextBlock";
import CriteoSponsoredProducts from "components/CriteoSponsoredProducts";
import SingleButton from "components/SingleButton";
import {default as SectionTitleComponent} from "components/SectionTitle";
import AnchorNav from "components/AnchorNav";
import HtmlContent from "./components/HtmlContent";
import ContentContainer, {withContentContainer} from "./ContentContainer";
import HeroBanner from "components/banners/HeroBanner";
import BarBanner from "components/banners/BarBanner";
import CategoryIconList from "components/CategoryIconList";
import ColumnContent from "components/banners/ColumnContent";
import FeatureBanner from "components/banners/FeatureBanner";
import {SlideShowFeatureBanner} from "components/banners/SlideShowFeatureBanner";
import {Story} from "components/banners/Story";
import Timeline from "components/banners/Timeline";
import TitleBanner from "components/banners/TitleBanner";
import {
    barBannerParser,
    categoryIconListParser,
    columnContentParser,
    featureBannerParser,
    heroBannerParser,
    singleButtonParser,
    skuListParser,
    slideShowFeatureBannerParser,
    storyBannerParser,
    textBlockParser,
    timelineParser,
    titleBannerParser,
    imageBlockParser,
} from "./helpers/componentParsers/";
import {RecentlyViewed} from "components/recommendations/RecentlyViewed";
import {DynamicContentFeatureToggles} from "config/featureToggles";
import {prodListingBannerParser} from "./helpers/componentParsers/prodListingBanner";
import ProdListingBanner from "components/ProdListingBanner";

export interface Props {
    screenSize: ScreenSize;
    sectionList: SectionData[];
    hasNavigation?: boolean;
    regionName?: string;
    isLoading?: boolean;
    language: Language;
    isMobileApp?: boolean;
    onAnyChildRendered?: (shouldShowParent: boolean) => void;
    dynamicContentFeatureToggles?: DynamicContentFeatureToggles;
    className?: string;
}

interface BuildProps {
    sectionListDisplayToggle: DisplayToggle;
    setSectionListDisplayToggle: React.Dispatch<React.SetStateAction<DisplayToggle>>;
}

type DisplayToggle = boolean[];

const SlideShowFeatureBannerWithContainer = withContentContainer(SlideShowFeatureBanner);
const indexThresholdLikelyAboveTheFold = 3;

const SectionTitle: React.FC<{className?: string}> = ({className, children}) => (
    <SectionTitleComponent className={classname([className, styles.sectionTitle])}>{children}</SectionTitleComponent>
);

export const isStoryBanner = (item: MerchItem): boolean =>
    !!item.bannerType && item.bannerType.toLowerCase() === "story";

const hasSectionItems = (section: SectionData): boolean =>
    section && section.items && section.items.length > 0 && !!section.items[0];

export function buildDynamicContent(dynamicContentProps: Props & BuildProps) {
    const {
        sectionList,
        screenSize,
        regionName,
        language,
        isMobileApp,
        sectionListDisplayToggle = [],
        setSectionListDisplayToggle,
        dynamicContentFeatureToggles,
    } = dynamicContentProps;

    if (!sectionList || sectionList.length === 0) {
        return null;
    }

    let storyBannerAlignment: "right" | "left" | null = null;
    const toggleSectionDisplay = (index: number, show: boolean) => {
        if (sectionListDisplayToggle[index] === show) {
            return;
        }
        const newToggles = [...sectionListDisplayToggle];
        newToggles.splice(index, 1, show);
        setSectionListDisplayToggle(newToggles);
    };

    const sections = sectionList.map((section, index, arr) => {
        if (!hasSectionItems(section)) {
            return null;
        }

        const item = section.items[0] as any;

        const sectionId = section.id ? {id: section.id} : null;
        const isLikelyAboveTheFold = index < indexThresholdLikelyAboveTheFold;

        switch (item.type) {
            case SectionItemTypes.banner:
                if (isStoryBanner(item)) {
                    // If a series of story banners come is from the api. We make the first left aligned by default and have it alternate for the next ones
                    storyBannerAlignment = storyBannerAlignment === "left" ? "right" : "left";
                    return (
                        <ErrorBoundary errorMsg={"StoryBanner error caught"} key={index + "storyBanner"}>
                            <ContentContainer
                                extraAttrs={{
                                    "data-automation": `dynamic-content-${SectionItemTypes.banner}`,
                                }}
                                displayOptions={item.displayOptions}
                                id={sectionId}>
                                {section.title && <SectionTitle>{section.title}</SectionTitle>}
                                <StoryBanner
                                    key={index}
                                    content={item}
                                    alignment={storyBannerAlignment}
                                    screenSize={screenSize}
                                    isMobileApp={isMobileApp}
                                    language={language}
                                />
                            </ContentContainer>
                        </ErrorBoundary>
                    );
                }
                return (
                    <ErrorBoundary errorMsg={"PromoBanner error caught"} key={index + "promoBanner"}>
                        <ContentContainer
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.banner}`}}
                            displayOptions={item.displayOptions}
                            id={sectionId}>
                            <PromoBanner
                                key={index}
                                className={styles.promoBannerContainer}
                                merchItem={item}
                                screenSize={screenSize}
                                isMobileApp={isMobileApp}
                                language={language}
                            />
                        </ContentContainer>
                    </ErrorBoundary>
                );
            case SectionItemTypes.textBlock:
                const displayOptions = item.displayOptions || {};
                const textBlockProps = textBlockParser(item, section);
                return (
                    textBlockProps && (
                        <ErrorBoundary errorMsg={"textBlock error caught"} key={index + "textBlock"}>
                            <TextBlock
                                extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.textBlock}`}}
                                id={sectionId}
                                className={styles.textBlockSection}
                                {...textBlockProps}>
                                <HtmlContent
                                    body={item.body}
                                    restrictedElementSelector={".videoWrapper"}
                                    hasRestrictedContent={displayOptions.bodyVideo === videoProps.ageRestricted}
                                />
                            </TextBlock>
                        </ErrorBoundary>
                    )
                );
            case SectionItemTypes.featureBanner:
                const featureBannerProps = featureBannerParser(
                    {...item},
                    {
                        screenSize,
                        disableLazyLoad: isLikelyAboveTheFold,
                    },
                );

                return featureBannerProps ? (
                    <ErrorBoundary errorMsg={"featureBanner error caught"} key={index + "featureBanner"}>
                        {section.title && <SectionTitle>{section.title}</SectionTitle>}
                        <FeatureBanner
                            className={styles.featureBanner}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.featureBanner}`}}
                            id={sectionId}
                            {...featureBannerProps}
                        />
                    </ErrorBoundary>
                ) : null;
            case SectionItemTypes.heroBanner: {
                const heroBannerProps = heroBannerParser({...item}, {screenSize});
                const HeroBannerWithContainer = withContentContainer(HeroBanner);
                return heroBannerProps ? (
                    <ErrorBoundary errorMsg={"heroBanner error caught"} key={index + "herobanner"}>
                        {section.title && <SectionTitle>{section.title}</SectionTitle>}
                        <HeroBannerWithContainer
                            className={styles.heroBanner}
                            backgroundImage={item.backgroundImage}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.heroBanner}`}}
                            displayOptions={{...item.displayOptions, backgroundWidth: BackgroundWidth.siteSize}}
                            id={sectionId}
                            {...heroBannerProps}
                        />
                    </ErrorBoundary>
                ) : null;
            }
            case SectionItemTypes.titleBanner: {
                const titleBannerProps = titleBannerParser({...item}, {screenSize});
                const TitleBannerWithContainer = withContentContainer(TitleBanner);
                return titleBannerProps ? (
                    <ErrorBoundary errorMsg={"titleBanner error caught"} key={index + "titleBanner"}>
                        {section.title && <SectionTitle>{section.title}</SectionTitle>}

                        <TitleBannerWithContainer
                            className={styles.titleBanner}
                            backgroundImage={item.backgroundImage}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.titleBanner}`}}
                            displayOptions={{...item.displayOptions, backgroundWidth: BackgroundWidth.siteSize}}
                            id={sectionId}
                            {...titleBannerProps}
                        />
                    </ErrorBoundary>
                ) : null;
            }
            case SectionItemTypes.barBanner: {
                const barBannerProps = barBannerParser({...item}, {screenSize});
                const BarBannerWithContainer = withContentContainer(BarBanner);
                return barBannerProps ? (
                    <ErrorBoundary errorMsg={"barBanner error caught"} key={index + "barBanner"}>
                        {section.title && <SectionTitle>{section.title}</SectionTitle>}

                        <BarBannerWithContainer
                            className={styles.barBanner}
                            backgroundImage={item.backgroundImage}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.barBanner}`}}
                            displayOptions={{...item.displayOptions, backgroundWidth: BackgroundWidth.siteSize}}
                            id={sectionId}
                            {...barBannerProps}
                        />
                    </ErrorBoundary>
                ) : null;
            }
            case SectionItemTypes.timeline: {
                const timelineData = timelineParser(item, {
                    screenSize,
                    language,
                });

                return (
                    timelineData && (
                        <ErrorBoundary errorMsg={"timeline error caught"} key={index + "timeline"}>
                            <Timeline id={section.id} {...timelineData} />
                        </ErrorBoundary>
                    )
                );
            }
            case SectionItemTypes.featureBannerList:
                const slideShowData = slideShowFeatureBannerParser(item, {
                    screenSize,
                    language,
                    isMobileApp: !!isMobileApp,
                    disableFirstSlideLazyLoad: isLikelyAboveTheFold,
                });

                return (
                    slideShowData && (
                        <ErrorBoundary
                            errorMsg={"slideShowFeatureBanner error caught"}
                            key={index + "slideShowFeatureBanner"}>
                            <SlideShowFeatureBannerWithContainer
                                extraAttrs={{
                                    "data-automation": `dynamic-content-${SectionItemTypes.featureBannerList}`,
                                }}
                                id={sectionId}
                                {...slideShowData}
                            />
                        </ErrorBoundary>
                    )
                );
            case SectionItemTypes.skuList:
                const skuListData = skuListParser(item, {
                    screenSize,
                    regionName: regionName || "",
                    isMobileApp: !!isMobileApp,
                    language,
                });

                const MerchSkuListWithContainer = withContentContainer(MerchSkuList);
                return (
                    skuListData && (
                        <ErrorBoundary errorMsg={"skuList error caught"} key={index + "skuList"}>
                            <MerchSkuListWithContainer
                                id={sectionId}
                                extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.skuList}`}}
                                displayOptions={item.displayOptions}
                                {...skuListData}>
                                {section.title && <SectionTitle>{section.title}</SectionTitle>}
                            </MerchSkuListWithContainer>
                        </ErrorBoundary>
                    )
                );

            case SectionItemTypes.story:
                const storyProps = storyBannerParser({...item, title: section.title}, {screenSize});
                const StoryWithContainer = withContentContainer(Story);
                return (
                    <ErrorBoundary errorMsg="Story Error caught" key={`${index}Story`}>
                        <StoryWithContainer
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.story}`}}
                            className={classname([styles.storySection])}
                            displayOptions={item.displayOptions}
                            id={sectionId}
                            {...storyProps}
                        />
                    </ErrorBoundary>
                );
            case SectionItemTypes.offerList:
                const h2Class = classname([
                    styles.sectionTitle,
                    item.displayOptions && styles[item.displayOptions.theme],
                ]);
                const columnContentData = columnContentParser(item, {
                    screenSize,
                    language,
                    isMobileApp: !!isMobileApp,
                });
                return columnContentData ? (
                    <ErrorBoundary errorMsg={"ColumnContent error caught"} key={index + "offerList"}>
                        <ColumnContent
                            id={sectionId}
                            className={classIf(
                                styles.hideContainer,
                                !sectionListDisplayToggle[index],
                                styles.showContainer,
                            )}
                            displaySection={sectionListDisplayToggle[index]}
                            onAdItemsHaveBeenHidden={(show) => toggleSectionDisplay(index, show)}
                            {...columnContentData}>
                            {section.title && <SectionTitle className={h2Class}>{section.title}</SectionTitle>}
                        </ColumnContent>
                    </ErrorBoundary>
                ) : null;
            case SectionItemTypes.customContentList:
                return (
                    <ErrorBoundary errorMsg={"ColumnContent error caught"} key={index + "customContentList"}>
                        <section
                            {...sectionId}
                            data-automation={`dynamic-content-${SectionItemTypes.customContentList}`}
                            className={classIf(
                                styles.hideContainer,
                                !sectionListDisplayToggle[index],
                                styles.showContainer,
                            )}
                        >
                            {section.title && <SectionTitle>{section.title}</SectionTitle>}
                            <AdvertisementList
                                language={language}
                                key={index}
                                content={item}
                                screenSize={screenSize}
                                isMobileApp={isMobileApp}
                                onAdItemsHaveBeenHidden={(show) => toggleSectionDisplay(index, show)}
                            />
                        </section>
                    </ErrorBoundary>
                );
            case SectionItemTypes.categoryIconList:
                const categoryIconListData = categoryIconListParser(item);
                const CategoryIconListWithContainer = withContentContainer(CategoryIconList);

                return (
                    categoryIconListData && (
                        <ErrorBoundary errorMsg={"Category Icon List error caught"} key={index + "categoryIcons"}>
                            <CategoryIconListWithContainer
                                extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.categoryIconList}`}}
                                id={sectionId}
                                displayOptions={item.displayOptions}
                                isMobileApp={!!isMobileApp}
                                screenSize={screenSize}
                                language={language}
                                {...categoryIconListData}>
                                {section.title && <SectionTitle>{section.title}</SectionTitle>}
                            </CategoryIconListWithContainer>
                        </ErrorBoundary>
                    )
                );
            case SectionItemTypes.prodListingBanner:
                const prodListingBannerProps = prodListingBannerParser(item, {screenSize});
                // Override default margins on ContentContainer
                const prodListingBannerDisplayOptions = {
                    ...item.displayOptions,
                    marginExtraSmall: MarginSizes.none,
                    marginSmall: MarginSizes.none,
                    marginMedium: MarginSizes.none,
                };
                return prodListingBannerProps ? (
                    <ErrorBoundary errorMsg={"ProdListingBanner error caught"} key={index + "prodListingBanner"}>
                        <ContentContainer
                            id={sectionId}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.prodListingBanner}`}}
                            displayOptions={prodListingBannerDisplayOptions}>
                            <ProdListingBanner {...prodListingBannerProps}></ProdListingBanner>
                        </ContentContainer>
                    </ErrorBoundary>
                ) : null;
            case SectionItemTypes.imageBlock:
                const imageBlockProps = imageBlockParser(item, {screenSize});
                const ImageBlockWithContainer = withContentContainer(ImageBlock);
                return imageBlockProps ? (
                    <ErrorBoundary errorMsg={"ImageBlock error caught"} key={index + "imageBlock"}>
                        <ImageBlockWithContainer
                            displayOptions={item.displayOptions}
                            id={sectionId}
                            extraAttrs={{"data-automation": `dynamic-content-${SectionItemTypes.imageBlock}`}}
                            {...imageBlockProps}
                        />
                    </ErrorBoundary>
                ) : null;
            case SectionItemTypes.customContent:
                if (item.customContentType === CustomContentType.criteoSponsoredProducts && !isMobileApp) {
                    // TODO: figure out why using section tag breaks Android App homepage view
                    return (
                        <ErrorBoundary
                            errorMsg={"CriteoSponsoredProducts error caught"}
                            key={index + "criteoSponsoredProducts"}>
                            <ContentContainer
                                displayOptions={item.displayOptions}
                                extraAttrs={{
                                    "data-automation": `dynamic-content-${SectionItemTypes.customContent}-criteo`,
                                }}
                                id={sectionId}>
                                <CriteoSponsoredProducts>
                                    {section.title && <SectionTitle>{section.title}</SectionTitle>}
                                </CriteoSponsoredProducts>
                            </ContentContainer>
                        </ErrorBoundary>
                    );
                }
                if (item.customContentType === CustomContentType.adSlotGoogle && !isMobileApp) {
                    const generateAdSlotWrapperClassNames = (): string => {
                        const classNames = [styles.adSlot];
                        if (index === 0) {
                            classNames.push(styles.firstAdBanner);
                        }
                        return classNames.join(" ");
                    };
                    return (
                        <ErrorBoundary
                            errorMsg={"Custom Content Ad Slot error caught"}
                            key={index + "customContentAdSlot"}>
                            <ContentContainer
                                displayOptions={item.displayOptions}
                                id={sectionId}
                                className={classIf(
                                    styles.hideContainer,
                                    !sectionListDisplayToggle[index],
                                    styles.showContainer,
                                )}>
                                <div>
                                    <AdSlot
                                        adSlotWrapperClasses={generateAdSlotWrapperClassNames()}
                                        containerId={item.values.id}
                                        onAdAvailabilityChange={(show: boolean) => toggleSectionDisplay(index, show)}
                                        format={item.values.format}
                                    />
                                </div>
                            </ContentContainer>
                        </ErrorBoundary>
                    );
                }

                if (
                    ( item.customContentType === CustomContentType.adobeTopSellers ||
                    item.customContentType === CustomContentType.adobe ) && 
                    ( item.values?.experience === undefined ||
                    item.values?.experience === dynamicContentFeatureToggles?.topSellers )
                ) {
                    
                    return (
                        <ErrorBoundary errorMsg={"TopSellers error caught"} key={index + "topSellers"}>
                            <ContentContainer displayOptions={item.displayOptions} id={sectionId}>
                                <TopSellers
                                    className={styles.section}
                                    extraAttributes={{
                                        "data-automation": `dynamic-content-${SectionItemTypes.banner}-adobe`,
                                    }}
                                    noCrawl={true}
                                    titleAlign="center"
                                />
                            </ContentContainer>
                        </ErrorBoundary>
                    );
                }
                if (
                    item.customContentType === CustomContentType.adobeRecentlyViewed &&
                    !!dynamicContentFeatureToggles?.recentlyViewed
                ) {
                    const RecentlyViewedWithContainer = withContentContainer(RecentlyViewed);
                    return (
                        <ErrorBoundary errorMsg={"RecentlyViewed error caught"} key={index + "recentlyViewed"}>
                            <RecentlyViewedWithContainer
                                displayOptions={item.displayOptions}
                                extraAttrs={{
                                    "data-automation": `dynamic-content-${SectionItemTypes.banner}-recentlyViewed`,
                                }}
                                titleAlign="center"
                            />
                        </ErrorBoundary>
                    );
                }
                if (item.customContentType === CustomContentType.productFinder) {
                    return (
                        <ErrorBoundary errorMsg={"ProductFinder error caught"} key={`${index}productFinder`}>
                            <ContentContainer displayOptions={item.displayOptions} id={sectionId}>
                                <ProductFinder
                                    url={item.values.productVariantsUrl}
                                    defaults={JSON.parse(item.values.defaults)}
                                />
                            </ContentContainer>
                        </ErrorBoundary>
                    );
                }
                return null;
            case SectionItemTypes.button:
                const singleButtonProps = singleButtonParser(item);
                const SingleButtonWithContainer = withContentContainer(SingleButton);
                return (
                    singleButtonProps && (
                        <ErrorBoundary errorMsg={"Button error caught"} key={`${index}button`}>
                            <SingleButtonWithContainer
                                {...singleButtonProps}
                                displayOptions={item.displayOptions}
                                className={styles.singleButton}
                                id={sectionId}
                            />
                        </ErrorBoundary>
                    )
                );

            case SectionItemTypes.anchorNav:
                return (
                    <ErrorBoundary errorMsg="Anchor navigation error caught" key={`${index}anchorNav`}>
                        <section
                            data-automation={`dynamic-content-${SectionItemTypes.anchorNav}`}
                            className={styles.anchorNavSection}>
                            <AnchorNav title={section.title} anchorLinks={item.anchorNavList} />
                        </section>
                    </ErrorBoundary>
                );

            default:
                return null;
        }
    });

    return sections;
}

export const DynamicContent: React.FunctionComponent<Props> = (props: Props) => {
    if (props.isLoading) {
        return <LoadingSkeleton.Banner />;
    } else if (props.sectionList) {
        const [sectionListDisplayToggle, setSectionListDisplayToggle] = React.useState(
            new Array(props.sectionList.length).fill(true),
        );

        React.useEffect(() => {
            if (props.onAnyChildRendered) {
                props.onAnyChildRendered(sectionListDisplayToggle.some((isVisible) => isVisible));
            }
        }, [sectionListDisplayToggle]);

        return (
            <div className={classname([styles.container, props.className])}>
                {buildDynamicContent({
                    ...props,
                    sectionListDisplayToggle,
                    setSectionListDisplayToggle,
                })}
            </div>
        );
    }

    return null;
};

DynamicContent.displayName = "DynamicContent";

export default DynamicContent;
