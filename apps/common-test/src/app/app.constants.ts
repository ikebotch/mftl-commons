import { RpcConfigModel } from "mftl-rpc";

export const serviceConfig: { [id: string]: RpcConfigModel } = {
  FETCH_CUSTOMER: {
    name: 'FETCH_CUSTOMER',
    url: process.env.RPC_GET_CUSTOMER,
    method: 'get',
  },
};
