# Digital Synth WRA32 3.0.0

2014-11-09 ISGK Instruments  
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
    - Waveform: Sawtooth(0), Square(1), Triangle(2), Sine(3)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
- VCO 2
    - Waveform: Sawtooth(0), Square(1), Triangle(2), Sine(3)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
    - Fine Tune: ..., -50(32), ..., 0(64), ..., +50(96), ... [cent]
- VCO 3
    - Waveform: Sawtooth(0), Square(1), Triangle(2), Sine(3)
    - Coarse Tune: ..., -48(16), ..., 0(64), ..., +48(96), ... [semitone]
    - Fine Tune: ..., -50(32), ..., 0(64), ..., +50(96), ... [cent]
- VCF
    - Filter Type: LPF, Attenuation Slope: -12 [dB/oct]
    - Cutoff Frequency: 6.5(0), ..., 19.5(7), ..., 10000(115), ..., 20000(127) [Hz]
    - Resonance: Q=0.7(0), ..., Q=1.4(51), ..., Q=2.8(102), ..., Q=4(127)
    - Envelope Amount: 0(0), ..., 50.4(64), ..., 100(127) [%]
- VCA
- AEG
    - Attack Time: 10(0), ..., 98.2(42), ..., 1018.3(85), ..., 10000(127) [ms]
    - Decay Time: 10(0), ..., 98.2(42), ..., 1018.3(85), ..., 10000(127) [ms]
    - Sustain Level: 0(0), ..., 50.4(64), ..., 100(127) [%]
- FEG
    - Attack Time: 10(0), ..., 98.2(42), ..., 1018.3(85), ..., 10000(127) [ms]
    - Decay Time: 10(0), ..., 98.2(42), ..., 1018.3(85), ..., 10000(127) [ms]
    - Sustain Level: 0(0), ..., 50.4(64), ..., 100(127) [%]
- Mixer
    - VCO 1 Level: 0(0), ..., 50.4(64), ..., 100(127) [%]
    - VCO 2 Level: 0(0), ..., 50.4(64), ..., 100(127) [%]
    - VCO 3 Level: 0(0), ..., 50.4(64), ..., 100(127) [%]

## MIDI Implementation Chart

      [Virtual Analog Synthesizer]                                    Date: 2014-11-09       
      Model  Digital Synth WRA32      MIDI Implementation Chart       Version: 3.0.0         
    +-------------------------------+---------------+---------------+-----------------------+
    | Function...                   | Transmitted   | Recognized    | Remarks               |
    +-------------------------------+---------------+---------------+-----------------------+
    | Basic        Default          | x             | 1-16          | Memorized             |
    | Channel      Changed          | x             | 1-16          |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Mode         Default          | x             | Mode 4 (M=1)  |                       |
    |              Messages         | x             | x             |                       |
    |              Altered          | ************* |               |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Note                          | x             | 0-127         |                       |
    | Number       : True Voice     | ************* | 0-127         |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Velocity     Note ON          | x             | x             |                       |
    |              Note OFF         | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | After        Key's            | x             | x             |                       |
    | Touch        Ch's             | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Pitch Bend                    | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Control                    14 | x             | o             | VCO 1 Waveform        |
    | Change                     15 | x             | o             | VCO 1 Coarse Tune     |
    |                            16 | x             | o             | VCO 2 Waveform        |
    |                            17 | x             | o             | VCO 2 Coarse Tune     |
    |                            18 | x             | o             | VCO 2 Fine Tune       |
    |                            19 | x             | o             | VCO 3 Waveform        |
    |                            20 | x             | o             | VCO 3 Coarse Tune     |
    |                            21 | x             | o             | VCO 3 Fine Tune       |
    |                            22 | x             | o             | VCF Cutoff Frequency  |
    |                            23 | x             | o             | VCF Resonance         |
    |                            24 | x             | o             | VCF Envelope Amount   |
    |                            25 | x             | o             | AEG Attack Time       |
    |                            26 | x             | o             | AEG Decay Time        |
    |                            27 | x             | o             | AEG Sustain Level     |
    |                            28 | x             | o             | FEG Attack Time       |
    |                            29 | x             | o             | FEG Decay Time        |
    |                            30 | x             | o             | FEG Sustain Level     |
    |                            80 | x             | o             | Mixer VCO 1 Level     |
    |                            81 | x             | o             | Mixer VCO 2 Level     |
    |                            82 | x             | o             | Mixer VCO 3 Level     |
    +-------------------------------+---------------+---------------+-----------------------+
    | Program                       | x             | x             |                       |
    | Change       : True #         | ************* |               |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System Exclusive              | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System       : Song Pos       | x             | x             |                       |
    | Common       : Song Sel       | x             | x             |                       |
    |              : Tune           | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | System       : Clock          | x             | x             |                       |
    | Real Time    : Commands       | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Aux          : Local ON/OFF   | x             | x             |                       |
    | Messages     : All Notes OFF  | x             | o             |                       |
    |              : Active Sense   | x             | x             |                       |
    |              : Reset          | x             | x             |                       |
    +-------------------------------+---------------+---------------+-----------------------+
    | Notes                         |                                                       |
    |                               |                                                       |
    +-------------------------------+-------------------------------------------------------+
      Mode 1: Omni On,  Poly          Mode 2: Omni On,  Mono          o: Yes                 
      Mode 3: Omni Off, Poly          Mode 4: Omni Off, Mono          x: No                  
