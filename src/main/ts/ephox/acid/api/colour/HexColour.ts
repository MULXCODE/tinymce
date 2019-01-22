import { Option, Fun } from '@ephox/katamari';

import { Hex, Rgba } from './ColourTypes';

const hexColour = (hexString: string): Hex => {
  return {
    value: Fun.constant(hexString)
  };
};

const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

const isHexString = (hex: string):boolean => {
  return shorthandRegex.test(hex) || longformRegex.test(hex);
};

const fromString = (hex: string): Option<Hex> => {
  return isHexString(hex) ? Option.some({ value: Fun.constant(hex) }) : Option.none();
};

// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
const getLongForm = (hexColour: Hex): Hex => {
  const hexString = hexColour.value().replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  return { value: Fun.constant(hexString) }
};

const extractValues = (hexColour: Hex):RegExpExecArray => {
  const longForm = getLongForm(hexColour);
  return longformRegex.exec(longForm.value());
};

const toHex = (component: number): string => {
  const hex = component.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const fromRgba = (rgbaColour: Rgba): Hex => {
  const value = toHex(rgbaColour.red()) + toHex(rgbaColour.green()) + toHex(rgbaColour.blue());
  return hexColour(value);
};

export {
  hexColour,
  isHexString,
  fromString,
  fromRgba,
  extractValues
};