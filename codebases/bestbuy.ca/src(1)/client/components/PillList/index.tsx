import * as React from "react";
import * as styles from "./styles.css";
import {Close} from "@bbyca/bbyca-components";

interface PillListProps {
    className?: string;
    pills: Pill[];
    onClear: (e) => void;
    language: Language;
}

export interface Pill {
    name: string;
    onClose: (e) => void;
}

const messages = {
    en: "Clear filters",
    fr: "Supprimer les filtres",
};

const PillList: React.FC<PillListProps> = ({pills = [], className = "", onClear, language}) =>
    pills.length > 0 ? (
        <div className={className}>
            <ul className={styles.container}>
                {pills.map((pill, index) => {
                    return (
                        <li className={styles.pill} key={`pill-${index}`}>
                            {pill.name}
                            <button className={styles.removeBtn} onClick={pill.onClose}>
                                <Close className={styles.remove} viewBox={"0 0 32 32"} />
                            </button>
                        </li>
                    );
                })}
                {pills.length >= 2 && (
                    <li className={styles.clearAll}>
                        <button onClick={onClear}>{messages[language]}</button>
                    </li>
                )}
            </ul>
        </div>
    ) : null;

export default PillList;
