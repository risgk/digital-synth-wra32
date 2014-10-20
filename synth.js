var vco1 = new VCO();
var vco2 = new VCO();
var vco3 = new VCO();
var vcf = {}; // TODO
var vca = {}; // TODO
var eg = {}; // TODO
var mixer = new Mixer();

var Synth = function() {
  this.systemExclusive     = false;
  this.systemDataRemaining = 0;
  this.runningStatus       = STATUS_BYTE_INVALID;
  this.firstData           = DATA_BYTE_INVALID;
  this.noteNumber          = 60;

// TODO:  this.programChange(0);

  this.receive = function(array) {
    console.log(data);
    data.forEach(function() { this.receiveMIDIByte(b) });
  }

  this.receiveMIDIByte = function(b) {
    if (IsDataByte(b)) {
      if (m_systemExclusive) {
        // do nothing
      } else if (m_systemDataRemaining != 0) {
        this.systemDataRemaining--;
      } else if (m_runningStatus == NOTE_ON) {
        if (!IsDataByte(m_firstData)) {
          this.firstData = b;
        } else if (b == 0) {
          this.noteOff(m_firstData);
          this.firstData = DATA_BYTE_INVALID;
        } else {
          this.noteOn(m_firstData);
          this.firstData = DATA_BYTE_INVALID;
        }
      } else if (m_runningStatus == NOTE_OFF) {
        if (!IsDataByte(m_firstData)) {
          this.firstData = b;
        } else {
          this.noteOff(m_firstData);
          this.firstData = DATA_BYTE_INVALID;
        }
      } else if (m_runningStatus == PROGRAM_CHANGE) {
        this.programChange(b);
      } else if (m_runningStatus == CONTROL_CHANGE) {
        if (!IsDataByte(m_firstData)) {
          this.firstData = b;
        } else {
          this.controlChange(m_firstData, b);
          this.firstData = DATA_BYTE_INVALID;
        }
      }
    } else if (IsStatusByte(b)) {
      this.runningStatus = b;
      this.firstData = DATA_BYTE_INVALID;
    } else if (IsSystemMessage(b)) {
      switch (b) {
      case EOX:
        this.systemExclusive = false;
        this.systemDataRemaining = 0;
        break;
      case SONG_SELECT:
      case TIME_CODE:
        this.systemDataRemaining = 1;
        break;
      case SONG_POSITION:
        this.systemDataRemaining = 2;
        break;
      case SYSTEM_EXCLUSIVE:
        this.systemExclusive = true;
        break;
      }
    }
  }

  this.clock = function() {
    level = mixer.clock(vco1.clock(), vco2.clock(), vco3.clock());
// TODO:    egOutput = eg.clock();
// TODO:    level = vcf.clock(level, egOutput);
// TODO:    level = vca.clock(level, egOutput);
    return level;
  }

  this.IsRealTimeMessage = function(b) {
    return b >= REAL_TIME_MESSAGE_MIN;
  }

  this.IsSystemMessage = function(b) {
    return b >= SYSTEM_MESSAGE_MIN;
  }

  this.IsStatusByte = function(b) {
    return b >= STATUS_BYTE_MIN;
  }

  this.IsDataByte = function(b) {
    return b <= DATA_BYTE_MAX;
  }

  this.noteOn = function(noteNumber) {
    if (OPTION_BLACK_KEY_PROGRAM_CHANGE) {
      if (noteNumber > 96) {
        switch (noteNumber) {
        case 97:  // C#7
          this.programChange(0);
          return;
        case 99:  // D#7
          this.programChange(1);
          return;
        case 102:  // F#7
          this.programChange(2);
          return;
        case 104:  // G#7
          this.programChange(3);
          return;
        case 106:  // A#7
          this.programChange(4);
          return;
        }
      }
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
    vco1.noteOn(m_noteNumber);
    vco2.noteOn(m_noteNumber);
    vco3.noteOn(m_noteNumber);
    eg.noteOn();
  }

  this.noteOff = function(noteNumber) {
    if (noteNumber == this.noteNumber) {
      eg.noteOff();
    }
  }

  this.soundOff = function() {
    eg.soundOff();
  }

  this.resetPhase = function() {
    vco1.resetPhase();
    vco2.resetPhase();
    vco3.resetPhase();
  }

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
    case EG_ATTACK_TIME:
      this.setEGAttackTime(value);
      break;
    case EG_DECAY_TIME:
      this.setEGDecayTime(value);
      break;
    case EG_SUSTAIN_LEVEL:
      this.setEGSustainLevel(value);
      break;
    }
  }

  this.setVCO1Waveform = function(value) {
    this.soundOff();
    vco1.setWaveform(value);
    this.resetPhase();
  }

  this.setVCO1CoarseTune = function(value) {
    this.soundOff();
    vco1.setCoarseTune(value);
    this.resetPhase();
  }

  this.setVCO2Waveform = function(value) {
    this.soundOff();
    vco2.setWaveform(value);
    this.resetPhase();
  }

  this.setVCO2CoarseTune = function(value) {
    this.soundOff();
    vco2.setCoarseTune(value);
    this.resetPhase();
  }

  this.setVCO2FineTune = function(value) {
    this.soundOff();
    vco2.setFineTune(value);
    this.resetPhase();
  }

  this.setVCO3Waveform = function(value) {
    this.soundOff();
    vco3.setWaveform(value);
    this.resetPhase();
  }

  this.setVCO3CoarseTune = function(value) {
    this.soundOff();
    vco3.setCoarseTune(value);
    this.resetPhase();
  }

  this.setVCO3FineTune = function(value) {
    this.soundOff();
    vco3.setFineTune(value);
    this.resetPhase();
  }

  this.setVCFCutoffFrequency = function(value) {
    this.soundOff();
    vcf.setCutoffFrequency(value);
    this.resetPhase();
  }

  this.setVCFResonance = function(value) {
    this.soundOff();
    vcf.setResonance(value);
    this.resetPhase();
  }

  this.setVCFEnvelopeAmount = function(value) {
    this.soundOff();
    vcf.setEnvelopeAmount(value);
    this.resetPhase();
  }

  this.setEGAttackTime = function(value) {
    this.soundOff();
    eg.setAttackTime(value);
    this.resetPhase();
  }

  this.setEGDecayTime = function(value) {
    this.soundOff();
    eg.setDecayTime(value);
    this.resetPhase();
  }

  this.setEGSustainLevel = function(value) {
    this.soundOff();
    eg.setSustainLevel(value);
    this.resetPhase();
  }

  this.allNotesOff = function(value) {
    eg.noteOff();
  }

  this.programChange = function(programNumber) {
    this.soundOff();
    var i = programNumber * PROGRAM_SIZE;
    vco1.setWaveform(programTable[i + 0]);
    vco1.setCoarseTune(programTable[i + 1]);
    vco2.setWaveform(programTable[i + 2]);
    vco2.setCoarseTune(programTable[i + 3]);
    vco2.setFineTune(programTable[i + 4]);
    vco3.setWaveform(programTable[i + 5]);
    vco3.setCoarseTune(programTable[i + 6]);
    vco3.setFineTune(programTable[i + 7]);
    vcf.setCutoffFrequency(programTable[i + 8]);
    vcf.setResonance(programTable[i + 9]);
    vcf.setEnvelopeAmount(programTable[i + 10]);
    eg.setAttackTime(programTable[i + 11]);
    eg.setDecayTime(programTable[i + 12]);
    eg.setSustainLevel(programTable[i + 13]);
    this.resetPhase();
  }
}
