console.log("shader main.js loaded")

class GradientEffect {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.params = {
      speed: 0.2,
      waveScale: 2.0,
      colorIntensity: 0.25,
      colorShiftR: 0.0,
      colorShiftG: 0.9,
      colorShiftB: 2.1,
      noiseScale: 90.0,
      noiseIntensity: 0.6
    };

    this.setupWebGL();
    this.setupGUI();
    this.setupEventListeners();
    this.render(0);
  }

  setupWebGL() {
    // Set canvas size
    this.resizeCanvas();

    // Compile shaders
    const vertShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertShader);
    this.gl.attachShader(this.program, fragShader);
    this.gl.linkProgram(this.program);

    // Setup buffers
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ]), this.gl.STATIC_DRAW);

    // Get uniform locations
    this.uniforms = {
      u_time: this.gl.getUniformLocation(this.program, 'u_time'),
      u_resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
      u_mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
      u_speed: this.gl.getUniformLocation(this.program, 'u_speed'),
      u_waveScale: this.gl.getUniformLocation(this.program, 'u_waveScale'),
      u_colorIntensity: this.gl.getUniformLocation(this.program, 'u_colorIntensity'),
      u_colorShift: this.gl.getUniformLocation(this.program, 'u_colorShift'),
      u_noiseScale: this.gl.getUniformLocation(this.program, 'u_noiseScale'),
      u_noiseIntensity: this.gl.getUniformLocation(this.program, 'u_noiseIntensity')
    };
  }

  setupGUI() {
    const gui = new dat.GUI();
    const colorFolder = gui.addFolder('Color Controls');
    colorFolder.add(this.params, 'speed', 0.1, 3.0).name('Animation Speed');
    colorFolder.add(this.params, 'waveScale', 0.5, 10.0).name('Wave Scale');
    colorFolder.add(this.params, 'colorIntensity', 0.1, 1.0).name('Color Intensity');
    colorFolder.add(this.params, 'colorShiftR', 0, 6.28).name('Red Phase');
    colorFolder.add(this.params, 'colorShiftG', 0, 6.28).name('Green Phase');
    colorFolder.add(this.params, 'colorShiftB', 0, 6.28).name('Blue Phase');
    //colorFolder.open();

    const noiseFolder = gui.addFolder('Noise Controls');
    noiseFolder.add(this.params, 'noiseScale', 90.0, 100.0).name('Noise Scale');
    noiseFolder.add(this.params, 'noiseIntensity', 0.0, 1.0).name('Noise Intensity');
    //noiseFolder.open();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  render(t) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    
    // Setup position attribute
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Update uniforms
    this.gl.uniform1f(this.uniforms.u_time, t * 0.001);
    this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.uniforms.u_mouse, 
      this.mouseX / this.canvas.width, 
      1.0 - (this.mouseY / this.canvas.height)
    );
    
    this.gl.uniform1f(this.uniforms.u_speed, this.params.speed);
    this.gl.uniform1f(this.uniforms.u_waveScale, this.params.waveScale);
    this.gl.uniform1f(this.uniforms.u_colorIntensity, this.params.colorIntensity);
    this.gl.uniform3f(this.uniforms.u_colorShift, 
      this.params.colorShiftR, 
      this.params.colorShiftG, 
      this.params.colorShiftB
    );
    this.gl.uniform1f(this.uniforms.u_noiseScale, this.params.noiseScale);
    this.gl.uniform1f(this.uniforms.u_noiseIntensity, this.params.noiseIntensity);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    requestAnimationFrame((t) => this.render(t));
  }
}

// Initialize when the window loads
window.addEventListener('load', () => {
  const canvas = document.getElementById('glcanvas');
  new GradientEffect(canvas);
}); 