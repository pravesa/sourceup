// HTTP Response Status Codes -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

const HTTP_RESPONSE_CODES = {
  // Informational Response Status Codes

  Continue: 100,
  'Switching Protocols': 101,
  Processing: 102,
  'Early Hints': 103,

  // Successful Response Status Codes

  OK: 200,
  Created: 201,
  Accepted: 202,
  'Non Authoritative Information': 203,
  'No Content': 204,
  'Reset Content': 205,
  'Partial Content': 206,
  'Multi Status': 207,
  'Already Reported': 208,
  'IM Used': 226,

  // Redirect Response Status Codes

  'Multiple Choices': 300,
  'Moved Permanently': 301,
  Found: 302,
  'See Other': 303,
  'Not Modified': 304,
  'Use Proxy': 305,
  Unused: 306,
  'Temporary Redirect': 307,
  'Permanent Redirect': 308,

  // Client Error Response Status Codes

  'Bad Request': 400,
  Unauthorized: 401,
  'Payment Required': 402,
  Forbidden: 403,
  'Not Found': 404,
  'Method Not Allowed': 405,
  'Not Acceptable': 406,
  'Proxy Authentication Required': 407,
  'Request Timeout': 408,
  Conflict: 409,
  Gone: 410,
  'Length Required': 411,
  'Precondition Failed': 412,
  'Payload Too Large': 413,
  'URI Too Long': 414,
  'Unsupported Media Type': 415,
  'Range Not Satisfiable': 416,
  'Expectation Failed': 417,
  'Im A Teapot': 418,
  'Misdirected Request': 421,
  'Unprocessable Entity': 422,
  Locked: 423,
  'Failed Dependency': 424,
  'Too Early': 425,
  'Upgrade Required': 426,
  'Precondition Required': 428,
  'Too Many Requests': 429,
  'Request Header Fields Too Large': 431,
  'Unavailable For Legal Reasons': 451,

  // Server Error Response Status Codes

  'Internal Server Error': 500,
  'Not Implemented': 501,
  'Bad Gateway': 502,
  'Service Unavailable': 503,
  'Gateway Timeout': 504,
  'HTTP Version Not Supported': 505,
  'Variant Also Negotiates': 506,
  'Insufficient Storage': 507,
  'Loop Detected': 508,
  'Bandwidth Limit Exceeded': 509,
  'Not Extended': 510,
  'Network Authentication Required': 511,
} as const;

// With empty export, types declared in global scope will visible to all files
export {};

type ResponseStatusCodes = typeof HTTP_RESPONSE_CODES;

/**
 * Defines property types in server response object
 */
type ResponseContent<S> = Readonly<{
  status: ResponseStatusCodes[S];
  statusText: S;
  message: string;
  redirect?: string;
  payload?: unknown;
}>;

declare global {
  /**
   * Checks whether the response status extends any redirect status code and
   * makes the redirect property required if true.
   */
  type ServerResponse<S extends keyof ResponseStatusCodes> = S extends S
    ? ResponseStatusCodes[S] extends 301 | 302 | 303 | 307 | 308
      ? MakeRequired<ResponseContent<S>, 'redirect'>
      : ResponseContent<S>
    : never;
}
