declare module '#error-code' {
  const errorCodeSet: Set<string>

  export function getErrorCode (error: Error): string

  export const extended: Set<string>

  export default errorCodeSet
}
