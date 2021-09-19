/**
 * This is a component that throws an error when it tries to render.
 *
 * It is served by /s/e/c/r/e/t/r/o/u/t/e so we can programaticially test that the application error fallbacks work.
 * It can also be included in a page through Symphony (e.g., /c/examplebrokencomponent ).
 */
import ExecutionEnvironment from 'exenv';

export default function BrokenPage(props) {
  const { slotDetails = {} } = props;
  if (slotDetails.ignoreOnServerRendering && !ExecutionEnvironment.canUseDOM) {
    return <div>BrokenPage does not break on ServerSide rendering (ignoreOnServerRendering is true)</div>;
  }
  return <div>{[][1]['Deliberate Error From BrokenPage Component']}</div>;
}
