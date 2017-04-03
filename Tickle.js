//
// Tickle.js -- forked from countUp.js by @inorganik
//
//

var $ = require('Dollar.js');

var default_options = {
  useEasing:    true,           // toggle easing
  duration_ms:  2000,           // animation duration
  prefix:       '',             // optional text before the result
  suffix:       '',             // optional text after the result
  separator:    '',             // character to use as a separator
  easingFn:     easeOutExpo,    // optional custom easing function, default is Robert Penner's easeOutExpo
  formattingFn: formatNumber,   // optional custom formatting function, default is formatNumber above
};

function formatNumber(num, opts) {
  for (var _n = '', n = (Math.round(num) + ''); n.length > 0; n = n.slice(0, -3)) {
    _n = n.slice(-3) + opts.separator + _n;
  }
  return opts.prefix + _n.slice(0, -1) + opts.suffix;s
}
function easeOutExpo(t) {
  return (t==1) ? 1 : 1 - Math.pow(2, -10 * t);
}
function print(el_wrapper, num, opts) {
  el_wrapper.innerHTML = (opts.formattingFn)(num, opts);
}


function init(el_wrapper, end_value, opts) {
  opts = $.extend(default_options, opts);

  var t_start;
  var raf_id;
  var duration = opts.duration_ms;

  function start() {
    stop();
    t_start = performance.now();
    enqueue();
  }
  function enqueue() {
    raf_id = requestAnimationFrame(update);
  }
  function stop() {
    cancelAnimationFrame(raf_id);
  }

  function update(t) {
    t = opts.easingFn((t - t_start) / duration).toFixed(2);
    var cur_val = Math.min(end_value * t, end_value);
    print(el_wrapper, cur_val, opts);

    if (t < 1.0) {
      enqueue();
    }
  }

  return {
    play: start,
    stop: stop,
  };
};

module.exports = init;
