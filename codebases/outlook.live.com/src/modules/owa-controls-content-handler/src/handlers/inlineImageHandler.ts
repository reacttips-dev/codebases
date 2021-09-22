import type { ContentHandler } from 'owa-controls-content-handler-base';
import { lazyLoadFromImageTag } from 'owa-inline-image-loader';
import {
    INLINEIMAGE_ATTRIBUTE_DATA_CUSTOM,
    INLINEIMAGE_ATTRIBUTE_ORIGINALSRC,
} from 'owa-inline-image-consts';

// The handler only acts on img tags that have either data-custom attribute or originalsrc
// data-custom indicates an inline image from attachment
// originalsrc indicates an external image sourced through proxy, or an image there is an error, i.e. an inline image
// that is supposed to be attachment, but we don't find its attachment id so cannot produce data-custom
const INLINE_IMAGE_HANDLER_SELECTOR = `img[${INLINEIMAGE_ATTRIBUTE_DATA_CUSTOM}],img[${INLINEIMAGE_ATTRIBUTE_ORIGINALSRC}]`;

export const INLINE_IMAGE_HANDLER_NAME = 'inlineImageHandler';

export class InlineImageHandler implements ContentHandler {
    private readonly loadContext: string = '';
    private readonly usePlaceHolder: boolean = false;
    private readonly userIdentity: string = '';
    private readonly delayRevoke: boolean = false;

    public readonly cssSelector = INLINE_IMAGE_HANDLER_SELECTOR;
    public readonly keywords = null;

    constructor(
        context?: string,
        usePlaceHolder?: boolean,
        userIdentity?: string,
        delayRevoke?: boolean
    ) {
        if (context) {
            this.loadContext = context;
        }

        if (usePlaceHolder) {
            this.usePlaceHolder = usePlaceHolder;
        }

        if (userIdentity) {
            this.userIdentity = userIdentity;
        }

        if (delayRevoke) {
            this.delayRevoke = delayRevoke;
        }
    }

    public readonly handler = (element: HTMLElement, keyword?: string) => {
        lazyLoadFromImageTag
            .import()
            .then(loader =>
                loader(
                    element as HTMLImageElement,
                    this.loadContext,
                    this.usePlaceHolder,
                    this.userIdentity,
                    this.delayRevoke
                )
            );
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        if (this.delayRevoke) {
            elements.forEach(element => {
                const img = element as HTMLImageElement;
                if (img.src?.indexOf('blob:') === 0) {
                    URL.revokeObjectURL(img.src);
                }
            });
        }
    };
}
