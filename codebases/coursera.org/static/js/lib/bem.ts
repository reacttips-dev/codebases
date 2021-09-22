import BEMHelper from 'react-bem-helper';

/**
 * @deprecated Please use Emotion: https://coursera.atlassian.net/wiki/spaces/EN/pages/1481310277/Styling+Components+with+Emotion
 *
 * BEM helper to use with react className
 * ======================================
 *
 * http://getbem.com/naming/
 * https://lorefnon.me/2016/04/04/embracing-bem-methodology-in-react-applications.html
 * https://medium.com/@GarrettLevine/react-components-b-e-m-168f199f35b
 *
 * Usage example:
 * import initBem from 'js/lib/bem';
 * ...
 * const bem = initBem('ComponentName');
 * ...
 * <div className={bem()}>
 *   <div className={bem('nav', { expanded: true })}>...</div>
 *   // OR <div className={bem('nav', 'expanded')}>...</div>
 *   // OR <div className={bem('nav', { expanded: true, disabled: false })}>...</div>
 *   // OR with other props: <div className={bem('nav', ['expanded', 'active'])}>...</div>
 * </div>
 *
 * It will produce
 * <div className="rc-ComponentName">
 *   <div className="rc-ComponentName__nav rc-ComponentName__nav--expanded">...</div>
 * </div>
 *
 * You can then write the following styles for it:
 * .rc-ComponentName
 *   &__nav
 *     display none
 *     &--expanded
 *       display block
 *
 * You can add third parameter with extra class names. That might be string, array or object.
 * bem('nav', '', 'extra'); // => rc-ComponentName__nav extra
 * bem('nav', '', ['extra1', 'extra2]); // => rc-ComponentName__nav extra1 extra2
 * bem('nav', '', { extra1: true, extra2: false }); // => rc-ComponentName__nav extra1
 *
 */
const initBem = (componentName: string) =>
  new BEMHelper({
    name: componentName,
    prefix: 'rc-',
    outputIsString: true,
  });

export default initBem;
