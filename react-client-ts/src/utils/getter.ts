import { get, isArray, isEmpty, isNumber, isObject, isString, mergeWith } from 'lodash';

// 利用空字符串使得第一次匹配时匹配到泛型的声明
type IKey<T> = keyof T | '';

// type IKey<T> = (T extends object ? Util.LimitDeepKeys<Required<T>> : never) | '';

export function getArray<T, K = any>(obj: T, key: IKey<T>, defaultValue?: Array<K>): Array<K>;
export function getArray<K = any>(obj: any, key: string, defaultValue?: Array<K>): Array<K>;
export function getArray<K = any>(obj: any, key: any, defaultValue: Array<K> = []): Array<K> {
    const result = get(obj, key) || defaultValue;
    return isArray(result) ? result : defaultValue;
};

export function getString<T>(obj: T, key: IKey<T>, defaultValue?: string): string;
export function getString(obj: any, key: string, defaultValue?: string): string;
export function getString(obj: any, key: any, defaultValue: string = ''): string {
    const value = get(obj, key);
    const result = value == null ? defaultValue : !isString(value) ? `${value}` : !!value ? value : defaultValue;
    return result;
};

export function getNumber<T>(obj: T, key: IKey<T>, defaultValue?: number): number;
export function getNumber(obj: any, key: string, defaultValue?: number): number;
export function getNumber(obj: any, key: any, defaultValue: number = 0): number {
    const value = get(obj, key);
    const result = (value == null) ? defaultValue : (isNumber(value) ? value : (parseFloat(value) || defaultValue));
    return result;
};

export function getBoolean<T>(obj: T, key: IKey<T>, defaultValue?: boolean): boolean;
export function getBoolean(obj: any, key: string, defaultValue?: boolean): boolean;
export function getBoolean(obj: any, key: any, defaultValue: boolean = false): boolean {
    const value = get(obj, key);
    const result = (value == null) ? defaultValue : !!value;
    return result;
};

export function getObject<T, K = any>(obj: T, key: IKey<T>, defaultValue?: K): K;
export function getObject<K = any>(obj: any, key: string, defaultValue?: K): K;
export function getObject(obj: any, key: any, defaultValue: any = {}): any {
    const result = get(obj, key) || defaultValue;
    return isObject(result) && !isArray(result) ? result : defaultValue;
};

/**
 * 去除对象中值为 null 和 undefined 的属性
 *  - 不改变原对象
 * @param obj 被操作对象
 * @param deep 深度遍历
 * @returns newObj 新对象
 */
export const getEffectiveParams = (obj: any, deep = true) => {
    const result = {} as any;
    isObject(obj) && !isEmpty(obj) && Object.keys(obj).forEach(item => {
        if (obj[item] !== null && obj[item] !== undefined) {
            if (isObject(obj[item]) && !isArray(obj[item]) && deep) {
                result[item] = getEffectiveParams(obj[item], true);
            } else {
                result[item] = obj[item];
            }
        }
    });
    return result;
};
