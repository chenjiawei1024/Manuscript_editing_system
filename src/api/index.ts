import axios from 'axios';

export const getHotList = async (): Object => {
  const data = await axios.get('https://v.api.aa1.cn/api/topbaidu/');
  return data;
};
