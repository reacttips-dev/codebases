import { Coachmark } from 'Hooks/useCoachMark';

export class CoachmarkHandler {
	constructor(private coachmark: Coachmark | null) {}

	public update(coachmark: Coachmark) {
		this.coachmark = coachmark;
	}

	public removeCoachmark = () => {
		if (this.coachmark) {
			this.coachmark.remove();
		}
	};

	public closeCoachmark = () => {
		if (this.coachmark) {
			this.coachmark.close();
		}
	};

	public confirmCoachmark = () => {
		if (this.coachmark) {
			this.coachmark.confirm();
		}
	};

	public unqueueCoachmark = () => {
		if (this.coachmark) {
			this.coachmark.unqueue();
		}
	};
}
