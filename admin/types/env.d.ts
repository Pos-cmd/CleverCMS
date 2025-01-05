/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  /** Interface for import.meta */
  interface ImportMeta extends ImportMetaEnv {}


}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
