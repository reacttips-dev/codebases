/* eslint-disable camelcase */
import { CmlContent } from 'bundles/cml/types/Content';
import { CourseScheduleSuggestion as CourseScheduleSuggestionType } from 'bundles/course-sessions/types/LearnerCourseScheduleSuggestion';

class CourseScheduleSuggestion {
  private suggestion: CourseScheduleSuggestionType;

  constructor(suggestion: CourseScheduleSuggestionType) {
    this.suggestion = suggestion;
  }

  get extension() {
    if (this.isExtension) {
      return (
        this.suggestion?.['org.coursera.ondemand.schedule.Extension'] ||
        // @ts-ignore 'org.coursera.ondemand.schedule.suggestion.Extension' is not a type??
        this.suggestion?.['org.coursera.ondemand.schedule.suggestion.Extension']
      );
    }
  }

  get shiftDeadlines() {
    if (this.isShiftDeadlines) {
      return this.suggestion?.['org.coursera.ondemand.schedule.suggestion.ShiftDeadlines'];
    }
  }

  get isExtension() {
    return (
      !!this.suggestion?.['org.coursera.ondemand.schedule.Extension'] ||
      // @ts-ignore 'org.coursera.ondemand.schedule.suggestion.Extension' is not a type??
      !!this.suggestion?.['org.coursera.ondemand.schedule.suggestion.Extension']
    );
  }

  get isNoSuggestion() {
    return (
      !!this.suggestion?.['org.coursera.ondemand.schedule.NoSuggestion'] ||
      // @ts-ignore 'org.coursera.ondemand.schedule.suggestion.NoSuggestion' is not a type??
      !!this.suggestion?.['org.coursera.ondemand.schedule.suggestion.NoSuggestion']
    );
  }

  get isShiftDeadlines() {
    return !!this.suggestion?.['org.coursera.ondemand.schedule.suggestion.ShiftDeadlines'];
  }

  get days(): number | undefined {
    if (this.extension && this.extension.days !== undefined) {
      return this.extension.days;
    }

    if (this.shiftDeadlines && this.shiftDeadlines.days) {
      return this.shiftDeadlines.days;
    }
  }

  get progressPercentage(): number | undefined {
    if (this.extension && this.extension.progressPercentage !== undefined) {
      return this.extension.progressPercentage;
    }

    if (this.shiftDeadlines && this.shiftDeadlines.progressPercentage) {
      return this.shiftDeadlines.progressPercentage;
    }
  }

  get startsAtForShiftDeadlinesSuggestion(): number | undefined {
    if (this.shiftDeadlines && this.shiftDeadlines.startsAt) {
      return this.shiftDeadlines.startsAt;
    }
  }

  get endsAtForShiftDeadlinesSuggestion(): number | undefined {
    if (this.shiftDeadlines && this.shiftDeadlines.endsAt) {
      return this.shiftDeadlines.endsAt;
    }
  }

  get changesDescriptionForShiftDeadlinesSuggestion(): CmlContent | undefined {
    const sessionSwitch = this.shiftDeadlines?.sessionSwitch;
    if (sessionSwitch && 'branchChange' in sessionSwitch && sessionSwitch.branchChange) {
      return sessionSwitch.branchChange.changesDescription;
    }
  }

  get destinationSessionBranchIdForShiftDeadlinesSuggestion(): string | undefined {
    // @ts-ignore 'org.coursera.ondemand.session.SuggestedSwitch' is not a member of sessionSwitch
    const suggestedSwitch = this.shiftDeadlines?.sessionSwitch?.['org.coursera.ondemand.session.SuggestedSwitch'];
    if (suggestedSwitch) {
      return suggestedSwitch.destinationSessionBranchId;
    }
  }

  hasVersionChangeForShiftDeadlinesSuggestion(): boolean {
    const sessionSwitch = this.shiftDeadlines?.sessionSwitch;
    if (sessionSwitch && 'branchChange' in sessionSwitch && sessionSwitch.branchChange) {
      return true;
    }

    return false;
  }
}

export default CourseScheduleSuggestion;
