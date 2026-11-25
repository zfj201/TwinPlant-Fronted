import type { EngineContext } from "./context";

export interface TwinModule {
  /**
   * 模块初始化
   */
  init?(ctx: EngineContext): void;

  /**
   * 每帧更新
   * @param dt 距离上一帧的时间，单位：秒
   */
  update?(dt: number): void;

  /**
   * 容器尺寸发生变化
   */
  resize?(width: number, height: number): void;

  /**
   * 释放模块资源
   */
  dispose?(): void;
}
