import type {
    default as BroadComponentType,
    MemoWrapped,
    ReffableComponent,
} from '../types/BroadComponentType';

// Used for recognizing a component as forward-reffable.
// Must be kept in sync with the react.forwardRef symbol definitions.
//
// See https://github.com/facebook/react/blob/master/packages/shared/ReactSymbols.js
const hasSymbol = typeof Symbol === 'function' && (Symbol as any).for;
const forwardRefSymbol = hasSymbol ? (Symbol as any).for('react.forward_ref') : 0xead0;
const memoSymbol = hasSymbol ? (Symbol as any).for('react.memo') : 0xead3;

/**
 * Checks if a component can accept a reference
 */
const canComponentAcceptRef = <TProps, TRef>(
    ComponentType: BroadComponentType<TProps, TRef>
): ComponentType is
    | ReffableComponent<TProps, TRef>
    | MemoWrapped<ReffableComponent<TProps, TRef>> =>
    ComponentType !== undefined &&
    // Class components
    !!(
        (ComponentType instanceof Function &&
            ComponentType.prototype &&
            ComponentType.prototype.render) ||
        // Ref forwarding components
        ((ComponentType as any).$$typeof && (ComponentType as any).$$typeof == forwardRefSymbol) ||
        // Memo'd components -- recursively check the inner wrapped component.
        ((ComponentType as any).$$typeof &&
            (ComponentType as any).$$typeof == memoSymbol &&
            canComponentAcceptRef((ComponentType as any).type))
    );

export default canComponentAcceptRef;
