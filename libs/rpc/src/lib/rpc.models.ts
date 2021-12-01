export interface RpcConfigModel {
  name: string;
  url: string;
  method: 'get' | 'delete' | 'post';
}
