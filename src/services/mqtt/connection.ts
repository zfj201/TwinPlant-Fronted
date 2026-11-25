import mqtt, { type MqttClient, type ISubscriptionGrant } from "mqtt";
import { MQTT_CONFIG, MQTT_SUBSCRIPTIONS } from "./config";
import { useConnectionStore } from "@/stores/connection";

const { protocol, host, port, path, ...connectOptions } = MQTT_CONFIG;
const BROKER_URL = `${protocol}://${host}:${port}${path}`;

// 全局唯一的连接。null 表示还没连，或已主动断开。
let client: MqttClient | null = null;

// 热更新替换本模块时，关掉旧模块里的连接，避免新旧两个连接同时在线。
import.meta.hot?.dispose(() => disconnectMqtt());

export function connectMqtt(): MqttClient {
  client ??= createClient();
  return client;
}

export function disconnectMqtt(): void {
  if (!client) return;
  client.end();
  client = null;
  useConnectionStore().setStatus("disconnected");
}

export function getMqttClient(): MqttClient | null {
  return client;
}

export function publishMqtt(topic: string, message: unknown): void {
  if (!client?.connected) {
    console.warn("[MQTT] publish skipped, not connected:", topic);
    return;
  }
  client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
    if (err) console.error("[MQTT] publish failed:", topic, err);
  });
}

// 创建连接并挂好事件。
function createClient(): MqttClient {
  const mqttClient = mqtt.connect(BROKER_URL, {
    ...connectOptions,
    clean: true,
    // clean: true 时 broker 不保留订阅，由 connect 回调每次重新订阅
    resubscribe: false,
  });
  useConnectionStore().setStatus("connecting");

  mqttClient
    .on("connect", () => onConnect(mqttClient))
    .on("reconnect", onReconnect)
    .on("close", onClose)
    .on("error", onError);

  return mqttClient;
}

// ---------- 连接事件 ----------
// 状态流转：connecting → connected ⇄ reconnecting；disconnectMqtt() → disconnected

function onConnect(mqttClient: MqttClient) {
  console.log("[MQTT] connected");
  useConnectionStore().setStatus("connected");
  mqttClient.subscribe(MQTT_SUBSCRIPTIONS, { qos: 0 }, onSubscribed);
}

function onReconnect() {
  console.log("[MQTT] reconnecting");
}

// 每次连接断开都会触发，包括重连失败。
// 只有从 connected 掉线才切到 reconnecting；connecting / reconnecting 期间的失败保持原状态，
// 主动断开已由 disconnectMqtt() 置为 disconnected，这里也不改。
function onClose() {
  console.log("[MQTT] closed");
  const store = useConnectionStore();
  if (store.status === "connected") {
    store.setStatus("reconnecting");
  }
}

function onError(err: Error) {
  console.error("[MQTT] error:", err);
  useConnectionStore().setError(err.message);
}

// 成功和失败都会回调这里。broker 拒绝某个 topic 时 err 为空，只把该项 qos 标成 128。
function onSubscribed(err: Error | null, granted?: ISubscriptionGrant[]) {
  const rejected = granted?.filter((g) => g.qos === 128).map((g) => g.topic) ?? [];
  if (err || rejected.length > 0) {
    console.error("[MQTT] subscribe failed:", err ?? rejected);
  } else {
    console.log("[MQTT] subscribed:", MQTT_SUBSCRIPTIONS);
  }
}
