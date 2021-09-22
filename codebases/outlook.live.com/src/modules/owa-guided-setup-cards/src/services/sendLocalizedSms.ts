import { makePostRequest } from 'owa-ows-gateway';
import type { SendSmsRequest } from '../store/schema/SendSmsRequest';
import type { SendSmsResponse } from '../store/schema/SendSmsResponse';
const ASG_PROXY_SEND_SMS_URL: string = 'ows/api/beta/AsgSmsProxy/SendSMS';

export default function sendLocalizedSms(sendSmsRequest: SendSmsRequest): Promise<SendSmsResponse> {
    return makePostRequest(ASG_PROXY_SEND_SMS_URL, sendSmsRequest);
}
