require './common'
require './lpf_table'

class VCF
  def initialize
    @cutoff_frequency = 127
    @resonance = OFF
    @envelope_amount = 0
    @x1 = 0
    @x2 = 0
    @y1 = 0
    @y2 = 0
  end

  def set_cutoff_frequency(cutoff_frequency)
    @cutoff_frequency = cutoff_frequency
  end

  def set_resonance(resonance)
    @resonance = resonance
  end

  def set_envelope_amount(envelope_amount)
    @envelope_amount = envelope_amount
  end

  def clock(a, k)
    cutoff_frequency = @cutoff_frequency + @envelope_amount * k / 128
    if (cutoff_frequency > 127)
      cutoff_frequency = 127
    end

    if ((@resonance & 0x40) != 0)
      i = cutoff_frequency * 4
      b1_over_a0 = $lpf_table_q_sqrt_2[i + 0]
      b2_over_a0 = $lpf_table_q_sqrt_2[i + 1]
      a1_over_a0 = $lpf_table_q_sqrt_2[i + 2]
      a2_over_a0 = $lpf_table_q_sqrt_2[i + 3]
    else
      i = cutoff_frequency * 4
      b1_over_a0 = $lpf_table_q_1_over_sqrt_2[i + 0]
      b2_over_a0 = $lpf_table_q_1_over_sqrt_2[i + 1]
      a1_over_a0 = $lpf_table_q_1_over_sqrt_2[i + 2]
      a2_over_a0 = $lpf_table_q_1_over_sqrt_2[i + 3]
    end

    x0 = a
    y0 =  (b2_over_a0 *  x0)
    y0 += (b1_over_a0 * @x1)
    y0 += (b2_over_a0 * @x2)
    y0 -= (a1_over_a0 * @y1)
    y0 -= (a2_over_a0 * @y2)
    @x2 = @x1
    @y2 = @y1
    @x1 = x0
    @y1 = y0

    return y0
  end
end
