// ─── Zero-dependency terminal colors ─────────────────────────────────────────
const supportsColor = process.stdout.isTTY && !process.env.NO_COLOR;

function code(open, close) {
  if (!supportsColor) return (s) => s;
  return (s) => `\x1b[${open}m${s}\x1b[${close}m`;
}

const c = {
  bold:      code(1, 22),
  dim:       code(2, 22),
  red:       code(31, 39),
  green:     code(32, 39),
  yellow:    code(33, 39),
  blue:      code(34, 39),
  magenta:   code(35, 39),
  cyan:      code(36, 39),
  white:     code(37, 39),
  gray:      code(90, 39),
  bgRed:     code(41, 49),
  bgGreen:   code(42, 49),
  bgYellow:  code(43, 49),
  bgCyan:    code(46, 49),
};

// Compose helpers
c.redBold     = (s) => c.red(c.bold(s));
c.greenBold   = (s) => c.green(c.bold(s));
c.yellowBold  = (s) => c.yellow(c.bold(s));
c.blueBold    = (s) => c.blue(c.bold(s));
c.magBold     = (s) => c.magenta(c.bold(s));
c.cyanBold    = (s) => c.cyan(c.bold(s));
c.whiteBold   = (s) => c.white(c.bold(s));
c.critBg      = (s) => c.bgRed(c.whiteBold(s));
c.highBg      = (s) => c.bgYellow(c.bold(s));
c.infoBg      = (s) => c.bgCyan(c.bold(s));
c.okBg        = (s) => c.bgGreen(c.bold(s));

module.exports = c;
