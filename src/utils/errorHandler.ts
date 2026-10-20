import { Alert } from 'react-native';

interface ErrorUtilsLike {
  setGlobalHandler: (handler: (error: Error, isFatal: boolean) => void) => void;
}

const errorHandler = (error: Error, isFatal: boolean): void => {
  if (isFatal) {
    Alert.alert('程序异常', '发生严重错误', [{ text: '确定' }]);
  } else {
    console.warn('JS捕获异常：', error?.message);
  }
};

export const registerGlobalError = (): void => {
  const errorUtils = (globalThis as unknown as { ErrorUtils?: ErrorUtilsLike })
    .ErrorUtils;
  errorUtils?.setGlobalHandler(errorHandler);
};
