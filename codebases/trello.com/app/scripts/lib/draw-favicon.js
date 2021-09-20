/* eslint-disable
    eqeqeq,
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// http://stackoverflow.com/a/3368118/62055
const roundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
  if (stroke == null) {
    stroke = true;
  }
  if (radius == null) {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    return ctx.fill();
  }
};

module.exports.drawFavicon = function (img, options) {
  let ctx;
  if (options == null) {
    options = {};
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;

  if (
    (ctx =
      typeof canvas.getContext === 'function'
        ? canvas.getContext('2d')
        : undefined) == null
  ) {
    throw Error("Can't render to the canvas!");
  }

  ctx.save();

  if (img != null) {
    roundRect(ctx, 0, 0, 64, 64, 8, false, false);
    ctx.clip();

    if (options.tiled) {
      ctx.drawImage(img, 0, 0);
    } else {
      const { width, height } = img;
      if (width > height) {
        ctx.drawImage(img, 0, 0, (64 * width) / height, 64);
      } else {
        ctx.drawImage(img, 0, 0, 64, (64 * height) / width);
      }
    }
  } else {
    if (options.useDefault) {
      const defaultFill = ctx.createLinearGradient(0, 0, 0, 32);
      defaultFill.addColorStop(0, '#298FCA');
      defaultFill.addColorStop(1, '#0079BF');
      ctx.fillStyle = defaultFill;
    } else {
      ctx.fillStyle =
        options.color != null ? options.color : Backgrounds.blue.color;
    }

    roundRect(ctx, 0, 0, 64, 64, 12, true);
  }

  ctx.fillStyle = '#fff';

  roundRect(ctx, 9, 9, 19, 44, 6, true);
  roundRect(ctx, 36, 9, 19, 29, 6, true);

  ctx.restore();

  if (options.hasNotifications) {
    const radius = 15;
    ctx.beginPath();
    ctx.arc(64 - radius, radius, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#EB5A46';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.closePath();
  }

  return canvas.toDataURL('image/png');
};
