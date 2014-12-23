var VCO = function() {
  const CYCLE_RESOLUTION  = 0x100000000;
  const MAX_OVERTONE      = 127;
  const SAMPLES_PER_CYCLE = 256;

  that = this;

  var generateWaveTable = function(waveTables, originalWaveTable) {
    for (var m = 0; m <= Math.floor((MAX_OVERTONE + 1) / 2) - 1; m++) {
      var waveTable = new Float64Array(SAMPLES_PER_CYCLE);
      var w = ifft(lpf(fft(originalWaveTable), m));
      for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
        waveTable[t] = w[t];
      }
      waveTables[m] = waveTable;
    }
  };

  this.waveTablesSawtooth = [];
  this.originalSawtooth = [];
  for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
    this.originalSawtooth[t] = +1 - (2 * (t + 0.5)) / SAMPLES_PER_CYCLE;
  }
  generateWaveTable(this.waveTablesSawtooth, this.originalSawtooth);

  this.waveTablesSquare = [];
  this.originalSquare = [];
  for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
    this.originalSquare[t] = (t + 0.5) < (SAMPLES_PER_CYCLE * 0.5) ? 1 : -1;
  }
  generateWaveTable(this.waveTablesSquare, this.originalSquare);

  this.waveTablesTriangle = [];
  this.originalTriangle = [];
  for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
    if (t < SAMPLES_PER_CYCLE / 4) {
      this.originalTriangle[t] = (t + 0.5) * (4 / SAMPLES_PER_CYCLE);
    } else if (t < (SAMPLES_PER_CYCLE * 3) / 4) {
      this.originalTriangle[t] = 1 - ((t + 0.5) - (SAMPLES_PER_CYCLE * 1) / 4) * (4 / SAMPLES_PER_CYCLE);
    } else {
      this.originalTriangle[t] = -1 + ((t + 0.5) - (SAMPLES_PER_CYCLE * 3) / 4) * (4 / SAMPLES_PER_CYCLE);
    }
  }
  generateWaveTable(this.waveTablesTriangle, this.originalTriangle);

  this.waveTablesSine = [];
  this.originalSine = [];
  for (var t = 0; t < SAMPLES_PER_CYCLE; t++) {
    this.originalSine[t] = Math.sin((2 * Math.PI) * ((t + 0.5) / SAMPLES_PER_CYCLE));
  }
  generateWaveTable(this.waveTablesSine, this.originalSine);

  this.freqTableC4toB4 = [];
  var generatefreqTable = function() {
    for (var i = 0; i <= 11; i++) {
      n = i + 60;
      cent = (n * 100) - 6900;
      hz = 440 * Math.pow(2, cent / 1200);
      that.freqTableC4toB4[i] = hz * CYCLE_RESOLUTION / SAMPLING_RATE;
    }
  }();

  this.resetPhase = function() {
    this.phase = 0;
  };

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
    case SINE:
      this.waveTables = this.waveTablesSine;
      break;
    }
  };

  this.setCoarseTune = function(coarseTune) {
    this.courseTune = coarseTune;
    this.updateFreq();
  };

  this.coarseTune = function() {
    return this.courseTune;
  };

  this.setFineTune = function(fineTune) {
    this.fineTune = fineTune;
    this.updateFreq();
  };

  this.noteOn = function(noteNumber) {
    this.noteNumber = noteNumber;
    this.updateFreq();
  };

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
    var waveTable = this.waveTables[Math.floor((this.overtone + 1) / 2) - 1];
    var currData = waveTable[currIndex];
    var nextData = waveTable[nextIndex];

    var level;
    var nextWeight = this.phase % (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE);
    var currWeight = (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE) - nextWeight;
    level = ((currData * currWeight) + (nextData * nextWeight)) / (CYCLE_RESOLUTION / SAMPLES_PER_CYCLE);

    return level;
  };

  this.updateFreq = function() {
    var noteNumber = this.noteNumber + this.courseTune - 64;
    var base = Math.floor(this.freqTableC4toB4[noteNumber % 12] *
                          Math.pow(2, (this.fineTune - 64) / 768) / 32) * 32;
    this.freq = base * Math.pow(2, Math.floor(noteNumber / 12) - 5);
    this.overtone = Math.floor((MAX_FREQ * CYCLE_RESOLUTION) / (this.freq * SAMPLING_RATE));
    if (this.overtone > MAX_OVERTONE) {
      this.overtone = MAX_OVERTONE;
    }
  };

  this.courseTune  = 64;
  this.fineTune    = 64;
  this.noteNumber  = 60;
  this.phase       = 0;
  this.freq        = 0;
  this.overtone    = 1;
  this.waveTables  = this.waveTablesSawtooth;
};
