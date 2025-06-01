/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Diğer ortam değişkenlerinizi burada tanımlayabilirsiniz
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
