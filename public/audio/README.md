# Audio Files for Signal Calibrator

Place the following audio files in the `public/audio/` directory:

## Required Files:

1. **static.mp3** - White noise / radio static (looping)
2. **pulse.mp3** - Pulsed static with interference (looping)
3. **warble.mp3** - Warbling tone (looping)
4. **beep.mp3** - Clean beep sound (one-shot)
5. **distort.mp3** - Distorted burst / failure sound (one-shot)
6. **squelch.mp3** - Radio squelch burst (one-shot, ~0.15s)
7. **transmission.mp3** - Walkie-talkie PTT beep (one-shot, ~0.1s)
8. **click.mp3** - Radio click/pop (one-shot, ~0.05s)

## Where to Get Audio:

### Option 1: Free Sound Libraries
- **Freesound.org** - Search for "radio static", "walkie talkie", "beep"
- **Zapsplat.com** - Free sound effects
- **BBC Sound Effects** - Free archive

### Option 2: Generate with Tools
- **Audacity** (Free) - Generate tones and noise
- **Online Tone Generator** - For beeps and warbles

### Option 3: Placeholder Files
For now, the app will try to load these files. If they don't exist, audio simply won't play (no errors).

## File Specifications:

- **Format:** MP3 (best browser compatibility)
- **Bitrate:** 64-128 kbps (keep files small)
- **Sample Rate:** 44.1 kHz
- **Looping files:** 1-2 seconds duration
- **One-shot files:** 0.05-0.3 seconds duration

## Quick Setup:

1. Download or create the 8 audio files
2. Place them in `public/audio/` folder
3. Restart the dev server
4. Test the Signal Calibrator (press 'C')

The audio manager will automatically load and play these files based on signal coherence levels.
