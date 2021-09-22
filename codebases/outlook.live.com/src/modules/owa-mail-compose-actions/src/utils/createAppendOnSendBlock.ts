import type BodyType from 'owa-service/lib/contract/BodyType';

const APPENDONSEND_ID = '<div id=appendonsend></div>';

export default function createAppendOnSendBlock(bodyType: BodyType): string {
    let appendOnSendBlock = '';
    if (bodyType == 'HTML') {
        appendOnSendBlock += APPENDONSEND_ID;
    }
    return appendOnSendBlock;
}
