import { createContext, useContext } from 'react';
import wasmService from '../service/wasm';

const wasms = wasmService.getWasms();

export const WasmContext = createContext(wasms);

export function useWasm() {
    return useContext(WasmContext);
}