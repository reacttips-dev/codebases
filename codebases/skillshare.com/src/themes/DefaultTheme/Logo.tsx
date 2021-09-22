var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
var useStyles = makeStyles(function () {
    return {
        root: {
            height: 52,
            width: 104,
        },
    };
});
export var Logo = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var classes = useStyles();
    return (React.createElement(SvgIcon, __assign({}, props, { className: clsx(classes.root, className), width: "104", height: "52", viewBox: "0 0 310 154", fill: "none", xmlns: "http://www.w3.org/2000/svg" }),
        React.createElement("g", { clipPath: "url(#clip0)" },
            React.createElement("title", null, "Skillshare Logo"),
            React.createElement("path", { d: "M89.8299 81.83L73.4199 58.37V81.83H56.4399V27.84H73.4199V50.67L90.2799 27.99H110.39L89.7199 53.46L110.71 81.83H89.8299Z", fill: "white" }),
            React.createElement("path", { d: "M299.29 152.84C304.785 152.84 309.24 148.435 309.24 143C309.24 137.566 304.785 133.16 299.29 133.16C293.795 133.16 289.34 137.566 289.34 143C289.34 148.435 293.795 152.84 299.29 152.84Z", fill: "white" }),
            React.createElement("path", { d: "M126.05 19.68C131.545 19.68 136 15.2745 136 9.84C136 4.40552 131.545 0 126.05 0C120.555 0 116.1 4.40552 116.1 9.84C116.1 15.2745 120.555 19.68 126.05 19.68Z", fill: "white" }),
            React.createElement("path", { d: "M134.54 27.84H117.56V81.83H134.54V27.84Z", fill: "white" }),
            React.createElement("path", { d: "M117.24 124.8C117.24 108.71 127.18 96.4301 142.82 96.4301C150.64 96.4301 156.78 100.12 159.69 105.59V97.8801H176.67V151.72H159.69V144.12C156.78 149.48 150.08 153.17 142.6 153.17C126.52 153.18 117.24 141 117.24 124.8ZM160.36 124.8C160.36 117.09 156 110.72 147.51 110.72C139.58 110.72 134.66 116.64 134.66 124.8C134.66 132.95 139.57 138.99 147.51 138.99C156.01 138.99 160.36 132.62 160.36 124.8Z", fill: "white" }),
            React.createElement("path", { d: "M186.67 97.88H203.76V109.16C205.66 101.12 212.03 96.99 218.62 96.99C220.63 96.99 221.75 97.1 223.09 97.44L223 113.29C220.99 113.06 220.07 112.96 217.95 112.96C208.68 112.96 203.76 118.99 203.76 130.94V151.72H186.67V97.88Z", fill: "white" }),
            React.createElement("path", { d: "M226.55 124.8C226.55 107.15 238.06 96.4301 255.59 96.4301C272.35 96.4301 283.74 106.82 283.74 122.01C283.74 124.8 283.63 126.48 283.29 129.49H243.52C243.85 136.53 248.55 140.33 256.14 140.33C261.39 140.33 264.74 138.88 266.19 135.53H282.95C281.28 146.14 270.44 153.18 256.14 153.18C237.83 153.18 226.55 142.79 226.55 124.8ZM266.88 118.88C266.77 111.73 262.75 107.93 255.49 107.93C248.12 107.93 243.65 112.29 243.54 118.88H266.88Z", fill: "white" }),
            React.createElement("path", { d: "M161.5 65.8V27.84H144.41V66.35V81.83H161.5H185.88V65.8H161.5Z", fill: "white" }),
            React.createElement("path", { d: "M212.23 65.8V27.84H195.14V66.35V81.83H212.23H236.61V65.8H212.23Z", fill: "white" }),
            React.createElement("path", { d: "M93.6699 97.86V117.25H73.1899V97.86H56.4399V117.25V132.73V151.86H73.1899V132.73H93.6699V151.86H110.43V132.73V117.25V97.86H93.6699Z", fill: "white" }),
            React.createElement("path", { d: "M35.36 119.75L24.92 116.86C21.39 115.81 20.17 114.26 20.17 112.07C20.17 109.68 22.05 108.27 24.48 107.99C28.01 107.58 30.74 109.11 30.74 112.92V113.17H48.7V112.92H48.69C48.69 102.17 39.6 96.24 24.42 96.24C10.58 96.24 1.43 102.96 1.43 113.15C1.43 121.32 6.34 126.81 14.93 128.93L25.7 131.63C28.9 132.64 30.19 134.21 30.18 136.67C30.17 139.36 27.47 140.88 24.71 141.01C20.71 141.19 17.8 139.02 17.58 135.57H0C0.26 145.87 10.34 153.11 25.43 153.11C39.71 153.11 48.98 146.51 48.98 135.31C48.97 127.14 43.84 121.99 35.36 119.75Z", fill: "white" }),
            React.createElement("path", { d: "M35.36 49.86L24.92 46.97C21.39 45.92 20.17 44.37 20.17 42.18C20.17 39.79 22.05 38.38 24.48 38.1C28.01 37.69 30.74 39.22 30.74 43.03V43.28H48.7V43.03H48.69C48.69 32.28 39.6 26.35 24.42 26.35C10.58 26.35 1.43 33.07 1.43 43.26C1.43 51.43 6.34 56.92 14.93 59.04L25.7 61.74C28.9 62.75 30.19 64.32 30.18 66.78C30.17 69.47 27.47 70.99 24.71 71.12C20.71 71.3 17.8 69.13 17.58 65.68H0C0.26 75.98 10.34 83.22 25.43 83.22C39.71 83.22 48.98 76.62 48.98 65.42C48.97 57.25 43.84 52.1 35.36 49.86Z", fill: "white" })),
        React.createElement("defs", null,
            React.createElement("clipPath", { id: "clip0" },
                React.createElement("rect", { width: "309.24", height: "153.18", fill: "white" })))));
};
//# sourceMappingURL=Logo.js.map