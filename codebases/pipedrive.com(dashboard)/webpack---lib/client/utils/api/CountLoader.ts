import { LabelId, Response } from 'Types/types';
import { AxiosInstance } from 'axios';

import { getUrl } from './api.utils';

export interface CountLoaderOpts {
	archived?: boolean;
	labelIds?: LabelId[];
}

interface CountRemote {
	totalCount: number;
}

export class CountLoader {
	public static of(opts: CountLoaderOpts, getter: AxiosInstance['get']) {
		return new CountLoader(opts, getter);
	}

	private constructor(private opts: CountLoaderOpts, private getter: AxiosInstance['get']) {}

	public async load() {
		try {
			const response = await this.getter<Response<CountRemote>>(
				getUrl('/api/v1_internal/leads/count', this.opts),
			);

			if (response.data.success) {
				return response.data.data.totalCount;
			}

			throw new Error('Error with requesting total count');
		} catch (msg) {
			throw new Error(msg);
		}
	}
}
