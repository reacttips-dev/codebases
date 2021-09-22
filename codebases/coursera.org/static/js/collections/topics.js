/* eslint-disable camelcase */
import Backbone from 'backbone';

import $ from 'jquery';
import moment from 'moment';
import _ from 'underscore';
import constants from 'js/json/constants';
import Cookie from 'js/lib/cookie';
import Coursera from 'js/lib/coursera';
import util from 'js/lib/util';
import Topic from 'js/models/topic';

const Topics = Backbone.Collection.extend({
  model: Topic,

  retrieve(filter, callback) {
    const self = this;

    // hack, until we improve our apis and models
    if (self.length) {
      callback(null, self);
    } else {
      require(['js/models/topicsearch'], function (TopicSearch) {
        /* Hack to make Topics.retrieve act like it used to, until
         * I rewrite all code using topics to get them through
         * a TopicSearch. */
        const ts = new TopicSearch({
          collection: this,
          orderby: 'new',
          'page-size': 1000,
        });
        ts.on('finishLoad', function () {
          callback(null, self);
        });
        ts.fetchPage();
      });
    }
  },

  getByShortName(name, callback) {
    const self = this;
    const topic = self.find(function (topic) {
      return topic.get('short_name') == name;
    });

    if (topic) {
      callback(null, topic);
    } else if (self.length) {
      // not an error, but topic does not exist
      callback(null, null);
      // hack, until we improve our apis and models
    } else {
      self.retrieve({}, function (err, topics) {
        if (!err) {
          self.getByShortName(name, callback);
        } else {
          callback(err);
        }
      });
    }
  },

  getByUniversity(name, callback) {
    const self = this;
    const topics = self.filter(function (topic) {
      return _.any(topic.get('universities'), function (university) {
        return university.short_name == name;
      });
    });

    if (topics && topics.length) {
      callback(topics);
    } else if (self.length) {
      callback(null);
      // hack, until we improve our apis and models
    } else {
      self.retrieve({}, function (err, topics) {
        if (!err) {
          self.getByUniversity(name, callback);
        } else {
          callback(err);
        }
      });
    }
  },

  getByCategory(name, callback) {
    const self = this;
    const topics = self.filter(function (topic) {
      return _.any(topic.get('categories'), function (category) {
        return category.short_name == name;
      });
    });

    if (topics && topics.length) {
      callback(topics);
    } else if (self.length) {
      callback(null);
      // hack, until we improve our apis and models
    } else {
      self.retrieve({}, function (err, topics) {
        if (!err) {
          self.getByCategory(name, callback);
        } else {
          callback(err);
        }
      });
    }
  },

  getByInstructor(id, callback) {
    const self = this;
    const topics = self.filter(function (topic) {
      return _.contains(topic.get('instructors'), id);
    });

    if (topics && topics.length) {
      callback(topics);
    } else if (self.length) {
      callback(null);
      // hack, until we improve our apis and models
    } else {
      self.retrieve({}, function (err, topics) {
        if (!err) {
          self.getByInstructor(id, callback);
        } else {
          callback(err);
        }
      });
    }
  },
});

Topics.toArray = function (topics) {
  return topics instanceof Backbone.Collection ? topics.toArray() : topics;
};

Topics.byTime = function (topics) {
  const FAR_AWAY_TIME = new Date(2100, 12, 30).getTime();
  return _.sortBy(Topics.toArray(topics), function (topic) {
    const openCourse = topic.get('open_course');
    return (openCourse && openCourse.getStartTime()) || FAR_AWAY_TIME;
  });
};

Topics.byCurrentlyRunning = function (topics) {
  const groups = _.groupBy(Topics.toArray(topics), function (topic) {
    if (topic.get('on-demand')) {
      // We're going to group these together and prepend them later.
      return 'flex';
    } else if (topic.get('open_course')) {
      const course = topic.get('open_course');
      if (course.getStartDiff() <= 0 && course.getEndDiff() > 0) {
        return 'current';
      } else if (course.getEndDiff() <= 0) {
        return 'ended';
      } else {
        return 'tba'; // to be announced
      }
    }

    return 'other';
  });
  // current courses by recent first
  let current = _.sortBy(groups.current, function (topic) {
    return -topic.get('open_course').getStartDiff();
  });
  // ended courses by recent first
  const ended = _.sortBy(groups.ended, function (topic) {
    return -topic.get('open_course').getEndDiff();
  });

  // let's prepend the flex courses
  if (groups.flex) {
    current = groups.flex.concat(groups.current || []);
  }

  return _.union(current, ended);
};

Topics.byUpcoming = function (topics) {
  const sessionId = Cookie.get('__204u') || '1234';

  const rankGenerator = function (short_name) {
    const frontPageSize = 20;
    // on average, how many on demand will appear on front end
    const numOnDemandOnFrontPage = 7;
    const onDemandCourseCount = constants.openCourses.length;
    const ratio = onDemandCourseCount / numOnDemandOnFrontPage;
    const openCourseRange = parseInt(ratio * frontPageSize);
    const week = moment().week();
    const num1 = short_name.charCodeAt(0) - 96; // 'a' is 96
    const num2 = short_name.charCodeAt(1) - 96;
    const num3 = sessionId.charCodeAt(3);
    const num4 = sessionId.charCodeAt(4);
    let result = parseInt(((num1 * num2 * num3) / num4) * (week - 9 / (week + 7))) % openCourseRange;
    if (result < 0) result = -result;
    return result - 14;
  };

  const MANY_DAYS_IN_FUTURE = 1000000;
  return _.sortBy(Topics.toArray(topics), function (topic) {
    if (_.contains(constants.pinnedCourses, topic.get('short_name'))) {
      return -21;
    } else if (topic.get('on-demand')) {
      return rankGenerator(topic.get('short_name'));
    } else if (topic.get('open_course')) {
      if (topic.get('open_course').getStartDiff() > -14) {
        // only surface courses that started in last 7 days
        return topic.get('open_course').getStartDiff();
      } else {
        return topic.get('open_course').getStartDiff() + MANY_DAYS_IN_FUTURE;
      }
    }

    return MANY_DAYS_IN_FUTURE * 2;
  });
};

Topics.byUpcomingWithCount = function (topics, days) {
  const MANY_DAYS_IN_FUTURE = 1000000;
  let count = 0;
  const upcomingTopics = _.sortBy(Topics.toArray(topics), function (topic) {
    if (topic.get('open_course')) {
      const startDiff = topic.get('open_course').getStartDiff();
      if (startDiff > 0 && startDiff < days) {
        count++;
        return topic.get('open_course').getStartDiff();
      } else {
        return topic.get('open_course').getStartDiff() + MANY_DAYS_IN_FUTURE;
      }
    }

    return MANY_DAYS_IN_FUTURE * 2;
  });
  return {
    topics: upcomingTopics,
    count,
  };
};

Topics.byName = function (topics) {
  return _.sortBy(Topics.toArray(topics), function (topic) {
    return topic.get('name');
  });
};

Topics.byDuration = function (topics) {
  return _.sortBy(Topics.toArray(topics), function (topic) {
    if (topic.get('open_course')) {
      return topic.get('open_course').getDurationWeeks();
    }

    return 1000;
  });
};

Topics.byAdded = function (topics) {
  return _.sortBy(Topics.toArray(topics), function (topic) {
    return -topic.get('id');
  });
};

Topics.matchingSearch = function (topics, search) {
  let searchWords = search.match(/\w+|"[^"]+"/g); // splits words, but leaves strings in quotes alone
  searchWords = _.map(searchWords, function (word) {
    return word.replace(/"/g, '');
  });
  const searchPatterns = _.map(searchWords, function (word) {
    return new RegExp('\\b' + word, 'i');
  });
  const matchingTopics = _.filter(Topics.toArray(topics), function (topic) {
    const uninames = _.pluck(topic.get('universities'), 'name');
    const unis = uninames.join(' ');
    const shortUnis = _.pluck(topic.get('universities'), 'short_name').join(' ');
    const cats = _.pluck(topic.get('categories'), 'name').join(' ');
    const shortDescription = (topic.get('short_description') || '').split(/\W+/).join(' ');
    return _.all(searchPatterns, function (pattern) {
      return (
        pattern.test(topic.get('name')) ||
        pattern.test(unis) ||
        pattern.test(cats) ||
        pattern.test(topic.get('short_description')) ||
        pattern.test(shortUnis) ||
        pattern.test(shortDescription) ||
        _.any(topic.get('instructors'), function (instructor) {
          return pattern.test(util.concatName(instructor));
        })
      );
    });
  });
  return matchingTopics;
};

Topics.forUniversity = function (topics, shortName) {
  const matchingTopics = _.filter(Topics.toArray(topics), function (topic) {
    const unis = _.pluck(topic.get('universities'), 'short_name');
    return unis.indexOf(shortName) != -1;
  });
  return matchingTopics;
};

Topics.forCategory = function (topics, shortName) {
  const matchingTopics = _.filter(Topics.toArray(topics), function (topic) {
    const cats = _.pluck(topic.get('categories'), 'short_name');
    return cats.indexOf(shortName) != -1;
  });
  return matchingTopics;
};

/* If you have some rootModels that look like this:
 *  [{name: 'bla', uni_ids: [2, 3]}, {name: 'foo', uni_ids: [6]}]
 * and you have some related universities that look like this:
 *  [{name: 'Stanford University', id: 2}, {name: 'MIT', id: 3}, {name: 'University of Berlin', id: 6}]
 * then you can call
 *  parseRelatedModel(rootModels, relatedUniversities, 'uni_ids', 'universities', 'id')
 * to embed the universities in the root models like this:
 *  [{name: 'bla', universities: [{name: 'Stanford University'}, ...]}, ...] */
const parseRelatedModel = function (rootModels, relatedModels, relatedKey, relatedKey2, relatedIdName) {
  _.each(rootModels, function (rootModel) {
    if (rootModel[relatedKey]) {
      const relatedIds = rootModel[relatedKey];
      rootModel[relatedKey2] = [];
      _.each(relatedIds, function (relatedId) {
        const relatedModel = _.find(relatedModels, function (testModel) {
          return testModel[relatedIdName] == relatedId;
        });
        rootModel[relatedKey2].push(relatedModel);
      });
    }
  });
};

Topics.parse = function (response) {
  parseRelatedModel(response.topics, response.unis, 'unis', 'universities', 'id');
  parseRelatedModel(response.topics, response.cats, 'cats', 'categories', 'id');
  _.each(response.courses, function (course) {
    response.topics[course.topic_id].courses = response.topics[course.topic_id].courses || [];

    parseRelatedModel([course], response.insts, 'instructors', 'instructors', 'instructor_id');
    response.topics[course.topic_id].courses.push(course);
  });
  const topics = _.values(response.topics);
  return topics;
};

/* Returns a deferred that resolves into the collections of all the topics from topics/list2 */
let deferredListJson;
Topics.singletonReadAll = function () {
  if (deferredListJson) {
    return deferredListJson;
  }

  deferredListJson = $.Deferred();

  const fetchUrl = 'topic/list2';

  const data = {
    unis: ['id', 'name', 'short_name', 'partner_type', 'favicon', 'home_link', 'display', 'abbr_name'].join(),
    topics: [
      'id',
      'language',
      'name',
      'short_name',
      'subtitle_languages_csv',
      'self_service_course_id',
      'small_icon_hover',
      'large_icon',
      'short_description',
    ].join(),
    cats: ['id', 'name', 'short_name'].join(),
    insts: ['id', 'first_name', 'middle_name', 'last_name', 'short_name', 'user_profile__user__instructor__id'].join(),
    courses: [
      'id',
      'start_day',
      'start_month',
      'start_year',
      'status',
      'signature_track_open_time',
      'signature_track_close_time',
      'eligible_for_signature_track',
      'duration_string',
      'home_link',
      'topic_id',
      'active',
    ].join(),
  };

  Coursera.api
    .get(fetchUrl, {
      data,
    })
    .done(function (data) {
      Topics.nonblockingBackbonify(data, deferredListJson);
    })
    .fail(function () {
      deferredListJson.reject();
    });

  return deferredListJson;
};

/**
 * topicIds: array[int]: can be a singular topicId or an array of topic ids
 *
 * There are 5 options:
 *  max_to_return: max number of topics to return
 *  getAllTopicData: true|false to get all topic data
 *  flavor: eg. 'rank5', 'rank25', 'rank43', 'rank100'
 *  nLeadingDays: days to lead by based on start date
 *  nTrailingDays: days to trail by based on start date
 */
Topics.similarTopics = function (topicIds, options) {
  const data = _({ topic_ids: topicIds.join() }).extend(options);
  return Coursera.api.get('topic/similartopics', { data });
};

/* Resolves deferred into a Backbone collection of topics, without freezing
 * the browser */
Topics.nonblockingBackbonify = function (rawJson, deferred) {
  let i = 0;
  const topics = new Topics();
  const parsedJson = Topics.parse(rawJson);

  function worker() {
    // We don't want it to take more than 100ms
    const startTime = new Date().getTime();
    while (i < parsedJson.length && new Date().getTime() < startTime + 100) {
      topics.add(parsedJson[i]);
      i++;
    }

    if (i < parsedJson.length) {
      setTimeout(worker, 0);
    } else {
      deferred.resolve(topics, rawJson);
    }
  }

  worker();
};

export default Topics;
