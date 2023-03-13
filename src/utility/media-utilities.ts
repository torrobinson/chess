export enum WellKnownSoundPaths {
	piecePlaced = '../audio/piece-placed.wav',
	error = '../audio/error.wav',
}
export abstract class MediaUtilities {
	static playSound(sound: WellKnownSoundPaths): void {
		var audio = new Audio(sound);
		audio.play();
	}
}
