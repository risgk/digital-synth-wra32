// refs http://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm
// Cooley–Tukey FFT algorithm - Wikipedia, the free encyclopedia

var fft = function(a) {
  var result = [];
  var n = a.length;
  for (var i = 0; i < n; i++) {
    result[i] = new Complex(a[i], 0);
  }
  return ditfft2(result, result.length, 1);
};

var ditfft2 = function(x, n, s) {
  var result = [];
  if (n == 1) {
    result[0] = x[0];
  } else {
    result = result.concat(ditfft2(x,          Math.floor(n / 2), 2 * s));
    result = result.concat(ditfft2(x.slice(s), Math.floor(n / 2), 2 * s));
    for (var k = 0; k <= Math.floor(n / 2) - 1; k++) {
      var t = result[k];
      var omega = new Complex(Math.cos(-2 * Math.PI * k / n), Math.sin(-2 * Math.PI * k / n));
      result[k]                     = t.add(omega.mul(result[k + Math.floor(n / 2)]));
      result[k + Math.floor(n / 2)] = t.sub(omega.mul(result[k + Math.floor(n / 2)]));
    }
  }
  return result;
};

var ifft = function(a) {
  var result = [];
  var n = a.length;
  for (var i = 0; i < n; i++) {
    result[i] = a[i].conj();
  }
  result = ditfft2(result, result.length, 1);
  for (var i = 0; i < n; i++) {
    result[i] = result[i].conj().real / n;
  }
  return result;
};

var lpf = function(a, k) {
  var result = [];
  var n = a.length;
  for (var i = 0; i < n; i++) {
    result[i] = a[i];
  }
  for (var i = k + 1; i <= Math.floor(n / 2); i++) {
    result[i] = new Complex(0, 0);
    result[n - i] = new Complex(0, 0);
  }
  return result;
};
