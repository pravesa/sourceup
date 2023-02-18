type AnyObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

const storage = {
  set: (key: string, value: AnyObject) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default storage;
