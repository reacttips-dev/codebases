/**
  ***************************************************
  * Cart Types
  ***************************************************
**/
export const MIXED_WITH_EGC = 'MIXED_WITH_EGC'; // retail items + egc
export const MIXED_WITH_PHYSICAL = 'MIXED_WITH_PHYSICAL'; // retail items + physical gc
export const MIXED_WITH_BOTH_GC = 'MIXED_WITH_BOTH_GC'; // retail items + physical gc + egc
export const NON_MIXED_WITH_BOTH_GC = 'NON_MIXED_WITH_BOTH_GC'; // no retail items, has both egc and physical gc
export const RETAIL_ONLY_CART = 'RETAIL_ONLY_CART'; // retail items only
export const DIGITAL_GC_ONLY_CART = 'DIGITAL_GC_ONLY_CART'; // egc only
export const PHYSICAL_GC_ONLY_CART = 'PHYSICAL_GC_ONLY_CART'; // physical gc only
