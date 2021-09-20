/**
 * GRAMMAR
 *
 * Precomputed permutations of various grammar/formatting opts provided as
 * constants for convenient use with `rttc.getNounPhrase()` and/or `getDisplayType()`.
 * ```
 * role / capitalization
 *   FRAGMENT  ({capitalization: 'fragment'})
 *   SENTENCE  ({completeSentence: true} or {capitalization: 'start'} -- depending on where it's used)
 *   TITLE     ({capitalization: 'title'})
 * plural
 *   SINGULAR  ({plural: false})
 *   PLURAL    ({plural: true})
 * determiner
 *   DEFINITE     ({determiner: 'the'})
 *   INDEFINITE   ({determiner: 'a'})
 *   EXISTENTIAL  ({determiner: 'any'})
 *   UNPRECEDED   ({determiner: ''})
 * ```
 *
 * > Note that this doesn't necessarily include EVERY possible mashup- just the
 * > common ones.  (It deliberately excludes some defaults to avoid redundancy.)
 * >
 * > Also be aware that **NOT EVERY COMBINATION HEREIN IS SUPPORTED** for ALL methods.
 * > Some combos might only be supported for either `.getDisplayTypeLabel()`, while others
 * > only work for `.getNounPhrase()`.  Be sure to do a few examples as thought experiments
 * > any time you pick a grammatical option set, since bad combos fail silently! (No error!)
 *
 * @type {Dictionary}
 */
module.exports = {

  // Basics:
  // =============================================
  DEFINITE:                                      {determiner:'the'},
  INDEFINITE:                                    {determiner:'a'},
  EXISTENTIAL:                                   {determiner:'any'},
  UNPRECEDED:                                    {determiner:''},

  SINGULAR:                                      {plural: false},
  PLURAL:                                        {plural: true},

  FRAGMENT:                                      {capitalization: 'fragment'},
  SENTENCE:                                      {capitalization: 'start', completeSentence: true},
  TITLE:                                         {capitalization: 'title'},

  // 2D Mashups:
  // =============================================
  DEFINITE_PLURAL:                               {determiner:'the', plural: true},
  // *Can't do indefinite plural ("an aardvarks")*  (because we don't have the right aggregator word to build e.g. "a troupe of aardvarks")
  EXISTENTIAL_PLURAL:                            {determiner:'any', plural: true},
  UNPRECEDED_PLURAL:                             {determiner:'', plural: true},

  PLURAL_FRAGMENT:                               {plural: true, capitalization: 'fragment'},
  PLURAL_SENTENCE:                               {plural: true, capitalization: 'start', completeSentence: true},
  PLURAL_TITLE:                                  {plural: true, capitalization: 'title'},

  DEFINITE_FRAGMENT:                             {determiner: 'the', capitalization: 'fragment'},
  INDEFINITE_FRAGMENT:                           {determiner: 'a', capitalization: 'fragment'},
  EXISTENTIAL_FRAGMENT:                          {determiner: 'any', capitalization: 'fragment'},
  UNPRECEDED_FRAGMENT:                           {determiner: '', capitalization: 'fragment'},

  DEFINITE_SENTENCE:                             {determiner: 'the', capitalization: 'start', completeSentence: true},
  INDEFINITE_SENTENCE:                           {determiner: 'a', capitalization: 'start', completeSentence: true},
  EXISTENTIAL_SENTENCE:                          {determiner: 'any', capitalization: 'start', completeSentence: true},
  UNPRECEDED_SENTENCE:                           {determiner: '', capitalization: 'start', completeSentence: true},

  // It never makes sense to use `title` at the same time as the determiner opts,
  // since neither of the methods supports both of them!
  // ```
  // DEFINITE_TITLE:                                {determiner: 'the', capitalization: 'title'},
  // INDEFINITE_TITLE:                              {determiner: 'a', capitalization: 'title'},
  // EXISTENTIAL_TITLE:                             {determiner: 'any', capitalization: 'title'},
  // UNPRECEDED_TITLE:                              {determiner: '', capitalization: 'title'},
  // ```

  // 3D Mashups:
  // =============================================
  DEFINITE_PLURAL_FRAGMENT:                      {determiner: 'the', plural: true, capitalization: 'fragment'},
  // *Can't do indefinite plural (see above)*
  EXISTENTIAL_PLURAL_FRAGMENT:                   {determiner: 'any', plural: true, capitalization: 'fragment'},
  UNPRECEDED_PLURAL_FRAGMENT:                    {determiner: '', plural: true, capitalization: 'fragment'},

  DEFINITE_PLURAL_SENTENCE:                      {determiner: 'the', plural: true, capitalization: 'start', completeSentence: true},
  // *Can't do indefinite plural (see above)*
  EXISTENTIAL_PLURAL_SENTENCE:                   {determiner: 'any', plural: true, capitalization: 'start', completeSentence: true},
  UNPRECEDED_PLURAL_SENTENCE:                    {determiner: '', plural: true, capitalization: 'start', completeSentence: true},

  // It wouldn't make sense to use `title` at the same time as the determiner opts.
  // (See above for explanation.)
  // ```
  // DEFINITE_PLURAL_TITLE:                         {determiner: 'the', plural: true, capitalization: 'title'},
  // // *Can't do indefinite plural (see above)*
  // EXISTENTIAL_PLURAL_TITLE:                      {determiner: 'any', plural: true, capitalization: 'title'},
  // UNPRECEDED_PLURAL_TITLE:                       {determiner: '', plural: true, capitalization: 'title'},
  // ```

};
