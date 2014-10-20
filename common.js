const OPTION_BLACK_KEY_PROGRAM_CHANGE = true;

const MIDI_CH         = 0;
const NOTE_NUMBER_MIN = 0;
const NOTE_NUMBER_MAX = 127;

const PROGRAM_SIZE = 16;
const SUB_OSC_LEAD = 0;
const SAW_LEAD     = 1;
const SQUERE_LEAD  = 2;
const SYNTH_PAD    = 3;
const SYNTH_BASS   = 4;

const SAWTOOTH = 0;
const SQUARE   = 1;
const TRIANGLE = 2;

const ON  = 127;
const OFF = 0;

const DATA_BYTE_MAX         = 0x7F;
const DATA_BYTE_INVALID     = 0x80;
const STATUS_BYTE_INVALID   = 0x7F;
const STATUS_BYTE_MIN       = 0x80;
const NOTE_ON               = (0x90 | MIDI_CH);
const NOTE_OFF              = (0x80 | MIDI_CH);
const CONTROL_CHANGE        = (0xB0 | MIDI_CH);
const PROGRAM_CHANGE        = (0xC0 | MIDI_CH);
const SYSTEM_MESSAGE_MIN    = 0xF0;
const SYSTEM_EXCLUSIVE      = 0xF0;
const TIME_CODE             = 0xF1;
const SONG_POSITION         = 0xF2;
const SONG_SELECT           = 0xF3;
const EOX                   = 0xF7;
const REAL_TIME_MESSAGE_MIN = 0xF8;
const ACTIVE_SENSING        = 0xFE;

const VCO_1_WAVEFORM        = 40;
const VCO_1_COARSE_TUNE     = 41;
const VCO_2_WAVEFORM        = 42;
const VCO_2_COARSE_TUNE     = 43;
const VCO_2_FINE_TUNE       = 44;
const VCO_3_WAVEFORM        = 45;
const VCO_3_COARSE_TUNE     = 46;
const VCO_3_FINE_TUNE       = 47;
const VCF_CUTOFF_FREQUENCY  = 48;
const VCF_RESONANCE         = 49;
const VCF_ENVELOPE_AMOUNT   = 50;
const EG_ATTACK_TIME        = 51;
const EG_DECAY_TIME         = 52;
const EG_SUSTAIN_LEVEL      = 53;
const ALL_NOTES_OFF         = 123;
