import celebrateSvg from '../resources/celebrate.svg';
import celebrateJson from '../resources/celebrate.json';
import heartSvg from '../resources/heart.svg';
import heartJson from '../resources/heart.json';
import laughSvg from '../resources/laugh.svg';
import laughJson from '../resources/laugh.json';
import likeSvg from '../resources/like.svg';
import likeJson from '../resources/like.json';
import sadSvg from '../resources/sad.svg';
import sadJson from '../resources/sad.json';
import surprisedSvg from '../resources/surprised.svg';
import surprisedJson from '../resources/surprised.json';

const ANIMATED_REACTION_RESOURCES = {
    celebrate: celebrateJson,
    heart: heartJson,
    laugh: laughJson,
    like: likeJson,
    sad: sadJson,
    surprised: surprisedJson,
};

const STATIC_REACTION_RESOURCES = {
    celebrate: celebrateSvg,
    heart: heartSvg,
    laugh: laughSvg,
    like: likeSvg,
    sad: sadSvg,
    surprised: surprisedSvg,
};

export default function getReactionResourceData(
    reactionType: string,
    isAnimated: boolean
): any | null {
    return (
        (isAnimated ? ANIMATED_REACTION_RESOURCES : STATIC_REACTION_RESOURCES)[reactionType] ?? null
    );
}
