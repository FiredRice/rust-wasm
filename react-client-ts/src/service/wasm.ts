import wasmInit, * as wasm from 'wasm';

class WasmService {
    private loaded = false;

    public async init() {
        try {
            if (!this.loaded) {
                await wasmInit();
                this.loaded = true;
            }
        } catch (error) {
            this.loaded = false;
        }
    }

    public getWasms(): Partial<typeof wasm> {
        if (!this.loaded) {
            return {};
        }
        return wasm || {};
    }
}

const wasmService = new WasmService();

export default wasmService;