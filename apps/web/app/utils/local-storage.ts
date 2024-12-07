export const LOCAL_STORAGE_KEY = 'recommend-ai';

export const setLocalStorage = (value: string): void => {
  window.localStorage.setItem(`${LOCAL_STORAGE_KEY}`, value);
};

export const getLocalStorage = (key: string): any => {
  const item = window.localStorage.getItem(key);
  if (!item) return null;

  return item;
};

export const setLocalStorageByKey = ({
  key,
  value,
  stringify,
}: {
  key: string,
  value: any,
  stringify: boolean,
}) => {
  try {
    const data = stringify && value ? JSON.stringify(value) : value;
    window.localStorage.setItem(key, data);
  } catch (err) {
    return false;
  }
};

export const getLocalStorageByKey = ({
  key,
  parse,
}: {
  key: string,
  parse: boolean,
}) => {
  try {
    const Object = window.localStorage.getItem(key);
    const result = parse && Object ? JSON.parse(Object) : Object;
    return result;
  } catch (err) {
    return false;
  }
};
