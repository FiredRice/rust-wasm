import { useEffect, useState } from 'react';
import { WasmContext } from '../hooks';
import wasmService from '../service/wasm';

const WasmMiddleware = ({ children }) => {

    const [wasm, setWasms] = useState(wasmService.getWasms());

    useEffect(() => {
        initWasm();
    }, []);

    async function initWasm() {
        try {
            await wasmService.init();
            setWasms(wasmService.getWasms());
        } catch (error) {
            console.log(error);
            // await initWasm();
        }
    }

    return (
        <WasmContext.Provider value={wasm}>
            {children}
        </WasmContext.Provider>
    );
};

export default WasmMiddleware;