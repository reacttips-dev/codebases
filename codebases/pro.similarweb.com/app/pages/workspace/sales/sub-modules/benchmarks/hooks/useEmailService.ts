import React from "react";
import dateTimeService from "services/date-time/dateTimeService";
import createEmailService from "../services/email/emailService";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";
import useLeaderboardService from "../hooks/useLeaderboardService";

const useEmailService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);
    const leaderboardService = useLeaderboardService();

    return React.useMemo(() => {
        return createEmailService(benchmarkItemService, leaderboardService, dateTimeService);
    }, [benchmarkItemService]);
};

export default useEmailService;
