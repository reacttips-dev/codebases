import * as React from "react";

export const NewCustomGroupImage = () => (
    <svg
        width="126"
        height="80"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <defs>
            <filter
                x="-22.5%"
                y="-32%"
                width="145.1%"
                height="164%"
                filterUnits="objectBoundingBox"
                id="a"
            >
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur
                    stdDeviation="3"
                    in="shadowOffsetOuter1"
                    result="shadowBlurOuter1"
                />
                <feColorMatrix
                    values="0 0 0 0 0.722234376 0 0 0 0 0.754855866 0 0 0 0 0.787477355 0 0 0 0.249508304 0"
                    in="shadowBlurOuter1"
                    result="shadowMatrixOuter1"
                />
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <path
                d="M14.875 0C6.664 0 0 6.676 0 14.903c0 8.226 6.664 14.902 14.875 14.902S29.75 23.13 29.75 14.903C29.75 6.676 23.086 0 14.875 0zm7.162 16.338h-5.73v5.74h-2.864v-5.74h-5.73v-2.87h5.73v-5.74h2.864v5.74h5.73v2.87z"
                id="b"
            />
        </defs>
        <g fill="none" fillRule="evenodd">
            <path
                d="M42.99 14.662h59.047a4.238 4.238 0 0 1 4.238 4.238v41.907a9.258 9.258 0 0 1-9.258 9.258H31.904c-8.778 0-15.895-7.116-15.895-15.894V12.83a3.52 3.52 0 0 1 3.52-3.52h19.942a3.52 3.52 0 0 1 3.52 3.52v1.83z"
                fill="#AEC7E0"
            />
            <g filter="url(#a)" transform="translate(49.481 4)">
                <path fill="#FFF" d="M0 .506h70.519v49H0z" />
                <path
                    fill="#EDF2F7"
                    d="M6.611 17.39h57.296v6.623H6.611zM6.611 7.455h57.296v6.623H6.611zM6.611 27.429h57.296v6.623H6.611zM6.611 37.364h57.296v6.623H6.611z"
                />
            </g>
            <path
                d="M91.41 70.059h-71c-5.851 0-10.595-4.744-10.595-10.596V28.68a3.52 3.52 0 0 1 3.52-3.52h20.172a3.52 3.52 0 0 1 3.52 3.52v2.76h51.246a3.179 3.179 0 0 1 3.18 3.178v24.52c2.184 10.11 14.818 8.834 14.818 1.375.084 3.639-1.457 6.375-4.62 8.209-2.317 1.343-2.551 1.343-10.142 1.343a.818.818 0 0 1-.1-.006z"
                fill="#CEDEEF"
            />
            <g transform="translate(1 50.195)">
                <ellipse fill="#FFF" cx="15.141" cy="14.903" rx="13.773" ry="13.799" />
                <use
                    fill="#AEC7E0"
                    fillRule="nonzero"
                    transform="rotate(90 14.875 14.903)"
                    xlinkHref="#b"
                />
            </g>
        </g>
    </svg>
);
