export type DefinedType = {
  property: string;
};

/** Shape accepted by the axios handlers in `app/libs/axios/handlers.ts`. */
export type BasicRequest = {
  path: string;
  authenticated?: boolean;
  headers?: Record<string, string>;
  body?: unknown;
  formData?: FormData;
};

export type BasicResponse<T> = {
  body: T;
};
