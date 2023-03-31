# @sequencemedia/verify-url

Verifies that a URL is publicly accessible on the network

## `verifyUrl`

The `verifyUrl` function returns a Promise which resolves to an object

That object is a _description_, and it has one of three shapes

- It always contains a `verification` string (either `PASS` or `FAIL`)
- It always contains the `url` string

### 1 - The verification request was successful and the remote host returned a status in the `success` range

The value of `verification` in the description is `PASS`

```typescript
  export interface ResponseSuccess {
    verification: string;
    url: string;
  }
```

### 2 - The verification request was successful but the remote host returned a status in the `failure` range

Dispatching a request was fine but the host or the path was not

- Perhaps a `500`
- Perhaps a `404`
- Etc

The value of `verification` in the description is `FAIL`

```typescript
  export interface ResponseFailure {
    verification: string;
    url: string;
    response: {status: number};
  }
```

### 3 - The verification request failed

Dispatching a request to this URL generated an error

- Perhaps the host does not exist
- Perhaps the host is not reachable
- Etc

The value of `verification` in the description is `FAIL`

```typescript
  export interface RequestFailure {
    verification: string;
    url: string;
    error: {code: string};
  }
```
