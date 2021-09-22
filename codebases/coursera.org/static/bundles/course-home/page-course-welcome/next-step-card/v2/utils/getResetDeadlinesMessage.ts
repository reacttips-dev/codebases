import _t from 'i18n!nls/course-home';

export default (progress: number) => {
  if (progress === 0) {
    return {
      title: _t('Ready to get started?'),
      message: _t('It looks like you missed some important deadlines. Reset your deadlines and get started today.'),
    };
  } else if (progress <= 50) {
    return {
      title: _t('Pick up where you left off'),
      message: _t("Don't let the great things you learned fade away!"),
    };
  } else if (progress > 50 && progress < 100) {
    return {
      title: _t('You can finish this time'),
      message: _t(
        "You've already completed #{percentage}% of your course! Reset your deadlines so you can finish the rest!",
        {
          percentage: progress,
        }
      ),
    };
  } else {
    return {
      title: _t('You can finish this time'),
      message: _t(
        "You've completed everything, but some assignments are not graded yet. Reset your deadlines so they can be graded!"
      ),
    };
  }
};
