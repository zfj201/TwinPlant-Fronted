# TwinPlant-Fronted

TwinPlant 智能设备数字孪生平台的 Web 前端，技术栈为 Vue 3、TypeScript、Ant Design Vue、Vue Router、Pinia 和 MQTT.js，后续接入 Three.js。

配套的嵌入式仓库：[TwinPlant-Embedded](https://github.com/zfj201/TwinPlant-Embedded)（固件、协议文档、系统架构）。

## 项目要做什么

TwinPlant 是一个"嵌入式实时控制 + 3D 数字孪生"平台，面向学习、展示和小型场景落地。一期以智能温室实验舱为场景：传感器数据经 STM32F103、STM32F407、ESP32-S3 汇聚到 EMQX，浏览器通过 MQTT over WebSocket 直接连接 EMQX，实时展示 3D 场景和设备状态，并能远程控制执行器、看到真实反馈。

前端负责：

- 在 3D 场景里展示设备和实时状态，离线设备保留最后一次数据。
- 展示设备列表、设备详情，并下发控制请求。
- 提供链路调试面板：原始消息、收发方向、序列号、延迟和错误码。
- 二期起增加历史趋势、告警、规则配置和设备运维。

一期不开发业务后端，也不引入数据库。

## 相关仓库

| 仓库 | 内容 | 地址 |
| --- | --- | --- |
| TwinPlant-Fronted（本仓库） | Web 前端 | https://github.com/zfj201/TwinPlant-Fronted |
| TwinPlant-Embedded | 三套固件、协议文档、系统架构 | https://github.com/zfj201/TwinPlant-Embedded |

系统架构、硬件选型和 MQTT 协议见嵌入式仓库。MQTT topic 或 payload 有变化时，前端需要同步修改。

## 分期规划

分期目标与嵌入式仓库保持一致，下面只列出前端的部分。

### 一期：真实硬件闭环 MVP

打通"采集、通信、展示、控制、反馈"闭环，在真实硬件上连续运行。

- 3D 总览页：舱体和设备的实时状态。
- 设备列表和设备详情。
- 远程控制：下发继电器等指令，1 秒内看到真实执行器的反馈。
- 链路调试页：原始消息、收发方向、seq、延迟、错误码。
- 顶部连接状态：EMQX 连接状态和延迟。

验收标准：

1. 连续运行 24 小时，传感器每 2 秒上报一次，页面没有明显的内存增长。
2. Wi-Fi 断开再恢复后，30 秒内自动重连并继续上报。
3. 页面下发继电器指令后，1 秒内看到真实执行器的反馈。
4. 任一节点断开后，一个心跳周期内 3D 场景显示离线，并保留最后一次数据。

### 二期：设备监控与规则

把一期的演示系统升级为可管理、可追溯、可自动运行的单项目平台。

- 历史趋势：查看设备的历史数据。
- 告警中心：告警列表和处理状态。
- 规则配置：阈值规则的持续时间、动作、恢复条件和手动控制优先级。
- 设备运维：设备状态、固件版本和 OTA。
- 区分实时数据和断线补传数据。
- 引入业务后端、时序数据和报警表，协议升级到 V2。

### 三期：可配置、可交付的平台

3D 场景配置器、设备与协议模板、多项目与权限、仿真模式、批量 OTA、Docker Compose 部署。

## 当前进度

- [x] 项目骨架：Vite、Vue 3、TypeScript、Ant Design Vue、Vue Router（hash 模式）
- [x] 引入 `mqtt`，`src/services/mqtt.ts` 只导出库，还没有连接逻辑
- [x] 主布局：顶部 Header 加下方 `RouterView`，整页高度 100% 且不滚动，滚动由各页面自己处理
- [x] Header 导航：实时孪生、链路调试、历史趋势、告警中心、规则配置、设备运维
- [x] 实时孪生页布局：左侧设备列表 180px、右侧设备详情 250px、中间 3D 区域加链路脉搏，内容为空
- [x] 链路调试页布局：工具栏、报文表格（含分页）、右侧报文详情 250px，表格暂无数据
- [x] 历史趋势、告警中心、规则配置、设备运维：页面已建，内容为空
- [ ] Header 的 EMQX 状态和延迟目前是写死的，待接入 MQTT
- [ ] MQTT 连接、订阅和重连（依赖协议 V1）
- [ ] Three.js 场景，放在 `src/three/`
- [ ] 设备列表、设备详情、链路调试接入真实数据
- [ ] 远程控制和控制应答

## 页面与路由

路由使用 hash 模式，路径和标题在 `src/router/index.ts` 里统一维护，Header 菜单由路由表生成。

| 路径 | 页面 | 目录 |
| --- | --- | --- |
| `/overview` | 实时孪生 | `src/view/OverView/` |
| `/debug` | 链路调试 | `src/view/DebugInfo/` |
| `/history` | 历史趋势 | `src/view/HistoryTrend/` |
| `/alerts` | 告警中心 | `src/view/AlertCenter/` |
| `/rules` | 规则配置 | `src/view/RuleConfig/` |
| `/devices` | 设备运维 | `src/view/DeviceOps/` |

## 目录结构

```
src/
├── router/        路由表
├── layouts/       主布局（index.vue）和 Header（components/MainHeader.vue）
├── view/          一级页面，每个页面是 index.vue 加 components/
├── services/      MQTT 客户端与消息处理
├── three/         Three.js 场景和 3D 资源（待接入）
├── stores/        设备与连接状态（待接入）
└── styles/        全局样式
```

## 开发

```sh
npm install
```

```sh
npm run dev
```

```sh
npm run type-check
```

```sh
npm run build
```

`npm run build` 会先做类型检查，再生成生产包。

