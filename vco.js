var VCO = function() {
  var that = this;

  this.waveTablesSawtooth = [];
  for (var m = 1; m <= 128; m++) {
    var waveTable = new Float32Array(2048);
    for (var t = 0; t < 2048; t++) {
      var level = 0;
      for (var k = 1; k <= m; k++) {
        level += Math.sin((2 * Math.PI) * (t / 2048) * k) / k;
      }
      waveTable[t] = level / 8;
    }
    that.waveTablesSawtooth[m] = waveTable;
  }

  this.waveTablesSquare = [];
  for (var m = 1; m <= 128; m++) {
    var waveTable = new Float32Array(2048);
    for (var t = 0; t < 2048; t++) {
      var level = 0;
      for (var k = 1; k <= m; k++) {
        if (k % 2 == 1) {
          level += 2 * Math.sin((2 * Math.PI) * (t / 2048) * k) / k;
        }
      }
      waveTable[t] = level / 8;
    }
    that.waveTablesSquare[m] = waveTable;
  }

  this.waveTablesTriangle = [];
  for (var m = 1; m <= 128; m++) {
    var waveTable = new Float32Array(2048);
    for (var t = 0; t < 2048; t++) {
      var level = 0;
      for (var k = 1; k <= m; k++) {
        if (k % 4 == 1) {
          level += (4 / Math.PI) * Math.sin((2 * Math.PI) * (t / 2048) * k) / Math.pow(k, 2);
        } else if (k % 4 == 3) {
          level += (4 / Math.PI) * -Math.sin((2 * Math.PI) * (t / 2048) * k) / Math.pow(k, 2);
        }
      }
      waveTable[t] = level / 8;
    }
    that.waveTablesTriangle[m] = waveTable;
  }

  this.freqTable = [];
  this.freqC4toB4 = []
  for (var i = 0; i <= 11; i++) {
    n = i + 60;
    cent = (n * 100) - 6900;
    hz = 440 * Math.pow(2, cent / 1200);
    that.freqC4toB4[i] = Math.floor((hz * 0x100000000 / SAMPLING_RATE) / 32) * 32;
  }
  for (var n = 0; n <= 127; n++) {
    this.freqTable[n] = Math.floor(that.freqC4toB4[n % 12] * Math.pow(2, Math.floor(n / 12) - 5));
  }

  this.resetPhase = function() {
    this.phase = 0;
  }

  this.setWaveform = function(waveform) {
    switch (waveform) {
    case SAWTOOTH:
      this.waveTables = this.waveTablesSawtooth;
      break;
    case SQUARE:
      this.waveTables = this.waveTablesSquare;
      break;
    case TRIANGLE:
      this.waveTables = this.waveTablesTriangle;
      break;
    }
  }

  this.setCoarseTune = function(coarseTune) {
    this.courseTune = coarseTune;
    this.updateFreq();
  }

  this.coarseTune = function() {
    return this.courseTune;
  }

  this.setFineTune = function(fineTune) {
    this.fineTune = fineTune;
    this.updateFreq();
  }

  this.noteOn = function(noteNumber) {
    this.noteNumber = noteNumber;
    this.updateFreq();
  }

  this.clock = function() {
    this.phase += this.freq;
    if (this.phase >= 0x100000000) {
      this.phase -= 0x100000000;
    }
    var currIndex = Math.floor(this.phase / 0x00200000);
    var nextIndex = currIndex + 1;
    if (this.nextIndex >= 0x0800) {
      this.nextIndex -= 0x0800;
    }
    var currData = this.waveTable[currIndex];
    var nextData = this.waveTable[nextIndex];

    var level;
    var nextWeight = this.phase & 0x001FFFFF;
    var currWeight = 0x00200000 - nextWeight;
    level = ((currData * currWeight) + (nextData * nextWeight)) / 0x00200000;

    return level;
  }

  this.updateFreq = function() {
    var noteNumber = this.noteNumber + this.courseTune - 64;
    this.freq = Math.floor(this.freqTable[noteNumber] * Math.pow(2, (this.fineTune - 64) / 768));
    this.maxOvertone = Math.floor((MAX_FREQ * 0x100000000) / (this.freq * SAMPLING_RATE));
    if (this.maxOvertone > 128) {
      this.maxOvertone = 128;
    }
    this.waveTable = this.waveTables[this.maxOvertone];
  }

  this.waveTables  = this.waveTablesSawtooth;
  this.courseTune  = 64;
  this.fineTune    = 64;
  this.noteNumber  = 60;
  this.phase       = 0;
  this.freq        = 0;
  this.maxOvertone = 1;
}
