import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useNewsStore } from '../store/newsStore';
import { Colors, Spacing } from '../constants/theme';
import type { HomeStackParamList } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { item } = route.params;
  const isFav = useNewsStore((s) => s.favoriteIds.includes(item.id));
  const toggleFavorite = useNewsStore((s) => s.toggleFavorite);

  const copyTitle = useCallback(async () => {
    await Clipboard.setStringAsync(item.title);
    alert('标题已复制！');
  }, [item.title]);

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name={isFav ? 'star' : 'star-outline'}
            size={26}
            color={isFav ? Colors.favorite : '#999'}
          />
        </Pressable>
      </View>

      <Text style={styles.desc}>{item.body}</Text>

      <Pressable style={styles.copyBtn} onPress={copyTitle}>
        <Text style={styles.copyText}>复制标题</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  copyBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyText: {
    color: Colors.white,
    fontSize: 16,
  },
});
