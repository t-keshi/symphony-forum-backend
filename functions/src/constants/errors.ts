export const ERRORS = {
  // 400
  ConcertNotFound: 'ConcertNotFound',
  // 500
  InternalServerError: 'InternalServerError',
} as const;

export type ErrorCode = typeof ERRORS[keyof typeof ERRORS];

export interface ErrorResponse {
  error: ErrorCode;
}
