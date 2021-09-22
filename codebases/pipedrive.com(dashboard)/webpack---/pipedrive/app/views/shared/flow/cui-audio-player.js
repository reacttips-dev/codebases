const React = require('react');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { AudioPlayer, Separator, Option } = require('@pipedrive/convention-ui-react');
const ReactDOM = require('react-dom');

module.exports = Pipedrive.View.extend({
	initialize: function(options) {
		this.options = options || {};
		this.model = this.options.model;
		this.file = this.model.get('file');

		this.onDelete = this.onDelete.bind(this);
		this.checkIfFileIsFromGoogle = this.checkIfFileIsFromGoogle.bind(this);

		this.model.file = this.options.fileModel;

		this.render();
	},

	onDelete: function() {
		if (
			window.confirm(
				_.gettext('Are you sure you want to delete this audio note from Pipedrive?')
			)
		) {
			this.model.file.destroy();
			this.model.unset('file', {
				silent: true
			});
		}
	},

	checkIfFileIsFromGoogle: function(file) {
		return file && _.includes(file.url, 'drive.google');
	},

	selfRender: function() {
		const file = this.file;
		const audioRef = React.createRef();

		ReactDOM.render(
			<AudioPlayer
				ref={audioRef}
				title={this.file.clean_name}
				source={this.file.url}
				onModeChange={(mode) => {
					if (this.checkIfFileIsFromGoogle(file)) {
						window.open(file.url, '_blank');
					} else {
						const player = audioRef.current.player.current;

						audioRef.current.state.mode = mode;
						player && player.play();
					}
				}}
				actions={
					<React.Fragment>
						<Separator />
						<Option onClick={this.onDelete}>Delete</Option>
					</React.Fragment>
				}
			/>,
			this.el
		);
	}
});
