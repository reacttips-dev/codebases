import React from "react";
import * as styles from "./styles";
import dateTimeService from "services/date-time/dateTimeService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useSalesSettingsHelper } from "../../../../services/salesSettingsHelper";

type MyListsPageHeaderProps = {};

const MyListsPageHeader: React.FC<MyListsPageHeaderProps> = () => {
    const translate = useTranslation();
    const lastSnapshotDate = useSalesSettingsHelper().getLastSnapshotDate();
    const date = React.useMemo(() => {
        return dateTimeService.formatWithMoment(lastSnapshotDate, "MMM YYYY");
    }, [lastSnapshotDate]);

    return (
        <styles.StyledHeaderContainer>
            <styles.StyledHeaderTitle>
                {translate("si.pages.my_lists.title")}
            </styles.StyledHeaderTitle>
            <styles.StyledHeaderContent>
                <styles.StyledHeaderDescription>
                    {translate("si.pages.my_lists.description", {
                        date,
                    })}
                </styles.StyledHeaderDescription>
            </styles.StyledHeaderContent>
        </styles.StyledHeaderContainer>
    );
};

export default MyListsPageHeader;
