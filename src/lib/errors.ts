export class AppError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = 'AppError';
    this.status = options?.status;
    this.code = options?.code;
  }
}

export function handleError(error: unknown, defaultMessage = 'Произошла ошибка') {
  console.error(error);

  if (error instanceof AppError) {
    return {
      success: false as const,
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  return {
    success: false as const,
    error: defaultMessage,
  };
}
