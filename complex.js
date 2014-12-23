var Complex = function(real, imaginary) {
  this.add = function(other) {
    return new Complex(this.real + other.real, this.imaginary + other.imaginary);
  };

  this.sub = function(other) {
    return new Complex(this.real - other.real, this.imaginary - other.imaginary);
  };

  this.mul = function(other) {
    return new Complex((this.real * other.real) - (this.imaginary * other.imaginary),
                       (this.real * other.imaginary) + (this.imaginary * other.real));
  };

  this.conj = function() {
    return new Complex(this.real, -this.imaginary);
  };

  if(typeof real === "undefined") {
    real = 0;
  };
  this.real = real;

  if(typeof imaginary === "undefined") {
    imaginary = 0;
  };
  this.imaginary = imaginary;
};
