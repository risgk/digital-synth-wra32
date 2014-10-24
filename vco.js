var VCO = function() {
  const CYCLE_RESOLUTION  = 0x100000000;
  const MAX_OVERTONE      = 64;
  const SAMPLES_PER_CYCLE = 2048;

  var that = this;

  var generateWaveTable = function(waveTables, f) {
    for (var m = 1; m <= MAX_OVERTONE; m++) {
      var waveTable = new Float32Array(SAMPLES_PER_CYCLE);
      for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
        var level = 0;
        for (var k = 1; k <= m; k++) {
          level += f(t, k);
        }
        waveTable[t] = level;
      }
      waveTables[m] = waveTable;
    }
  }

  this.waveTablesSawtooth = [];
  generateWaveTable(this.waveTablesSawtooth, function(t, k) {
    return (2 / Math.PI) * Math.sin((2 * Math.PI) * (t / SAMPLES_PER_CYCLE) * k) / k;
  });

  this.waveTablesSquare = [];
  generateWaveTable(this.waveTablesSquare, function(t, k) {
    if (k % 2 == 1) {
      return (4 / Math.PI) * Math.sin((2 * Math.PI) * (t / SAMPLES_PER_CYCLE) * k) / k;
    }
    return 0;
  });

  this.waveTablesTriangle = [];
  generateWaveTable(this.waveTablesTriangle, function(t, k) {
    if (k % 4 == 1) {
      return (8 / Math.pow(Math.PI, 2)) * Math.sin((2 * Math.PI) * (t / SAMPLES_PER_CYCLE) * k) / Math.pow(k, 2);
    } else if (k % 4 == 3) {
      return (8 / Math.pow(Math.PI, 2)) * -Math.sin((2 * Math.PI) * (t / SAMPLES_PER_CYCLE) * k) / Math.pow(k, 2);
    }
    return 0;
  });

  this.freqTable = [];
  var generatefreqTable = function() {
    var freqC4toB4 = [];
    for (var i = 0; i <= 11; i++) {
      n = i + 60;
      cent = (n * 100) - 6900;
      hz = 440 * Math.pow(2, cent / 1200);
      freqC4toB4[i] = Math.floor((hz * CYCLE_RESOLUTION / SAMPLING_RATE) / 32) * 32;
    }
    for (var n = 0; n <= 127; n++) {
      that.freqTable[n] = Math.floor(freqC4toB4[n % 12] * Math.pow(2, Math.floor(n / 12) - 5));
    }
  }
  generatefreqTable();

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
    if (this.phase >= CYCLE_RESOLUTION) {
      this.phase -= CYCLE_RESOLUTION;
    }
    var currIndex = Math.floor(this.phase / (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE));
    var nextIndex = currIndex + 1;
    if (nextIndex >= SAMPLES_PER_CYCLE) {
      nextIndex -= SAMPLES_PER_CYCLE;
    }
    var waveTable = this.waveTables[this.overtone];
    var currData = waveTable[currIndex];
    var nextData = waveTable[nextIndex];

    var level;
    var nextWeight = this.phase % (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE);
    var currWeight = (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE) - nextWeight;
    level = ((currData * currWeight) + (nextData * nextWeight)) / (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE);

    return level;
  }

  this.updateFreq = function() {
    var noteNumber = this.noteNumber + this.courseTune - 64;
    this.freq = Math.floor(this.freqTable[noteNumber] * Math.pow(2, (this.fineTune - 64) / 768));
    this.overtone = Math.floor((MAX_FREQ * CYCLE_RESOLUTION) / (this.freq * SAMPLING_RATE));
    if (this.overtone > MAX_OVERTONE) {
      this.overtone = MAX_OVERTONE;
    }
  }

  this.courseTune  = 64;
  this.fineTune    = 64;
  this.noteNumber  = 60;
  this.phase       = 0;
  this.freq        = 0;
  this.overtone    = 1;
  this.waveTables  = this.waveTablesSawtooth;
}
