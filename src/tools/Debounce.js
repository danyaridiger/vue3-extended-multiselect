class Debounce {

  _localTimeout = null;
  _callback = null; 
  _timer = 0;

  constructor(callback, timer) {
    this._callback = callback;
    this._timer = timer;
  }

  start() {
    if (this._localTimeout) {
      clearTimeout(this._localTimeout);
    }

    this._localTimeout = setTimeout(() => {
      this._callback();
    }, this._timer);
  }
}

export default Debounce;