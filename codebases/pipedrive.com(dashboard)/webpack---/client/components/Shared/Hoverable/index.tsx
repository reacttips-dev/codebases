import React from 'react';

type Props = {
	children: ({
		isHovering,
		handleMouseHover,
	}: {
		isHovering: boolean;
		handleMouseHover: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	}) => React.ReactNode;
};

type State = {
	isHovering: boolean;
};

export default class Hoverable extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.handleMouseHover = this.handleMouseHover.bind(this);

		this.state = {
			isHovering: false,
		};
	}

	handleMouseHover() {
		this.setState((state) => ({
			isHovering: !state.isHovering,
		}));
	}

	render() {
		return this.props.children({
			isHovering: this.state.isHovering,
			handleMouseHover: this.handleMouseHover,
		});
	}
}
