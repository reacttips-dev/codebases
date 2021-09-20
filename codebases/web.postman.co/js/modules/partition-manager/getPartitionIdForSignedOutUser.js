/**
 * Return static UUID for logged out User
 * This is derived from a deterministicUUID of (partition:0) where 0 is the signed out user id.
 * Check PartitionManagerLegacy for implementation.
*/
export default function getPartitionIdForSignedOutUser () {
  return '306e0a91-2408-40a6-8284-f796ea30a14a';
}
