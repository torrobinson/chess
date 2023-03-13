export enum WellKnownSoundPaths {
	piecePlaced = '../audio/piece-placed.wav',
	error = '../audio/error.wav',
}
export abstract class MediaUtilities {
	static playSound(sound: WellKnownSoundPaths, volume: number = 1.0): void {
		let audio = new Audio(sound);
		audio.volume = volume;
		audio.play();
	}
}
