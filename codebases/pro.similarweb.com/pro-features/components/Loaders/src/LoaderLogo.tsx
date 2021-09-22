import * as React from "react";
import { StatelessComponent } from "react";
import styled, { keyframes } from "styled-components";

const rotate = ({ scale }) => keyframes`
100%{transform:rotateZ(0) scale(${scale})}}
`;

const circleFirst = keyframes`
    0%,33% {
    width:55px;
    height:55px;
    z-index:1
    }
    34% {
    z-index:2;
    width:0;
    height:0
    }
    100%,66% {
    width:55px;
    height:55px;
    z-index:2
    }
     67% {
    z-index:2
    }
`;

const circleSecond = keyframes`
  0% {
            width: 0;
            height: 0;
            z-index: 2
        }
        33% {
            width: 55px;
            height: 55px;
            z-index: 2
        }
        35% {
            z-index: 1
        }
        100%, 66% {
            width: 55px;
            height: 55px;
            z-index: 1
        }
`;

const LoaderLogoContainer = styled.div`
    position: relative;
    margin: 0 auto;
    background-color: #fff;
    transform: rotateZ(15deg) scale(0);
    animation: ${rotate} 0.17s forwards;
    animation-delay: 0.3s;
    border-radius: 50%;
    width: 90px;
    height: 90px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
`;
LoaderLogoContainer.displayName = "LoaderLogoContainer";

const LoaderLogoMask = styled.div`
    background: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2242%22%20height%3D%2270%22%20viewBox%3D%220%200%2042%2070%22%3E%3Cpath%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%20d%3D%22M17.824%2069.437c-4.443%200-10.123-.955-17.04-2.864v-9.165c7.454%203.408%2013.58%205.112%2018.382%205.112%203.697%200%206.67-.955%208.923-2.864%202.25-1.91%203.376-4.42%203.376-7.535%200-2.554-.738-4.73-2.214-6.52-1.476-1.792-4.197-3.79-8.163-5.992l-4.563-2.6c-5.636-3.172-9.61-6.16-11.92-8.966-2.31-2.806-3.466-6.073-3.466-9.804%200-5.023%201.85-9.157%205.547-12.403C10.384%202.59%2015.097.965%2020.82.965c5.098%200%2010.48.838%2016.146%202.513v8.46c-6.977-2.703-12.18-4.054-15.61-4.054-3.25%200-5.933.852-8.05%202.555-2.118%201.703-3.176%203.847-3.176%206.432%200%202.174.775%204.098%202.326%205.772%201.55%201.675%204.383%203.672%208.498%205.993l4.74%202.643c5.726%203.202%209.72%206.228%2011.988%209.077%202.266%202.85%203.4%206.27%203.4%2010.266%200%205.67-2.126%2010.222-6.375%2013.66-4.25%203.436-9.877%205.154-16.884%205.154z%22%2F%3E%3C%2Fsvg%3E)
        50% 50% no-repeat;
    background-size: 33px;
    transform: translateX(-50%) translateY(-50%) scale(1.4);
    z-index: 3;
    width: 55px;
    height: 55px;
    position: absolute;
    top: 50%;
    left: 50%;
`;
LoaderLogoMask.displayName = "LoaderLogoMask";

const LoaderCircle = styled.div`
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
`;

const LoaderBlue = styled(LoaderCircle)`
    width: 55px;
    height: 55px;
    background-color: #202c55;
    transform: translateX(-50%) translateY(-50%);
    animation: ${circleFirst} 1.2s infinite cubic-bezier(0.4, 0, 0.23, 1);
    animation-delay: 0.5s;
`;

LoaderBlue.displayName = "LoaderBlue";

const LoaderOrange = styled(LoaderCircle)`
    width: 0;
    height: 0;
    background-color: #f08800;
    transform: translateX(-50%) translateY(-50%);
    animation: ${circleSecond} 1.2s infinite cubic-bezier(0.4, 0, 0.23, 1);
    animation-delay: 0.5s;
`;
LoaderOrange.displayName = "LoaderOrange";

export const LoaderLogo: StatelessComponent<any> = ({ scale = 0.5 }) => {
    return (
        <LoaderLogoContainer scale={scale}>
            <LoaderLogoMask />
            <LoaderBlue />
            <LoaderOrange />
        </LoaderLogoContainer>
    );
};
