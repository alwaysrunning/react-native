import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { registerGlobalError } from './src/utils/errorHandler';
import { Colors } from './src/constants/theme';
import * as Updates from 'expo-updates';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import MineScreen from './src/screens/MineScreen';
import type { HomeStackParamList, TabParamList } from './src/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '详情页' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    registerGlobalError();
    async function autoCheck() {
      try {
        const res = await Updates.checkForUpdateAsync();
        console.log('自动更新检查结果：', res);
        if (res.isAvailable) {
          // 后台静默下载，下次用户关掉重开App自动生效
          await Updates.fetchUpdateAsync();
        }
      } catch (e) {
        console.log('自动更新检查失败：', e);
      }
    }
    autoCheck();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: '首页', headerShown: false }} />
        <Tab.Screen name="MineTab" component={MineScreen} options={{ title: '我的' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
