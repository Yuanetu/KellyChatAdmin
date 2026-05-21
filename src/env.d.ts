/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuex' {
  import type { App } from 'vue'
  export function createStore<S>(options: any): Store<S>
  export function useStore<S = any>(): Store<S>
  export interface Store<S> {
    readonly state: S
    readonly getters: any
    commit(type: string, payload?: any): void
    dispatch(type: string, payload?: any): Promise<any>
    install(app: App, ...options: any[]): void
  }
}
