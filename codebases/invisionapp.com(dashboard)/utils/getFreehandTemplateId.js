const templateMap = {
  blank: 'blank',
  teamMeeting: 'meeting-agenda',
  brainstorm: 'brainstorming-xbox',
  projectKickoff: 'product-launch',
  roadmap: 'product-planning'
}

const getFreehandTemplateId = (template) => {
  return templateMap[template]
}

export default getFreehandTemplateId
