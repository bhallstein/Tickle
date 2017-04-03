//
// Tickupto.js -- number ticker, forked from countUp.js by inorganik
//
//

var default_options = {
  value:        1234,           // the value to tick up to
  useEasing:    true,           // toggle easing
  duration_ms:  2000,           // animation duration
  prefix:       '',             // optional text before the result
  suffix:       '',             // optional text after the result
  separator:    '',             // character to use as a separator
  easingFn:     easeOutQuint,   // optional custom easing function, default easeOutQuint
  formattingFn: formatNumber,   // optional custom formatting function, default "1,234"
  renderFn:     print,          // rendering function
};

function extend(obj, add_properties) {
  var o = { };
  for (var i in obj) if (obj.hasOwnProperty(i)) {
    o[i] = obj[i];
  }
  for (var i in add_properties) if (add_properties.hasOwnProperty(i)) {
    o[i] = add_properties[i];
  }
  return o;
}

function formatNumber(num, opts) {
  var sep = opts.separator;
  var n = Math.round(num) + '';
  var length_diff = (opts.value+'').length - n.length;
  n = Array(length_diff + 1).join('0') + n;
  for (var _n = ''; n.length > 0; n = n.slice(0, -3)) {
    _n = n.slice(-3) + sep + _n;
  }
  return opts.prefix + (sep.length ? _n.slice(0, -sep.length) : _n) + opts.suffix;
}
function easeOutQuint(t) {
  return (t=t-1)*t*t*t*t + 1;
}
function print(el_wrapper, str) {
  el_wrapper.innerHTML = str;
}


function init(el_wrapper, opts) {
  opts = extend(default_options, opts);

  var value = opts.value;
  var t_start;
  var raf_id;
  var duration = opts.duration_ms;

  function start() {
    stop();
    t_start = null;
    enqueue();
  }
  function enqueue() {
    raf_id = requestAnimationFrame(update);
  }
  function stop() {
    cancelAnimationFrame(raf_id);
  }

  function update(t) {
    if (t_start === null) {
      t_start = t;
    }
    t = (t - t_start) / duration;
    var _t = opts.easingFn(t);

    var cur_val = Math.min(value * _t, value);
    var str = (opts.formattingFn)(cur_val, opts);
    (opts.renderFn)(el_wrapper, str, t);

    if (cur_val.toFixed(0) < value) {
      enqueue();
    }
  }

  return {
    play: start,
    stop: stop,
  };
};

module.exports = init;
