var EG = function() {
  const STATE_ATTACK        = 0;
  const STATE_DECAY_SUSTAIN = 1;
  const STATE_RELEASE       = 3;
  const STATE_IDLE          = 4;

  this.setAttackTime = function(attackTime) {
    this.attackTime = attackTime;
  };

  this.setDecayTime = function(decayTime) {
    this.decayTime = decayTime;
  };

  this.setSustainLevel = function(sustainLevel) {
    this.sustainLevel = sustainLevel;
  };

  this.setReleaseTime = function(releaseTime) {
    this.releaseTime = releaseTime;
  };

  this.noteOn = function() {
    this.state = STATE_ATTACK;
  };

  this.noteOff = function() {
    this.state = STATE_RELEASE;
  };

  this.soundOff = function() {
    this.state = STATE_IDLE;
  };

  this.clock = function() {
    var as = 10 / Math.pow(10, (127 - this.attackTime) / (127 / 3));
    var ar = Math.pow(1 / 3, 1 / (SAMPLING_RATE * as));
    var ds = 10 / Math.pow(10, (127 - this.decayTime) / (127 / 3));
    var dr = Math.pow(1 / 32, 1 / (SAMPLING_RATE * ds));
    var sl = this.sustainLevel / 127;
    var rs = 10 / Math.pow(10, (127 - this.releaseTime) / (127 / 3));
    var rr = Math.pow(1 / 32, 1 / (SAMPLING_RATE * rs));

    switch (this.state) {
    case STATE_ATTACK:
      this.level = 1.5 - ((1.5 - this.level) * ar);
      if (this.level >= 1) {
        this.state = STATE_DECAY_SUSTAIN;
        this.level = 1;
      }
      break;
    case STATE_DECAY_SUSTAIN:
      if (this.level > sl) {
        if ((this.level - sl) <= (1 / 1024)) {
          this.level = sl;
        } else {
          this.level = sl - ((sl - this.level) * dr);
        }
      }
      break;
    case STATE_RELEASE:
      this.level = 0 - ((0 - this.level) * rr);
      if (this.level <= 1 / 1024) {
        this.state = STATE_IDLE;
        this.level = 0;
      }
      break;
    case STATE_IDLE:
      this.level = 0;
      break;
    }

    return this.level;
  };

  this.attackTime   = 0;
  this.decayTime    = 0;
  this.sustainLevel = 127;
  this.level        = 0;
  this.releaseTime  = 0;
};
