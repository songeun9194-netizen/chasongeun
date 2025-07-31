
declare var GIF: new (options: {
  workers: number;
  quality: number;
  workerScript: string;
}) => {
  addFrame: (
    image: CanvasImageSource,
    options: { delay: number; copy: boolean }
  ) => void;
  on: (event: string, callback: (blob: Blob) => void) => void;
  render: () => void;
};
