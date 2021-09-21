import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
  isOn: boolean;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const SpeakerIcon = ({
  fillColor,
  className,
  isOn,
}: Props): React.ReactElement<React.ReactNode> => {
  const width = isOn ? 20 : 11.65;
  return (
    <svg
      viewBox={`0 0 ${width} 15`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(-740 -564)" fill={fillColor} fillRule="nonzero">
          <g transform="translate(299 65)">
            <g>
              <g>
                <g>
                  <g>
                    <g transform="translate(298 498)">
                      <g transform="translate(0 1)">
                        <g transform="translate(143)">
                          <path d="M10.8872022,0.0909027315 L5.4818507,3.30762398 L0.738528476,3.30762398 C0.330676125,3.30762398 -5.24025268e-14,3.62762224 -5.24025268e-14,4.02243768 L-5.24025268e-14,10.85284 C-5.24025268e-14,11.2476555 0.330676125,11.5676538 0.738528476,11.5676538 L5.48209688,11.5676538 L10.8872022,14.784375 C11.2267406,14.9865481 11.6257306,14.8293487 11.6257306,14.0695613 L11.6257306,0.805716437 C11.6257306,0.0386617631 11.2490811,-0.132893526 10.8872022,0.0909027315 Z" />
                          <g transform="translate(14.167)">
                            <path
                              d="M2.08333333,7.5 C2.08333333,6.025 1.23333333,4.75833333 0,4.14166667 L0,10.85 C1.23333333,10.2416667 2.08333333,8.975 2.08333333,7.5 Z M0,0.191666667 L0,1.90833333 C2.40833333,2.625 4.16666667,4.85833333 4.16666667,7.5 C4.16666667,10.1416667 2.40833333,12.375 0,13.0916667 L0,14.8083333 C3.34166667,14.05 5.83333333,11.0666667 5.83333333,7.5 C5.83333333,3.93333333 3.34166667,0.95 0,0.191666667 Z M2.08333333,7.5 C2.08333333,6.025 1.23333333,4.75833333 0,4.14166667 L0,10.85 C1.23333333,10.2416667 2.08333333,8.975 2.08333333,7.5 Z"
                              id="Shape"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

SpeakerIcon.defaultProps = defaultProps;

export { SpeakerIcon };
