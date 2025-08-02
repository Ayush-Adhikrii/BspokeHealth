import { setCookie, getCookie } from "./cookie";

export const generateDeviceFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const canvasFingerprint = canvas.toDataURL();
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvasFingerprint,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      webdriver: navigator.webdriver,
    };
    
    const fingerprintString = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const deviceId = Math.abs(hash).toString(16).padStart(8, '0');
    
    console.log('Generated device fingerprint:', deviceId);
    return deviceId;
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    const fallbackFingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
    };
    
    const fingerprintString = JSON.stringify(fallbackFingerprint);
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const deviceId = Math.abs(hash).toString(16).padStart(8, '0');
    console.log('Generated fallback device fingerprint:', deviceId);
    return deviceId;
  }
};

export const getOrCreateDeviceId = () => {
  let deviceId = getCookie('deviceId');

  if (!deviceId) {
    deviceId = generateDeviceFingerprint();
    setCookie('deviceId', deviceId, 365);
    console.log('Created new device ID:', deviceId);
  } else {
    console.log('Retrieved existing device ID:', deviceId);
  }

  return deviceId;
}; 