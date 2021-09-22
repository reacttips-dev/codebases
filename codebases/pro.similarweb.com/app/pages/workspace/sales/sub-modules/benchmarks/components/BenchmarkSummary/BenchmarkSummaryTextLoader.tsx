import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

const LOADER_HEIGHT = 10;
const LOADER_WIDTH = 380;

const BenchmarkSummaryTextLoader: React.FC = () => {
    return (
        <div>
            <PixelPlaceholderLoader width={LOADER_WIDTH} height={LOADER_HEIGHT} />
            <PixelPlaceholderLoader width={LOADER_WIDTH - 30} height={LOADER_HEIGHT} />
        </div>
    );
};

export default BenchmarkSummaryTextLoader;
