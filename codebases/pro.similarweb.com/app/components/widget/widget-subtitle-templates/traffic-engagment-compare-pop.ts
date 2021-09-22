export const getTrafficEngagmentComparePopSubtitle = (forWidget) => `
    <div style="display: flex; flex-direction: row;">
        <div style="background-color: #cacaca;
                    width: 10px;
                    height: 10px;
                    border-radius: 3px;
                    margin: 4px 4px 0 2px;">
            <div style="width: 6px;
                        border-bottom: 1px solid #595959;
                        transform: translateY(3px) translateX(4px) rotate(45deg);"/>
            <div style="width: 10px;
                        border-bottom: 1px solid #595959;
                        transform: translateY(3px) translateX(-1px) rotate(45deg);"/>
            <div style="width: 6px;
                        border-bottom: 1px solid #595959;
                        transform: translateY(4px) translateX(-1px) rotate(45deg);"/>
        </div>
        <div dataAutomation='previous period' style="margin-right: 8px;">${forWidget[1]} </div>
        <div style="background-color: #cacaca;
                    width: 10px;
                    height: 10px;
                    border-radius: 3px;
                    margin: 4px;"/>
        <div dataAutomation='current period'style="margin-right: 8px;">${forWidget[0]}</div>
    </div>
`;
