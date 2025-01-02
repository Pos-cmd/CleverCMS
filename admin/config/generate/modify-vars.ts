import { resolve } from 'node:path'

/**
 * less global variable
 */
export function generateModifyVars() {
  return {
    hack: `true;@import (reference) "${resolve('src/design/config.less')}";`,
  }
}
