/**
 * Debounce functions generator
 * @class 
 */
class Debounce {

  _localTimeout = null;
  _callback = null; 
  _timer = 0;

  /**
   * Debounce constructor
   * @constructor
   * @param {Function} callback - debounce function
   * @param {number} timer - milliseconds
   */
  constructor(callback, timer) {
    this._callback = callback;
    this._timer = timer;
  }

  /**
   * Runs debounce function
   * @method
   */
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