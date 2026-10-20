import { Alert } from 'react-native';

interface ErrorUtils {
  setGlobalHandler: (handler: (error: Error, isFatal: boolean) => void) => void;
}

declare global {
  // eslint-disable-next-line no-var
  var ErrorUtils: ErrorUtils | undefined;
}

const errorHandler = (error: Error, isFatal: boolean): void => {
  if (isFatal) {
    Alert.alert('程序异常', '发生严重错误', [{ text: '确定' }]);
  } else {
    console.warn('JS捕获异常：', error?.message);
  }
};

export const registerGlobalError = (): void => {
  global.ErrorUtils?.setGlobalHandler(errorHandler);
};
