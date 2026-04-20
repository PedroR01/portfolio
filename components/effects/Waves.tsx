import React, { useRef, useEffect, CSSProperties } from "react";

/**
 * Vector Gradient Class:
 * This class is used to store the gradient of a vector with dot product between two vectors in 2D, therefore his method only uses 2 coordinates.
 * @param x - The x coordinate of the gradient.
 * @param y - The y coordinate of the gradient.
 * @param z - The z coordinate of the gradient.
 * @returns The dot product of the gradient and the vector.
 * @example
 * const grad = new Grad(1, 2, 3);
 * const dot = grad.dot2(4, 5);
 * console.log(dot); // 26
 */
class Grad {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Dot Product Method: Calculates the dot product between two vectors in 2D, which indicates the similarity in direction between two vectors. Return the scalar result as a number.
   *
   * - If result > 0, the vectors are in the same direction.
   * - If result < 0, the vectors are in the opposite direction.
   * - If result == 0, the vectors are perpendicular.
   *
   * The dot product is also used to calculate the angle between two vectors.
   */
  dot2(x: number, y: number): number {
    return this.x * x + this.y * y;
  }
}

/**
 * Noise Class: Based on the original Perlin Noise algorithm by Ken Perlin, and improved later by Joseph Gentle and Stefan Gustavson.
 * This class is used to generate a noise value between 0 and 1.
 * @param seed - The seed of the noise.
 * @returns The noise value between 0 and 1.
 * @example
 * const noise = new Noise(2);
 * const value = noise.perlin2(1, 2);
 * console.log(value); // 0.5
 */
class Noise {
  grad3: Grad[];
  p: number[];
  perm: number[];
  gradP: Grad[];

  constructor(seed = 0) {
    // This is the gradient of the noise (by Ken Perlin), it is used to calculate the noise value. Each vector points towards one of these 12 edges of the unit cube.
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ];
    // Perlin permutation table, which consists of 256 numbers in the range 0-255 in a pseudo-random order.
    // This table is used to generate the noise value for each coordinate, using a hash function of the seed and the coordinate.
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    // Expansion to 512 elements (256 * 2), to avoid index out of bounds errors.
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }
  /**
   * Seed Method: Initializes the noise with a seed to generate alternative noise values with the permutation table.
   * @param seed - The seed of the noise.
   */
  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536; // 2¹⁶ = 2 bytes (16 bits)
    seed = Math.floor(seed);
    // Bit based operations. More details in the Waves.md file.
    if (seed < 256) seed |= seed << 8; // 256 = 2⁸ = 1 byte (8 bits)
    for (let i = 0; i < 256; i++) {
      const v =
        i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }
  /**
   * Fade Curve Method: A quintic polynomial (polynomial of degree 5) that is used to smooth the transition between two values. Like a smoothstep function.
   * @param t - The time value to be used in the fade curve.
   * @returns The value of the fade curve.
   */
  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10); // 6t^5 - 15t^4 + 10t^3
  }
  /**
   * Lerp Method: Linearly interpolates between two values. Like mix() method in GLSL.
   * @param a - The first value to be interpolated.
   * @param b - The second value to be interpolated.
   * @param t - The time value to be used in the interpolation.
   * @returns The interpolated value.
   */
  lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  perlin2(x: number, y: number): number {
    // Get the integer part of the coordinates.
    let X = Math.floor(x),
      Y = Math.floor(y);
    // Get the fractional part of the coordinates.
    x -= X;
    y -= Y;
    // Normalize the coordinates to the range 0-255.
    X &= 255;
    Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y); // Edge 00
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1); // Edge 01
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y); // Edge 10
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1); // Edge 11
    // Interpolate between the edges using the fade curve.
    const u = this.fade(x);
    return this.lerp(
      this.lerp(n00, n10, u), // Horizontal interpolation lower edges
      this.lerp(n01, n11, u), // Horizontal interpolation upper edges
      this.fade(y), // Vertical interpolation
    );
  }
}

interface Point {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: { x: number; y: number; vx: number; vy: number };
}

interface Mouse {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  smoothX: number;
  smoothY: number;
  velocity: number;
  smoothVelocity: number;
  angle: number;
  set: boolean;
}

interface Config {
  lineColor: string;
  waveSpeedX: number;
  waveSpeedY: number;
  waveAmpX: number;
  waveAmpY: number;
  friction: number;
  tension: number;
  maxCursorMove: number;
  xGap: number;
  yGap: number;
}

interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  style?: CSSProperties;
  className?: string;
}

const Waves: React.FC<WavesProps> = ({
  lineColor = "black",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  style = {},
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const boundingRef = useRef<{
    width: number;
    height: number;
    left: number;
    top: number;
  }>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const noiseRef = useRef(new Noise(2));
  const linesRef = useRef<Point[][]>([]);
  const mouseRef = useRef<Mouse>({
    x: -10,
    y: 0,
    lastX: 0,
    lastY: 0,
    smoothX: 0,
    smoothY: 0,
    velocity: 0,
    smoothVelocity: 0,
    angle: 0,
    set: false,
  });

  const configRef = useRef<Config>({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  });

  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    configRef.current = {
      lineColor,
      waveSpeedX,
      waveSpeedY,
      waveAmpX,
      waveAmpY,
      friction,
      tension,
      maxCursorMove,
      xGap,
      yGap,
    };
  }, [
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    ctxRef.current = canvas.getContext("2d");

    function setSize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      boundingRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    /**
     * Set Lines Method: Initializes the lines array with the width and height of the container. Creates a grid of points.
     */
    function setLines() {
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      // TODO: It seems that the overflow is not enough, we need to add more overflow to the width and height.
      const overflowWidth = width + 200,
        overflowHeight = height + 30;
      const { xGap, yGap } = configRef.current;
      const totalLines = Math.ceil(overflowWidth / xGap); // Total number of lines in the grid.
      const totalPoints = Math.ceil(overflowHeight / yGap); // Total number of points in each vertical line.
      // Calculate the starting position of the grid. Offset.
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;
      // Create the grid of points and therefore draw the lines.
      for (let i = 0; i <= totalLines; i++) {
        const pts: Point[] = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        linesRef.current.push(pts);
      }
    }

    /**
     * Move Points Method: Moves the points based on the noise and the mouse position.
     * @param time - The time value to be used in the movement.
     */
    function movePoints(time: number) {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      const {
        waveSpeedX,
        waveSpeedY,
        waveAmpX,
        waveAmpY,
        friction,
        tension,
        maxCursorMove,
      } = configRef.current;
      // Lines movement animation.
      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move =
            noise.perlin2(
              (p.x + time * waveSpeedX) * 0.002,
              (p.y + time * waveSpeedY) * 0.0015,
            ) * 12;
          p.wave.x = Math.cos(move) * waveAmpX;
          p.wave.y = Math.sin(move) * waveAmpY;
          // Mouse movement interaction effect.
          const dx = p.x - mouse.smoothX,
            dy = p.y - mouse.smoothY;
          const dist = Math.hypot(dx, dy);
          const l = Math.max(175, mouse.smoothVelocity);
          if (dist < l) {
            const s = 1 - dist / l;
            const f = Math.cos(dist * 0.001) * s;
            p.cursor.vx +=
              Math.cos(mouse.angle) * f * l * mouse.smoothVelocity * 0.00065;
            p.cursor.vy +=
              Math.sin(mouse.angle) * f * l * mouse.smoothVelocity * 0.00065;
          }
          // Friction and tension mouse effect.
          p.cursor.vx += (0 - p.cursor.x) * tension;
          p.cursor.vy += (0 - p.cursor.y) * tension;
          p.cursor.vx *= friction;
          p.cursor.vy *= friction;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(
            maxCursorMove,
            Math.max(-maxCursorMove, p.cursor.x),
          );
          p.cursor.y = Math.min(
            maxCursorMove,
            Math.max(-maxCursorMove, p.cursor.y),
          );
        });
      });
    }

    /**
     * Moved Method: Moves the point based on the wave and the cursor movement.
     * @param point - The point to be moved.
     * @param withCursor - Whether to include the cursor movement in the calculation.
     * @returns X and Y coordinates of the moved point.
     */
    function moved(point: Point, withCursor = true): { x: number; y: number } {
      // const ny = point.y / (boundingRef.current.height * 0.05); // The spread of the lines makes some kind of illusion of POV effect.
      const ny = point.y / boundingRef.current.height;
      const spreadX = (point.x - boundingRef.current.width / 2) * ny;

      const x =
        point.x + point.wave.x + (withCursor ? point.cursor.x : 0) + spreadX;
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }
    /**
     * Draw Lines Method: Draws the lines on the canvas.
     *
     */
    function drawLines() {
      const { width, height } = boundingRef.current;
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = configRef.current.lineColor;
      linesRef.current.forEach((points) => {
        let p1 = moved(points[0], false);
        ctx.moveTo(p1.x, p1.y); // The canvas moves to or takes the origin point of the line in the coordinates.
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1;
          p1 = moved(p, !isLast);
          const p2 = moved(
            points[idx + 1] || points[points.length - 1],
            !isLast,
          );
          ctx.lineTo(p1.x, p1.y); // The canvas draws a line to the next point from the origin point.
          if (isLast) ctx.moveTo(p2.x, p2.y); // The canvas moves the origin point to the next point.
        });
      });
      const lineColor = configRef.current.lineColor;
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, lineColor);
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.25;
      ctx.globalAlpha = 0.58;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    /**
     * Tick Method: The main animation loop.
     * @param t - The time value to be used in the animation.
     */
    function tick(t: number) {
      if (!container) return;
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1;
      const dx = mouse.x - mouse.lastX,
        dy = mouse.y - mouse.lastY;
      const d = Math.hypot(dx, dy);
      mouse.velocity = d;
      mouse.smoothVelocity += (d - mouse.smoothVelocity) * 0.1;
      mouse.smoothVelocity = Math.min(100, mouse.smoothVelocity);
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.angle = Math.atan2(dy, dx);
      // Show mouse position in the screen
      // container.style.setProperty("--x", `${mouse.smoothX}px`);
      // container.style.setProperty("--y", `${mouse.smoothY}px`);

      movePoints(t);
      drawLines();
      frameIdRef.current = requestAnimationFrame(tick);
    }

    function onResize() {
      setSize();
      setLines();
    }
    function onMouseMove(e: MouseEvent) {
      updateMouse(e.clientX, e.clientY);
    }
    function onTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY);
    }
    function updateMouse(x: number, y: number) {
      const mouse = mouseRef.current;
      const b = boundingRef.current;
      mouse.x = x - b.left;
      mouse.y = y - b.top;
      if (!mouse.set) {
        mouse.smoothX = mouse.x;
        mouse.smoothY = mouse.y;
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        mouse.set = true;
      }
    }

    setSize();
    setLines();
    frameIdRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor,
        ...style,
      }}
      className={`absolute top-0 left-0 w-full h-full overflow-hidden ${className}`}
    >
      <div
        className="absolute top-0 left-0 bg-[#160000] rounded-full w-2 h-2"
        style={{
          transform:
            "translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)",
          willChange: "transform",
        }}
      />
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default Waves;
