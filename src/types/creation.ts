export interface HotSpotItem {
  data: {
    code?: number;
    msg?: string;
    newslist: NewsItem[];
  };
}

export interface NewsItem {
  title: string;
  hotnum: number;
  digest: string;
}
