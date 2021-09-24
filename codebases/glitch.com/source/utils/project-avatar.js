/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const sample = require('lodash/sample');
const randomColor = require('randomcolor');
const Model = require('../model');
const Shapes = require('../data/project-avatar-paths');

const AVATAR_SIZE = 200;

function canvasSetup() {
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = AVATAR_SIZE * dpr;
    canvas.height = AVATAR_SIZE * dpr;
    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);
    context.fillStyle = randomColor({
        luminosity: 'light'
    });
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    return [canvas, context];
}

function randomShape(obj) {
    return sample(Object.values(obj));
}

function drawAvatar() {
    const [canvas, context] = canvasSetup();

    const mask = randomShape(Shapes.masks);
    const combo = randomShape(Shapes.combos);
    const diff = randomShape(Shapes.diffs);
    const shape = randomShape(Shapes.shapes);

    context.fillStyle = randomColor({
        luminosity: 'bright'
    });
    context.fill(new Path2D(mask));

    context.fillStyle = randomColor();
    context.fill(new Path2D(Math.random() >= 0.5 ? combo : diff));

    context.fillStyle = randomColor({
        luminosity: 'dark'
    });
    context.fill(new Path2D(shape));

    return canvas;
}

module.exports = /* istanbul ignore next */ (I, self) => {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);

    return self.extend({
        random() {
            const randomAvatarCanvas = drawAvatar();

            // eslint-disable-next-line func-names
            return new Promise((resolve, reject) => {
                try {
                    return randomAvatarCanvas.toBlob((blob) => resolve(blob));
                } catch (error) {
                    /* istanbul ignore next */
                    return reject(error);
                }
            });
        },
    });
};