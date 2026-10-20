## 目录结构
```
react-native/
├── App.tsx                  # 入口（expo init blank-typescript 结构）
├── index.ts                 # registerRootComponent
├── app.json
├── babel.config.js
├── eas.json
├── tsconfig.json
├── assets/                  # 图标 / 启动图
└── src/
    ├── api/
    │   ├── request.ts       # axios 封装
    │   └── news.ts          # 新闻接口
    ├── utils/
    │   ├── storage.ts       # AsyncStorage 泛型封装
    │   └── errorHandler.ts  # 全局异常捕获
    ├── store/
    │   └── newsStore.ts     # Zustand
    ├── components/
    │   └── ListItem.tsx     # memo + Reanimated
    ├── screens/
    │   ├── HomeScreen.tsx   # FlatList 性能优化
    │   ├── DetailScreen.tsx
    │   └── MineScreen.tsx   # 相册 + 推送
    ├── constants/
    │   └── theme.ts         # 主题色/间距
    ├── modules/
    │   └── DeviceBattery/   # 原生模块封装
    └── types/
        └── index.ts         # 全局类型
```

## 运行
```bash
npx expo start
```
原生模块（Reanimated、notifications）需用 Dev Build：
```bash
eas login
eas init
eas build --platform android --profile development
```
