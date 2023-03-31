declare module '#superagent/verify-url' {
  export type Params = import('#verify-url').Params
  export type RequestFailure = import('#verify-url').RequestFailure
  export type ResponseFailure = import('#verify-url').ResponseFailure
  export type ResponseSuccess = import('#verify-url').ResponseSuccess
  export type VerifyUrlParams = Params & {timeout?: number}
  export default function verifyUrl(url: string, params?: VerifyUrlParams): Promise<RequestFailure | ResponseFailure | ResponseSuccess>
}

declare module '#error-code' {
  const errorCodeSet: Set<string>
  export function getErrorCode (error: Error): string
  export const extended: Set<string>
  export default errorCodeSet
}

declare module '#response-status' {
  type SuperAgentResponse = import('superagent').Response
  const responsStatusMap: Map<number, string>
  export function getResponseStatus (response: Response | SuperAgentResponse): number
  export function isResponseStatusRange (status: number | null): boolean
  export function isResponseStatusInformationRange (status: number | null): boolean
  export function isResponseStatusSuccessRange (status: number | null): boolean
  export function isResponseStatusRedirectionRange (status: number | null): boolean
  export function isResponseStatusClientErrorRange (status: number | null): boolean
  export function isResponseStatusServerErrorRange (status: number | null): boolean
  export default responsStatusMap
}

declare module '#verification' {
  export type Verification = Readonly<{
    PASS: string;
    FAIL: string;
  }>

  export default Verification
}

declare module '#verify-url' {
  export interface Params {
    userAgent?: string;
  }
  export interface RequestFailure {
    verification: string;
    url: string;
    error: {code: string};
  }
  export interface ResponseFailure {
    verification: string;
    url: string;
    response: {status: number};
  }
  export interface ResponseSuccess {
    verification: string;
    url: string;
  }
  export type VerifyUrlParams = Params & {timeout?: number, follow?: number}
  export default function verifyUrl(url: string, params?: VerifyUrlParams): Promise<RequestFailure | ResponseFailure | ResponseSuccess>
}

declare module '@sequencemedia/verify-url' {
  export { default as superagent } from '#superagent/verify-url'
  export { default } from '#verify-url'
}
