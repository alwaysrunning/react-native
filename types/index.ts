// ============ 业务数据类型 ============

/** 新闻帖子（对应 jsonplaceholder /posts） */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** 通用 API 响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ============ 导航类型 ============

/** 首页 Stack 路由参数 */
export type HomeStackParamList = {
  Home: undefined;
  Detail: { item: Post };
};

/** 底部 Tab 路由参数 */
export type TabParamList = {
  HomeTab: undefined;
  MineTab: undefined;
};

// ============ Store 类型 ============

export interface NewsState {
  newsList: Post[];
  loading: boolean;
  favoriteIds: number[];

  loadFavorite: () => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  fetchNews: (limit?: number) => Promise<void>;
  appendNews: (limit?: number) => Promise<void>;
}
