export default function isValidCoupon(expiryDateTimeStamp: string, nowDateTimeStamp: number) {
    // A coupon is considered valid if it hasn't expired
    return new Date(expiryDateTimeStamp) > new Date(nowDateTimeStamp);
}
