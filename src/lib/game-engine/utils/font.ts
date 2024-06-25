import { Settings } from '../builtin/Settings';

export function font(size: number = 14, family: string = Settings.defaultFontFamily) {
	return `${Math.round(size * Settings.fontScale)}px '${family}'`;
}
