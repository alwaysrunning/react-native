import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Modal,
  Pressable,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Updates from 'expo-updates';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Colors, Spacing } from '../constants/theme';

// 配置通知展示行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MineScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 检查更新
  const checkUpdate = async () => {
    setIsChecking(true);
    try {
      // 1. 请求服务器，看是否有可用更新
      const updateResult = await Updates.checkForUpdateAsync();
      if (updateResult.isAvailable) {
        Alert.alert('发现新版本', '是否立即下载更新？', [
          { text: '稍后', style: 'cancel' },
          {
            text: '更新',
            onPress: async () => {
              setIsDownloading(true);
              try {
                // 2. 下载JS包和资源
                await Updates.fetchUpdateAsync();
                Alert.alert('下载完成，即将重启App');
                // 3. 立刻重启App加载新版本
                await Updates.reloadAsync();
              } catch (err) {
                Alert.alert('更新失败', String(err));
                setIsDownloading(false);
              }
            },
          },
        ]);
      } else {
        Alert.alert('当前已经是最新版本');
      }
    } catch (e) {
      Alert.alert('检查更新出错', String(e));
    } finally {
      setIsChecking(false);
    }
  };

  // 申请相册权限 + 通知权限
  useEffect(() => {
    (async () => {
      const { status: photoStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (photoStatus !== 'granted') {
        Alert.alert('权限提示', '需要相册权限才能选择图片');
      }

      // 通知权限
      const { status: notifStatus } =
        await Notifications.getPermissionsAsync();
        
      if (notifStatus !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }

      // Android 通知渠道
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  // 本地触发一条推送通知
  const sendTestNotification = useCallback(async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '新闻提醒',
        body: '你收藏的新闻有更新啦！',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>李四</Text>
        <Text style={styles.info}>前端开发工程师</Text>
      </View>

      <Pressable style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.btnText}>从相册选择图片</Text>
      </Pressable>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImg} />
      )}

      <Pressable style={styles.notifBtn} onPress={sendTestNotification}>
        <Text style={styles.btnText}>发送测试推送</Text>
      </Pressable>

      <View style={styles.row}>
        <Text>深色模式</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <Pressable style={styles.btn} onPress={() => setModalVisible(true)}>
        <Text style={styles.btnText}>打开弹窗</Text>
      </Pressable>

      <Pressable style={styles.updateBtn} onPress={checkUpdate} disabled={isChecking || isDownloading}>
        {isChecking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>检查版本更新（OTA热更）</Text>
        )}
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>提示</Text>
            <Text>这是自定义Modal弹窗</Text>
            <Pressable
              style={styles.modalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnText}>关闭</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.lg,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  info: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  pickBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notifBtn: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  previewImg: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.white,
    fontSize: 16,
  },
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  updateBtn: {
    backgroundColor: '#0091ff',
    padding:14,
    borderRadius:8,
    alignItems:'center',
    marginTop:Spacing.md,
  },
});
