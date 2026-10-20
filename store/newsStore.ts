import { create } from 'zustand';
import { getNewsList } from '../api/news';
import { getStorage, setStorage } from '../utils/storage';
import type { NewsState } from '../types';

const FAV_KEY = 'favorites';

export const useNewsStore = create<NewsState>((set, get) => ({
  newsList: [],
  loading: false,
  favoriteIds: [],

  loadFavorite: async () => {
    const fav = await getStorage<number[]>(FAV_KEY);
    if (fav) set({ favoriteIds: fav });
  },

  toggleFavorite: async (id) => {
    const { favoriteIds } = get();
    const newFav = favoriteIds.includes(id)
      ? favoriteIds.filter((item) => item !== id)
      : [...favoriteIds, id];
    set({ favoriteIds: newFav });
    await setStorage(FAV_KEY, newFav);
  },

  fetchNews: async (limit = 10) => {
    set({ loading: true });
    try {
      const res = await getNewsList({ _limit: limit });
      set({ newsList: res, loading: false });
    } catch (err) {
      console.error('获取新闻失败', err);
      set({ loading: false });
    }
  },

  appendNews: async (limit = 10) => {
    const { newsList } = get();
    try {
      const res = await getNewsList({ _limit: limit, _start: newsList.length });
      set({ newsList: [...newsList, ...res] });
    } catch (err) {
      console.error('上拉加载失败', err);
    }
  },
}));
