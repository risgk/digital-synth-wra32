var Mixer = function() {
  this.setInput1Level = function(l) {
    this.Input1Level = l;
  };

  this.setInput2Level = function(l) {
    this.Input2Level = l;
  };

  this.setInput3Level = function(l) {
    this.Input3Level = l;
  };

  this.clock = function(a1, a2, a3) {
    return ((a1 * (this.Input1Level / 127)) +
            (a2 * (this.Input2Level / 127)) +
            (a3 * (this.Input3Level / 127))) / 4;
  };

  this.Input1Level = 64;
  this.Input2Level = 64;
  this.Input3Level = 64;
};
