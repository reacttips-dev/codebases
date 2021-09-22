/**
 * Subclass of the admin-menu view to handle interactions with the admin
 * menu on the class details page
 *
 * @author      Calvin Chan <calvin@skillshare.com>
 */
import AdminMenu from 'core/src/views/modules/admin-menu/admin-menu';
import TeacherMenuClasses from 'core/src/views/modules/teacher-menu/teacher-menu-classes';

const AdminMenuClassDetailsView = AdminMenu.extend({
  events: {
    'click .approve-class': 'onClickApproveClass',
    'click .approve-and-feature-class': 'onClickApproveAndFeatureClass',
    'click .update-previewable': 'onClickPreviewable',
    'click .update-indexed': 'onClickIndexed',
    'click .js-update-transcript': 'onClickTranscripts',
    'click .update-staff-pick': 'onClickStaffPick',
    'click .update-audio-only': 'onClickAudioOnly',
    'click [name="display_status"]': 'onClickDisplayStatus',
    'focus .js-quality-grade': 'onFocusQualityGrade',
    'change .js-quality-grade': 'onChangeQualityGrade',
    'click .js-button-update-note-only': 'onClickButtonUpdateNotesOnly',
    'keyup .js-quality-grade-notes': 'onChangeQualityGradeNote',
    'click .update-ss-owned': 'onClickSkillshareOwned',
    'click .update-ss-produced': 'onClickSkillshareProduced',
    'click .delete-parent-class': 'onClickDeleteParentClass',
    'click .js-undelete-class': 'onClickUndeleteClass',
  },

  gradeDropdown: $('.js-quality-grade'),
  gradeNote: $('.js-quality-grade-notes'),
  gradeNoteConfimation: $('.js-grade-note-confirmation'),
  updateButtonGradeGradeNoteOnly: $('.js-button-update-note-only'),

  initialize: function(options) {
    AdminMenu.prototype.initialize.apply(this, arguments);
    this.classData = _.result(options, 'classData');
    new TeacherMenuClasses();
  },

  onClickApproveClass: function() {
    this.doApproveClass(0, 'This class WILL NOT be featured.');
  },

  onClickApproveAndFeatureClass: function() {
    this.doApproveClass(1, 'This class WILL be featured.');
  },

  doApproveClass: function(feature, additionalMessage) {
    const confirmationMessage = `Are you sure you want to approve this inbound class?\n`
        + `Pressing OK will publish this class so that it's live and enrollable.\n`
        + `${additionalMessage}`;
    let url = '/listings/publish';
    const params = {
      sku: this.classData.sku,
      feature: feature,
    };
    const errorMessage = 'Error publishing class. Are you sure your class doesn\'t have any validation errors?';
    this.actionOnClick(confirmationMessage, url, params, errorMessage);
  },

  onClickIndexed: function() {
    const isIndexed = this.classData.parentClass.is_indexed;
    this.toggleBooleanAttribute(isIndexed, 'is_indexed', 'indexing status');
  },

  onClickStaffPick: function() {
    const isStaffPick = this.classData.parentClass.is_staff_pick;
    this.toggleBooleanAttribute(isStaffPick, 'is_staff_pick', 'staff pick status');
  },


  onClickAudioOnly: function() {
    const isAudioOnly = this.classData.parentClass.is_audio_only;
    this.toggleBooleanAttribute(isAudioOnly, 'is_audio_only', 'audio only status');
  },


  onClickDisplayStatus: function(e) {
    e.preventDefault();
    const newDisplayStatus = parseInt(e.target.value, 10);
    const newDisplayLabel = e.target.labels[0].innerText;
    const confirmationMessage = `Are you sure you want to change the display status to ${newDisplayLabel}?`;
    const url = '/classes/adminUpdateAttributes';
    const postData = {
      id: this.classData.parentClass.id,
      attributes: {
        display_status: newDisplayStatus,
      },
    };
    const errorMessage = 'Error updating the display status. Are you sure your class doesn\'t have any validation errors?';
    this.actionOnClick(confirmationMessage, url, postData, errorMessage);
  },

  onChangeQualityGradeNote: function() {
    this.updateButtonGradeGradeNoteOnly.removeClass('hide');
  },

  onClickButtonUpdateNotesOnly: function() {
    const attributes = {
      quality_grade: parseInt(this.gradeDropdown.val(), 10),
      grade_note: this.gradeNote.val(),
    };

    this.updateQualityGrade(null, attributes);
  },

  showConfirmation: function() {
    this.updateButtonGradeGradeNoteOnly.prop('disabled', false);
    this.updateButtonGradeGradeNoteOnly.addClass('hide');
    this.gradeNoteConfimation.removeClass('hide');
    window.setTimeout(() => this.gradeNoteConfimation.addClass('hide'), 1500);
  },

  onFocusQualityGrade: function() {
    this.previousGradeDropdownState = {
      label: $('#site-menu .ss-select .label').text(),
      value: this.gradeDropdown.val(),
    };
  },

  resetGrade() {
    const prevState = this.previousGradeDropdownState;
    if (prevState) {
      $('#site-menu .ss-select .label').text(prevState.label);
      this.gradeDropdown.find(`option[value=${prevState.value}]`).prop('selected', true);
    }
  },

  onChangeQualityGrade: function(e) {
    e.preventDefault();
    const grade = parseInt(this.gradeDropdown.val(), 10);
    const note = this.gradeNote.val();
    const selectedOption = this.gradeDropdown.find(':selected');
    if (selectedOption.data('request-note') && (note.length < 3)) {
      alert('This type of grade needs a note!\nPlease input a grade note and reselect this grade.\nThe grade has not been updated!');
      this.resetGrade();
    } else {
      let confirmationMessage = null;
      if(selectedOption.data('request-confirm-msg')) {
        confirmationMessage = 'Are you sure you want to select ' + selectedOption.text() + ' for this class?';
      }

      const attributes = {
        quality_grade: grade,
        grade_note: note,
      };
      this.updateQualityGrade(confirmationMessage, attributes);
    }
  },

  updateQualityGrade: function(confirmationMessage, attributes) {
    this.updateButtonGradeGradeNoteOnly.prop('disabled', true);
    const url = '/classes/adminUpdateAttributes';
    const postData = {
      id: this.classData.parentClass.id,
      attributes,
    };
    const errorMessage = 'Error updating the quality grade.';
    this.actionOnClick(confirmationMessage, url, postData, errorMessage, this.resetGrade.bind(this), this.showConfirmation.bind(this));
  },

  onClickPreviewable: function() {
    const isPreviewable = this.classData.parentClass.is_previewable;
    this.toggleBooleanAttribute(isPreviewable, 'is_previewable', 'previewable status');
  },

  onClickSkillshareOwned: function() {
    const isOwned = this.classData.parentClass.is_skillshare_owned;
    this.toggleBooleanAttribute(isOwned, 'is_skillshare_owned', 'Skillshare owned status');
  },

  onClickSkillshareProduced: function() {
    const isSSProduced = this.classData.parentClass.is_skillshare_produced;
    this.toggleBooleanAttribute(isSSProduced, 'is_skillshare_produced', 'Skillshare produced status');
  },

  onClickTranscripts: function() {
    const isDisplayed = this.classData.parentClass.display_transcripts;
    this.toggleBooleanAttribute(isDisplayed, 'display_transcripts', 'Display Transcripts on Logged out Home');
  },

  onClickDeleteParentClass: function() {
    const confirmationMessage = 'Are you sure you want to delete this class and all related enrollments, projects, notes, etc.?';
    const url = '/listings/delete';
    const postData = {
      sku: this.classData.parentClass.sku,
    };
    const errorMessage = 'Could not delete the class';
    this.actionOnClick(confirmationMessage, url, postData, errorMessage);
  },

  onClickUndeleteClass: function(){
    const confirmationMessage = 'Are you sure you want to undelete this class and all related enrollments, projects, notes, etc.?';
    const url = '/listings/undelete';
    const postData = {
      sku: this.classData.parentClass.sku,
    };
    const errorMessage = 'Could not undelete the class';
    this.actionOnClick(confirmationMessage, url, postData, errorMessage);
  },

  toggleBooleanAttribute: function(isActive, attribute, attributeDescription) {
    const opposite = isActive ? 'NO' : 'YES';
    const oppositeValue = isActive ? 0 : 1;
    const confirmationMessage = 'Are you sure you want to change the ' + attributeDescription + ' to ' + opposite + '?';
    const url = '/classes/adminUpdateAttributes';
    const postData = {
      id: this.classData.parentClass.id,
      attributes: {
        [attribute]: oppositeValue,
      },
    };
    postData.attributes = {};
    postData.attributes[attribute] = oppositeValue;
    const errorMessage = 'Error updating the ' + attributeDescription + '. Are you sure your class doesn\'t have any validation errors?';
    this.actionOnClick(confirmationMessage, url, postData, errorMessage);
  },
});
export default AdminMenuClassDetailsView;
