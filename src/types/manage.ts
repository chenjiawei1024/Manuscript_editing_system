import type { AxiosResponse } from 'axios';
import type { RouteLocationRaw } from 'vue-router';

export interface FolderDetailItem {
  folder_id: number;
  folder_name: string;
  created_time: Date;
  last_accessed_at: Date;
  is_favorite: boolean;
  child_folder_count: number;
  child_file_count: number;
}

export interface FileDetailItem {
  file_id: number;
  file_name: string;
  created_time: Date;
  last_accessed_at: Date;
  is_favorite: boolean;
  content: string;
  is_shared?: string;
  tags: TagDetailItem[];
}

export interface TagDetailItem {
  tag_id: number;
  tag_name: string;
}

export interface breadcrumbItem {
  title: string;
  href: string;
  to?: RouteLocationRaw;
}
