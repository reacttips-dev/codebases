import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const api = API('/api/slackAuth.v1', { type: 'rest' });

const SlackAuthAPIUtils = {
  link(degreeId: string, email: string) {
    const uri = new URI()
      .addQueryParam('action', 'link')
      .addQueryParam('email', email)
      .addQueryParam('degreeId', degreeId);

    return Q(api.post(uri.toString()));
  },

  unlink(degreeId: string) {
    const uri = new URI().addQueryParam('action', 'unlink').addQueryParam('degreeId', degreeId);

    return Q(api.post(uri.toString()));
  },
};

export default SlackAuthAPIUtils;

export const { link, unlink } = SlackAuthAPIUtils;
