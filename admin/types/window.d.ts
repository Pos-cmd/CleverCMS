export {}

declare global {
  interface Window {
    // Useful for naive-ui
    /** Toast instance from vue-sonner */
    $toast: typeof import('vue-sonner').toast
    /** Loading bar instance */
    $loadingBar: import('naive-ui').LoadingBarProviderInst
    /** Dialog instance */
    $dialog: import('naive-ui').DialogProviderInst
    /** Message instance */
    $message: import('naive-ui').MessageProviderInst
    /** Notification instance */
    $notification: import('naive-ui').NotificationProviderInst
    /** Modal instance */
    $modal: import('naive-ui').ModalProviderInst
  }
}
