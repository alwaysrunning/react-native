import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import ListItem from '../components/ListItem';
import { useNewsStore } from '../store/newsStore';
import { Colors, Spacing } from '../constants/theme';
import type { HomeStackParamList, Post } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const newsList = useNewsStore((s) => s.newsList);
  const loading = useNewsStore((s) => s.loading);
  const fetchNews = useNewsStore((s) => s.fetchNews);
  const appendNews = useNewsStore((s) => s.appendNews);
  const loadFavorite = useNewsStore((s) => s.loadFavorite);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      await loadFavorite();
      await fetchNews(10);
    })();
  }, [loadFavorite, fetchNews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews(10);
    setRefreshing(false);
  }, [fetchNews]);

  const onEndReached = useCallback(async () => {
    await appendNews(10);
  }, [appendNews]);

  // 性能优化：renderItem 用 useCallback 缓存，keyExtractor 用稳定函数
  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <ListItem
        item={item}
        onPress={(post) => navigation.navigate('Detail', { item: post })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback(
    (item: Post) => String(item.id),
    []
  );

  const ItemSeparator = useCallback(
    () => <View style={styles.divider} />,
    []
  );

  const EmptyComponent = useCallback(
    () => (
      <View style={styles.emptyWrap}>
        <Text>暂无数据</Text>
        <Pressable onPress={() => fetchNews(10)} style={styles.retryBtn}>
          <Text style={styles.retryText}>重试</Text>
        </Pressable>
      </View>
    ),
    [fetchNews]
  );

  if (loading && newsList.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyComponent}
        // FlatList 性能优化关键属性
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  },
  emptyWrap: {
    marginTop: 80,
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  retryText: {
    color: Colors.white,
  },
});
