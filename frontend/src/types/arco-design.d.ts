declare module '@arco-design/web-vue/es/form' {
  import { Component } from 'vue';
  
  export interface FormInstance {
    validate: () => Promise<boolean>;
    resetFields: () => void;
    clearValidate: () => void;
  }
  
  export const Form: Component;
  export const FormItem: Component;
}