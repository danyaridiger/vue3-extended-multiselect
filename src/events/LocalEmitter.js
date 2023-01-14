class LocalEmitter {

  _eventsStack = {
    payload: null,
  };
  _eventsRegistered = [];

  emit(eventName, payload = null) {
    const proxies = this._eventsRegistered.filter(event => event.eventName === eventName);

    if (!proxies.length) return;
        
    proxies.forEach((proxy) => {
      this._eventsStack.payload = payload;
      proxy.proxy.payload = payload;
    });
  }

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