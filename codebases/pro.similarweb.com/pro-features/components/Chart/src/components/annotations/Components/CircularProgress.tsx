import { CircularLoader } from "components/React/CircularLoader";
import { LoaderContainer } from "./StyledComponents";
/*
 * Circular progress used when retrieving annotations (Charts component),
 * adding, edit, deleting annotations (AnnotationHOC component)
 */
export const CircularProgress = () => {
    return (
        <LoaderContainer>
            <CircularLoader
                options={{
                    svg: {
                        stroke: "#dedede",
                        strokeWidth: "4",
                        r: 21,
                        cx: "50%",
                        cy: "50%",
                    },
                    style: {
                        width: 46,
                        height: 46,
                        position: "absolute",
                        top: "calc(50% - 23px)",
                        left: "calc(50% - 23px)",
                    },
                }}
            />
        </LoaderContainer>
    );
};
