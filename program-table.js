var programTable = [
  // VCO 1 Waveform, Coarse Tune,
  // VCO 2 Waveform, Coarse Tune, Fine Tune,
  // VCO 3 Waveform, Coarse Tune, Fine Tune,
  // VCF Cutoff Frequency, Resonance, Envelope Amount,
  // EG Attack Time, Decay Time, Sustain Level
  // Dummy, Dummy

  // Sub Osc Lead
  SAWTOOTH, 64,
  SAWTOOTH, 64, 77,
  TRIANGLE, 52, 64,
  64, ON, 64,
  0, 80, 127,
  64, 64,

  // Saw Lead
  SAWTOOTH, 64,
  SAWTOOTH, 64, 77,
  SAWTOOTH, 64, 64,
  64, ON, 64,
  0, 80, 127,
  64, 64,

  // Square Lead
  SQUARE, 64,
  SQUARE, 64, 77,
  SQUARE, 64, 64,
  64, OFF, 64,
  16, 80, 127,
  64, 64,

  // Synth Pad
  SAWTOOTH, 64,
  SAWTOOTH, 64, 77,
  TRIANGLE, 64, 64,
  0, ON, 127,
  127, 127, 127,
  64, 64,

  // Synth Bass
  TRIANGLE, 64,
  SAWTOOTH, 64, 77,
  SAWTOOTH, 64, 64,
  0, ON, 127,
  0, 112, 0,
  64, 64,
];
