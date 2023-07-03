var Demo;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Color.js":
/*!**********************!*\
  !*** ./src/Color.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Color; }
/* harmony export */ });
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const colorRegExp = /^(#)?([0-9a-f]+)$/i;
function hex(n) {
  const s = n.toString(16);
  return s.length === 1 ? "0" + s : s;
}
function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
class Color {
  constructor(r, g, b) {
    _defineProperty(this, "r", void 0);
    _defineProperty(this, "g", void 0);
    _defineProperty(this, "b", void 0);
    this.r = r;
    this.g = g;
    this.b = b;
  }
  mix(other, ratio, out) {
    if (!out) {
      out = new Color();
    }
    out.r = this.r + (other.r - this.r) * ratio | 0;
    out.g = this.g + (other.g - this.g) * ratio | 0;
    out.b = this.b + (other.b - this.b) * ratio | 0;
    return out;
  }
  multiply(n, out) {
    if (!out) {
      out = new Color();
    }
    out.r = this.r * n;
    out.g = this.g * n;
    out.b = this.b * n;
    return out;
  }
  toRGBHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }
  toHex() {
    return (this.r << 16) + (this.g << 8) + this.b;
  }
  static validate(color) {
    let m;
    if (typeof color !== "string" || !(m = colorRegExp.exec(color))) {
      return null;
    }
    const col = m[2];
    if (col.length === 3) {
      return new Color(parseInt(col[0], 16) * 17, parseInt(col[1], 16) * 17, parseInt(col[2], 16) * 17);
    } else if (col.length === 6) {
      return new Color(parseInt(col.substring(0, 2), 16), parseInt(col.substring(2, 4), 16), parseInt(col.substring(4, 6), 16));
    } else {
      return null;
    }
  }
  static from(color) {
    let factor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
    if (Array.isArray(color)) {
      const length = color.length;
      const array = new Float32Array(length * 3);
      const f = factor / 255;
      let off = 0;
      for (let i = 0; i < length; i++) {
        const col = Color.from(color[i]);
        array[off++] = col.r * f;
        array[off++] = col.g * f;
        array[off++] = col.b * f;
      }
      return array;
    }
    const col = Color.validate(color);
    if (!col) {
      throw new Error("Invalid color " + color);
    }
    col.r *= factor;
    col.g *= factor;
    col.b *= factor;
    return col;
  }
  static fromHSL(h, s, l) {
    let r, g, b;
    if (s <= 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var performance_now__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! performance-now */ "./node_modules/performance-now/lib/performance-now.js");
/* harmony import */ var performance_now__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(performance_now__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");
/* harmony import */ var _polar_zebra_vert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./polar-zebra.vert */ "./src/polar-zebra.vert");
/* harmony import */ var _polar_zebra_frag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polar-zebra.frag */ "./src/polar-zebra.frag");
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Color */ "./src/Color.js");
// noinspection ES6UnusedImports







//console.log(fragmentShaderSource)

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;
const config = {
  width: 0,
  height: 0
};
let canvas, gl, vao, program;

// uniform: current time
let u_time;
let u_symmetry;
let u_resolution;
let u_mouse;
let mouseX = 0,
  mouseY = 0,
  mouseDown,
  startX,
  startY;

// Get the container element's bounding box
let canvasBounds;
function resize() {
  const width = window.innerWidth & ~15;
  const height = window.innerHeight | 0;
  config.width = width;
  config.height = height;
  canvas.width = width;
  canvas.height = height;
  mouseX = width / 2;
  mouseY = height / 2;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader)); // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.error(gl.getProgramInfoLog(program)); // eslint-disable-line
  gl.deleteProgram(program);
  return undefined;
}
function printError(msg) {
  document.getElementById("out").innerHTML = "<p>" + msg + "</p>";
}
function main(time) {
  const f = mouseDown ? 1 : -1;

  // update uniforms
  gl.uniform1f(u_time, performance_now__WEBPACK_IMPORTED_MODULE_1___default()() / 1000.0);
  gl.uniform2f(u_resolution, config.width, config.height);
  gl.uniform4f(u_mouse, mouseX, config.height - mouseY, startX * f, (config.height - startY) * f);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // draw
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
  requestAnimationFrame(main);
}
window.onload = () => {
  // Get A WebGL context
  canvas = document.getElementById("screen");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    canvas.parentNode.removeChild(canvas);
    printError("Cannot run shader. Your browser does not support WebGL2.");
    return;
  }

  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, _polar_zebra_vert__WEBPACK_IMPORTED_MODULE_3__["default"]);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, _polar_zebra_frag__WEBPACK_IMPORTED_MODULE_4__["default"]);

  // Link the two shaders into a program
  program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, -1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create a vertex array object (attribute state)
  vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  resize();
  u_time = gl.getUniformLocation(program, "u_time");
  u_resolution = gl.getUniformLocation(program, "u_resolution");
  u_mouse = gl.getUniformLocation(program, "u_mouse");

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);
  window.addEventListener("resize", resize, true);
  canvas.addEventListener("mousemove", onMouseMove, true);
  canvas.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("mouseup", onMouseUp, true);
  window.addEventListener("touchstart", onMouseDown, true);
  window.addEventListener("touchmove", onMouseMove, true);
  window.addEventListener("touchend", onMouseUp, true);
  canvasBounds = document.getElementById("screen").getBoundingClientRect();
  requestAnimationFrame(main);
};

// Apply the mouse event listener

function onMouseMove(ev) {
  if (mouseDown) {
    mouseX = ev.clientX - canvasBounds.left + self.pageXOffset;
    mouseY = ev.clientY - canvasBounds.top + self.pageYOffset;
  }
}
function onMouseDown(ev) {
  mouseDown = true;
  startX = ev.clientX - canvasBounds.left + self.pageXOffset;
  startY = ev.clientY - canvasBounds.top + self.pageYOffset;
  mouseX = startX;
  mouseY = startY;
}
function onMouseUp(ev) {
  mouseDown = false;
}

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/polar-zebra.frag":
/*!******************************!*\
  !*** ./src/polar-zebra.frag ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float u_time;\n\nuniform vec2 u_resolution;\nuniform vec4 u_mouse;\n\nconst float pi = 3.141592653589793;\nconst float tau = pi * 2.0;\nconst float invTau = 1.0 / tau;\nconst float hpi = pi * 0.5;\nconst float phi = (1.0+sqrt(5.0))/2.0;\n\nout vec4 outColor;\n\nfloat atan2(in float y, in float x)\n{\n    return abs(x) > abs(y) ? hpi - atan(x,y) : atan(y,x);\n}\n\n////////////////////// NOISE\n\n//\tSimplex 3D Noise\n//\tby Ian McEwan, Ashima Arts\n//\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n\nfloat snoise(vec3 v){\n    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n    // First corner\n    vec3 i  = floor(v + dot(v, C.yyy) );\n    vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n    // Other corners\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min( g.xyz, l.zxy );\n    vec3 i2 = max( g.xyz, l.zxy );\n\n    //  x0 = x0 - 0. + 0.0 * C\n    vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n    vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n    vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n    // Permutations\n    i = mod(i, 289.0 );\n    vec4 p = permute( permute( permute(\n    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n    // Gradients\n    // ( N*N points uniformly over a square, mapped onto an octahedron.)\n    float n_ = 1.0/7.0; // N=7\n    vec3  ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n    vec4 x = x_ *ns.x + ns.yyyy;\n    vec4 y = y_ *ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4( x.xy, y.xy );\n    vec4 b1 = vec4( x.zw, y.zw );\n\n    vec4 s0 = floor(b0)*2.0 + 1.0;\n    vec4 s1 = floor(b1)*2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n    vec3 p0 = vec3(a0.xy,h.x);\n    vec3 p1 = vec3(a0.zw,h.y);\n    vec3 p2 = vec3(a1.xy,h.z);\n    vec3 p3 = vec3(a1.zw,h.w);\n\n    //Normalise gradients\n    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n    // Mix final noise value\n    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n    dot(p2,x2), dot(p3,x3) ) );\n}\n\nvoid main(void)\n{\n    vec2 ratio = vec2(0.2);\n    vec2 uv = (gl_FragCoord.xy * ratio - .5 * u_resolution.xy * ratio)/min(u_resolution.x, u_resolution.y);\n\n    float dist = length(uv);\n\n    float r = tau * dist;\n    float time = u_time * 0.1;\n    float time2 = u_time * 0.07;\n\n    float angle = atan2(uv.y, uv.x) + time;\n    float n = snoise(vec3(dist * 200.0, cos(angle) * r, sin(angle) * r) + vec3(0, time, time2)) < 0.0 ? 0.0 : 1.0;\n\n    outColor = vec4(n, n, n,1);\n}\n");

/***/ }),

/***/ "./src/polar-zebra.vert":
/*!******************************!*\
  !*** ./src/polar-zebra.vert ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("#version 300 es\n#define GLSLIFY 1\n\n// an attribute is an input (in) to a vertex shader.\n// It will receive data from a buffer\nin vec4 a_position;\n\n// all shaders have a main function\nvoid main() {\n\n    // gl_Position is a special variable a vertex shader\n    // is responsible for setting\n    gl_Position = a_position;\n}\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkDemo"] = self["webpackChunkDemo"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], function() { return __webpack_require__("./src/index.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	Demo = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle-main-23883622be8597adcd7a.js.map