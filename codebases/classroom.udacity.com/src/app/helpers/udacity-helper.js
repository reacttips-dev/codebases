import {
    __
} from 'services/localization-service';

const UdacityHelper = {
    courseUrl(key) {
        return __('https://www.udacity.com/course/<%= key %>', {
            key
        });
    },

    nanodegreeUrl(key) {
        return UdacityHelper.courseUrl(key);
    },

    contentfulNanodegreeUrlSlug(nanodegree) {
        const resource = _.get(nanodegree, ['items', 0, 'fields', 'slug'], '');
        return !!resource ?
            __('https://www.udacity.com/course/<%= resource %>', {
                resource
            }) :
            __('https://www.udacity.com/courses/all');
    },

    // This is *not* a great solution, but will have to do for now.
    // If the experiment is successful, we will take time to create an
    // association between the ND and it's trial ND.
    paidTrialNanodegreeKey(key) {
        return UdacityHelper.nanodegreeUrl(key.replace('-ptrial', ''));
    },
};

export default UdacityHelper;