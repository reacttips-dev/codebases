export default async function(componentLoader) {
	const { getModalsView } = await componentLoader.load('webapp:main');
	const ModalsView = await getModalsView();

	return {
		mount: async ({ props: { modal, params, onClose, onAfterClose }, el }) => {
			ModalsView.show(modal, { ...params, container: el }, onClose, onAfterClose);
		},
		update: async ({ props: { visible, onAfterClose } }) => {
			if (!visible) {
				ModalsView.closeWithTransition(onAfterClose);
			}
		},
		unmount: async () => {
			ModalsView.close();
		}
	};
}
