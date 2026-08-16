(function (global) {
  'use strict';

  function createLocalStorageAdapter(storage) {
    return {
      read(key, fallbackFactory) {
        try {
          const value = storage.getItem(key);
          return value === null ? fallbackFactory() : JSON.parse(value);
        } catch (error) {
          console.warn(`Could not read ${key}; using fallback data.`, error);
          return fallbackFactory();
        }
      },
      write(key, value) {
        try {
          storage.setItem(key, JSON.stringify(value));
          return { ok: true };
        } catch (error) {
          console.error(`Could not save ${key}.`, error);
          return { ok: false, error };
        }
      },
      getFlag(key) {
        try { return storage.getItem(key); } catch { return null; }
      },
      setFlag(key, value) {
        try { storage.setItem(key, value); return true; } catch { return false; }
      }
    };
  }

  function createDesktopBridgeAdapter(bridge) {
    return {
      read(key, fallbackFactory) {
        try {
          const value = bridge.read(key);
          return value == null ? fallbackFactory() : value;
        } catch (error) {
          console.warn(`Could not read ${key}; using fallback data.`, error);
          return fallbackFactory();
        }
      },
      write(key, value) {
        try {
          const ok = bridge.write(key, value);
          return ok === false ? { ok: false, error: new Error('Desktop storage write failed') } : { ok: true };
        } catch (error) {
          console.error(`Could not save ${key}.`, error);
          return { ok: false, error };
        }
      },
      getFlag(key) {
        try { return bridge.getFlag?.(key) ?? null; } catch { return null; }
      },
      setFlag(key, value) {
        try { return bridge.setFlag?.(key, value) !== false; } catch { return false; }
      }
    };
  }

  function createStorageAdapter({ browserStorage, desktopBridge }) {
    return desktopBridge
      ? createDesktopBridgeAdapter(desktopBridge)
      : createLocalStorageAdapter(browserStorage);
  }

  global.QuickNotesStorage = Object.freeze({
    createDesktopBridgeAdapter,
    createLocalStorageAdapter,
    createStorageAdapter
  });
})(window);
