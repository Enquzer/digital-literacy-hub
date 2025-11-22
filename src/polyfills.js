// Polyfills for Node.js built-in modules that are not available in the browser

// Buffer polyfill
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = {
    prototype: {}
  };
}

// Stream polyfill
if (typeof window !== 'undefined' && !window.stream) {
  window.stream = {
    Readable: function() {},
    Writable: function() {},
    Duplex: function() {},
    Transform: function() {}
  };
}

// Events polyfill
if (typeof window !== 'undefined' && !window.events) {
  window.events = {
    EventEmitter: function() {}
  };
}

// Safer-buffer polyfill
if (typeof window !== 'undefined' && !window['safer-buffer']) {
  window['safer-buffer'] = {
    Buffer: function() {}
  };
}

export {};