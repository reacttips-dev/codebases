import PipedriveLogger from '@pipedrive/logger-fe';

export class Logger {
	private readonly logger: PipedriveLogger;

	constructor(private readonly serviceName: string, private readonly commonContext: Record<string, unknown>) {
		this.logger = new PipedriveLogger(serviceName);
	}

	public error(message: string, error?: Error | null, context?: Record<string, unknown>) {
		this.logger.remote(
			'error',
			message,
			{
				caughtErrorStack: error?.stack,
				caughtErrorMessage: error?.message,
				...this.commonContext,
				...context,
			},
			this.serviceName,
		);
	}

	public info(message: string, data: Record<string, unknown> = {}) {
		this.logger.remote(
			'info',
			message,
			{
				...this.commonContext,
				...data,
			},
			this.serviceName,
		);
	}

	public warning(message: string, data: Record<string, unknown> = {}) {
		this.logger.remote(
			'warning',
			message,
			{
				...this.commonContext,
				...data,
			},
			this.serviceName,
		);
	}

	public get pipedriveLogger() {
		return this.logger;
	}
}
