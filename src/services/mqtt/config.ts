export const MQTT_CONFIG = {
  // 公共 EMQX Broker
  host: "broker.emqx.io",

  // MQTT TCP 端口 1883 不能直接给浏览器使用
  // 这里使用 WebSocket 监听端口
  port: 8083,
  path: "/mqtt",

  username: "",
  password: "",

  protocol: "ws" as const,

  // MQTT Keep Alive
  keepalive: 5,

  // 前端重连间隔
  reconnectPeriod: 3000,

  // 连接超时时间
  connectTimeout: 10000,

  // 每个浏览器客户端使用独立 ID
  clientId: `web_${Math.random().toString(16).slice(2, 10)}`,
};

const TOPIC_PREFIX = "twin-plant-zfj";

// 网关状态
export const topicGwStatus = (gatewayId: string) =>
  `${TOPIC_PREFIX}/gw/${gatewayId}/status`;

// 网关心跳
export const topicGwData = (gatewayId: string) =>
  `${TOPIC_PREFIX}/gw/${gatewayId}/heartbeat`;

// 错误信息
export const topicGwError = (gatewayId: string) =>
  `${TOPIC_PREFIX}/gw/${gatewayId}/error`;

// 设备数据
export const topicDevData = (deviceId: string) =>
  `${TOPIC_PREFIX}/dev/${deviceId}/data`;

// 设备应答
export const topicDevCtrlAck = (deviceId: string) =>
  `${TOPIC_PREFIX}/dev/${deviceId}/ctrl/ack`;

// 订阅合集
export const MQTT_SUBSCRIPTIONS = [
  `${TOPIC_PREFIX}/gw/+/status`,
  `${TOPIC_PREFIX}/gw/+/heartbeat`,
  `${TOPIC_PREFIX}/gw/+/error`,
  `${TOPIC_PREFIX}/dev/+/data`,
  `${TOPIC_PREFIX}/dev/+/ctrl/ack`,
];
