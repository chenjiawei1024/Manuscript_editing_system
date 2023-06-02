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

export interface AIImgRespListItem {
  results: ImgItem[];
}

export interface ImgItem {
  links: {
    download: string;
    download_location: string;
  };
  urls: {
    full: string;
    raw: string;
    small: string;
    thumb: string;
  };
}

export interface ImgShowItem {
  download: string;
  src: string;
}
