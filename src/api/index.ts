import router from '@/router';
import type { HotSpotItem, NewsItem } from '@/types/creation';
import axios from 'axios';

const instance = axios.create({
  // 设置请求头
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 处理响应错误
    if (error.response && error.response.status === 401) {
      // 跳转到登陆页面
      router.push({ path: '/signin', query: { expired: '1' } });
    }
    return Promise.reject(error);
  },
);

export default instance;

export const getHotList = async (): Promise<NewsItem[]> => {
  const { data } = (await axios.get('https://v.api.aa1.cn/api/topbaidu/')) as HotSpotItem;
  return data.newslist;
};
