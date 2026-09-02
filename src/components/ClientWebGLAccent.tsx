import { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

float circle(vec2 uv, vec2 center, float radius, float blur) {
  float dist = length(uv - center);
  return smoothstep(radius + blur, radius - blur, dist);
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 warped = (uv - 0.5) * aspect;

  float t = u_time * 0.28;
  float wave = sin((warped.x * 8.0) + t) * 0.03 + cos((warped.y * 9.0) - t * 1.4) * 0.02;
  uv.y += wave;

  float goldBloom = circle(uv, vec2(0.22 + sin(t) * 0.03, 0.30), 0.24, 0.22);
  float whiteBloom = circle(uv, vec2(0.76, 0.64 + cos(t * 1.2) * 0.04), 0.20, 0.18);
  float horizon = smoothstep(0.95, 0.12, uv.y) * 0.14;
  float band = smoothstep(0.02, 0.5, sin((uv.x + uv.y + t) * 10.0) * 0.5 + 0.5) * 0.06;

  vec3 base = vec3(0.02, 0.02, 0.03);
  vec3 gold = vec3(0.77, 0.64, 0.35) * goldBloom;
  vec3 pearl = vec3(0.90, 0.88, 0.82) * whiteBloom * 0.42;
  vec3 color = base + gold + pearl + vec3(horizon + band);

  float vignette = smoothstep(1.15, 0.28, length((vUv - 0.5) * vec2(1.2, 1.0)));
  color *= vignette;

  gl_FragColor = vec4(color, 0.92);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function ClientWebGLAccent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    if (!gl) {
      return undefined;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      return undefined;
    }

    const program = gl.createProgram();

    if (!program) {
      return undefined;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return undefined;
    }

    const buffer = gl.createBuffer();

    if (!buffer) {
      gl.deleteProgram(program);
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const nextHeight = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      if (width === nextWidth && height === nextHeight) {
        return;
      }

      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    resize();

    let frameId: number | null = null;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === "visible";
    let prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const startedAt = performance.now();

    const render = (timestamp: number) => {
      frameId = null;

      if (!isVisible || !isDocumentVisible) {
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, (timestamp - startedAt) / 1000);
      gl.uniform2f(resolutionLocation, width, height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const renderWhenActive = () => {
      if (!isVisible || !isDocumentVisible) {
        return;
      }

      if (prefersReducedMotion) {
        render(performance.now());
      } else if (frameId === null) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";

      if (!isDocumentVisible && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      } else {
        renderWhenActive();
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;

      if (prefersReducedMotion && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      renderWhenActive();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? false;

      if (!isVisible && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      } else {
        renderWhenActive();
      }
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    renderWhenActive();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}