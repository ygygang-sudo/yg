import 'vue';

declare module 'vue' {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}