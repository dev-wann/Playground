import {
  SCRATCH_CANVAS_ID,
  SCRATCH_COVER_IMAGE_SRC,
  SCRATCH_RADIUS,
} from "@/app/scratch-card/_constants";

export default class ScratchController {
  private canvas: HTMLCanvasElement | null = null;
  private isScratching = false;

  init() {
    this.isScratching = false;

    // find canvas element
    this.canvas = document.getElementById(
      SCRATCH_CANVAS_ID,
    ) as HTMLCanvasElement | null;

    if (!this.canvas) {
      console.error("Canvas not found");
      return;
    }

    // init canvas
    const { width: canvasWidth, height: canvasHeight } =
      this.canvas.getBoundingClientRect();
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    // draw cover image
    const coverImage = new Image();
    coverImage.src = SCRATCH_COVER_IMAGE_SRC;

    return new Promise((resolve) => {
      coverImage.onload = () => {
        ctx.drawImage(coverImage, 0, 0, canvasWidth, canvasHeight);
        resolve(true);
      };
    });
  }

  startScratch() {
    this.isScratching = true;
  }

  stopScratch() {
    this.isScratching = false;
  }

  scratch(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!this.isScratching) return;

    const ctx = this.canvas?.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    const { offsetX, offsetY } = event.nativeEvent;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, SCRATCH_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  calculateProgress() {
    if (!this.canvas) return 0;

    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not found");
      return 0;
    }

    // 전체 캔버스의 픽셀 데이터를 가져옴
    const { width, height } = this.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // 투명한 픽셀 수 계산
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      // alpha 값이 0이면 완전 투명
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    // 전체 픽셀 대비 투명 픽셀의 비율 계산
    const totalPixels = width * height;
    return transparentPixels / totalPixels;
  }
}