import validTours from '../constants/validTours';
export default function isTourValid(tourAlias) {
  return validTours[tourAlias];
}