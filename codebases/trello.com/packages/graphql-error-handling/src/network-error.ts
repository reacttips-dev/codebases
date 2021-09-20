import { ErrorExtensionsType } from './errors';

interface NetworkErrorExtension {
  code: ErrorExtensionsType;
  status: number;
}
export class NetworkError extends Error {
  message: string;
  code: ErrorExtensionsType;
  status: number;

  constructor(message: string, { code, status }: NetworkErrorExtension) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
  }
}
