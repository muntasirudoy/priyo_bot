/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ALLOWED_EMBED_ORIGINS?: string;
}

interface ImportMeta { readonly env: ImportMetaEnv; }
