import * as THREE from 'three'
import {createContext, type EngineContext } from "./context";
import { setupEnvironment } from '../stage/Environment';
import { disposeObject } from '../utils/dispose';
import { loadScene } from '../assets/SceneLoader';
import { CameraManager } from '../camera/CameraManager';
import { setupLighting } from '../stage/Lighting';
import modelUrl from "@/assets/model/twinplant_factory.glb?url";

export class Engine {
    // init() {
    //     const context = createContext();
    //     setupEnvironment(context);
    //     setupLighting(context);
    //     const cameraManager = new CameraManager();
    //     cameraManager.init(context);
    // }
}
  
