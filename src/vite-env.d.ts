/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV_APP?: "production" | "stage";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
