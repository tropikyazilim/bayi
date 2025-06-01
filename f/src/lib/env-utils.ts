// Vite ortam değişkenlerine erişim için yardımcı fonksiyon
export const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  try {
    // @ts-ignore - Bu satır TypeScript'in import.meta.env hatasını görmezden gelmesini sağlar
    const value = import.meta.env[key];
    return value || defaultValue;
  } catch (e) {
    console.warn(`Ortam değişkeni okunamadı: ${key}, varsayılan değer kullanılıyor.`, e);
    return defaultValue;
  }
};
