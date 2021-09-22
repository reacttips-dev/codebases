import type CharmInfo from '../schema/CharmInfo';

/*The dot charm can be found using:
 * https://ow1.res.office365.com/assets-calendar-eventicons/v1.0/assets/svg/dot.svg
 */
export const defaultCharmId: number = 0;

export function getNoCharmInfoObject(): CharmInfo {
    let noneCharm = {
        Name: 'none',
        IconId: defaultCharmId,
        Keywords: [''],
        IsInDefaultSet: false,
        SvgFile: '',
        SvgHtmlText:
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 17 17">' +
            '  <defs>' +
            '    <style>' +
            '      .cls-1 {' +
            '        fill: none;' +
            '      }' +
            '      .cls-2 {' +
            '        fill: black;' +
            '      }' +
            '    </style>' +
            '  </defs>' +
            '  <g id="dot" transform="translate(0 17)">' +
            '    <path id="Path_89" data-name="Path 89" class="cls-2" d="M8.5-11.687a3.063,3.063,0,0,1,1.237.253,3.256,3.256,0,0,1,1.013.685,3.256,3.256,0,0,1,.685,1.013A3.062,3.062,0,0,1,11.688-8.5a3.062,3.062,0,0,1-.253,1.237A3.256,3.256,0,0,1,10.75-6.25a3.256,3.256,0,0,1-1.013.685A3.063,3.063,0,0,1,8.5-5.312a3.063,3.063,0,0,1-1.237-.253A3.256,3.256,0,0,1,6.25-6.25a3.256,3.256,0,0,1-.685-1.013A3.062,3.062,0,0,1,5.313-8.5a3.062,3.062,0,0,1,.253-1.237A3.256,3.256,0,0,1,6.25-10.75a3.256,3.256,0,0,1,1.013-.685A3.063,3.063,0,0,1,8.5-11.687Z" transform="translate(0 0)"/>' +
            '  </g>' +
            '</svg>',
    } as CharmInfo;

    return noneCharm;
}

export default getNoCharmInfoObject;
