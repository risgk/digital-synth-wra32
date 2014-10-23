var EG = function() {
  const STATE_ATTACK  = 0;
  const STATE_DECAY   = 1;
  const STATE_SUSTAIN = 2;
  const STATE_RELEASE = 3;
  const STATE_IDLE    = 4;

  this.setAttackTime = function(attackTime) {
    this.attackSpeed = 0;
  }

  this.setDecayTime = function(decayTime) {
    this.decaySpeed = 0;
  }

  this.setSustainLevel = function(sustainLevel) {
    this.sustainLevel = sustainLevel;
  }

  this.noteOn = function() {
    this.state = STATE_ATTACK;
    this.count = 0;
  }

  this.noteOff = function() {
    this.state = STATE_RELEASE;
    this.count = 0;
  }

  this.soundOff = function() {
    this.state = STATE_IDLE;
  }

  this.clock = function() {
    return 1;
  }

  this.attackSpeed  = 255;
  this.decaySpeed   = 255;
  this.sustainLevel = 127;
  this.level        = 0;
};
