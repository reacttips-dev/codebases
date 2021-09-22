export const getFilteredFilesByTemplateId = (files, templateId) => {
	return files ? files.filter((file) => file.mail_template_id === templateId) : [];
};
