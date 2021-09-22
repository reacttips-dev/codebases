import { watermarkService } from "common/services/watermarkService";

export default () => {
    return {
        chart: {
            events: {
                load: function () {
                    watermarkService.add.call(this, { opacity: 0.1 });
                },
            },
        },
    };
};
