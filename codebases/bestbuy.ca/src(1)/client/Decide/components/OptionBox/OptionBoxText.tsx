import * as React from "react";

import {classname} from "utils/classname";

import * as styles from "./styles.css";
import OptionBox from "./OptionBox";

interface Props {
    text: React.ReactNode;
    price?: React.ReactNode;
    isSelected: boolean;
    dataAutomation?: string;
    onClick?: (evt: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    disabled?: boolean;
}

const OptionBoxText: React.FC<Props> = ({
    className = "",
    dataAutomation = "",
    isSelected,
    onClick,
    price,
    text,
    disabled = false,
}: Props) => {
    return (
        <OptionBox
            className={className}
            dataAutomation={dataAutomation}
            isSelected={isSelected}
            onClick={onClick}
            disabled={disabled}>
            {!!price ? (
                <>
                    <p data-automation="option-box-text" className={styles.text}>
                        {text}
                    </p>
                    <p data-automation="option-box-price" className={styles.price}>
                        {price}
                    </p>
                </>
            ) : (
                <p data-automation="option-box-text" className={classname([styles.text, styles.flexCenter])}>
                    {text}
                </p>
            )}
        </OptionBox>
    );
};

export default OptionBoxText;
