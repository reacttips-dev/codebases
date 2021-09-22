import { useEffect, useState } from "react";
import { PreferencesService } from "services/preferences/preferencesService";
import { useSelector } from "react-redux";

export const EDUCATION_BAR_PREFERENCES_KEY = "hide_education_bar";

declare const window;

const educationHook = (
    hideEducationValue = PreferencesService.get(EDUCATION_BAR_PREFERENCES_KEY) || false,
): [boolean, boolean, (iconValue: boolean, barValue: boolean) => void] => {
    const currentPage = useSelector((state) => {
        const {
            routing: { currentPage },
        } = state;
        return currentPage;
    });

    const [iconValue, setIconValue] = useState(hideEducationValue);
    const [educationValue, setEducationValue] = useState(!hideEducationValue);

    useEffect(() => {
        const showIcon = !!window.education?.[currentPage] && hideEducationValue;
        setIconValue(showIcon);
    }, [currentPage]);

    const setValue = async (iconValue, barValue) => {
        await PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: !barValue });
        setIconValue(iconValue);
        setEducationValue(barValue);
    };
    return [
        iconValue,
        educationValue,
        (iconValue, barValue) => {
            setValue(iconValue, barValue);
        },
    ];
};

export default educationHook;
