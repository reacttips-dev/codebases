/* Defines the model for a Course Present Grade */

import { CoursePassingForecast } from 'bundles/ondemand/constants/Constants';

class CoursePresentGrade {
  constructor({ grade, passingStateForecast, userId, courseId, relevantItems }) {
    this._grade = grade;
    this._passingStateForecast = passingStateForecast;
    this._courseId = courseId;
    this._userId = userId;
    this._relevantItems = relevantItems;
    this._label = 'Current Course Grade';
    this._labelShort = 'Current Grade';
  }

  get grade() {
    return this._grade;
  }

  get displayGrade() {
    return Math.round(this._grade * 1000) / 10; // display as percentage
  }

  get label() {
    return this._label;
  }

  get labelShort() {
    return this._labelShort;
  }

  get hasPresentGrade() {
    return this.grade() !== undefined;
  }

  get isPassing() {
    return this._passingStateForecast === CoursePassingForecast.PASSING;
  }
}

export default CoursePresentGrade;
