import spriteStyles from 'owa-sprite/dist/styles/fileType_sprite.css';

// sprite class prefix
const FILE_SPRITE_PREFIX: string = 'fileType-icon';

// helper function to get sprite class name from icon name
function getFileIconSprite(icon: string): string {
    return FILE_SPRITE_PREFIX + '-' + icon;
}

export default function getFileSpriteIconClass(icon: string): string {
    return spriteStyles[getFileIconSprite(icon)];
}
