import React, { useRef } from 'react';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import useMenuCoachmark from '../../hooks/useMenuCoachmark';
import { TooltipContentWithKeyboardShortcut } from '../KeyboardShortcut';

import { HeaderTooltip } from '../Header';
import { MenuLink } from './types';

const AddButton = styled.div<{ isOpen: boolean }>`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: ${colors.green};
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.1s;

	& .cui4-icon {
		fill: ${colors.white};
		transform: ${(props) => (props.isOpen ? 'rotate(45deg)' : 'rotate(0)')};
		transition: transform 0.1s, fill 0.1s;
	}

	&:hover {
		background-color: ${colors.green88};

		.cui4-icon {
			fill: ${colors.white};
		}
	}

	&:active {
		background-color: ${colors.green16};
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	width: 40px;
	height: 40px;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: background-color 0.1s;
	border-radius: 50%;
`;

interface Props {
	item: MenuLink;
	isActive?: boolean;
	onClick?(item: MenuLink, ev: React.SyntheticEvent): void;
}

function QuickAddButtonForwardRef({ item, isActive, onClick }: Props, ref: (node: Element) => {}) {
	const element = useRef(null);

	const { coachmark, visible: coachmarkVisible } = useMenuCoachmark(item, element, {
		appearance: {
			placement: 'bottom',
			zIndex: {
				min: 100,
			},
			align: {
				points: ['tc', 'bc'],
				offset: [0, 12],
			},
		},
	});

	function handleClick(ev: React.SyntheticEvent) {
		coachmarkVisible && coachmark?.close();

		onClick && onClick(item, ev);
	}

	return (
		<ButtonWrapper
			className="quick-add-button"
			onClick={handleClick}
			aria-label={item.title}
			ref={(node) => {
				ref(node);
				element.current = node;
			}}
			data-test="quick-add"
			tabIndex={0}
		>
			<HeaderTooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut="+">
						{item.title}
					</TooltipContentWithKeyboardShortcut>
				}
			>
				<AddButton isOpen={isActive}>
					<Icon icon="plus" color="black-64" />
				</AddButton>
			</HeaderTooltip>
		</ButtonWrapper>
	);
}

export const QuickAddButton = React.forwardRef(QuickAddButtonForwardRef);
