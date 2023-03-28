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
