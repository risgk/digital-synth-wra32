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
  this.waveTable = [];
  for (var i = 0; i <= 2047; i++) {
    this.waveTable[i] = (i / 1024 - 1) / 8;
  }

  this.freqTable = [];
  var freqC4toB4 = []
  for (var i = 0; i <= 11; i++) {
    n = i + 60;
    cent = (n * 100) - 6900;
    hz = 440 * Math.pow(2, cent / 1200);
    freqC4toB4[i] = Math.floor((hz * 0x100000000 / SAMPLING_RATE) / 32) * 32;
  }
  for (var n = 0; n <= 127; n++) {
    this.freqTable[n] = Math.floor(freqC4toB4[n % 12] * Math.pow(2, Math.floor(n / 12) - 5));
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
    this.phase &= 0xFFFFFFFF;

    var waveTable = this.waveTable;
//    var waveTable = this.waveTables[this.freq >> 11];
    var currIndex = this.phase >> 21;
    var nextIndex = currIndex + 1;
    nextIndex &= 0x07FF;
    var currData = waveTable[currIndex];
    var nextData = waveTable[nextIndex];

    var level;
    var nextWeight = this.phase & 0x001FFFFF;
    var currWeight = 0x00200000 - nextWeight;
    level = ((currData * currWeight) + (nextData * nextWeight)) / 0x00200000;

    return level;
  }

  this.updateFreq = function() {
    var noteNumber = this.noteNumber + this.courseTune - 64;
    this.freq = this.freqTable[noteNumber];
// TODO:   this.freq = Math.floor(this.freqTable[noteNumber] * (this.fineTune - 64));
  }
}
