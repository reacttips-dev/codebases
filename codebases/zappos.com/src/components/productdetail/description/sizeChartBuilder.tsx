import React, { isValidElement } from 'react';
import { Link } from 'react-router';
import { Parser } from 'html-to-react';

import { DescriptionItems } from './ProductDescription';

import { openPopup } from 'helpers/index';
import ProductUtils from 'helpers/ProductUtils';

const htmlToReactParser = new Parser();

const makeSizeChartLi = (testId: <T extends string | null | undefined>(id: T) => T, link: React.ReactNode, containerClass: string, index: number) => (
  <li key={index} className={containerClass} data-test-id={testId('sizeChartLi')}>
    {link}
  </li>
);

export const buildPopupProps = (className: string) => {
  interface NewProps {
    className?: null;
    onClick?: typeof openPopup;
    'data-popup-options'?: string;
  }
  const newProps: NewProps = {};
  if (className && className.includes('popup')) {
    const [width, height] = className.split('-').slice(1);
    newProps.className = null;
    newProps.onClick = openPopup;
    newProps['data-popup-options'] = `width=${width},height=${height}`;
  }
  return newProps;
};

export const makeSizeChartLink = (parsedLink: string, sizeChartsPropTransformer: (parsedLink: string, props: any) => any) => {
  if (typeof parsedLink === 'string') {
    return parsedLink;
  }
  const { props: { className } } = parsedLink;
  const transformedProps = sizeChartsPropTransformer(parsedLink, buildPopupProps(className));
  return transformedProps ? React.cloneElement(parsedLink, transformedProps) : null;
};

const makeStandardSizeChartLink = (parsedLink: string) => makeSizeChartLink(parsedLink, (parsedLink: string, props: any) => props);
const makeSizeChartLinkWithMultipleElements = (elements: string[], sizeChartLinkFactory: (parsedLink: string) => React.ReactNode) => React.Children.map(elements, sizeChartLinkFactory);

export const makeSizeChartLiBody = (sizeChart: string, multipleElementSizeChartLinkFactory = makeSizeChartLinkWithMultipleElements, sizeChartLinkFactory = makeStandardSizeChartLink) => {
  const trimmedSizeChart = sizeChart.trim();
  let parsedLink = htmlToReactParser.parse(trimmedSizeChart);
  if (isValidElement(parsedLink)) {
    return sizeChartLinkFactory(parsedLink as any);
  }

  parsedLink = htmlToReactParser.parse(`<span>${trimmedSizeChart}</span>`);
  if (!isValidElement(parsedLink)) {
    return null;
  }
  const { props: { children } } = parsedLink as any; // TODO ts write type-defs (or find some) from 'html-to-react' lib
  if (children.length <= 1) {
    return parsedLink;
  }

  return multipleElementSizeChartLinkFactory(children, sizeChartLinkFactory);
};

export function makeSizeCharts(defaultProductType: string, { sizeCharts = [] }: DescriptionItems, containerClass: string, testId: <T extends string | null | undefined>(id: T) => T
) {
  const isShoe = ProductUtils.isShoeType(defaultProductType);
  const hasSizeCharts = sizeCharts.length > 0;

  // if it's not a shoe and doesn't have size chart data...
  if (!isShoe && !hasSizeCharts) {
    // don't render a size chart
    return [];
  }

  // if it has one or more size charts (may or may not be a shoe)...
  if (hasSizeCharts) {
    // map each size chart to markup
    return sizeCharts.map((sizeChart, index) => {
      const link = makeSizeChartLiBody(sizeChart);
      return makeSizeChartLi(testId, link, containerClass, index);
    });
  }

  // otherwise return the default shoe size chart markup
  const link = (
    <Link
      to="/measure-your-shoe-size"
      onClick={openPopup}
      data-popup-options="width=1000,height=800"
      data-track-action="Product-Page"
      data-track-label="Tabs"
      data-track-value="Size-Chart"
      data-test-id={testId('descriptionSizeChart')}>
      View the size chart
    </Link>
  );
  return [makeSizeChartLi(testId, link, containerClass, 0)];
}
