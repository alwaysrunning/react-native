import request from './request';
import type { Post } from '../types';

/** 获取新闻列表 */
export function getNewsList(params: { _limit?: number; _start?: number } = {}) {
  return request.get<unknown, Post[]>('/posts', { params });
}

/** 获取单条新闻详情 */
export function getNewsDetail(id: number) {
  return request.get<unknown, Post>(`/posts/${id}`);
}
