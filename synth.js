var vco1 = new VCO();
var vco2 = new VCO();
var vco3 = new VCO();
var vcf = new VCF();
var vca = new VCA();
var feg = new EG();
var aeg = new EG();
var mixer = new Mixer();

var Synth = function() {
  this.receive = function(array) {
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      this.receiveMIDIByte(array[i]);
    }
  };

  this.receiveMIDIByte = function(b) {
    if (this.IsDataByte(b)) {
      if (this.systemExclusive) {
        // do nothing
      } else if (this.systemDataRemaining != 0) {
        this.systemDataRemaining--;
      } else if (this.runningStatus == (NOTE_ON | midiCh)) {
        if (!this.IsDataByte(this.firstData)) {
          this.firstData = b;
        } else if (b == 0) {
          this.noteOff(this.firstData);
          this.firstData = DATA_BYTE_INVALID;
        } else {
          this.noteOn(this.firstData);
          this.firstData = DATA_BYTE_INVALID;
        }
      } else if (this.runningStatus == (NOTE_OFF | midiCh)) {
        if (!this.IsDataByte(this.firstData)) {
          this.firstData = b;
        } else {
          this.noteOff(this.firstData);
          this.firstData = DATA_BYTE_INVALID;
        }
      } else if (this.runningStatus == (CONTROL_CHANGE | midiCh)) {
        if (!this.IsDataByte(this.firstData)) {
          this.firstData = b;
        } else {
          this.controlChange(this.firstData, b);
          this.firstData = DATA_BYTE_INVALID;
        }
      }
    } else if (this.IsSystemMessage(b)) {
      switch (b) {
      case SYSTEM_EXCLUSIVE:
        this.systemExclusive = true;
        this.runningStatus = STATUS_BYTE_INVALID;
        break;
      case EOX:
      case TUNE_REQUEST:
      case 0xF4:
      case 0xF5:
        this.systemExclusive = false;
        this.systemDataRemaining = 0;
        this.runningStatus = STATUS_BYTE_INVALID;
        break;
      case TIME_CODE:
      case SONG_SELECT:
        this.systemExclusive = false;
        this.systemDataRemaining = 1;
        this.runningStatus = STATUS_BYTE_INVALID;
        break;
      case SONG_POSITION:
        this.systemExclusive = false;
        this.systemDataRemaining = 2;
        this.runningStatus = STATUS_BYTE_INVALID;
        break;
      }
    } else if (this.IsStatusByte(b)) {
      this.systemExclusive = false;
      this.runningStatus = b;
      this.firstData = DATA_BYTE_INVALID;
    }
  };

  this.clock = function() {
    var level = mixer.clock(vco1.clock(), vco2.clock(), vco3.clock());
    fegOutput = feg.clock();
    level = vcf.clock(level, fegOutput);
    aegOutput = aeg.clock();
    level = vca.clock(level, aegOutput);
    return level;
  };

  this.IsRealTimeMessage = function(b) {
    return b >= REAL_TIME_MESSAGE_MIN;
  };

  this.IsSystemMessage = function(b) {
    return b >= SYSTEM_MESSAGE_MIN;
  };

  this.IsStatusByte = function(b) {
    return b >= STATUS_BYTE_MIN;
  };

  this.IsDataByte = function(b) {
    return b <= DATA_BYTE_MAX;
  };

  this.noteOn = function(noteNumber) {
    pitch1 = noteNumber + vco1.coarseTune();
    if (pitch1 < (NOTE_NUMBER_MIN + 64) ||
        pitch1 > (NOTE_NUMBER_MAX + 64)) {
      return;
    }

    pitch2 = noteNumber + vco2.coarseTune();
    if (pitch2 < (NOTE_NUMBER_MIN + 64) ||
        pitch2 > (NOTE_NUMBER_MAX + 64)) {
      return;
    }

    pitch3 = noteNumber + vco3.coarseTune();
    if (pitch3 < (NOTE_NUMBER_MIN + 64) ||
        pitch3 > (NOTE_NUMBER_MAX + 64)) {
      return;
    }

    this.noteNumber = noteNumber;
    vco1.noteOn(this.noteNumber);
    vco2.noteOn(this.noteNumber);
    vco3.noteOn(this.noteNumber);
    feg.noteOn();
    aeg.noteOn();
  };

  this.noteOff = function(noteNumber) {
    if (noteNumber == this.noteNumber) {
      feg.noteOff();
      aeg.noteOff();
    }
  };

  this.soundOff = function() {
    feg.soundOff();
    aeg.soundOff();
  };

  this.resetPhase = function() {
    vco1.resetPhase();
    vco2.resetPhase();
    vco3.resetPhase();
  };

  this.controlChange = function(controllerNumber, value) {
    switch (controllerNumber) {
    case ALL_NOTES_OFF:
      this.allNotesOff(value);
      break;
    case VCO_1_WAVEFORM:
      this.setVCO1Waveform(value);
      break;
    case VCO_1_COARSE_TUNE:
      this.setVCO1CoarseTune(value);
      break;
    case VCO_2_WAVEFORM:
      this.setVCO2Waveform(value);
      break;
    case VCO_2_COARSE_TUNE:
      this.setVCO2CoarseTune(value);
      break;
    case VCO_2_FINE_TUNE:
      this.setVCO2FineTune(value);
      break;
    case VCO_3_WAVEFORM:
      this.setVCO3Waveform(value);
      break;
    case VCO_3_COARSE_TUNE:
      this.setVCO3CoarseTune(value);
      break;
    case VCO_3_FINE_TUNE:
      this.setVCO3FineTune(value);
      break;
    case VCF_CUTOFF_FREQUENCY:
      this.setVCFCutoffFrequency(value);
      break;
    case VCF_RESONANCE:
      this.setVCFResonance(value);
      break;
    case VCF_ENVELOPE_AMOUNT:
      this.setVCFEnvelopeAmount(value);
      break;
    case AEG_ATTACK_TIME:
      this.setAEGAttackTime(value);
      break;
    case AEG_DECAY_TIME:
      this.setAEGDecayTime(value);
      break;
    case AEG_SUSTAIN_LEVEL:
      this.setAEGSustainLevel(value);
      break;
    case FEG_ATTACK_TIME:
      this.setFEGAttackTime(value);
      break;
    case FEG_DECAY_TIME:
      this.setFEGDecayTime(value);
      break;
    case FEG_SUSTAIN_LEVEL:
      this.setFEGSustainLevel(value);
      break;
    case MIXER_VCO_1_LEVEL:
      this.setMixerVCO1Level(value);
      break;
    case MIXER_VCO_2_LEVEL:
      this.setMixerVCO2Level(value);
      break;
    case MIXER_VCO_3_LEVEL:
      this.setMixerVCO3Level(value);
      break;
    }
  };

  this.setVCO1Waveform = function(value) {
    this.soundOff();
    vco1.setWaveform(value);
    this.resetPhase();
  };

  this.setVCO1CoarseTune = function(value) {
    this.soundOff();
    vco1.setCoarseTune(value);
    this.resetPhase();
  };

  this.setVCO2Waveform = function(value) {
    this.soundOff();
    vco2.setWaveform(value);
    this.resetPhase();
  };

  this.setVCO2CoarseTune = function(value) {
    this.soundOff();
    vco2.setCoarseTune(value);
    this.resetPhase();
  };

  this.setVCO2FineTune = function(value) {
    this.soundOff();
    vco2.setFineTune(value);
    this.resetPhase();
  };

  this.setVCO3Waveform = function(value) {
    this.soundOff();
    vco3.setWaveform(value);
    this.resetPhase();
  };

  this.setVCO3CoarseTune = function(value) {
    this.soundOff();
    vco3.setCoarseTune(value);
    this.resetPhase();
  };

  this.setVCO3FineTune = function(value) {
    this.soundOff();
    vco3.setFineTune(value);
    this.resetPhase();
  };

  this.setVCFCutoffFrequency = function(value) {
    vcf.setCutoffFrequency(value);
  };

  this.setVCFResonance = function(value) {
    vcf.setResonance(value);
  };

  this.setVCFEnvelopeAmount = function(value) {
    vcf.setEnvelopeAmount(value);
  };

  this.setAEGAttackTime = function(value) {
    aeg.setAttackTime(value);
  };

  this.setAEGDecayTime = function(value) {
    aeg.setDecayTime(value);
  };

  this.setAEGSustainLevel = function(value) {
    aeg.setSustainLevel(value);
  };

  this.setFEGAttackTime = function(value) {
    feg.setAttackTime(value);
  };

  this.setFEGDecayTime = function(value) {
    feg.setDecayTime(value);
  };

  this.setFEGSustainLevel = function(value) {
    feg.setSustainLevel(value);
  };

  this.setMixerVCO1Level = function(value) {
    mixer.setInput1Level(value);
  };

  this.setMixerVCO2Level = function(value) {
    mixer.setInput2Level(value);
  };

  this.setMixerVCO3Level = function(value) {
    mixer.setInput3Level(value);
  };

  this.allNotesOff = function(value) {
    feg.noteOff();
    aeg.noteOff();
  };

  this.systemExclusive     = false;
  this.systemDataRemaining = 0;
  this.runningStatus       = STATUS_BYTE_INVALID;
  this.firstData           = DATA_BYTE_INVALID;
  this.noteNumber          = 60;
};
