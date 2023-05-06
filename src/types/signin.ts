import type { AxiosResponse } from 'axios';

// 登陆成功返回数据
export type signinRespItem = AxiosResponse<{
  message: string;
  token: string;
  user_id: number;
  statusCode: string;
}>;
