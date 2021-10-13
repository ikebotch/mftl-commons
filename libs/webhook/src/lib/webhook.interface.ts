export interface WebhookEventModel {
  [id: string]: string
}
export interface WebhookHttpConfigModel {
  timeout: number;
  maxRedirects: number;
  headers?: any
}
