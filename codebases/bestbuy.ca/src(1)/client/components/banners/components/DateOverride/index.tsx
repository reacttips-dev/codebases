import * as moment from "moment";
import * as React from "react";
import * as styles from "./styles.css";
import {Form, Input, Button, ChevronDown, Select, ChevronUp} from "@bbyca/bbyca-components";
import {classIf} from "utils/classname";

declare global {
    interface Window {
        globalDateOffset: number;
    }
}

enum TimePeriod {
    AM = "am",
    PM = "pm",
}

export const convertTime12to24 = (time: string, period: TimePeriod) => {
    // tslint:disable-next-line:prefer-const
    let [hours, minutes, seconds] = time.split(":");
    if (hours === "12") {
        hours = "00";
    }
    if (period === TimePeriod.PM) {
        hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}:${seconds}`;
};

export const formatDateStamp = (date: string, period: TimePeriod) => {
    const month = date.substr(0, 2);
    const day = date.substr(2, 2);
    const year = date.substr(4, 4);
    const hour = date.substr(8, 2);
    const minute = date.substr(10, 2);
    const second = date.substr(12, 2);

    const dateString = `${year}-${month}-${day}`;
    const timeString = convertTime12to24(`${hour}:${minute}:${second}`, period);

    return `${dateString}T${timeString}`;
};

const DateOverride: React.FC = () => {
    const setTime = (offset: number) => {
        window.globalDateOffset = offset;
        setCurrentTime(new Date().getTime() - offset);
    };

    const toggleWidget = () => {
        setVisibility(!visible);
    };

    const handleDateSubmit = (type: string, e: React.FormEvent, data: any) => {
        e.preventDefault();
        const formattedDate = new Date(formatDateStamp(data.date.value, data.period.value));
        setTime(new Date().getTime() - formattedDate.getTime());
    };

    const [currentTime, setCurrentTime] = React.useState(new Date().getTime());
    const [visible, setVisibility] = React.useState(true);

    return (
        <div className={styles.dateOverride}>
            <div className={classIf(styles.hidden, !visible)}>
                <div>
                    <span className={styles.label}>Currently Viewing :</span>
                    <p>{moment(currentTime).format("MM/DD/YYYY, h:mm:ssa")}</p>
                </div>
                <Form onSubmit={handleDateSubmit}>
                    <Input
                        className={styles.input}
                        name={"date"}
                        errorMsg={"Please enter a valid date and time, including seconds."}
                        helperTxt={"Format: MM/DD/YYYY - HH:MM:SS"}
                        label={"Date and Time"}
                        formatter={"##/##/####-##:##:##"}
                        type={"text"}
                    />
                    {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                    <Select
                        className={styles.input}
                        name={"period"}
                        errorMsg={"Please select a 12 hour time period"}
                        label={"AM/PM"}>
                        <option value={TimePeriod.AM}>AM</option>
                        <option value={TimePeriod.PM}>PM</option>
                    </Select>
                    {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                    <Button appearance={"secondary"} type={"submit"}>
                        Update
                    </Button>
                </Form>
            </div>
            <div role="button" onClick={toggleWidget} className={styles.icon}>
                {!visible ? <ChevronUp /> : <ChevronDown />}
            </div>
        </div>
    );
};

export default DateOverride;
