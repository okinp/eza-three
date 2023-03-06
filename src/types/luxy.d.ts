export {};

interface Luxy {
  wapperOffset: number;
  init({
    wrapper,
    wapperSpeed,
  }: {
    wrapper: string;
    wapperSpeed: number;
  }): void;
}

declare global {
  interface Window {
    luxy: Luxy;
  }
}