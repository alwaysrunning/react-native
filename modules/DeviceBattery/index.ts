import { NativeModules } from 'react-native';

const DeviceBatteryModule = NativeModules.DeviceBattery;

export function getBatteryLevel(): Promise<number> {
  return DeviceBatteryModule.getBatteryLevel();
}
