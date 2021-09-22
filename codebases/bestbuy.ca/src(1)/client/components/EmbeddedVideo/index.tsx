import * as React from "react";
import styles from "./style.css";
import withAgeGate from "components/AgeGate";

interface EmbeddedVideoProps {
    url: string;
    title?: string;
}

export const EmbeddedVideo: React.FunctionComponent<EmbeddedVideoProps> = ({url, title}) => {
    return url.length ? (
        <div className={styles.videoAspectContainer}>
            <iframe
                className={styles.videoIframe}
                src={url}
                frameBorder={0}
                allow={"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}
                allowFullScreen={true}
                title={title}
            />
        </div>
    ) : null;
};

export default withAgeGate(EmbeddedVideo);
