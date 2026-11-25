import { Engine } from "./core/Engine";

export function createTwinScene(container: HTMLElement, modelUrl: string)
{
    const engine = new Engine(container);
    
    engine.start();
    const ready = engine.load(modelUrl);
    return {
        dispose: () => engine.dispose(),
        ready,
    };
}
