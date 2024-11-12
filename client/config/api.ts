import { Platform } from 'react-native';
import * as Device from 'expo-device';

const isEmulator = Device.isDevice === false;

export const API_BASE_URL = __DEV__
    ? Platform.select({
        android: isEmulator ? 'http://10.0.2.2:3000' : 'http://192.168.1.213:3000',
        ios: isEmulator ? 'http://localhost:3000' : 'http://192.168.1.213:3000',
    })
    : 'https://tuo-server-produzione.com';