const IamClient = require('utils/support/iam');

const contextualSupport = {
	openLearnMoreSupport: function() {
		const sidebarContainer = document.getElementById('main-content');

		IamClient.initialize(function(API) {
			self.iamSidebar = new API.Sidebar(sidebarContainer, {
				appearance: {
					zIndex: {
						min: 101
					}
				}
			});

			self.iamSidebar.openArticle('360000030169');
		});
	}
};

module.exports = contextualSupport;
