const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  
  // Color parameters
  uniform float u_speed;
  uniform float u_waveScale;
  uniform float u_colorIntensity;
  uniform vec3 u_colorShift;
  uniform float u_noiseScale;
  uniform float u_noiseIntensity;

  // Improved hash function for better randomness
  vec2 hash(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // Cubic interpolation for smoother noise
  float cubic(float f) {
    return f * f * (3.0 - 2.0 * f);
  }

  // Higher quality 2D noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Cubic interpolation
    vec2 u = vec2(cubic(f.x), cubic(f.y));
    
    // Generate gradients and dot products
    vec2 ga = hash(i + vec2(0.0, 0.0));
    vec2 gb = hash(i + vec2(1.0, 0.0));
    vec2 gc = hash(i + vec2(0.0, 1.0));
    vec2 gd = hash(i + vec2(1.0, 1.0));
    
    float va = dot(ga, f - vec2(0.0, 0.0));
    float vb = dot(gb, f - vec2(1.0, 0.0));
    float vc = dot(gc, f - vec2(0.0, 1.0));
    float vd = dot(gd, f - vec2(1.0, 1.0));
    
    // Bilinear interpolation with cubic smoothing
    return mix(
        mix(va, vb, u.x),
        mix(vc, vd, u.x),
        u.y
    ) * 0.5 + 0.5;
  }

  // Fractal Brownian Motion for more detail
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    // Add multiple layers of noise
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
  }

  vec3 getColor(vec2 uv, float t) {
    vec3 col = vec3(0.0);
    float cx = 0.5 + 0.5 * sin(t + uv.y * u_waveScale);
    float cy = 0.5 + 0.5 * cos(t + uv.x * u_waveScale);
    float d = distance(uv, vec2(cx, cy));
    
    // Apply color shifts and intensity
    col.r = 0.5 + u_colorIntensity * cos(6.2831 * d - t + u_colorShift.r);
    col.g = 0.5 + u_colorIntensity * cos(6.2831 * d - t + u_colorShift.g);
    col.b = 0.5 + u_colorIntensity * cos(6.2831 * d - t + u_colorShift.b);
    return col;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = getColor(uv, u_time * u_speed);
    
    // Add high-quality animated noise
    float n = fbm(uv * (u_noiseScale*10.) + u_time * u_speed * 0.1);
    color = mix(color, color * (0.7 + 0.6 * n), u_noiseIntensity*1.1);
    
    // Create halo effect around mouse
    float mouseDistance = distance(uv, u_mouse);
    float halo = 1.0 - smoothstep(0.0, 0.7, mouseDistance);
    
    // Invert colors within the halo radius
    vec3 invertedColor = vec3(1.0) - color;
    color = mix(color, invertedColor, halo);
    
    gl_FragColor = vec4(color, 1.0);
  }
`; 