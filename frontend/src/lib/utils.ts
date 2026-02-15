import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const coordToLabel = (x: number, y: number) => {
  if (y % 2 == 0) {
    x = 9 - x;
  }

  const label = (9 - y) * 10 + x + 1;

  return label;
};

export const labelToCoord = (label: number) => {
  label--;

  let x: number = Math.floor(label % 10);
  const y: number = 9 - Math.floor(label / 10);

  const goingRight: boolean = y % 2 !== 0;

  if (!goingRight) {
    x = 10 - x - 1;
  }

  return { y, x };
};
