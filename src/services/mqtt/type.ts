// 第一版协议
export const PROTOCOL_VERSION = 1;

// ==================== 基础枚举 ====================

export const ErrCode = {
  OK: 0,
  BAD_JSON: 1001,
  BAD_VERSION: 1002,
  UNKNOWN_DEVICE: 1003,
  UNKNOWN_KEY: 1004,
  OUT_OF_RANGE: 1005,
  INVALID_STATE: 1006,
  DEVICE_OFFLINE: 1007,
} as const;

export const DeviceId = {
  TANK: "tank-01",
  FAN: "fan-01",
  HV: "hv-01",
  INCUBATOR: "incubator-01",
  TILT: "tilt-01",
} as const;

export type DeviceId = (typeof DeviceId)[keyof typeof DeviceId];

export type Quality = "good" | "uncertain" | "bad";

// mock：ESP32 生成的模拟数据；sensor：真实传感器
export type Src = "mock" | "sensor";

export type NodeState = "online" | "offline" | "mock";

export const FAN_RPM = { min: 0, max: 1800, step: 100 };

// ==================== 设备数据 value ====================

export interface TankValue {
  level: number; // 水位 %，0-100
}

export interface FanValue {
  rpm: number; // 实际转速
  targetRpm: number; // 目标转速
  stalled: boolean; // 是否堵转
}

export interface HvValue {
  distance: number; // 与高压笼的距离，m
}

export interface IncubatorValue {
  touched: boolean;
}

export interface TiltValue {
  q: [number, number, number, number]; // 芯片坐标系四元数 [w, x, y, z]
  roll: number; // 度
  pitch: number; // 度
}

// ==================== 上行消息（esp32上报的数据） ====================

// 公共字段。timestamp 为 Unix 毫秒，0 表示设备未对时；sequence 按设备各自计数。
interface MsgBase {
  ver: number;
  gatewayId: string;
  timestamp: number;
  sequence: number;
}

export interface GwStatusMsg {
  ver: number;
  type: "status";
  gatewayId: string;
  value: "online" | "offline";
}

export interface GwHeartbeatMsg extends MsgBase {
  type: "heartbeat";
  value: {
    uptimeS: number;
    freeHeap: number;
    rssi: number;
    nodes: { f407: NodeState; f103: NodeState };
  };
}

// 不属于某次控制的错误，如请求 JSON 解析失败、UART CRC 错误
export interface GwErrorMsg extends MsgBase {
  type: "error";
  code: number; // 见 ErrCode，可能出现未定义的码
  msg: string;
}

interface DeviceDataBase extends MsgBase {
  type: "data";
  quality: Quality;
  src: Src;
}

export interface TankDataMsg extends DeviceDataBase {
  deviceId: "tank-01";
  value: TankValue;
}

export interface FanDataMsg extends DeviceDataBase {
  deviceId: "fan-01";
  value: FanValue;
}

export interface HvDataMsg extends DeviceDataBase {
  deviceId: "hv-01";
  value: HvValue;
}

export interface IncubatorDataMsg extends DeviceDataBase {
  deviceId: "incubator-01";
  value: IncubatorValue;
}

export interface TiltDataMsg extends DeviceDataBase {
  deviceId: "tilt-01";
  value: TiltValue;
}

// switch (msg.deviceId) 之后，msg.value 会自动收窄成对应设备的类型
export type DeviceDataMsg =
  | TankDataMsg
  | FanDataMsg
  | HvDataMsg
  | IncubatorDataMsg
  | TiltDataMsg;

export interface CtrlAckMsg extends MsgBase {
  type: "ctrl_ack";
  deviceId: DeviceId;
  requestId: string; // 原样带回请求里的 requestId
  key: string;
  value: unknown;
  code: number; // 见 ErrCode，可能出现未定义的码
  msg: string;
}

export type UpMsg = GwStatusMsg | GwHeartbeatMsg | GwErrorMsg | DeviceDataMsg | CtrlAckMsg;

// ==================== 下行消息（控制消息） ====================

interface CtrlReqBase {
  ver: number;
  type: "ctrl_req";
  requestId: string;
  timestamp: number;
  sequence: number;
}

export interface FanSetRpmReq extends CtrlReqBase {
  deviceId: "fan-01";
  key: "setRpm";
  value: number; // 范围见 FAN_RPM
}

export interface IncubatorResetReq extends CtrlReqBase {
  deviceId: "incubator-01";
  key: "reset";
  value: null;
}

export type CtrlReqMsg = FanSetRpmReq | IncubatorResetReq;

// ==================== 工具函数 ====================

export function isDeviceId(id: unknown): id is DeviceId {
  return Object.values(DeviceId).includes(id as DeviceId);
}

// 错误码转名称，调试表显示用：1005 → "OUT_OF_RANGE"。未知码原样返回。
export function errName(code: number): string {
  for (const [name, value] of Object.entries(ErrCode)) {
    if (value === code) return name;
  }
  return String(code);
}
