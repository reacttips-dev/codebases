import { positionErrorCode } from "../../constants";

const positionOptions: PositionOptions = {
    maximumAge: 1000 * 60 * 60,
};

export default function geolocate(): Promise<Position> {
    return new Promise((resolve, reject) => {
        let error = { code: positionErrorCode.timeout };
        const getCurrentPositionTimeout = setTimeout(() => {
            if (error) {
                reject(error);
            }
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                error = undefined;
                clearTimeout(getCurrentPositionTimeout);
                resolve(position);
            },
            (e: PositionError) => {
                error = e;
                clearTimeout(getCurrentPositionTimeout);
                reject(error);
            },
            positionOptions,
        );
    });
}
