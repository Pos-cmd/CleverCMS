import type { ProxyOptions } from 'vite';
import { createServiceConfig } from '../../src/utils/services';

/**
 * Set http proxy
 *
 * @param env - The current env
 * @param isDev - Is development environment
 */
export function createViteProxy(env: ViteEnv, isDev: boolean) {
  const isEnableHttpProxy = isDev && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const { baseURL, proxyPattern, other } = createServiceConfig(env);

  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern });

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item));
  });

  return proxy;
}

function createProxyItem(item: App.Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
  };

  return proxy;
}
