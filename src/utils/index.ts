import { Appearance } from '../types'

const APPEARANCE_VALUES: Appearance[] = ['system', 'dark', 'light']

export const isValidAppearance = (value: unknown): value is Appearance =>
  APPEARANCE_VALUES.includes(value as Appearance)

/** Accepts 3- and 6-digit hex color strings (#rgb, #rrggbb). */
export const isValidColor = (value: string): boolean =>
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
