import type { IIconProps } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import {
    Reaction_Like_Text,
    Reaction_Heart_Text,
    Reaction_Celebrate_Text,
    Reaction_Laugh_Text,
    Reaction_Surprised_Text,
    Reaction_Sad_Text,
} from './reactions.locstring.json';
import loc from 'owa-localize';

export const EmojiIcon: IIconProps = { iconName: ControlIcons.Emoji2 };

export interface ReactionInfo {
    localizedName: string;
    icon: string;
}

export const ReactionsMap: { [key: string]: ReactionInfo } = Object.freeze({
    like: { icon: '👍', localizedName: loc(Reaction_Like_Text) },
    heart: { icon: '❤️', localizedName: loc(Reaction_Heart_Text) },
    celebrate: { icon: '🎉', localizedName: loc(Reaction_Celebrate_Text) },
    laugh: { icon: '😄', localizedName: loc(Reaction_Laugh_Text) },
    surprised: { icon: '😲', localizedName: loc(Reaction_Surprised_Text) },
    sad: { icon: '😢', localizedName: loc(Reaction_Sad_Text) },
});
