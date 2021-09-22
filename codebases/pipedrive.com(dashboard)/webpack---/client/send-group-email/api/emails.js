import { post } from '@pipedrive/fetch';
import { MergeFieldsPlugin } from '@pipedrive/pd-wysiwyg';
import { hasEmptyPlaceholders, getMergeFieldCounts } from '../utils/merge-fields';
import { REQUEST_RETRY_COUNT, REQUEST_RETRY_DELAY } from '../constants';

const sumCounts = (...objects) =>
	objects.reduce((sums, object) => {
		Object.keys(object).forEach((key) => {
			const value = object[key];

			if (key in sums) {
				sums[key] += value;
			} else {
				sums[key] = value;
			}
		});

		return sums;
	}, {});

export const validateEmailsRequest = async (emails) =>
	(await post('/api/v1/mailbox/validateEmails', { emails })).data;

export const sendGroupEmails = ({
	messages,
	relatedObjects,
	composerData,
	wysiwyg,
	subjectEditor,
	files,
	sendingSubjectStatus,
	usageTracking,
	setSending,
	setModalVisibility,
	setSent,
	setSendingSubjectStatus,
	setFailedResponse,
	sendingScheduledEmail,
	scheduledAtTimeProps
}) => {
	// check if any "placeholder" merge field is empty
	if (
		hasEmptyPlaceholders(wysiwyg.current, [
			wysiwyg.current.editorEl,
			subjectEditor.current.editorEl
		])
	) {
		setSending(false);

		return;
	}

	const subject = subjectEditor.current.getParsedContent({
		[MergeFieldsPlugin.name]: { keepFieldSyntax: true }
	});
	const attachmentIds = files.map(({ file }) => file.id);

	const sendGroupEmails = async () => {
		try {
			const response = await post(
				'/api/v1/mailbox/mailQueue',
				{
					...composerData,
					subject,
					body: wysiwyg.current.getParsedContent({
						[MergeFieldsPlugin.name]: {
							keepFieldSyntax: true
						}
					}),
					to: messages,
					related_objects: relatedObjects,
					file_ids: attachmentIds,
					...(sendingScheduledEmail
						? {
								priority_type: 'scheduled_group',
								delay_until_time: scheduledAtTimeProps.time
						  }
						: null)
				},
				{ retryOptions: { retries: REQUEST_RETRY_COUNT, retryDelay: REQUEST_RETRY_DELAY } }
			);

			setModalVisibility(false);
			setSent(true);

			const subjectFieldCounts = getMergeFieldCounts(subjectEditor.current);
			const composerFieldCounts = getMergeFieldCounts(wysiwyg.current);
			const totalFieldCounts = sumCounts(subjectFieldCounts, composerFieldCounts);
			const defaultTrackingBody = {
				template_id: composerData.template_id,
				open_tracking_on: composerData.mail_tracking_open_mail,
				link_tracking_on: composerData.mail_tracking_link,
				person_merge_field_count: totalFieldCounts.personInputCount,
				deal_merge_field_count: totalFieldCounts.dealInputCount,
				org_merge_field_count: totalFieldCounts.orgInputCount,
				other_merge_field_count: totalFieldCounts.otherInputCount,
				total_merge_field_count: totalFieldCounts.totalCount,
				subject_total_merge_field_count: subjectFieldCounts.totalCount,
				template_attachment_count: files.filter((file) => !!file.mail_template_id).length,
				attachment_count: files.length,
				group_id: response.data[0].group_uid,
				count_of_messages: messages.length
			};
			const trackingProperties = sendingScheduledEmail
				? {
						componentName: 'group_email_schedule',
						actionName: 'created',
						bodyProps: {
							...defaultTrackingBody,
							date_time_selection: scheduledAtTimeProps.type,
							date_time_value: scheduledAtTimeProps.time
						}
				  }
				: {
						componentName: 'group_email',
						actionName: 'sent',
						bodyProps: defaultTrackingBody
				  };

			usageTracking.sendMetrics(
				trackingProperties.componentName,
				trackingProperties.actionName,
				trackingProperties.bodyProps
			);
		} catch (error) {
			setSending(false);
			setFailedResponse(true);
		}
	};

	if (subject || sendingSubjectStatus === 'checked') {
		sendGroupEmails();
	} else {
		setSendingSubjectStatus('checking');
	}
};
