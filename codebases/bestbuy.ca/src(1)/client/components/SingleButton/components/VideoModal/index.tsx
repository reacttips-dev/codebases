import * as React from "react";
import {Modal} from "@bbyca/bbyca-components";
import EmbeddedVideo from "components/EmbeddedVideo";
import styles from "./style.css";

export interface VideoModalProps {
    ageRestricted?: boolean;
    className?: string;
    isOpen?: boolean;
    onClose: () => void;
    title?: string;
    url: string;
}

const VideoModal: React.FunctionComponent<VideoModalProps> = ({
    ageRestricted,
    className = "",
    isOpen,
    onClose,
    url,
}: VideoModalProps) => {
    const [visible, setVisible] = React.useState(false);
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        if (isOpen) {
            clearTimeout(timerRef.current);
            setVisible(isOpen);
        } else {
            handleClose();
        }
        return () => clearTimeout(timerRef.current);
    }, [isOpen]);

    const handleClose = () => {
        clearTimeout(timerRef.current);
        setVisible(false);
        timerRef.current = window.setTimeout(() => onClose(), 1000);
    };

    return isOpen || visible ? (
        <div className={`${className} ${styles.videoLoader}`}>
            <Modal blockScrollingOnOpen={true} theme={"fullscreen"} visible={visible} onClose={handleClose}>
                <div className={styles.videoContainer}>
                    {isOpen && <EmbeddedVideo url={url} ageRestricted={ageRestricted} />}
                </div>
            </Modal>
        </div>
    ) : null;
};

export default VideoModal;
