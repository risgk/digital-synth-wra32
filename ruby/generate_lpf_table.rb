# refs http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt

require './common'

$file = File::open("lpf_table.rb", "w")

def generate_lpf_table(name, q)
  $file.printf("$lpf_table_%s = [\n  ", name)
  (0..127).each do |i|
    f0_over_fs = (2.0 ** (i / (127.0 / 2.0))) / (2.0 ** 4.0)
    f0_over_fs /= 3.0
    w0 = 2.0 * Math::PI * f0_over_fs
    alpha = Math::sin(w0) / (2.0 * q)

    b1 = 1.0 - Math::cos(w0)
    b2 = (1.0 - Math::cos(w0)) / 2.0
    a0 = 1.0 + alpha
    a1 = (-2.0) * Math::cos(w0)
    a2 = 1.0 - alpha

    b1_over_a0 = b1 / a0
    b2_over_a0 = b2 / a0
    a1_over_a0 = a1 / a0
    a2_over_a0 = a2 / a0

    $file.printf("%+f, %+f, %+f, %+f,", b1_over_a0, b2_over_a0, a1_over_a0, a2_over_a0)
    if i == 127
      $file.printf("\n")
    else
      $file.printf("\n  ")
    end
  end
  $file.printf("]\n\n")
end

generate_lpf_table("q_1_over_sqrt_2", 1.0 / Math::sqrt(2.0))
generate_lpf_table("q_sqrt_2", Math::sqrt(2.0))

$file.close
