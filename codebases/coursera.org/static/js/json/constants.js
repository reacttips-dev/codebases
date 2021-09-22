export default {
  openCourses: [
    'calculus1',
    'childnutrition',
    'competitivestrategy',
    'sustainabledevelopment1',
    'chineseforbeginners',
    'ageofjefferson',
    'epidemiology',
    'kennedy',
    'publicspeaking',
    'businessinsociety',
    'togetherteacher',
    'competitivestrategyzh',
    'financialengineering1',
    'financialengineering2',
    'insidetheinternet',
    'advancedchemistry',
  ],

  pinnedCourses: ['publicspeaking'],

  specializationsFlaggedForNoPayment: [
    'businessoperations',
    'digitalmarketing',
    'interactiondesign',
    'projectmanagement',
    'bizcommunication',
    'managementbasics',
    'biztools',
    'engineeringgraphics',
    'compsci',
    'socialscience',
  ],

  topicsFlaggedForNoPayment: ['foundationmedneuro'],
  specializationsFlaggedForPriceChange: ['jhudatascience', 'genomics'],

  chineseOnlyTopicToCourses: {
    datascitoolbox: [
      973978, // datascitoolbox-017
      973979, // datascitoolbox-018
      973980, // datascitoolbox-019
      974721, // datascitoolbox-020
      974722, // datascitoolbox-021
    ],
    rprog: [
      973973, // rprog-017
      973974, // rprog-018
      973975, // rprog-019
      973976, // rprog-020
      973977, // rprog-021
    ],
    getdata: [
      974176, // getdata-017
      974764, // getdata-018
      974770, // getdata-019
      974771, // getdata-020
      974772, // getdata-021
    ],
    exdata: [
      974177, // exdata-017
      974765, // exdata-018
      974766, // exdata-019
      974767, // exdata-020
      974768, // exdata-021
    ],
    // 'repdata': [
    //   974178  // repdata-017
    // ],
    // 'statinference': [
    //   974179  // statinference-017
    // ]
  },

  flexjoin_course_ids: [
    970641, // livearthistory-001
    972058, // intlcriminallaw-003
    971830, // biostats-005
    971921, // ccss-literacy1-002
    971981, // ccss-math1-002
    972197, // modelsystems-002
    972476, // ucimicroeconomics-003
    972475, // ucimacroeconomics-004
    972296, // healthcareinnovation-002
    972242, // lead-ei-003
    972189, // malsoftware-002
    972750, // innovativeideas-012
    972893, // ucimacroeconomics-005
    972894, // ucimicroeconomics-004
    972895, // precalculus-003
    971772, // elearning-001
    970726, // virtualinstruction-002
    972974, // innovativeideas-013
    972902, // 4dimensions-004
    971727, // emergenceoflife-001
    971558, // welcome2math-002
    972832, // jerusalem-003
    972560, // managingmoney-001
    972196, // lyingcamera-002
    971211, // humankind-002
    971994, // k12virtualtrends-002
    973098, // innovativeideas-014

    // TESTING
    5000000,
    5000001,
  ],

  // topics for the student stories A/B test
  student_stories_topics: {
    // Python
    88: [
      {
        text:
          "I've begun using Python for data analysis. My Certificate not only gave me commitmment to complete the course but also something to highlight in school applications.",
        student: 'Timothy W.',
        title: 'Business Analyst at Boeing',
      },
      {
        text:
          'The course material made me a better data analyst. I was able to get a promotion and raise within weeks of completing my first course. I am just thrilled!',
        student: 'Corey K.',
        title: 'IT & Support Professional',
      },
      {
        text:
          'I needed to upgrade my programming skills to cope with the ever-increasing software-defined infrastructure in the industry. I know the Course Certificate will help my career.',
        student: 'Bernard T.',
        title: 'Hardware Engineer at Cisco',
      },
      {
        text:
          'I took this course to better prepare myself for upcoming projects at work. The Certificate helps to verify my effort. It reassures my employer that I’m capable to take on Python-related tasks.',
        student: 'Andy L.',
        title: 'Systems Administrator - Florida Museum of History',
      },
    ],
    // Developing Innovative Ideas
    168: [
      {
        text:
          'The course improved my knowledge in the field, and the Course Certificate gives me a lot more credibility.',
        student: 'Clayton S.',
        title: 'Business Development Manager',
      },
      {
        text:
          "I'm using what I learned in the course to develop new products in my company, one of the oldest and most respected newspapers in Brazil.",
        student: 'Nelson P.',
        title: 'CIO from Brazil',
      },
      {
        text:
          'After the course, I was inspired to write the business plan for my start-up. My certificate proves what I’ve accomplished!',
        student: 'Florian A.',
        title: 'Account Manager from Switzerland',
      },
      {
        text:
          'By showing my Course Certificate to my employer, I was able to get support to turn my idea into a new project.',
        student: 'Sebastian S.',
        title: 'Programmer from Costa Rica',
      },
    ],
    // An Introduction to Marketing (/marketing)
    747: [
      {
        text:
          "This course helped me identify a target market and understand aspects of marketing that I hadn't been aware of, and for that I am grateful. I'll use the certificate I received from Coursera as a seal of approval for my work.",
        student: 'Bartholomew N.',
        title: 'Director of Fundraising at WQED in Pittsburgh, PA',
      },
      {
        text:
          'The course validated the analytics functions we’ve instituted within our company. And the Course Certificate validates my skill set.',
        student: 'Michael D.',
        title: 'Director of Sales from Portland',
      },
      {
        text:
          'Learning is a never-ending process. Now I know what needs to get done before I start rebranding my company.',
        student: 'Saundra L.',
        title: 'CEO from Miami, Florida',
      },
      {
        text:
          "My employers were happy to hear that I'd completed the course. The Course Certificate shows my dedication to performing better at my current position.",
        student: 'Stephanie N.',
        title: 'Marketing Communications Manager from Newark, Delaware',
      },
    ],
  },
};
