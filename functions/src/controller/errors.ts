export const ERRORS = {
  // 400
  ConcertNotFound: 'ConcertNotFound',
} as const;

export type ErrorCode = typeof ERRORS[keyof typeof ERRORS];

export interface ErrorResponse {
  error: ErrorCode;
}
