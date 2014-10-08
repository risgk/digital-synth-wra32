require './common'
require './program_table'
require './vco'
require './vcf'
require './vca'
require './eg'
require './mixer'

$vco_1 = VCO.new
$vco_2 = VCO.new
$vco_3 = VCO.new
$vcf = VCF.new
$vca = VCA.new
$eg = EG.new
$mixer = Mixer.new

class Synth
  def initialize
    @system_exclusive = false
    @system_data_remaining = 0
    @running_status = STATUS_BYTE_INVALID
    @first_data = DATA_BYTE_INVALID
    @note_number = 60
    program_change(0)
  end

  def receive_midi_byte(b)
    if (real_time_message?(b))
      # do nothing
    elsif (system_message?(b))
      case (b)
      when EOX
        @system_exclusive = false
        @system_data_remaining = 0
      when SONG_SELECT, TIME_CODE
        @system_data_remaining = 1
      when SONG_POSITION
        @system_data_remaining = 2
      when SYSTEM_EXCLUSIVE
        @system_exclusive = true
      end
    elsif (status_byte?(b))
      @running_status = b
      @first_data = DATA_BYTE_INVALID
    else
      if (@system_exclusive)
        # do nothing
      elsif (@system_data_remaining > 0)
        @system_data_remaining -= 1
      elsif (@running_status == PROGRAM_CHANGE)
        program_change(b)
      elsif (@running_status == CONTROL_CHANGE)
        if (!data_byte?(@first_data))
          @first_data = b
        else
          control_change(@first_data, b)
          @first_data = DATA_BYTE_INVALID
        end
      elsif (@running_status == NOTE_OFF)
        if (!data_byte?(@first_data))
          @first_data = b
        else
          note_off(@first_data)
          @first_data = DATA_BYTE_INVALID
        end
      elsif (@running_status == NOTE_ON)
        if (!data_byte?(@first_data))
          @first_data = b
        else
          if (b == 0x00)
            note_off(@first_data)
            @first_data = DATA_BYTE_INVALID
          else
            note_on(@first_data)
            @first_data = DATA_BYTE_INVALID
          end
        end
      end
    end
  end

  def clock
    level = $mixer.clock($vco_1.clock, $vco_2.clock, $vco_3.clock)
     eg_output = $eg.clock
     level = $vcf.clock(level, eg_output)
     level = $vca.clock(level, eg_output)
  end

  def real_time_message?(b)
    b >= REAL_TIME_MESSAGE_MIN
  end

  def system_message?(b)
    b >= SYSTEM_MESSAGE_MIN
  end

  def status_byte?(b)
    b >= STATUS_BYTE_MIN
  end

  def data_byte?(b)
    b <= DATA_BYTE_MAX
  end

  def note_on(note_number)
    if (OPTION_BLACK_KEY_PROGRAM_CHANGE)
      if (note_number > 96)
        case (note_number)
        when 97  # C#7
          program_change(0)
          return
        when 99  # D#7
          program_change(1)
          return
        when 102  # F#7
          program_change(2)
          return
        when 104  # G#7
          program_change(3)
          return
        when 106  # A#7
          program_change(4)
          return
        end
      end
    end

    pitch_2 = note_number + $vco_2.coarse_tune
    if (pitch_2 < (NOTE_NUMBER_MIN + 64) || pitch_2 > (NOTE_NUMBER_MAX + 64))
      return
    end

    pitch_3 = note_number + $vco_3.coarse_tune
    if (pitch_3 < (NOTE_NUMBER_MIN + 64) || pitch_3 > (NOTE_NUMBER_MAX + 64))
      return
    end

    @note_number = note_number
    $vco_1.note_on(@note_number)
    $vco_2.note_on(@note_number)
    $vco_3.note_on(@note_number)
    $eg.note_on
  end

  def note_off(note_number)
    if (note_number == @note_number)
      $eg.note_off
    end
  end

  def sound_off
    $eg.sound_off
  end

  def reset_phase
    $vco_1.reset_phase
    $vco_2.reset_phase
    $vco_3.reset_phase
  end

  def control_change(controller_number, value)
    case (controller_number)
    when VCO_1_WAVEFORM
      set_vco_1_waveform(value)
    when VCO_1_COARSE_TUNE
      set_vco_1_coarse_tune(value)
    when VCO_2_WAVEFORM
      set_vco_2_waveform(value)
    when VCO_2_COARSE_TUNE
      set_vco_2_coarse_tune(value)
    when VCO_2_FINE_TUNE
      set_vco_2_fine_tune(value)
    when VCO_3_WAVEFORM
      set_vco_3_waveform(value)
    when VCO_3_COARSE_TUNE
      set_vco_3_coarse_tune(value)
    when VCO_3_FINE_TUNE
      set_vco_3_fine_tune(value)
    when VCF_CUTOFF_FREQUENCY
      set_vcf_cutoff_frequency(value)
    when VCF_RESONANCE
      set_vcf_resonance(value)
    when VCF_ENVELOPE_AMOUNT
      set_vcf_envelope_amount(value)
    when EG_ATTACK_TIME
      set_eg_attack_time(value)
    when EG_DECAY_TIME
      set_decay_time(value)
    when EG_SUSTAIN_LEVEL
      set_eg_sustain_level(value)
    when ALL_NOTES_OFF
      all_notes_off(value)
    end
  end

  def set_vco_1_waveform(value)
    sound_off
    $vco_1.set_waveform(value)
    reset_phase
  end

  def set_vco_1_coarse_tune(value)
    sound_off
    $vco_1.set_coarse_tune(value)
    reset_phase
  end

  def set_vco_2_waveform(value)
    sound_off
    $vco_2.set_waveform(value)
    reset_phase
  end

  def set_vco_2_coarse_tune(value)
    sound_off
    $vco_2.set_coarse_tune(value)
    reset_phase
  end

  def set_vco_2_fine_tune(value)
    sound_off
    $vco_2.set_fine_tune(value)
    reset_phase
  end

  def set_vco_3_waveform(value)
    sound_off
    $vco_3.set_waveform(value)
    reset_phase
  end

  def set_vco_3_coarse_tune(value)
    sound_off
    $vco_3.set_coarse_tune(value)
    reset_phase
  end

  def set_vco_3_fine_tune(value)
    sound_off
    $vco_3.set_fine_tune(value)
    reset_phase
  end

  def set_vcf_cutoff_frequency(value)
    sound_off
    $vcf.set_cutoff_frequency(value)
    reset_phase
  end

  def set_vcf_resonance(value)
    sound_off
    $vcf.set_resonance(value)
    reset_phase
  end

  def set_vcf_envelope_amount(value)
    sound_off
    $vcf.set_envelope_amount(value)
    reset_phase
  end

  def set_eg_attack_time(value)
    sound_off
    $eg.set_attack_time(value)
    reset_phase
  end

  def set_decay_time(value)
    sound_off
    $eg.set_decay_time(value)
    reset_phase
  end

  def set_eg_sustain_level(value)
    sound_off
    $eg.set_sustain_level(value)
    reset_phase
  end

  def all_notes_off(value)
    $eg.note_off
  end

  def program_change(program_number)
    sound_off
    i = program_number * PROGRAM_SIZE
    $vco_1.set_waveform($program_table[i + 0])
    $vco_1.set_coarse_tune($program_table[i + 1])
    $vco_1.set_fine_tune(64)
    $vco_2.set_waveform($program_table[i + 2])
    $vco_2.set_coarse_tune($program_table[i + 3])
    $vco_2.set_fine_tune($program_table[i + 4])
    $vco_3.set_waveform($program_table[i + 5])
    $vco_3.set_coarse_tune($program_table[i + 6])
    $vco_3.set_fine_tune($program_table[i + 7])
    $vcf.set_cutoff_frequency($program_table[i + 8])
    $vcf.set_resonance($program_table[i + 9])
    $vcf.set_envelope_amount($program_table[i + 10])
    $eg.set_attack_time($program_table[i + 11])
    $eg.set_decay_time($program_table[i + 12])
    $eg.set_sustain_level($program_table[i + 13])
    reset_phase
  end
end
