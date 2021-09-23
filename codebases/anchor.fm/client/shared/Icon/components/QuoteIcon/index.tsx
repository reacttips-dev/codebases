import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const QuoteIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 34 25"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd" fillOpacity="0.2">
      <g transform="translate(-410 -2591)" fill={fillColor} fillRule="nonzero">
        <g transform="translate(196 2456)">
          <g transform="translate(214 135)">
            <path d="M24.6057441,15.5354449 C24.6057441,13.2352941 20,12.8959276 20,7.239819 C20,3.09200603 22.8877285,0 26.9086162,0 C31.1853786,0.0377073906 34,3.99698341 34,8.18250377 C34,15.4223228 27.4203655,25 23.3263708,25 C22.3028721,25 20.4386423,24.2458522 20.4386423,22.9638009 C20.4751958,21.6817496 24.6057441,19.4570136 24.6057441,15.5354449 Z" />
            <path d="M4.59375,15.521148 C4.59375,13.255287 0,12.8776435 0,7.25075529 C0,3.09667674 2.88020833,0 6.890625,0 C11.1927083,0 14,3.9652568 14,8.1570997 C14,15.407855 7.4375,25 3.35416667,25 C2.33333333,25 0.473958333,24.244713 0.473958333,22.9607251 C0.473958333,21.6767372 4.59375,19.4486405 4.59375,15.521148 Z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

QuoteIcon.defaultProps = defaultProps;

export default QuoteIcon;
