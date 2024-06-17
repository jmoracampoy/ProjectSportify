import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.frontend.com',
  appName: 'frontend',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
