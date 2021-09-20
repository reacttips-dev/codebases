//   █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗███████╗██████╗
//  ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝╚══███╔╝██╔════╝██╔══██╗
//  ███████║██╔██╗ ██║███████║██║   ╚████╔╝   ███╔╝ █████╗  ██████╔╝
//  ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝   ███╔╝  ██╔══╝  ██╔══██╗
//  ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████╗███████╗██║  ██║
//  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝
//
// Analyze a set of "tokens" and group them together based on functionality.
// Tokens come from the "Tokenizer" helper which is responsible for taking a
// deeply nested Waterline Statement and breaking it down into a flat list
// of keyed tokens that are easier to parse and work with.
//
// Once the tokens have been created the analyzer goes through and groups the
// tokens into discrete pieces of query logic. These groups are then used by
// other helpers such as the SQL builder or Mongo query builder to generate a
// native query. The point of the analyzer isn't to re-create the orignal nested
// statement but to group related pieces of the query that will be processed as
// chunks. So an OR clause will have each set in the clause grouped or a subquery
// will have it's contents grouped.
//
// In most cases this will not be implemented by adapter authors but will be used
// inside a database driver's `compileStatement` machine.

var _ = require('@sailshq/lodash');

module.exports = function analyzer(tokens) {

  if (!tokens) {
    throw new Error('Missing tokens argument.');
  }

  // If any of these identifiers is encountered, push a new array onto the stack.
  // When the subsequent "ENDIDENTIFIER" is encountered, pop the array off.
  var WRAPPED_IDENTIFIERS = [
    'JOIN',
    'INNERJOIN',
    'OUTERJOIN',
    'CROSSJOIN',
    'LEFTJOIN',
    'LEFTOUTERJOIN',
    'RIGHTJOIN',
    'RIGHTOUTERJOIN',
    'FULLOUTERJOIN'
  ];

  // If any of these conditions is encountered, push them onto the current stack.
  var OUTPUTTING_CONDITIONS = [
    'NOT',
    'IN',
    'NOTIN',
    'AND'
  ];

  // Analyze the tokens and return the result
  var result = (function analyzer(tokens) {

    // Start a stack with one array in it.  That array will hold the final result.
    // As tokens which require nesting are encountered, more arrays will be pushed
    // onto `stack`.  Tokens that don't require nesting are pushed directly onto
    // the last array in the stack, referenced by `curChunk`.
    var stack = [[]];

    // Reference to the current writable chunk.
    var curChunk;

    // Another stack to keep track of union/subquery madness.  See comments in
    // the UNION, ENDUNION, SUBQUERY and ENDSUBQUERY branches of the `switch` below.
    var unionSubqueryStack = [];

    // Function to push a new array onto the stack, and set `curChunk` to that array,
    // so that new tokens will added there there until `popStack` is called.
    var pushStack = function() {
      curChunk = [];
      stack.push(curChunk);
    };

    // Function to pop a chunk off the stack and fold it into the last array remaining in the stack,
    // which then becomes `curChunk`.
    var popStack = function() {
      stack.pop();
      _.last(stack).push(curChunk);
      curChunk = _.last(stack);
    };

    // Loop through the tokens.
    _.each(tokens, function(token) {

      switch (token.type) {

        // Each IDENTIFIER token gets its own array, of which the token is the first element.
        case 'IDENTIFIER':
          pushStack();
          curChunk.push(token);
          // If this is one of the "wrapped" identifiers, then add another level of nesting for it.
          if (_.contains(WRAPPED_IDENTIFIERS, token.value)) {
            pushStack();
          }
          break;

        // CONDITION tokens don't get their own array, but some of them (like AND and IN) are outputted
        // to the current chunk.
        case 'CONDITION':
          if (_.contains(OUTPUTTING_CONDITIONS, token.value)) {
            curChunk.push(token);
          }
          break;

        // The UNION token gets its own array and, like wrapped identifiers, gets another level of nesting
        // besides.  Each UNION token is followed by one or more subquery groups, but we don't want those
        // subquery groups to output a SUBQUERY token into the current chunk like they normally would.
        // We push "UNION" onto `unionSubqueryStack` to indicate that the immediate ancestor of the next
        // subquery group is a union, so that the analyzer behaves accordingly.
        case 'UNION':
          pushStack();
          curChunk.push(token);
          pushStack();
          unionSubqueryStack.push('UNION');
          break;

        // Pop the "UNION" string off the `unionSubqueryStack` to reset the behaviour when encountering
        // subquery groups, then pop two levels off the main stack to account for those that we pushed
        // when we saw the UNION token.
        case 'ENDUNION':
          unionSubqueryStack.pop();
          popStack();
          popStack();
          break;

        // So long as we're not immediately inside of a union group, a SUBQUERY token will get pushed
        // onto the current stack, and then get another level of nesting.  Otherwise, it's ignored.
        // Either way, we'll push "SUBQUERY" onto `unionSubqueryStack` so that any nested subqueries
        // will be treated appropriately.
        case 'SUBQUERY':
          if (unionSubqueryStack.length === 0 || _.last(unionSubqueryStack) === 'SUBQUERY') {
            curChunk.push(token);
            pushStack();
          }
          unionSubqueryStack.push('SUBQUERY');
          break;

        // As above; if this is a normal subquery, then pop a level off the main stack to account for the
        // one we added when we saw the SUBQUERY token.  Either way, pop the `unionSubqueryStack` so that
        // subsequent behavior when encoutnering a SUBQUERY token is correct.
        case 'ENDSUBQUERY':
          unionSubqueryStack.pop();
          if (unionSubqueryStack.length === 0 || _.last(unionSubqueryStack) === 'SUBQUERY') {
            popStack();
          }
          break;

        // GROUP tokens don't get outputted, but they do cause a new level of nesting to pushed onto
        // the main stack.
        case 'GROUP':
          pushStack();
          break;

        // Pop the main stack to account for the level added when the GROUP token was encountered.
        case 'ENDGROUP':
          popStack();
          break;

        default:
          // Is this the "END" token of an identifier?
          if (token.type === 'ENDIDENTIFIER') {
            // Pop one level off the stack.
            popStack();
            // Is the identifier we're ending a "wrapped" token?
            // If so, pop another level off the stack to account for the wrapping.
            if (_.contains(WRAPPED_IDENTIFIERS, token.value)) {
              popStack();
            }
            break;
          }

          // All other "END" tokens (like ENDCONDITION) can be ignored.
          if (token.type.substr(0,3) === 'END') {
            break;
          }

          // All other tokens (like KEY and VALUE) are outputted to the current chunk.
          curChunk.push(token);

      }

    });

    // The stack should now be completely collapsed into one (possibly nested) array item.  If not, we've got issues.
    if (stack.length > 1) {
      throw new Error('Consistency violation: final stack in analyzer contains more than one item.  Stack is: ', require('util').inspect(stack, {depth: null}));
    }

    // Return the result.
    return stack[0];

  })(tokens); // </analyzer>

  // Return the result from the analyzer.
  return result;

};
