import propertyUri from 'owa-service/lib/factory/propertyUri';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import addAdditionalPropertiesToResponseShape from '../utils/addAdditionalPropertiesToResponseShape';
import isAmpEnabled from './isAmpEnabled';

/**
 * Configure item response shape for AMP
 * It essentially adds an additional property
 *
 */
export default function configItemResponseShapeForAmp(itemResponseShape: ItemResponseShape) {
    // Add the property for AMP
    if (isAmpEnabled()) {
        addAdditionalPropertiesToResponseShape(itemResponseShape, [
            propertyUri({ FieldURI: 'AmpHtmlBody' }),
        ]);
    }
}
