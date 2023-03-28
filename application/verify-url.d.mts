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
