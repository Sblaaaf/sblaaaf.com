/**
 * 3D simplex noise — Ian McEwan, Stefan Gustavson (Ashima Arts), MIT License.
 * https://github.com/ashima/webgl-noise
 */
const simplexNoise3d = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform vec3 uPointerDir;      // pointer direction, in object space
  uniform float uPointerStrength;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vDisplacement;

  ${simplexNoise3d}

  // Radial displacement of a point on the unit sphere.
  float displace(vec3 p) {
    float n = snoise(p * uFrequency + vec3(0.0, 0.0, uTime * 0.22));
    // Second octave, domain-warped by the first: gives the "fluid" folds.
    n += 0.35 * snoise(p * uFrequency * 2.1 + n * 0.6 - uTime * 0.12);
    // Soft bulge on the side facing the pointer.
    float bulge = pow(max(dot(p, uPointerDir), 0.0), 6.0) * uPointerStrength;
    return n * uAmplitude + bulge;
  }

  vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
  }

  void main() {
    vec3 p = normalize(position);
    float d = displace(p);
    vec3 displaced = p * (1.0 + d);

    // Recompute the normal from two displaced neighbours (tangent / bitangent),
    // so lighting follows the deformed surface.
    const float EPS = 0.015;
    vec3 t = orthogonal(p);
    vec3 b = cross(p, t);
    vec3 pt = normalize(p + t * EPS);
    vec3 pb = normalize(p + b * EPS);
    vec3 displacedT = pt * (1.0 + displace(pt));
    vec3 displacedB = pb * (1.0 + displace(pb));
    vec3 displacedNormal = normalize(cross(displacedT - displaced, displacedB - displaced));

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * displacedNormal);
    vViewDir = normalize(-mvPosition.xyz);
    vDisplacement = d;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform float uContourDensity;
  uniform float uGlow; // 0..1, overall strength of the accent

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vDisplacement;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    vec3 lightDir = normalize(vec3(-0.5, 0.7, 0.6));

    float diffuse = max(dot(n, lightDir), 0.0);
    float specular = pow(max(dot(reflect(-lightDir, n), v), 0.0), 40.0);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);

    // Topographic contour lines on the displacement field, anti-aliased with fwidth.
    float f = vDisplacement * uContourDensity;
    float line = abs(fract(f) - 0.5) / max(fwidth(f), 1e-4);
    float contour = 1.0 - min(line, 1.0);

    vec3 color = uColorBase * (0.35 + 0.65 * diffuse);
    color += specular * 0.18;
    color = mix(color, uColorAccent, fresnel * 0.85 * uGlow);
    color = mix(color, uColorAccent, contour * 0.25 * (1.0 - fresnel) * uGlow);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>

    // Dithering (in output space) removes banding on the dark gradients.
    gl_FragColor.rgb += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  }
`;
