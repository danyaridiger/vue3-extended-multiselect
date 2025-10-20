/**
 * Event emitter
 * @class
 */

class LocalEmitter {
  _eventsStack = {
    payload: null,
  };
  _eventsRegistered = [];

  /**
   * Triggers some event with given name
   * @method
   * @param {string} eventName - name of event
   * @param {} payload - data of event
   */
  emit(eventName, payload = null) {
    const proxies = this._eventsRegistered.filter(
      (event) => event.eventName === eventName,
    );

    if (!proxies.length) return;

    proxies.forEach((proxy) => {
      this._eventsStack.payload = payload;
      proxy.proxy.payload = payload;
    });
  }

  /**
   * Registers an event listener with the given name
   * @method
   * @param {string} eventName - name of event
   * @param {Function} callback - function to fire due to event
   */
  on(eventName, callback) {
    this._eventsRegistered.push({
      eventName,
      proxy: new Proxy(this._eventsStack, {
        set(target) {
          callback(target.payload);

          return target;
        },
      }),
    });
  }
}

export default LocalEmitter;
