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

export interface AIRespItem {
  result: string;
}

export interface AIRespListItem {
  result: string[];
}
