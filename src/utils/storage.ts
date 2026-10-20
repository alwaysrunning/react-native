import AsyncStorage from '@react-native-async-storage/async-storage';

/** 保存任意可序列化值 */
export const setStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('存储失败', e);
  }
};

/** 读取并自动反序列化 */
export const getStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn('读取失败', e);
    return null;
  }
};

export const removeStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('删除失败', e);
  }
};
