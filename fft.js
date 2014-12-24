// refs http://d.hatena.ne.jp/ku-ma-me/20111124/p1#20111124f1

var fft = function(a) {
  var result = [];

  var n = a.length;
  for (var i = 0; i < n; i++) {
    result[i] = new Complex(a[i], 0);
  }
  return fftCore(result);
};

var fftCore = function(a) {
  var n = a.length;
  if (n == 1) {
    return a;
  }

  var a1 = [];
  for (var i = 0; i < Math.floor(n / 2); i++) {
    a1[i] = a[i].add(a[i + Math.floor(n / 2)]);
  }
  a1 = fftCore(a1);

  var a2 = [];
  for (var i = 0; i < Math.floor(n / 2); i++) {
    a2[i] = (a[i].sub(a[i + Math.floor(n / 2)]))
            .mul(new Complex(Math.cos(-2 * Math.PI * i / n),
                             Math.sin(-2 * Math.PI * i / n)));
  }
  a2 = fftCore(a2);

  var result = [];
  for (var i = 0; i < Math.floor(n / 2); i++) {
    result.push(a1[i]);
    result.push(a2[i]);
  }
  return result;
};

var ifft = function(a) {
  var result = [];

  var n = a.length;
  for (var i = 0; i < n; i++) {
    result[i] = a[i].conj();
  }
  result = fftCore(result);

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
