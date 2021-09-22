import React from 'react';
import { DropTargetMonitor } from 'react-dnd';
import Droppable from '../../../Shared/Droppable';
import { Popover } from '@pipedrive/convention-ui-react';
import { Container, Action } from './StyledComponents';

type Props = {
	className?: string;
	textColor: string;
	textDraggingColor: string;
	backgroundDraggingColor: string;
	onDrop: (monitor: DropTargetMonitor) => void;
	popoverProps?: any;
};

const DealActionButton: React.FunctionComponent<Props> = (props) => {
	return (
		<Container>
			<Droppable className={props.className} onDrop={props.onDrop}>
				{(isDraggingOver) => {
					const ActionComponent = (
						<Action
							isDraggingOver={isDraggingOver}
							textColor={props.textColor}
							textDraggingColor={props.textDraggingColor}
							backgroundDraggingColor={props.backgroundDraggingColor}
							data-test={props['data-test']}
						>
							{props.children}
						</Action>
					);

					if (props.popoverProps) {
						return (
							<Popover
								{...props.popoverProps}
								spacing="none"
								innerRefProp="ref"
								popperProps={{
									modifiers: {
										preventOverflow: {
											enabled: true,
											padding: 40,
											boundariesElement: 'viewport',
										},
									},
								}}
							>
								{ActionComponent}
							</Popover>
						);
					}

					return ActionComponent;
				}}
			</Droppable>
		</Container>
	);
};

export default DealActionButton;
