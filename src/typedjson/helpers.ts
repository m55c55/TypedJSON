﻿declare abstract class Reflect
{
    public static getMetadata(metadataKey: string, target: any, targetKey: string | symbol): any;
}

export const METADATA_FIELD_KEY = "__typedJsonJsonObjectMetadataInformation__";

export function getDefaultValue<T>(type: { new (): T }): T|undefined
{
    switch (type as any)
    {
        case Number:
            return 0 as any;

        case String:
            return "" as any;

        case Boolean:
            return false as any;

        case Array:
            return [] as any;

        default:
            return undefined;
    }
}

/**
 * Determines whether the specified type is a type that can be passed on "as-is" into `JSON.stringify`.
 * Values of these types don't need special conversion.
 * @param type The constructor of the type (wrapper constructor for primitive types, e.g. `Number` for `number`).
 */
export function isDirectlySerializableNativeType(type: Function): boolean
{
    return !!(~[Date, Number, String, Boolean].indexOf(type as any));
}

export function isTypeTypedArray(type: Function): boolean
{
    return !!(~[Float32Array, Float64Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array]
        .indexOf(type as any));
}

export function isPrimitiveValue(obj: any): boolean
{
    switch (typeof obj)
    {
        case "string":
        case "number":
        case "boolean":
            return true;
        default:
            return (obj instanceof String || obj instanceof Number || obj instanceof Boolean);
    }
}

export function isObject(value: any): value is Object
{
    return typeof value === "object";
}

function shouldOmitParseString(jsonStr: string, expectedType: Function): boolean {
    const expectsTypesSerializedAsStrings = expectedType === String
        || expectedType === ArrayBuffer
        || expectedType === DataView;

    const hasQuotes = jsonStr.length >= 2 && jsonStr[0] === '"' && jsonStr[jsonStr.length-1] === '"';
    const isInteger = /^\d+$/.test(jsonStr.trim());

    return (expectsTypesSerializedAsStrings && !hasQuotes) || ((!hasQuotes && !isInteger) && expectedType === Date);
}

export function parseToJSObject(json: any, expectedType: Function): Object {
    if (typeof json !== 'string' || shouldOmitParseString(json, expectedType))
    {
      return json;
    }
    return JSON.parse(json);
}

/**
 * Determines if 'A' is a sub-type of 'B' (or if 'A' equals 'B').
 * @param A The supposed derived type.
 * @param B The supposed base type.
 */
export function isSubtypeOf(A: Function, B: Function)
{
    return A === B || A.prototype instanceof B;
}

export function logError(message?: any, ...optionalParams: any[])
{
    if (typeof console === "object" && typeof console.error === "function")
    {
        console.error(message, ...optionalParams);
    }
    else if (typeof console === "object" && typeof console.log === "function")
    {
        console.log(`ERROR: ${message}`, ...optionalParams);
    }
}

export function logMessage(message?: any, ...optionalParams: any[])
{
    if (typeof console === "object" && typeof console.log === "function")
    {
        console.log(message, ...optionalParams);
    }
}

export function logWarning(message?: any, ...optionalParams: any[])
{
    if (typeof console === "object" && typeof console.warn === "function")
    {
        console.warn(message, ...optionalParams);
    } else if (typeof console === "object" && typeof console.log === "function")
    {
        console.log(`WARNING: ${message}`, ...optionalParams);
    }
}

/**
 * Checks if the value is considered defined (not undefined and not null).
 * @param value
 */
export function isValueDefined<T>(value: T): value is Exclude<T, undefined | null>
{
    return !(typeof value === "undefined" || value === null);
}

export function isInstanceOf<T>(value: any, constructor: Function): boolean
{
    if (typeof value === "number")
    {
        return (constructor === Number);
    }
    else if (typeof value === "string")
    {
        return (constructor === String);
    }
    else if (typeof value === "boolean")
    {
        return (constructor === Boolean);
    }
    else if (isObject(value))
    {
        return (value instanceof constructor);
    }

    return false;
}

export const isReflectMetadataSupported =
    (typeof Reflect === "object" && typeof Reflect.getMetadata === "function");

/**
 * Gets the name of a function.
 * @param fn The function whose name to get.
 */
export function nameof(fn: Function & { name?: string })
{
    if (typeof fn.name === "string")
    {
        return fn.name;
    }
    else
    {
        return "undefined";
    }
}
