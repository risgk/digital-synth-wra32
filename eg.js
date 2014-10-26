var EG = function() {
  const STATE_ATTACK  = 0;
  const STATE_DECAY   = 1;
  const STATE_SUSTAIN = 2;
  const STATE_RELEASE = 3;
  const STATE_IDLE    = 4;

  this.setAttackTime = function(attackTime) {
    this.attackTime = attackTime;
  }

  this.setDecayTime = function(decayTime) {
    this.decayTime = decayTime;
  }

  this.setSustainLevel = function(sustainLevel) {
    this.sustainLevel = sustainLevel;
  }

  this.noteOn = function() {
    this.state = STATE_ATTACK;
  }

  this.noteOff = function() {
    this.state = STATE_RELEASE;
  }

  this.soundOff = function() {
    this.state = STATE_IDLE;
  }

  this.clock = function() {
    var at = this.attackTime;
    if (at > 120) {
      at = 120;
    }
    var ar = 0.9999; // TODO
    var dt = this.decayTime;
    if (dt > 120) {
      dt = 120;
    }
    var dr = 0.9999; // TODO
    var sl = this.sustainLevel / 120;
    if (sl > 1) {
      sl = 1;
    }

    switch (this.state) {
    case STATE_ATTACK:
      this.level = 2 - ((2 - this.level) * ar);
      if (this.level >= 1) {
        this.state = STATE_DECAY;
        this.level = 1;
      }
      break;
    case STATE_DECAY:
      this.level = this.level * dr;
      if (this.level <= sl) {
        this.state = STATE_SUSTAIN;
        this.level = sl;
      }
      break;
    case STATE_SUSTAIN:
      this.level = sl;
      break;
    case STATE_RELEASE:
      this.level = this.level * dr;
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
  }

  this.attackTime   = 0;
  this.decayTime    = 0;
  this.sustainLevel = 127;
  this.level        = 0;
};
