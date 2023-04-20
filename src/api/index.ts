import type { HotSpotItem, NewsItem } from '@/types/creation';
import axios from 'axios';

export const getHotList = async (): Promise<NewsItem[]> => {
  const { data } = (await axios.get('https://v.api.aa1.cn/api/topbaidu/')) as HotSpotItem;
  return data.newslist;
};
