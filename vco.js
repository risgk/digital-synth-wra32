var VCO = function() {
  this.waveTables = this.waveTablesSawtooth;
  this.courseTune = 64;
  this.fineTune   = 64;
  this.noteNumber = 60;
  this.phase      = 0;
  this.freq       = 0;

  // TODO
  this.waveTablesSawtooth = [];
  this.waveTablesSquare = [];
  this.waveTablesTriangle = [];

  // TODO
  this.freqTableMinus10Cent = [];
  this.freqTable0Cent = [];
  this.freqTablePlus10Cent = [];

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
    this.phase &= 0xFFFF;

    var waveTable = this.waveTables[this.freq >> 8];
    var currIndex = this.phase >> 8;
    var nextIndex = currIndex + 1;
    nextIndex &= 0xFF;
    var currData = waveTable[currIndex];
    var nextData = waveTable[nextIndex];

    var level;
    var nextWeight = lowByte(this.phase);
    if (nextWeight == 0) {
      level = currData;
    } else {
      var currWeight = 256 - nextWeight;
      level = ((currData * currWeight) + (nextData * nextWeight)) / 256;
    }

    return level;
  }

  this.updateFreq = function() {
    var noteNumber = this.noteNumber + this.courseTune - 64;
    if (this.fineTune <= 63) {
      this.freq = this.freqTableMinus10Cent[noteNumber];
    } else if (this.fineTune == 64) {
      this.freq = this.freqTable0Cent[noteNumber];
    } else {
      this.freq = this.freqTablePlus10Cent[noteNumber];
    }
  }
}
