# Digital Synth WRA32 1.0.0

2014-11-01 ISGK Instruments  
[https://github.com/risgk/digital-synth-wra32](https://github.com/risgk/digital-synth-wra32)

## Concept

- Virtual Analog Synthesizer Web App
- A sibling of [Digital Synth VRA8](https://github.com/risgk/DigitalSynthVRA8)

## Features

- Using Web MIDI API and Web Audio API
- We recommend Google Chrome (Please enable Web MIDI API)
- Supporting MIDI IN
- Supporting 32 bit float audio (48 kHz/32 bit in Google Chrome 38 for Windows)

## Synth Modules

- VCO 1
    - Waveform: Sawtooth(0), Square(1), Triangle(2)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
- VCO 2
    - Waveform: Sawtooth(0), Square(1), Triangle(2)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
    - Fine Tune: ..., -50(32), ..., 0(64), ..., +50(96), ... [cent]
- VCO 3
    - Waveform: Sawtooth(0), Square(1), Triangle(2)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
    - Fine Tune: ..., -50(32), ..., 0(64), ..., +50(96), ... [cent]
- VCF
    - Filter Type: LPF, Attenuation Slope: -12 [dB/oct]
    - Cutoff Frequency: 20(0), ..., 5000(96), ..., 10000(108), ..., 20000(120-127) [Hz]
    - Resonance: Q=0.7(0), ..., Q=1.4(48), ..., Q=2.8(96), ..., Q=4(120-127)
    - Envelope Amount: 0(0), ..., 50(60), ..., 100(120-127) [%]
- VCA
- EG
    - Attack Time: 10(0), ..., 100(40), ..., 1000(80), ..., 10000(120-127) [ms]
    - Decay Time: 10(0), ..., 100(40), ..., 1000(80), ..., 10000(120-127) [ms]
    - Sustain Level: 0(0), ..., 50(60), ..., 100(120-127) [%]

## MIDI Implementation Chart

      ISGK Instruments                                                Date: 2014-11-01       
      Model: Digital Synth WRA32      MIDI Implementation Chart       Version: 1.0.0         
    +-------------------------------+---------------+---------------+-----------------------+
    | Function                      | Transmitted   | Recognized    | Remarks               |
    +-------------------------------+---------------+---------------+-----------------------+
    | Basic        Default          | x             | 1             |                       |
    | Channel      Changed          | x             | 1-16          | Memorized             |
    +-------------------------------+---------------+---------------+-----------------------+
    | Mode         Default          | x             | Mode 4 (M=1)  |                       |
    |              Messages         | x             | x             |                       |
    |              Altered          | ************* |               |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Note                          | x             | 0-127         |                       |
    | Number       : True Voice     | ************* | 0-127         |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Velocity     Note On          | x             | x  *1         |                       |
    |              Note Off         | x             | x  *2         |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | After        Key's            | x             | x             |                       |
    | Touch        Channel's        | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Pitch Bend                    | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Control                    40 | x             | o             | VCO 1 Waveform        |
    | Change                     41 | x             | o             | VCO 1 Coarse Tune     |
    |                            42 | x             | o             | VCO 2 Waveform        |
    |                            43 | x             | o             | VCO 2 Coarse Tune     |
    |                            44 | x             | o             | VCO 2 Fine Tune       |
    |                            45 | x             | o             | VCO 3 Waveform        |
    |                            46 | x             | o             | VCO 3 Coarse Tune     |
    |                            47 | x             | o             | VCO 3 Fine Tune       |
    |                            48 | x             | o             | VCF Cutoff Frequency  |
    |                            49 | x             | o             | VCF Resonance         |
    |                            50 | x             | o             | VCF Envelope Amount   |
    |                            51 | x             | o             | EG Attack Time        |
    |                            52 | x             | o             | EG Decay Time         |
    |                            53 | x             | o             | EG Sustain Level      |
    +-------------------------------+---------------+---------------+-----------------------+
    | Program                       | x             | x             |                       |
    | Change       : True Number    | ************* | ************* |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System Exclusive              | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System       : Song Position  | x             | x             |                       |
    | Common       : Song Select    | x             | x             |                       |
    |              : Tune Request   | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System       : Clock          | x             | x             |                       |
    | Real Time    : Commands       | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Aux          : Local On/Off   | x             | x             |                       |
    | Messages     : All Notes Off  | x             | o             |                       |
    |              : Active Sensing | x             | x             |                       |
    |              : System Reset   | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Notes                         | *1  9nH v=1-127                                       |
    |                               | *2  9nH v=0 or 8nH v=0-127                            |
    +-------------------------------+-------------------------------------------------------+
      Mode 1: Omni On,  Poly          Mode 2: Omni On,  Mono          o: Yes                 
      Mode 3: Omni Off, Poly          Mode 4: Omni Off, Mono          x: No                  
