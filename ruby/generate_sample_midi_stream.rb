require './common'

$file = File::open("sample_midi_stream.bin", "wb")

def program_change(program_number)
    $file.write([PROGRAM_CHANGE, program_number].pack("C*"))
end

def play(note_number, length)
  $file.write([NOTE_ON,  note_number, 64].pack("C*"))
  (length * 7 / 8).times { $file.write([ACTIVE_SENSING].pack("C")) }
  $file.write([NOTE_OFF, note_number, 64].pack("C*"))
  (length * 1 / 8).times { $file.write([ACTIVE_SENSING].pack("C")) }
end

def wait(length)
  length.times { $file.write([ACTIVE_SENSING].pack("C")) }
end

def play_cdefgabc(c)
  play(12 + (c * 12), 1000 / 2 * 3)
  play(14 + (c * 12), 1000 / 2 * 3)
  play(16 + (c * 12), 1000 / 2 * 3)
  play(17 + (c * 12), 1000 / 2 * 3)
  play(19 + (c * 12), 1000 / 2 * 3)
  play(21 + (c * 12), 1000 / 2 * 3)
  play(23 + (c * 12), 1000 / 2 * 3)
  play(24 + (c * 12), 4000 / 2 * 3)
  wait(2000)
end

program_change(SUB_OSC_LEAD)
play_cdefgabc(3)

program_change(SAW_LEAD)
play_cdefgabc(2)

program_change(SQUERE_LEAD)
play_cdefgabc(4)

program_change(SYNTH_PAD)
play_cdefgabc(3)

program_change(SYNTH_BASS)
play_cdefgabc(2)
