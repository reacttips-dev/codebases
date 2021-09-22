import type PreviewContext from '../types/PreviewContext';
import { action } from 'satcheljs';

export const previewAttachment = action('previewAttachment', (context: PreviewContext) => ({
    context,
}));
