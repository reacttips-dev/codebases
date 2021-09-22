import { CircularLoader } from "components/React/CircularLoader";
import { LoaderContainer } from "../style";
import { circularLoaderOptions } from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";

type SfCardLoaderProps = { height: string | number };

export const SfCardLoader = ({ height }: SfCardLoaderProps) => (
    <LoaderContainer height={height}>
        <CircularLoader options={circularLoaderOptions} />
    </LoaderContainer>
);
