/* ============================================================
   MojaMind — content & instruments
   Verbatim survey content transcribed from the MojaMind
   screen recordings (12 Jun 2026), demo deck, and the
   Stellenbosch University "Creative Resilience Proposed
   Survey Changes" + "New MojaMind Design_07082026" documents.
   © IONITY Global (Pty) Ltd — MojaMind Creative Resilience.
   ============================================================ */
'use strict';

const MM = {};

MM.APP_NAME = 'MojaMind';
MM.CREATOR = 'IONITY Global (Pty) Ltd';
MM.AUTHOR = 'Johan Wilhelm van Antwerp';
MM.ORGANIZATION = 'Ionity (Pty) Ltd / Antwerp Designs / AEDI';
MM.TAGLINE = 'Building Tomorrow, Today. Anything is Possible with God.';
MM.DESIGNER = 'Solutionist of Antwerp Designs & Ecosystems Engineer';
MM.ENDPOINTS = {
  main: 'https://www.ionity.co.za/',
  profile: 'https://www.ionity.world/',
  linkedin: 'https://www.linkedin.com/in/ionity',
  github: 'https://github.com/AntwerpDesignsIonity',
  contact: 'johan@ionity.co.za',
  phone: '+27 64 699 9877',
};
MM.PORTFOLIO_URL = 'https://www.ionity.co.za';

/* ── Cloud sync (OPT-IN) ─────────────────────────────────────
   The app is 100% on-device by default. Flip `enabled` to true and
   set `base` to your hosted study API (see BACKEND_AZURE.md) to
   stream survey/activity/chat data to the DB and let the admin
   inbox read all participants' messages. Leave disabled to stay
   fully DataFree/offline. Never commit a secret admin key here —
   `key` is a public *write* token only. */
MM.SYNC = {
  enabled: false,
  base: '',            // e.g. 'https://mojamind-api.azurewebsites.net/api'
  key: '',             // optional public write token / function key
  studyId: 'creative-resilience-2026',
  flushMs: 15000,      // queue flush interval (ms)
};

/* ── Partners (opening splash) ───────────────────────────── */
MM.PARTNERS = {
  headline: 'Welcome',
  poweredBy: ['SHOUT-IT-NOW', 'Stellenbosch University'],
  madePossibleBy: 'Gilead',
  line: 'Powered by SHOUT-IT-NOW & Stellenbosch University · Made possible by Gilead',
  craftedBy: 'Crafted by IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp (Antwerp Designs) · www.ionity.co.za',
};

/* ── Journal Prompts for Writer ─────────────────────────── */
MM.JOURNAL_PROMPTS = [
  'What brought a spark of hope or light to your day today?',
  'Write about a challenge you faced and the strength you found inside.',
  'Describe a feeling you want to gently release or express.',
  'Three small things you are deeply grateful for right now.',
  'A message of kindness you wish someone would say to you today.',
  'How your creative spirit is growing this week.',
];

/* ── Study groups (feature availability per protocol) ────── */
MM.GROUPS = {
  1: { name: 'Group 1', desc: 'Surveys & support only', art: false, chat: false },
  2: { name: 'Group 2', desc: 'Surveys, support & art activities', art: true, chat: false },
  3: { name: 'Group 3', desc: 'The full experience — surveys, art & chat', art: true, chat: true },
};

/* ── Response scales ─────────────────────────────────────── */
MM.SCALES = {
  freq4:   ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  mars:    ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
  stigma:  ['Never', 'Sometimes', 'Often/usually'],
  agree5:  ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  yesno:   ['Yes', 'No'],
  agree7:  ['Strongly agree', 'Agree', 'Somewhat agree', 'Neutral', 'Somewhat disagree', 'Disagree', 'Strongly disagree'],
};

/* ── Demographic questionnaire (16 questions) ────────────── */
MM.DEMOGRAPHICS = {
  id: 'demographics',
  title: 'Demographic Questions',
  theme: 'demo',
  optClass: 'opt-demo',
  questions: [
    { id: 'age',       text: 'What is your Age?', options: ['18', '19', '20', '21', '22', '23', '24'] },
    { id: 'gender',    text: 'What is your Gender?', options: ['Female', 'Male', 'Non-binary/ Genderqueer', 'Prefer not to say', 'Other (please specify)'], other: 'Other (please specify)' },
    { id: 'region',    text: 'Which region are you from?', options: ['Rural', 'Urban'] },
    { id: 'province',  text: 'Which province do you live in? (Please tick one)', options: ['Gauteng', 'North West', 'Western Cape'] },
    { id: 'livewith',  text: 'Who do you live with?', options: ['Alone', 'Family', 'Spouse/Partner', 'Friends/Housemate', 'Other (please specify)'], other: 'Other (please specify)' },
    { id: 'water',     text: 'Do you have access to clean water?', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'power',     text: 'Do you have reliable electricity at home?', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'grade',     text: 'What is the highest grade you passed?', options: ['No formal education', 'Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12 / Matric', 'Some college/university', 'Completed college/university'] },
    { id: 'work',      text: 'What is your employment status?', options: ['Unemployed', 'Part-time', 'Full-time', 'Student', 'Self-employed'] },
    { id: 'income',    text: 'What is your household income (per month)?', options: ['Less than R1 000', 'R1 000 – R4 999', 'R5 000 – R9 999', 'R10 000+', 'Prefer not to say'] },
    { id: 'relation',  text: 'What is your relationship status?', options: ['Single', 'In a relationship', 'Married', 'Separated/ Divorced'] },
    { id: 'support',   text: 'Do you have someone who supports you emotionally?', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'healthapp', text: 'Do you attend healthcare appointments regularly?', options: ['Regularly', 'Occasionally', 'Rarely', 'Never'] },
    { id: 'mwb',       text: 'How would you rate your mental well-being?', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
    { id: 'hiv',       text: 'Are you living with HIV?', options: ['Yes', 'No'] },
    { id: 'art',       text: 'Are you on Antiretroviral Therapy (ART)?', options: ['Yes', 'No'] },
  ],
};

/* ── Survey instruments ──────────────────────────────────────
   Per the Stellenbosch survey-changes document: three separate
   surveys at each pre data-collection point, four at each post
   point (usability added post-only). Each carries its own
   participant-facing introduction text, verbatim.             */
MM.SURVEYS = {
  mental: {
    id: 'mental',
    name: 'Mental Health Survey',
    theme: 'mental',
    optClass: 'opt-mental',
    num: 1,
    blurb: 'Please take a moment to answer the following questions. Remember, all your answers will remain confidential and your identity will remain anonymous. We would like to better understand how you have been feeling over the past two weeks.',
    sections: [
      {
        title: 'Question 1',
        scaleName: 'Patient Health Questionnaire (PHQ-9)',
        intro: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        scale: 'freq4',
        items: [
          'Little interest or pleasure in doing things',
          'Feeling down, depressed or hopeless',
          'Trouble falling or staying asleep, or sleeping too much',
          'Feeling tired or having little energy',
          'Poor appetite or overeating',
          'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
          'Trouble concentrating on things, such as reading the newspaper or watching television',
          'Moving or speaking so slowly that other people have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
          'Thoughts that you would be better off dead or of hurting yourself in some way',
        ],
      },
      {
        title: 'Question 2',
        scaleName: 'Generalised Anxiety Disorder Scale (GAD-7)',
        intro: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        scale: 'freq4',
        items: [
          'Feeling nervous, anxious or on edge',
          'Not being able to stop or control worrying',
          'Worrying too much about different things',
          'Trouble relaxing',
          'Being so restless that it is hard to sit still',
          'Becoming easily annoyed or irritable',
          'Feeling afraid as if something awful might happen',
        ],
      },
    ],
  },

  lifestyle: {
    id: 'lifestyle',
    name: 'Lifestyle Management Survey',
    theme: 'life',
    optClass: 'opt-life',
    num: 2,
    blurb: 'In this survey, we would like to explore your lifestyle habits, including your daily routines and health-related behaviours.',
    sections: [
      {
        title: 'Question 1',
        scaleName: 'Medication Adherence Report Scale (MARS-5)',
        intro: 'Many people find a way of using their medicines which suits them. This may differ from the instructions on the label. How often do the following apply to you?',
        scale: 'mars',
        items: [
          'I forget to take my anti-retroviral drugs',
          'I alter the dose of my anti-retroviral drugs',
          'I stop taking my anti-retroviral drugs for a while',
          'I decide to skip a dose of my anti-retroviral drugs',
          'I take less anti-retroviral drugs than instructed',
        ],
      },
      {
        title: 'Question 2',
        scaleName: '5-Question Stigma Indicator-Affected Person',
        intro: 'In the past year:',
        scale: 'stigma',
        items: [
          'Have you experienced problems in finding or keeping work because you have HIV?',
          'Have you been worried about others finding out you have HIV?',
          'Have you felt ashamed because of your condition?',
          'Have you had problems getting married/in your marriage because of HIV?',
          'Have people tried to avoid you because you have HIV?',
        ],
      },
    ],
  },

  wellbeing: {
    id: 'wellbeing',
    name: 'Personal Wellbeing Survey',
    theme: 'well',
    optClass: 'opt-well',
    num: 3,
    blurb: 'In this survey, we would like to ask you about your personal wellbeing, including coping strategies and general psychological health.',
    sections: [
      {
        title: 'Question 1',
        scaleName: 'Brief Resilience Scale',
        intro: 'Please respond to each item by selecting one answer per statement.',
        scale: 'agree5',
        items: [
          'I tend to bounce back quickly after hard times',
          'I have a hard time making it through stressful events',
          'It does not take me long to recover from a stressful event',
          'It is hard for me to snap back when something bad happens',
          'I usually come through difficult times with little trouble',
          'I tend to take a long time to get over set-backs in my life',
        ],
      },
      {
        title: 'Question 2',
        scaleName: 'CAGE-AID Questionnaire',
        intro: 'When thinking about drug use, include illegal drug use and the use of prescription drugs other than prescribed.',
        scale: 'yesno',
        items: [
          'Have you felt that you ought to cut down on your drinking or drug use?',
          'Have people annoyed you by criticising your drinking or drug use?',
          'Have you ever felt bad or guilty about your drinking or drug use?',
          'Have you ever had a drink or used drugs first thing in the morning to steady your nerves or to get rid of a hangover?',
        ],
      },
    ],
  },

  usability: {
    id: 'usability',
    name: 'App Usability Survey',
    theme: 'usab',
    optClass: 'opt-usab',
    num: 4,
    postOnly: true,
    blurb: 'In this survey, we would like to better understand what your experiences were of using the MojaMind application.',
    sections: [
      {
        title: 'Question 1',
        scaleName: 'mHealth Usability Questionnaire (MAUQ)',
        intro: 'We would love to hear about your experience! Your feedback helps us improve the app’s usability and effectiveness. Let’s get started! Please rate each statement on a scale from 1 (Strongly Agree) to 7 (Strongly Disagree).',
        scale: 'agree7',
        items: [
          'The creative resilience application was easy to use',
          'It was easy for me to learn to use the application',
          'The navigation was consistent when moving between screens',
          'The interface of the application allowed me to use all the functions offered (entering information, uploading pictures, viewing content)',
          'Whenever I made a mistake using the application, I could recover easily and quickly',
          'I like the interface of the application',
          'The information in the application was well organised, so I could easily find the information I needed',
          'The application adequately acknowledged and provided information to let me know the progress of my actions',
          'I feel comfortable using this application in social settings',
          'The amount of time involved in using this application has been fitting for me',
          'I would use this application again',
          'Overall, I am satisfied with this application',
          'The application would be useful for my health and well-being',
          'The application improved my access to health care services',
          'The application helped me manage my mental health effectively',
          'This application has all the functions and capabilities I expected it to have',
          'The application worked well even with a poor internet connection',
          'This application provides an acceptable way to receive health care services',
        ],
      },
    ],
  },
};

MM.PRE_SURVEYS  = ['mental', 'lifestyle', 'wellbeing'];
MM.POST_SURVEYS = ['mental', 'lifestyle', 'wellbeing', 'usability'];

MM.SURVEY_INTRO = {
  pre: {
    title: 'Take a quick mental health check-in!',
    body: 'Complete these three short surveys on how you feel, your lifestyle, and your personal wellbeing. Your responses help us support you better—let’s get started!',
    note: 'These surveys are part of the Creative Resilience study by Stellenbosch University. All answers remain confidential and anonymous. Each survey can be completed once.',
  },
  post: {
    title: 'Take a quick mental health check-in!',
    body: 'Welcome back! It’s time for your final check-in. Please take a few minutes to complete the four post-surveys to help us understand your experience. Your feedback is important—thank you for being part of this study!',
    note: 'These surveys are part of the Creative Resilience study by Stellenbosch University. All answers remain confidential and anonymous. Each survey can be completed once.',
  },
};

/* ── PHQ-9 risk screening (Stellenbosch protocol) ──────────
   PHQ-9 total of 20–27 → possible severe depression.
   Question 9 answered "Nearly every day" (3) → suicide screen.
   Either condition flags the participant as at risk: show the
   information message and open a social-worker ticket.        */
MM.RISK = {
  severeMin: 20,
  q9Index: 8,
  q9Min: 3,
  title: 'We’re here for you',
  message: 'Your responses suggest that you may be experiencing some challenges, and we would like to offer additional support. A social worker will contact you to offer assistance.',
  ticketSubject: 'Wellbeing check-in requested (survey screening)',
};

/* ── Home / welcome copy ─────────────────────────────────── */
MM.WELCOME = {
  fresh: {
    title: 'Welcome to Your Space',
    body: 'You’re ready to begin your 8-week journey. Explore the intervention instructions, helpful videos, and dive into the art activities at your own pace. If you need support or want to chat, we’re here for you anytime.',
    tail: 'Let’s get started!',
  },
  preDone: {
    title: 'Welcome to Your Space',
    body: 'Over the next 8 weeks, you will complete weekly activities and join virtual facilitated sessions to support your journey. Please check out the MojaMind instructions and available support services, and remember to complete your post-survey after 8 weeks.',
    tail: 'We’re excited to have you on this journey!',
  },
};

/* ── Onboarding ──────────────────────────────────────────── */
MM.TERMS = {
  title: 'Terms & Conditions',
  intro: 'Before you proceed, please review our policies regarding the handling of your information, privacy, and available support. This is a one-time agreement.',
  lead: 'By proceeding, you:',
  points: [
    ['Consent to Participate in a Research Study', 'Your responses will contribute to improving mental health support. All information will remain anonymous.'],
    ['Understand that your privacy is protected', 'Your data will not be shared beyond the research team.'],
    ['Acknowledge that a counsellor may review summaries of chats', 'If needed, they may reach out with mental health support and resources.'],
    ['Tap ‘Accept’ to continue your journey with MojaMind.', ''],
  ],
};

MM.ONBOARD = {
  title: 'Welcome to Your Space',
  body: 'Feeling overwhelmed by stress, anxiety, or depression? You’re not alone. It is important to reflect on your personal growth and check in with yourself.',
  ready: 'Ready to start?',
};

/* ── Instructions screen ─────────────────────────────────── */
MM.INSTRUCTIONS = {
  heroTitle: 'Welcome to Your Space',
  heroBody: 'Welcome to your 8-week creative journey! Explore art, words, or sound to express yourself. No right or wrong—just a space for self-reflection and growth.',
  sections: [
    {
      icon: 'clipboard',
      title: 'Your Participation',
      items: [
        ['A Pre-Survey', 'Complete one week prior to the start of the intervention.'],
        ['Intervention Duration', '8 weeks of app-based activities.'],
        ['Time Commitment', 'Weekly activities of ± 60 minutes per week.'],
        ['A Post-Survey', 'Complete one week after the intervention ends.'],
      ],
    },
    {
      icon: 'compass',
      title: 'Using the Creative Resilience Platform',
      items: [
        ['Instructions', 'Read before starting.'],
        ['Support Services', 'Find mental health and technical support anytime.'],
        ['Pre-Survey', 'Must be completed prior to the start of the intervention.'],
        ['Art Activities', 'Explore 8 weekly creative activities.'],
        ['Post-Survey', 'Opens after the intervention ends for feedback.'],
        ['Help Button', 'Provides immediate support when needed.'],
      ],
    },
    {
      icon: 'palette',
      title: 'Getting Started with Art Activities',
      items: [
        ['Review & Choose', 'Read the instructions of each activity and decide on your approach. Mix elements if needed.'],
        ['Prepare Your Space', 'Gather materials and minimise distractions.'],
        ['Ground Yourself', 'Take a deep breath or a moment of stillness before you begin.'],
        ['Create Freely', 'Let your creativity flow—there’s no right or wrong way.'],
        ['Reflect & Observe', 'Once done, sit with your artwork, recall your feelings, and answer reflection questions in your visual diary and the reflection tab.'],
        ['Express Without Judgment', 'Your reflections are personal—no need to filter or edit.'],
      ],
    },
  ],
  incentive: 'There’s no right or wrong — just your unique creative voice. Enjoy! At the start of the intervention, you will receive data vouchers (to download the application and attend online meetings), and an incentive for your time at the end of the intervention. If you have any questions or need support, simply reach out to your facilitator through the chat button.',
  datafree: 'DataFree friendly: MojaMind is an offline-first app. Once installed it opens without a connection, your work is saved on your phone, and data vouchers are provided for downloads and online meetings.',
};

/* ── Accessibility statement ─────────────────────────────── */
MM.A11Y = {
  title: 'Accessibility',
  statement: 'MojaMind is designed to support people with disabilities and impairments. You can make text bigger, increase contrast, and reduce motion below — your choices are remembered on this device. The app also supports screen readers, keyboard navigation and voice notes with on-device transcription.',
};

/* ── About Art Activities ────────────────────────────────── */
MM.ART_ABOUT = {
  heroBody: 'This is your creative space to express yourself, reflect, and grow through art, writing, and movement. No rules, no judgment—just you and your creativity!',
  lead: 'Each activity follows the same 5-step process:',
  steps: [
    ['📖', 'Read About the Activity', 'Every activity starts with a short intro about why it matters.'],
    ['🧘', 'Take a Deep Breath', 'Relax with a simple breathing exercise before creating.'],
    ['🎨', 'Choose Your Way to Create', 'You can draw, write, make a collage, or record your voice—whichever feels right for you!'],
    ['📤', 'Submit Your Work', 'Click Submit when you’re done. Submitted activities are locked to protect your original expression.'],
    ['💬', 'Reflect on Your Creation', 'Tap “Reflect” to answer thought-provoking questions about what you made.'],
  ],
};

/* ── Art activities (8 weeks) ────────────────────────────── */
MM.ART_OPTION_KINDS = [
  { key: 'art',     emoji: '🎨', name: 'Physical Art & Paper' },
  { key: 'draw',    emoji: '🖌️', name: 'Draw on Device (Digital Studio)' },
  { key: 'write',   emoji: '✍️', name: 'Write It Out' },
  { key: 'speak',   emoji: '🎤', name: 'Speak Up (Voice Note)' },
  { key: 'nature',  emoji: '🌿', name: 'Use Nature' },
  { key: 'digital', emoji: '📱', name: 'Get Digital (Photo & Collage)' },
];

/* Activities with published inspiration videos (id → options with video files
   at ./assets/videos/activity-<id>/option-<n>.mp4 or animated interactive canvas videos). */
MM.ACTIVITY_VIDEOS = {
  1: [1, 2, 3, 4, 5, 6],
  2: [1, 2, 3, 4, 5, 6],
  3: [1, 2, 3, 4, 5, 6],
  4: [1, 2, 3, 4, 5, 6],
  5: [1, 2, 3, 4, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
  7: [1, 2, 3, 4, 5, 6],
  8: [1, 2, 3, 4, 5, 6],
};

MM.ACTIVITIES = [
  {
    id: 1, name: 'Self-Portrait', week: 1,
    about: 'Who are you right now? This week is about seeing yourself with kindness and curiosity.',
    options: [
      'Physical Artwork: Draw or paint yourself on paper using colours that match your vibe.',
      'Draw on Device: Draw and paint your self-portrait directly on your screen with the digital paint studio.',
      'Write It Out: Write a poem, letter, or powerful words about who you are or who you’re becoming.',
      'Speak Up: Record a voice note, poem, or song that tells your story.',
      'Use Nature: Tell your story using natural materials around you.',
      'Get Digital: Snap a selfie and write about who you are right now.',
    ],
    startHere: [
      ['Find a chill spot.', 'Sit somewhere that feels safe or calm to you.'],
      ['Think about how you feel.', 'Happy? Stressed? Powerful? Sad? Hopeful?'],
      ['Choose your colours:', 'Use colours that match or express your current mood.'],
      ['Draw your self-portrait.', 'You can show your face, body, or symbols and shapes that represent you.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'A mirror or selfie for inspiration',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating your portrait?',
      'What did you learn about yourself?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 2, name: 'My Safe Space', week: 2,
    about: 'Everyone deserves a place where they feel calm and protected. This week you create yours.',
    options: [
      'Physical Artwork: Draw or paint on paper the place (real or imagined) where you feel safest.',
      'Draw on Device: Paint your safe space directly on your screen using brushes, stamps & glow tools.',
      'Write It Out: Describe your safe space in words—what you see, hear, and feel there.',
      'Speak Up: Record yourself describing your safe space as if guiding a friend into it.',
      'Use Nature: Build or arrange a small safe-space scene using natural materials.',
      'Get Digital: Photograph or design a collage of the place where you feel most at peace.',
    ],
    startHere: [
      ['Get comfortable.', 'Find a quiet moment where you won’t be disturbed.'],
      ['Close your eyes.', 'Picture a place where you feel completely safe and calm.'],
      ['Notice the details.', 'What colours, sounds, and textures live there?'],
      ['Bring it to life.', 'Recreate your safe space in the medium you chose.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'Magazines or photos for collage (optional)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating your safe space?',
      'What makes this space feel safe for you?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 3, name: 'My Family', week: 3,
    about: 'Family can mean many things. This week, express what family means to you.',
    options: [
      'Physical Artwork: Draw or paint the people (or pets!) you consider family on paper.',
      'Draw on Device: Draw your family or loved ones directly on screen with the digital canvas.',
      'Write It Out: Write a letter, poem, or memory about someone who feels like home.',
      'Speak Up: Record a story or message about the people who matter most to you.',
      'Use Nature: Use stones, leaves, or flowers to represent each person in your family.',
      'Get Digital: Create a photo collage of your chosen family.',
    ],
    startHere: [
      ['Think about your people.', 'Family can be blood, friends, or community—whoever feels like home.'],
      ['Notice your feelings.', 'Warmth? Gratitude? Complicated feelings are okay too.'],
      ['Choose how to show them.', 'Faces, symbols, colours, or words—anything goes.'],
      ['Create your piece.', 'Take your time and let it be honest.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'Family photos for inspiration (optional)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating this piece about your family?',
      'What did you realise about the people in your life?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 4, name: 'My Journey', week: 4,
    about: 'Your story so far—the highs, the lows, and everything that made you stronger.',
    options: [
      'Physical Artwork: Draw a road, river, or path on paper that shows your life’s journey so far.',
      'Draw on Device: Trace and paint your life journey path directly on your screen.',
      'Write It Out: Write about a moment that changed you and how far you’ve come.',
      'Speak Up: Record your journey as a spoken story, rap, or song.',
      'Use Nature: Lay out a path with stones or leaves—each one a chapter of your life.',
      'Get Digital: Build a timeline collage with photos or images that tell your story.',
    ],
    startHere: [
      ['Look back gently.', 'Recall key moments—good and hard—that shaped you.'],
      ['Spot your strength.', 'Notice what helped you keep going.'],
      ['Map it out.', 'Show your journey as a path, timeline, or story.'],
      ['Mark where you are now.', 'And maybe where you’re heading next.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'Old photos or keepsakes for inspiration (optional)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while mapping your journey?',
      'What strength did you discover in your story?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 5, name: 'My Homestead', week: 5,
    about: 'Home, community, and belonging—celebrate the places and people that ground you.',
    options: [
      'Physical Artwork: Draw or paint your home, village, or neighbourhood on paper.',
      'Draw on Device: Paint your homestead, favorite room, or community scene on your phone screen.',
      'Write It Out: Describe the sounds, smells, and moments that make your home yours.',
      'Speak Up: Record the sounds of home or narrate a walk through your community.',
      'Use Nature: Collect materials from around your home to build a mini homestead.',
      'Get Digital: Photograph the corners of home that mean the most to you.',
    ],
    startHere: [
      ['Walk around (in person or in your mind).', 'Notice what makes your home yours.'],
      ['Pick the heart of it.', 'A kitchen, a tree, a stoep, a person?'],
      ['Capture the feeling.', 'Warmth, safety, pride, or hope.'],
      ['Create your homestead.', 'Show what belonging looks like for you.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'Natural or found materials from around home (optional)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating your homestead?',
      'What does home and belonging mean to you?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 6, name: 'Vision Board', week: 6,
    about: 'Dream forward! Build a picture of the future you’re growing towards.',
    options: [
      'Physical Artwork: Draw or paint symbols of your dreams and goals on paper.',
      'Draw on Device: Paint your future vision board directly on your screen with glowing colours and stamps.',
      'Write It Out: Write your future story—where you’ll be in 5 years.',
      'Speak Up: Record a message to your future self about your dreams.',
      'Use Nature: Arrange natural objects to represent your hopes and goals.',
      'Get Digital: Create a digital collage of images that represent your future.',
    ],
    startHere: [
      ['Dream big.', 'What do you want your life to look and feel like?'],
      ['Pick your themes.', 'Health, learning, family, work, joy—anything that matters.'],
      ['Find your images.', 'Draw, cut out, or collect pictures and words.'],
      ['Build your board.', 'Arrange everything into one inspiring picture.'],
    ],
    materials: [
      'A blank page, cardboard, or poster, or your phone screen',
      'Magazines, newspapers, printed pictures, scissors and glue',
      'Pencils, pens, crayons or the digital drawing studio',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while building your vision board?',
      'Which dream on your board excites you the most, and why?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 7, name: 'Letter to Myself', week: 7,
    about: 'Speak to yourself with the kindness you’d give a best friend.',
    options: [
      'Physical Artwork: Illustrate a letter or card addressed to yourself on paper.',
      'Draw on Device: Draw a decorative letter, card, or seal directly on screen.',
      'Write It Out: Write a compassionate letter to your past, present, or future self.',
      'Speak Up: Record a voice message of encouragement to yourself.',
      'Use Nature: Create a small gift from nature for yourself, with a message.',
      'Get Digital: Type or design a digital letter or message to yourself.',
    ],
    startHere: [
      ['Choose your self.', 'Past you, present you, or future you?'],
      ['Speak kindly.', 'Imagine you’re encouraging a dear friend.'],
      ['Say what matters.', 'Forgiveness, pride, hope, advice—whatever needs saying.'],
      ['Sign it with love.', 'End your letter in a way that feels warm.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper) or your phone screen',
      'Pencils, pens, crayons, kokis, or the digital drawing studio',
      'An envelope to keep it safe (optional)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating your letter?',
      'What words did you most need to hear?',
      'Anything else you want to say?',
    ],
  },
  {
    id: 8, name: 'My Song of Strength', week: 8,
    about: 'Celebrate how far you’ve come—turn your resilience into rhythm, colour, or words.',
    options: [
      'Physical Artwork: Paint or draw what your strength looks like on paper.',
      'Draw on Device: Paint your symbol of strength and power directly on your screen.',
      'Write It Out: Write a song, chant, or praise poem about your resilience.',
      'Speak Up: Record your song, beat, or spoken word of strength.',
      'Use Nature: Make an instrument or rhythm using natural materials and capture it.',
      'Get Digital: Mix a playlist or record a video that celebrates your journey.',
    ],
    startHere: [
      ['Look how far you’ve come.', 'Think back over the past 8 weeks.'],
      ['Find your rhythm.', 'A beat, a colour, a word that feels strong.'],
      ['Make it loud (or soft).', 'Create your celebration in your own style.'],
      ['Own your strength.', 'This one is a tribute to YOU.'],
    ],
    materials: [
      'A blank page or your phone’s digital drawing studio / recorder',
      'Pencils, pens, crayons, kokis, or anything creative',
      'Anything that makes a sound (optional!)',
    ],
    reflections: [
      'What made you choose this option, and how do you feel about your choice?',
      'How did you feel while creating your song of strength?',
      'What are you most proud of from these 8 weeks?',
      'Anything else you want to say?',
    ],
  },
];

MM.ACT_COLORS = [
  ['#f4a63c', '#e8891d'], ['#f75b88', '#ee2b63'], ['#7f84d9', '#5a5fbf'],
  ['#b45cc9', '#8e3ba8'], ['#f0813c', '#e05a2b'], ['#43b0a8', '#2a8f88'],
  ['#ef5da8', '#d81b76'], ['#8d6fe0', '#6a48c4'],
];

/* ── Support services ────────────────────────────────────── */
MM.SUPPORT = {
  intro: 'Find mental health and technical support anytime. You are not alone—free, confidential help is one tap away.',
  /* Two study support pathways — requests are logged as tickets for the
     study service desk (Freshservice) and handled by the right team. */
  pathways: [
    {
      kind: 'social',
      name: 'Social Worker',
      desc: 'Emotional support, wellbeing check-ins, or anything weighing on you. A study social worker will reach out.',
      icon: 'chat-heart', color: ['#ee2b63', '#8a2eae'],
      cta: 'Request support',
    },
    {
      kind: 'it',
      name: 'IT Technical Support',
      desc: 'App problems, sign-in trouble, uploads, or data vouchers. Our technical team will sort it out.',
      icon: 'wrench', color: ['#3f6ad8', '#5a5fbf'],
      cta: 'Report a problem',
    },
  ],
  ticketNote: 'Your request is saved on your phone and logged with the study service desk (Freshservice) as soon as you are online.',
  services: [
    {
      name: 'Lifeline',
      desc: '24-hour crisis support and counselling for anxiety, depression and trauma.',
      icon: 'phone', color: ['#ee2b63', '#c2185b'],
      actions: [
        { label: '0861 1113', href: 'tel:08611113', kind: 'call' },
        { label: 'WhatsApp 063 709 2620', href: 'https://wa.me/27637092620', kind: 'wa' },
      ],
    },
    {
      name: 'Counselling Hub',
      desc: 'Affordable, quality counselling with caring professionals.',
      icon: 'chat-heart', color: ['#a855c8', '#7c3aa0'],
      actions: [
        { label: '021 462 3902', href: 'tel:0214623902', kind: 'call' },
        { label: '067 235 0019', href: 'tel:0672350019', kind: 'call' },
      ],
    },
    {
      name: 'SADAG Mental Health Line',
      desc: 'South African Depression and Anxiety Group—free telephonic counselling, referrals and resources.',
      icon: 'sun', color: ['#f0813c', '#e05a2b'],
      actions: [
        { label: '0800 456 789', href: 'tel:0800456789', kind: 'call' },
        { label: 'SMS 31393', href: 'sms:31393', kind: 'sms' },
      ],
    },
    {
      name: 'Suicide Crisis Helpline',
      desc: 'If you or someone you know is in crisis, call now. Free, 24 hours a day.',
      icon: 'shield-heart', color: ['#5a5fbf', '#3f4494'],
      actions: [
        { label: '0800 567 567', href: 'tel:0800567567', kind: 'call' },
      ],
    },
    {
      name: 'Your Facilitator',
      desc: 'Questions about the study, the app, or the activities? Chat with your facilitator any time.',
      icon: 'chat', color: ['#ee2b63', '#8a2eae'],
      actions: [
        { label: 'Open Chat', route: '#/chat', kind: 'chat' },
      ],
    },
  ],
};

/* ── Help Now ────────────────────────────────────────────── */
MM.HELP_NOW = {
  intro: 'If you experience extreme anxiety, a panic attack, or feel triggered during the intervention, follow these steps:',
  steps: [
    ['Pause & Breathe', 'If you feel overwhelmed, pause. Take a deep breath in for 4 seconds, hold for 6, and exhale for 7. You are not alone.'],
    ['Ground Yourself', 'Sip cold water, dig your bare feet into the sand or ground, or touch a brick or wooden wall to ground yourself.'],
    ['Reach Out', 'Contact a trusted person or call a support service:'],
  ],
  lines: [
    { label: 'Lifeline', value: '0861 1113 / 063 709 2620 (WhatsApp)', href: 'tel:08611113' },
    { label: 'Counselling Hub', value: '021 462 3902 / 067 235 0019', href: 'tel:0214623902' },
  ],
};

/* ── Mood check-in ───────────────────────────────────────── */
MM.MOODS = [
  { key: 'good', label: 'Feeling good', color: '#34c759' },
  { key: 'meh',  label: 'Meh / Okay',   color: '#ffb020' },
  { key: 'bad',  label: 'Not great',    color: '#e8506e' },
];

/* ── Facilitator auto-replies (legacy pool, kept as fallback) ── */
MM.FACILITATOR_REPLIES = [
  'Thank you for sharing! How did this activity make you feel?',
  'That’s wonderful—keep expressing yourself, there’s no wrong way. 🎨',
  'I hear you. Remember the Help button is always there if things feel heavy.',
  'Great progress this week! Remember to complete your reflection when you’re ready.',
  'Lovely! Would you like to tell the group more about what inspired you?',
];

/* ── Facilitator AI — intent brain ───────────────────────── */
MM.AI = {
  crisisRx: /suicid|kill (myself|me)|end (it|my life)|self.?harm|hurt myself|don.?t want to (live|be here)|no reason to live|overdose/i,
  crisisReply: 'Thank you for trusting me with this — what you’re feeling matters, and you deserve support right now. Please tap the Help button at the top for immediate steps, or call the Suicide Crisis Helpline on 0800 567 567 (free, 24 hours). I’ve also let a human facilitator know you may need extra care. If you can, reach out to someone you trust and let them know how you feel. I’m here with you. 💜',
  handoverRx: /human|real person|agent|facilitator|social worker|speak to someone|talk to someone|not a bot|stop the bot/i,
  handoverReply: 'Of course — I’ve asked a human facilitator to join this conversation. They’ll reply here as soon as they’re available (usually within a working day). While you wait, I’m still here, and Support Services has people you can call right now. 💜',
  handoverAck: 'Hi! This is your facilitator — thank you for reaching out. I’ve read the conversation above. How can I help you today?',
  intents: [
    {
      name: 'greeting', rx: /^(hi|hello|hey|hola|sawubona|molo|dumela|good (morning|afternoon|evening)|howzit)\b/i,
      replies: [
        'Hello! Lovely to see you here. 🌸 How is your {act} journey going so far?',
        'Hey there! Welcome to the {act} space. What’s on your mind today?',
        'Sawubona! 👋 I’m here whenever you want to share or ask anything about {act}.',
      ],
    },
    {
      name: 'sad', rx: /sad|down|depress|cry|lonely|heavy|tired of|hopeless|empty|numb|anxious|anxiety|stress|worried|scared|afraid|overwhelm/i,
      replies: [
        'I hear you, and I’m really glad you said it out loud here. Those feelings are valid. Would a short breathing moment help? The Help button has a guided one — and I’m right here. 💜',
        'That sounds heavy, and carrying it takes strength. Be gentle with yourself today. Sometimes putting the feeling into your {act} creation helps it soften. Want to try?',
        'Thank you for trusting me with that. You’re not alone — support is one tap away under Support Services, and this space is always open for you. 🌱',
      ],
    },
    {
      name: 'happy', rx: /happy|great|good|excited|proud|amazing|awesome|wonderful|love(d)? (it|this)|enjoyed|fun/i,
      replies: [
        'That’s beautiful to hear! 🌟 Hold onto that feeling — maybe even capture it in your visual diary.',
        'Yes!! Moments like these are worth celebrating. What do you think sparked it?',
        'I love that energy! Let it flow into your {act} creation — joy makes wonderful art. 🎨',
      ],
    },
    {
      name: 'done', rx: /finish(ed)?|done|complete(d)?|submitted|uploaded/i,
      replies: [
        'Congratulations on completing it! 🎉 Take a moment to sit with your creation — what does it tell you about yourself?',
        'Wonderful work! Don’t forget the Reflections tab — your thoughts are the most powerful part of {act}.',
        'That’s real commitment. Every activity you finish grows your resilience a little more. 🌱',
      ],
    },
    {
      name: 'stuck', rx: /stuck|hard|difficult|can.?t|don.?t know|confus|struggle|help me|how do i|what (should|must) i/i,
      replies: [
        'Totally okay to feel stuck — creativity has no deadline. Try the Start Here tab of {act} for a gentle first step, or just make one small mark and see where it leads.',
        'There’s no wrong way to do {act}. Pick the option that feels lightest — art, words, voice, nature or digital — and start tiny. I believe in you!',
        'Good question! Check the Materials tab for what you need, and remember: mixing options is allowed. Want to tell me which part feels tricky?',
      ],
    },
    {
      name: 'hope', rx: /\b(hope|hopeful|ithemba|temba|tsholofelo|tsepiso|hoop|better days|faith|future|dream|inspire me|need hope)\b/i,
      replies: [
        'Hope is the quiet whisper that tomorrow holds new light. 🌟 What is one small thing giving you strength today in {act}?',
        'Ithemba kalibulali — hope never dies. Even on the heaviest days, the creative seed inside you is waiting to bloom. 🌱',
        'You have overcome so much already. Bringing your honest feelings into {act} is an act of real courage and hope. ✨',
      ],
    },
    {
      name: 'thanks', rx: /thank(s| you)|dankie|ngiyabonga|enkosi|ke a leboga/i,
      replies: [
        'Always a pleasure! I’m here any time you need me. 💜',
        'You’re so welcome — thank YOU for showing up for yourself today. 🌸',
      ],
    },
    {
      name: 'meds', rx: /medicat|pills|treatment|art therapy|clinic|doctor|appointment/i,
      replies: [
        'Looking after your health is a big act of self-care. If you have questions about medication or appointments, your clinic team is the best guide — and Support Services has caring people to talk to as well. 💜',
      ],
    },
    {
      name: 'tech', rx: /bug|broken|not work|can.?t upload|error|crash|slow|internet|data|offline/i,
      replies: [
        'Sorry about that! MojaMind works offline too — your work is saved on your phone and will be here when you return. If it still looks wrong, open Support Services and tap “IT Technical Support” to log it with our team — or describe it here and we’ll sort it out together. 🔧',
      ],
    },
  ],
  knowledge: [
    {
      id: 'materials',
      terms: ['material', 'materials', 'supplies', 'tools', 'pencil', 'paper'],
      reply: 'For {act}, keep it simple: {materials}. Use what you already have — the meaning matters more than perfect supplies. 🎨',
    },
    {
      id: 'starting',
      terms: ['where to start', 'how to start', 'begin', 'first step', 'instructions'],
      reply: 'Here is a gentle start for {act}: {steps} You only need to begin — it does not need to be perfect.',
    },
    {
      id: 'creative options',
      terms: ['option', 'options', 'draw', 'write', 'voice', 'nature', 'digital'],
      minScore: 2,
      reply: 'You can approach {act} in five ways: {options}. Pick the one that feels easiest today, and mixing them is welcome.',
    },
    {
      id: 'pictures and uploads',
      terms: ['upload', 'picture', 'photo', 'camera', 'image', 'visual diary'],
      reply: 'Open {act}, choose the Pictures tab, then tap Upload. Your image is compressed on your device before it is saved, so it stays lighter on mobile data. 📸',
    },
    {
      id: 'voice notes',
      terms: ['voice note', 'voice notes', 'record', 'recording', 'audio', 'microphone', 'transcribe', 'transcription'],
      reply: 'You can add your voice to {act}! Open the Voice tab, tap the microphone, and speak freely — MojaMind records on your device and writes down what it hears, so your spoken words can become reflections too. 🎤',
    },
    {
      id: 'inspiration videos',
      terms: ['video', 'videos', 'watch', 'example', 'demo'],
      reply: 'Activities 5–8 include short inspiration videos for every creative option — look for the Play button on the Start Here tab of {act}. They stream only when you tap them, so they never use data in the background. 🎬',
    },
    {
      id: 'artwork colours',
      terms: ['colour', 'colours', 'color', 'colors', 'palette', 'what do you see', 'my artwork', 'my picture'],
      reply: '{artwork}',
    },
    {
      id: 'reflections',
      terms: ['reflect', 'reflection', 'journal', 'what to write', 'diary'],
      reply: 'For {act}, you can begin with either of these prompts: {reflections}. Honest and short is enough — there is no right answer. 💭',
    },
    {
      id: 'progress and unlocks',
      terms: ['progress', 'week', 'unlock', 'locked', 'when does', 'how far'],
      reply: 'You are in week {week}, with {done} of 8 art activities completed. Activities open week by week; completing the Pre-Survey unlocks your journey pathway.',
    },
    {
      id: 'surveys',
      terms: ['pre-survey', 'post-survey', 'pre survey', 'post survey', 'questionnaire', 'survey'],
      reply: 'There are three pre-surveys (Mental Health, Lifestyle Management, Personal Wellbeing) and four post-surveys (the same three plus App Usability). Each can be completed once — the Post-Survey opens after the Pre-Survey is done. Draft answers save on your device as you go.',
    },
    {
      id: 'privacy',
      terms: ['privacy', 'private', 'data', 'confidential', 'anonymous', 'who can see'],
      minScore: 2,
      reply: 'MojaMind keeps this demo’s progress on your device. Study responses are intended to remain anonymous and within the research team, as explained in the consent screen.',
    },
    {
      id: 'offline use',
      terms: ['offline', 'internet', 'connection', 'mobile data', 'network', 'load shedding', 'datafree', 'data free'],
      reply: 'MojaMind is an offline-first, DataFree-friendly app. Once loaded, it opens without a connection, and your in-progress answers stay on this device until you return. Data vouchers are provided for downloads and online meetings.',
    },
    {
      id: 'support pathways',
      terms: ['support service', 'support services', 'counsellor', 'helpline', 'hotline', 'lifeline', 'sadag', 'social worker', 'it support', 'technical support', 'ticket'],
      reply: 'Open Support Services to request help from a Social Worker or IT Technical Support — your request is logged as a ticket and the right person follows up. Lifeline, SADAG and the Suicide Crisis Helpline are there too. If this is urgent or you feel unsafe, tap Help at the top now. 💜',
    },
    {
      id: 'breathing and grounding',
      terms: ['breathe', 'breathing', 'grounding', 'ground myself', 'panic', 'calm down'],
      reply: 'Tap Help and use the 4–6–7 breathing guide: breathe in for 4, hold for 6, and breathe out for 7 — the circle counts every second down with you. You can also sip cold water or feel your feet against the ground.',
    },
    {
      id: 'incentive',
      terms: ['incentive', 'voucher', 'vouchers', 'data voucher', 'payment', 'reward'],
      reply: 'At the start of the intervention you receive data vouchers (to download the app and attend online meetings), and an incentive for your time at the end of the intervention. For timing or eligibility questions, ask your facilitator here in Chat.',
    },
    {
      id: 'mood garden',
      terms: ['mood garden', 'flower', 'flowers', 'daily check-in', 'mood check'],
      reply: 'Your mood garden begins with one welcome flower. Each daily check-in grows another flower in the colour of that day’s feeling — a gentle picture of your journey. 🌸',
    },
    {
      id: 'daily spark',
      terms: ['daily spark', 'inspiration', 'quote', 'constellation'],
      reply: 'Daily Spark gives you one message each day. Hold the glowing orb while you breathe in; your saved sparks become a small constellation over time. ✨',
    },
    {
      id: 'hope',
      terms: ['hope', 'message of hope', 'beacon of hope', 'ithemba', 'tsholofelo', 'hoop', 'give me hope', 'spark of hope'],
      reply: 'The Beacon of Hope is always open: Ithemba alibulali (hope keeps the spirit alive). Every small creation, breath, and step you take today is a seed of hope blooming in your life. 🌟',
    },
    {
      id: 'accessibility',
      terms: ['accessibility', 'bigger text', 'text size', 'contrast', 'disability', 'impairment', 'screen reader'],
      reply: 'MojaMind is designed to support people with disabilities and impairments. Tap the accessibility button in the header to make text bigger, increase contrast, or reduce motion — your choices are remembered on this device. ♿',
    },
  ],
  fallback: [
    'Thank you for sharing! How did this make you feel?',
    'I hear you. Tell me more — I’m listening. 🌸',
    'That’s a lovely thought to bring into {act}. What inspired it?',
    'Beautiful — keep expressing yourself, there’s no wrong way here. 🎨',
    'Noted with care. 💜 Remember your reflections tab is a great place for thoughts like this too.',
  ],
};

/* ── Facilitator (admin) access ──────────────────────────── */
MM.ADMIN = {
  code: 'MOJA2026',
  hint: 'Facilitators: enter your access code to answer group and individual chats.',
};

/* ── Beacon of Hope — inspiration, proverbs & grounding ──── */
MM.HOPE = {
  title: 'Beacon of Hope',
  subtitle: 'Ithemba · Tsholofelo · Hoop · Hope',
  lead: 'Hope is not the absence of darkness — it is the conviction that the light inside you is stronger than whatever you face today.',
  affirmations: [
    { title: 'Seeds of Light', text: 'You carry within you an unbroken resilience. Every sunrise is an invitation to begin again with kindness.', sa: 'Ithemba alibulali — Hope keeps the spirit alive.' },
    { title: 'Your Pace Matters', text: 'There is no rush to heal or create. Growth happens quietly in the soil before the blossom opens into beauty.', sa: 'Tsholofelo ke bophelo — Hope is life.' },
    { title: 'Courage in Quiet Steps', text: 'Taking one breath, making one mark, speaking one truth — these small, brave acts change your world.', sa: 'Motho ke motho ka batho — We rise together.' },
    { title: 'The Light Within', text: 'You are worthy of care, kindness, and joy. Never let a difficult season convince you that you are alone.', sa: 'Hoop beskaam nie — Hope never puts you to shame.' },
    { title: 'A New Dawn Awaits', text: 'However long the shadow, the dawn always breaks. Keep your face toward the morning sun.', sa: 'Kusasa kusa ngomuso — Tomorrow is a new beginning.' },
  ],
  crisisHope: 'You have survived 100% of your hardest days. You do not have to walk this alone. Reach out, breathe, and let support hold you up right now.',
};

/* ── Daily Spark — inspiration library ───────────────────── */
MM.SPARKS = [
  { text: 'However long the night, the dawn will break.', by: 'African proverb' },
  { text: 'Smooth seas do not make skilful sailors.', by: 'African proverb' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', by: 'African proverb' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', by: 'African proverb' },
  { text: 'Rain does not fall on one roof alone.', by: 'African proverb' },
  { text: 'Wisdom is like a baobab tree; no one individual can embrace it.', by: 'African proverb' },
  { text: 'A bird will always use another bird’s feathers to feather its own nest.', by: 'Sotho proverb' },
  { text: 'Umuntu ngumuntu ngabantu — I am because we are.', by: 'Ubuntu philosophy' },
  { text: 'Little by little, a little becomes a lot.', by: 'Tanzanian proverb' },
  { text: 'When the roots are deep, there is no reason to fear the wind.', by: 'African proverb' },
  { text: 'The lion does not turn around when a small dog barks.', by: 'African proverb' },
  { text: 'Hope is being able to see that there is light despite all of the darkness.', by: 'Desmond Tutu' },
  { text: 'Ithemba alibulali — hope never dies, it only blooms anew.', by: 'isiZulu proverb' },
  { text: 'Tsholofelo ke lesedi — hope is the lantern in the storm.', by: 'Sesotho proverb' },
  { text: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.', by: 'Maya Angelou' },
  { text: 'Do not judge me by my successes, judge me by how many times I fell down and got back up again.', by: 'Nelson Mandela' },
  { text: 'It always seems impossible until it’s done.', by: 'Nelson Mandela' },
  { text: 'Courage is not the absence of fear, but the triumph over it.', by: 'Nelson Mandela' },
  { text: 'There is no greater agony than bearing an untold story inside you.', by: 'Maya Angelou' },
  { text: 'You alone are enough. You have nothing to prove to anybody.', by: 'Maya Angelou' },
  { text: 'Still, I rise.', by: 'Maya Angelou' },
  { text: 'Turn your wounds into wisdom.', by: 'Oprah Winfrey' },
  { text: 'The wound is the place where the light enters you.', by: 'Rumi' },
  { text: 'What you seek is seeking you.', by: 'Rumi' },
  { text: 'No feeling is final.', by: 'Rainer Maria Rilke' },
  { text: 'You are not a drop in the ocean. You are the entire ocean in a drop.', by: 'Rumi' },
  { text: 'Art washes away from the soul the dust of everyday life.', by: 'Pablo Picasso' },
  { text: 'Every artist was first an amateur.', by: 'Ralph Waldo Emerson' },
  { text: 'Creativity takes courage.', by: 'Henri Matisse' },
  { text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', by: 'Ralph Waldo Emerson' },
  { text: 'Almost everything will work again if you unplug it for a few minutes — including you.', by: 'Anne Lamott' },
  { text: 'You don’t have to see the whole staircase, just take the first step.', by: 'Martin Luther King Jr.' },
  { text: 'Fall seven times, stand up eight.', by: 'Japanese proverb' },
  { text: 'The flower that blooms in adversity is the rarest and most beautiful of all.', by: 'Mulan' },
  { text: 'Your present circumstances don’t determine where you can go; they merely determine where you start.', by: 'Nido Qubein' },
  { text: 'Healing is not linear — and that is perfectly okay.', by: 'MojaMind' },
  { text: 'You have survived 100% of your hardest days so far.', by: 'MojaMind' },
  { text: 'Small steps every day. That is how gardens grow.', by: 'MojaMind' },
  { text: 'Breathe. You are exactly where you need to be.', by: 'MojaMind' },
  { text: 'Your story is a work of art in progress — keep painting.', by: 'MojaMind' },
  { text: 'Rest is productive. Kindness to yourself is strength.', by: 'MojaMind' },
  { text: 'Feel it. Create it. Release it.', by: 'MojaMind' },
  { text: 'The bravest thing you can do is show up as yourself.', by: 'MojaMind' },
];

MM.SPARK_PERSONAL = {
  streak: n => `🔥 ${n} day${n > 1 ? 's' : ''} of showing up for yourself — that is real resilience.`,
  acts: n => `🎨 ${n} creative activit${n > 1 ? 'ies' : 'y'} completed. Your voice is getting stronger.`,
  moodsGood: 'Your garden shows more sunshine lately — keep tending it. 🌻',
  moodsTough: 'Some days felt heavy lately. Be gentle with yourself — you’re still growing. 🌱',
  week: w => `Week ${w} of your journey — every week you create, you grow.`,
  firstSpark: 'This is your very first spark. May it light the whole journey. ✨',
};
