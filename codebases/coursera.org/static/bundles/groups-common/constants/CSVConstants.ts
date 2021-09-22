const CSVConstants = {
  Types: {
    BlackboardV1: 'BlackboardV1',
    BlackboardV2: 'BlackboardV2',
    Moodle: 'Moodle',
    Sakai: 'Sakai',
    Canvas: 'Canvas',
    Generic: 'Generic',
    BetaTester: 'BetaTester',
    Degree: 'Degree',
  },

  ColumnData: {
    BlackboardV1: {
      RequiredColumns: ['Last Name', 'First Name', 'Username', 'Student ID'],
      SampleData: ['Smith', 'John', 'jsmith', '1234'],
    },
    BlackboardV2: {
      RequiredColumns: ['Last Name', 'First Name', 'Username', 'Student ID', 'Email'],
      SampleData: ['Smith', 'John', 'jsmith', '1234', 'jsmith@example.com'],
      Note: 'Note that "Email" is not part of standard blackboard exports and must be added manually.',
    },
    Moodle: {
      RequiredColumns: ['Surname', 'First name', 'Email address'],
      SampleData: ['Smith', 'John', 'jsmith@example.com'],
      OptionalColumns: ['ID number', 'Institution', 'Department'],
    },
    Sakai: {
      RequiredColumns: ['Student Name', 'Student ID', 'Email'],
      SampleData: ['John Smith', '1234', 'jsmith@example.com'],
      Note: 'Note that "Email" is not part of standard Sakai exports and must be added manually.',
    },
    Canvas: {
      RequiredColumns: ['Student', 'ID', 'SIS User ID', 'SIS Login ID', 'Section'],
      SampleData: ['John Smith', 'jsmith', '12345678', 'jsmith@example.com', 'section10'],
    },
    Generic: {
      RequiredColumns: ['Full Name', 'Email'],
      SampleData: ['John Smith', 'jsmith@example.com'],
      Note: '',
    },
    BetaTester: {
      RequiredColumns: ['Full Name', 'Email'],
      SampleData: ['John Smith', 'jsmith@example.com'],
      Note: '',
    },
    Degree: {
      RequiredColumns: ['First Name', 'Last Name', 'Email', 'Student ID'],
      SampleData: ['John', 'Smith', 'jsmith@example.com', '1234'],
      Note: '',
    },
  },

  TypeLookups: [
    { name: 'blackboardPrivateCommunity', label: 'Blackboard' },
    { name: 'moodlePrivateCommunity', label: 'Moodle' },
    { name: 'sakaiPrivateCommunity', label: 'Sakai' },
    { name: 'canvasPrivateCommunity', label: 'Canvas' },
    { name: 'genericPrivateCommunity', label: 'Generic' },
    { name: 'degreePrivateCommunity', label: 'Degree' },
  ],

  SuperuserTypeLookups: [{ name: 'betaTesterPrivateCommunity', label: 'Beta Testers' }],

  CSV_TEMPLATE_URL: 'https://s3.amazonaws.com/coursera-university-assets/program-assets/csv/csv-template.csv',
};

export default CSVConstants;

export const { Types, ColumnData, TypeLookups, SuperuserTypeLookups, CSV_TEMPLATE_URL } = CSVConstants;
