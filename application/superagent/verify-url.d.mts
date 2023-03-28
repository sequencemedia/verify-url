declare module '#superagent/verify-url' {
  export type Params = import('#verify-url').Params
  export type RequestFailure = import('#verify-url').RequestFailure
  export type ResponseFailure = import('#verify-url').ResponseFailure
  export type ResponseSuccess = import('#verify-url').ResponseSuccess
  export type VerifyUrlParams = Params & {timeout?: number}

  export default function verifyUrl(url: string, params?: VerifyUrlParams): Promise<RequestFailure | ResponseFailure | ResponseSuccess>
}
