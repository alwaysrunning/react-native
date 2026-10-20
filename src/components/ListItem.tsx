import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNewsStore } from '../store/newsStore';
import { Colors } from '../constants/theme';
import type { Post } from '../types';

interface ListItemProps {
  item: Post;
  onPress: (item: Post) => void;
}

/**
 * 性能优化点：
 * 1. React.memo 包裹，props 不变时不重渲染
 * 2. favoriteIds 用选择器精确取，避免整个 store 变化都重渲染
 * 3. onPress 由父组件用 useCallback 缓存
 */
function ListItem({ item, onPress }: ListItemProps) {
  // 精确订阅：只取这一项是否在收藏列表里
  const isFav = useNewsStore((s) => s.favoriteIds.includes(item.id));
  const toggleFavorite = useNewsStore((s) => s.toggleFavorite);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const handleStar = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      toggleFavorite(item.id);
      scale.value = withSpring(1.3, {}, () => {
        scale.value = withSpring(1);
      });
    },
    [item.id, toggleFavorite, scale]
  );

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.itemWrap}>
        <View style={styles.row}>
          <View style={styles.textWrap}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemDesc} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
          <Animated.View style={animatedStyle}>
            <Pressable onPress={handleStar}>
              <Ionicons
                name={isFav ? 'star' : 'star-outline'}
                size={24}
                color={isFav ? Colors.favorite : '#999'}
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemWrap: {
    padding: 14,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.text,
  },
  itemDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

export default memo(ListItem);
