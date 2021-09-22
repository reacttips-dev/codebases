import getOwaResourceUrl from './getOwaResourceUrl';

export default function getOwaResourceImageUrl(imageName: string) {
    return getOwaResourceUrl('resources/images/' + imageName);
}
