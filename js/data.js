/* ============================================================
   MojoMind — content & instruments
   Verbatim survey content transcribed from the MojoMind
   screen recordings (12 Jun 2026) and demo deck.
   © IONITY Global (Pty) Ltd — MojoMind Creative Resilience.
   ============================================================ */
'use strict';

const MM = {};

MM.APP_NAME = 'MojoMind';
MM.CREATOR = 'IONITY Global (Pty) Ltd';

/* ── Response scales ─────────────────────────────────────── */
MM.SCALES = {
  freq4:   ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  mars:    ['Always', 'Often', 'Sometimes', 'Rarely', 'Never', 'Not Applicable'],
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
    { id: 'grade',     text: 'What is the highest grade you passed?', options: ['No formal education', 'Grade R', 'Grade 1 – 11', 'Grade 12 / Matric', 'Some college/university', 'Completed college/university'] },
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

/* ── Survey instruments ──────────────────────────────────── */
MM.SURVEYS = {
  mental: {
    id: 'mental',
    name: 'Mental Health Survey',
    theme: 'mental',
    optClass: 'opt-mental',
    num: 1,
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
    name: 'Lifestyle Management',
    theme: 'life',
    optClass: 'opt-life',
    num: 2,
    sections: [
      {
        title: 'Question 1',
        scaleName: 'MARS-5 Adherence Questionnaire',
        intro: 'Many people find a way of using their medicines which suits them. This may differ from the instructions on the label. How often do the following apply to you?',
        scale: 'mars',
        items: [
          'I forget to take my medication',
          'I change the dose of my medication',
          'I stop taking my medication for a while',
          'I sometimes decide to skip a dose',
          'I take less than instructed',
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
    name: 'Personal Wellbeing',
    theme: 'well',
    optClass: 'opt-well',
    num: 3,
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
    sections: [
      {
        title: 'Question 1',
        scaleName: 'App Usability',
        intro: 'We would love to hear about your experience! Your feedback helps us improve the app\u2019s usability and effectiveness. Let\u2019s get started! Please rate each statement on a scale from 1 (Strongly Agree) to 7 (Strongly Disagree).',
        scale: 'agree7',
        items: [
          'The creative resilience application was easy to use',
          'It was simple to navigate',
          'The application helped me manage my mental health',
          'I would use this application again',
          'The application worked well even with a poor internet connection',
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
    body: 'Complete these short surveys on depression, anxiety, stress, resilience, and adherence. Your responses help us support you better\u2014let\u2019s get started!',
  },
  post: {
    title: 'Take a quick mental health check-in!',
    body: 'Welcome back! It\u2019s time for your final check-in. Please take a few minutes to complete the post-survey to help us understand your experience. Your feedback is important\u2014thank you for being part of this study!',
  },
};

/* ── Home / welcome copy ─────────────────────────────────── */
MM.WELCOME = {
  fresh: {
    title: 'Welcome to the Creative Resilience Intervention!',
    body: 'You\u2019re ready to begin your 8-week journey. Explore the intervention instructions, helpful videos, and dive into the art activities at your own pace. If you need support or want to chat, we\u2019re here for you anytime.',
    tail: 'Let\u2019s get started!',
  },
  preDone: {
    title: 'Welcome to the MojoMind Intervention!',
    body: 'Over the next 8 weeks, you will complete weekly activities and join virtual facilitated sessions to support your journey. Please check out the MojoMind instructions and available support services, and remember to complete your post-survey after 8 weeks.',
    tail: 'We\u2019re excited to have you on this journey!',
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
    ['Tap \u2018I Agree\u2019 to continue your journey with MojoMind.', ''],
  ],
};

MM.ONBOARD = {
  title: 'Welcome to MojoMind',
  body: 'Feeling overwhelmed by stress, anxiety, or depression? You\u2019re not alone. It is important to reflect on your personal growth and check in with yourself.',
  ready: 'Ready to start?',
};

/* ── Instructions screen ─────────────────────────────────── */
MM.INSTRUCTIONS = {
  heroTitle: 'Welcome to the Creative Resilience!',
  heroBody: 'Welcome to your 8-week creative journey! Explore art, words, or sound to express yourself. No right or wrong\u2014just a space for self-reflection and growth.',
  sections: [
    {
      icon: 'clipboard',
      title: 'Your Participation',
      items: [
        ['A Pre-Survey', 'Complete one week prior to the start of the intervention.'],
        ['Intervention Duration', '8 weeks of app-based activities.'],
        ['Time Commitment', 'Weekly activities + 60-minutes per week.'],
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
        ['Create Freely', 'Let your creativity flow\u2014there\u2019s no right or wrong way.'],
        ['Reflect & Observe', 'Once done, sit with your artwork, recall your feelings, and answer reflection questions in your visual diary and the reflection tab.'],
        ['Express Without Judgment', 'Your reflections are personal\u2014no need to filter or edit.'],
      ],
    },
  ],
  incentive: 'You will receive a R400 incentive after completing both surveys. For questions or support, reach out to your facilitator through the chat button.',
};

/* ── About Art Activities ────────────────────────────────── */
MM.ART_ABOUT = {
  heroBody: 'This is your creative space to express yourself, reflect, and grow through art, writing, and movement. No rules, no judgment\u2014just you and your creativity!',
  lead: 'Each activity follows the same 5-step process:',
  steps: [
    ['\uD83D\uDCD6', 'Read About the Activity', 'Every activity starts with a short intro about why it matters.'],
    ['\uD83E\uDDD8', 'Take a Deep Breath', 'Relax with a simple breathing exercise before creating.'],
    ['\uD83C\uDFA8', 'Choose Your Way to Create', 'You can draw, write, make a collage, or record your voice\u2014whichever feels right for you!'],
    ['\uD83D\uDCE4', 'Submit Your Work', 'Click Submit when you\u2019re done.'],
    ['\uD83D\uDCAC', 'Reflect on Your Creation', 'Tap \u201CReflect\u201D to answer thought-provoking questions about what you made.'],
  ],
};

/* ── Art activities (8 weeks) ────────────────────────────── */
MM.ART_OPTION_KINDS = [
  { key: 'art',     emoji: '\uD83C\uDFA8', name: 'Express with ART' },
  { key: 'write',   emoji: '\u270D\uFE0F', name: 'Write It Out' },
  { key: 'speak',   emoji: '\uD83C\uDFA4', name: 'Speak Up' },
  { key: 'nature',  emoji: '\uD83C\uDF3F', name: 'Use Nature' },
  { key: 'digital', emoji: '\uD83D\uDCF1', name: 'Get Digital' },
];

MM.ACTIVITIES = [
  {
    id: 1, name: 'Self-Portrait', week: 1,
    about: 'Who are you right now? This week is about seeing yourself with kindness and curiosity.',
    options: [
      'Express with ART: Draw or paint yourself using colours that match your vibe.',
      'Write It Out: Write a poem, letter, or powerful words about who you are or who you\u2019re becoming.',
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
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to draw with',
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
      'Express with ART: Draw or paint the place (real or imagined) where you feel safest.',
      'Write It Out: Describe your safe space in words\u2014what you see, hear, and feel there.',
      'Speak Up: Record yourself describing your safe space as if guiding a friend into it.',
      'Use Nature: Build or arrange a small safe-space scene using natural materials.',
      'Get Digital: Photograph or design a collage of the place where you feel most at peace.',
    ],
    startHere: [
      ['Get comfortable.', 'Find a quiet moment where you won\u2019t be disturbed.'],
      ['Close your eyes.', 'Picture a place where you feel completely safe and calm.'],
      ['Notice the details.', 'What colours, sounds, and textures live there?'],
      ['Bring it to life.', 'Recreate your safe space in the medium you chose.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to draw with',
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
      'Express with ART: Draw or paint the people (or pets!) you consider family.',
      'Write It Out: Write a letter, poem, or memory about someone who feels like home.',
      'Speak Up: Record a story or message about the people who matter most to you.',
      'Use Nature: Use stones, leaves, or flowers to represent each person in your family.',
      'Get Digital: Create a photo collage of your chosen family.',
    ],
    startHere: [
      ['Think about your people.', 'Family can be blood, friends, or community\u2014whoever feels like home.'],
      ['Notice your feelings.', 'Warmth? Gratitude? Complicated feelings are okay too.'],
      ['Choose how to show them.', 'Faces, symbols, colours, or words\u2014anything goes.'],
      ['Create your piece.', 'Take your time and let it be honest.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to draw with',
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
    about: 'Your story so far\u2014the highs, the lows, and everything that made you stronger.',
    options: [
      'Express with ART: Draw a road, river, or path that shows your life\u2019s journey so far.',
      'Write It Out: Write about a moment that changed you and how far you\u2019ve come.',
      'Speak Up: Record your journey as a spoken story, rap, or song.',
      'Use Nature: Lay out a path with stones or leaves\u2014each one a chapter of your life.',
      'Get Digital: Build a timeline collage with photos or images that tell your story.',
    ],
    startHere: [
      ['Look back gently.', 'Recall key moments\u2014good and hard\u2014that shaped you.'],
      ['Spot your strength.', 'Notice what helped you keep going.'],
      ['Map it out.', 'Show your journey as a path, timeline, or story.'],
      ['Mark where you are now.', 'And maybe where you\u2019re heading next.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to draw with',
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
    about: 'Home, community, and belonging\u2014celebrate the places and people that ground you.',
    options: [
      'Express with ART: Draw or paint your home, village, or neighbourhood.',
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
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to draw with',
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
    about: 'Dream forward! Build a picture of the future you\u2019re growing towards.',
    options: [
      'Express with ART: Draw or paint symbols of your dreams and goals.',
      'Write It Out: Write your future story\u2014where you\u2019ll be in 5 years.',
      'Speak Up: Record a message to your future self about your dreams.',
      'Use Nature: Arrange natural objects to represent your hopes and goals.',
      'Get Digital: Create a digital collage of images that represent your future.',
    ],
    startHere: [
      ['Dream big.', 'What do you want your life to look and feel like?'],
      ['Pick your themes.', 'Health, learning, family, work, joy\u2014anything that matters.'],
      ['Find your images.', 'Draw, cut out, or collect pictures and words.'],
      ['Build your board.', 'Arrange everything into one inspiring picture.'],
    ],
    materials: [
      'A blank page, cardboard, or poster',
      'Magazines, newspapers, printed pictures, scissors and glue',
      'Pencils, pens, crayons or kokis for drawing and words',
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
    about: 'Speak to yourself with the kindness you\u2019d give a best friend.',
    options: [
      'Express with ART: Illustrate a letter or card addressed to yourself.',
      'Write It Out: Write a compassionate letter to your past, present, or future self.',
      'Speak Up: Record a voice message of encouragement to yourself.',
      'Use Nature: Create a small gift from nature for yourself, with a message.',
      'Get Digital: Type or design a digital letter or message to yourself.',
    ],
    startHere: [
      ['Choose your self.', 'Past you, present you, or future you?'],
      ['Speak kindly.', 'Imagine you\u2019re encouraging a dear friend.'],
      ['Say what matters.', 'Forgiveness, pride, hope, advice\u2014whatever needs saying.'],
      ['Sign it with love.', 'End your letter in a way that feels warm.'],
    ],
    materials: [
      'A blank page (journal, sketchbook, or paper)',
      'Pencils, pens, crayons, kokis, or anything to write with',
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
    about: 'Celebrate how far you\u2019ve come\u2014turn your resilience into rhythm, colour, or words.',
    options: [
      'Express with ART: Paint or draw what your strength looks like in colour and shape.',
      'Write It Out: Write a song, chant, or praise poem about your resilience.',
      'Speak Up: Record your song, beat, or spoken word of strength.',
      'Use Nature: Make an instrument or rhythm using natural materials and capture it.',
      'Get Digital: Mix a playlist or record a video that celebrates your journey.',
    ],
    startHere: [
      ['Look how far you\u2019ve come.', 'Think back over the past 8 weeks.'],
      ['Find your rhythm.', 'A beat, a colour, a word that feels strong.'],
      ['Make it loud (or soft).', 'Create your celebration in your own style.'],
      ['Own your strength.', 'This one is a tribute to YOU.'],
    ],
    materials: [
      'A blank page or your phone\u2019s recorder',
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
  intro: 'Find mental health and technical support anytime. You are not alone\u2014free, confidential help is one tap away.',
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
      desc: 'South African Depression and Anxiety Group\u2014free telephonic counselling, referrals and resources.',
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
  'That\u2019s wonderful\u2014keep expressing yourself, there\u2019s no wrong way. \uD83C\uDFA8',
  'I hear you. Remember the Help button is always there if things feel heavy.',
  'Great progress this week! Remember to complete your reflection when you\u2019re ready.',
  'Lovely! Would you like to tell the group more about what inspired you?',
];

/* ── Facilitator AI — intent brain ───────────────────────── */
MM.AI = {
  crisisRx: /suicid|kill (myself|me)|end (it|my life)|self.?harm|hurt myself|don.?t want to (live|be here)|no reason to live|overdose/i,
  crisisReply: 'Thank you for trusting me with this \u2014 what you\u2019re feeling matters, and you deserve support right now. Please tap the Help button at the top for immediate steps, or call the Suicide Crisis Helpline on 0800 567 567 (free, 24 hours). If you can, reach out to someone you trust and let them know how you feel. I\u2019m here with you. \uD83D\uDC9C',
  intents: [
    {
      name: 'greeting', rx: /^(hi|hello|hey|hola|sawubona|molo|dumela|good (morning|afternoon|evening)|howzit)\b/i,
      replies: [
        'Hello! Lovely to see you here. \uD83C\uDF38 How is your {act} journey going so far?',
        'Hey there! Welcome to the {act} space. What\u2019s on your mind today?',
        'Sawubona! \uD83D\uDC4B I\u2019m here whenever you want to share or ask anything about {act}.',
      ],
    },
    {
      name: 'sad', rx: /sad|down|depress|cry|lonely|heavy|tired of|hopeless|empty|numb|anxious|anxiety|stress|worried|scared|afraid|overwhelm/i,
      replies: [
        'I hear you, and I\u2019m really glad you said it out loud here. Those feelings are valid. Would a short breathing moment help? The Help button has a guided one \u2014 and I\u2019m right here. \uD83D\uDC9C',
        'That sounds heavy, and carrying it takes strength. Be gentle with yourself today. Sometimes putting the feeling into your {act} creation helps it soften. Want to try?',
        'Thank you for trusting me with that. You\u2019re not alone \u2014 support is one tap away under Support Services, and this space is always open for you. \uD83C\uDF31',
      ],
    },
    {
      name: 'happy', rx: /happy|great|good|excited|proud|amazing|awesome|wonderful|love(d)? (it|this)|enjoyed|fun/i,
      replies: [
        'That\u2019s beautiful to hear! \uD83C\uDF1F Hold onto that feeling \u2014 maybe even capture it in your visual diary.',
        'Yes!! Moments like these are worth celebrating. What do you think sparked it?',
        'I love that energy! Let it flow into your {act} creation \u2014 joy makes wonderful art. \uD83C\uDFA8',
      ],
    },
    {
      name: 'done', rx: /finish(ed)?|done|complete(d)?|submitted|uploaded/i,
      replies: [
        'Congratulations on completing it! \uD83C\uDF89 Take a moment to sit with your creation \u2014 what does it tell you about yourself?',
        'Wonderful work! Don\u2019t forget the Reflections tab \u2014 your thoughts are the most powerful part of {act}.',
        'That\u2019s real commitment. Every activity you finish grows your resilience a little more. \uD83C\uDF31',
      ],
    },
    {
      name: 'stuck', rx: /stuck|hard|difficult|can.?t|don.?t know|confus|struggle|help me|how do i|what (should|must) i/i,
      replies: [
        'Totally okay to feel stuck \u2014 creativity has no deadline. Try the Start Here tab of {act} for a gentle first step, or just make one small mark and see where it leads.',
        'There\u2019s no wrong way to do {act}. Pick the option that feels lightest \u2014 art, words, voice, nature or digital \u2014 and start tiny. I believe in you!',
        'Good question! Check the Materials tab for what you need, and remember: mixing options is allowed. Want to tell me which part feels tricky?',
      ],
    },
    {
      name: 'thanks', rx: /thank(s| you)|dankie|ngiyabonga|enkosi|ke a leboga/i,
      replies: [
        'Always a pleasure! I\u2019m here any time you need me. \uD83D\uDC9C',
        'You\u2019re so welcome \u2014 thank YOU for showing up for yourself today. \uD83C\uDF38',
      ],
    },
    {
      name: 'meds', rx: /medicat|pills|treatment|art therapy|clinic|doctor|appointment/i,
      replies: [
        'Looking after your health is a big act of self-care. If you have questions about medication or appointments, your clinic team is the best guide \u2014 and Support Services has caring people to talk to as well. \uD83D\uDC9C',
      ],
    },
    {
      name: 'tech', rx: /bug|broken|not work|can.?t upload|error|crash|slow|internet|data|offline/i,
      replies: [
        'Sorry about that! MojoMind works offline too \u2014 your work is saved on your phone and will be here when you return. If something still looks wrong, describe it here and we\u2019ll sort it out together. \uD83D\uDD27',
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
      reply: 'You are in week {week}, with {done} of 8 art activities completed. Activities open week by week; completing the Pre-Survey unlocks Art, Chat and the Post-Survey path.',
    },
    {
      id: 'surveys',
      terms: ['pre-survey', 'post-survey', 'pre survey', 'post survey', 'questionnaire', 'survey'],
      reply: 'The Pre-Survey checks your starting point; the Post-Survey checks in again after the journey and includes app usability. Draft answers save on your device as you go.',
    },
    {
      id: 'privacy',
      terms: ['privacy', 'private', 'data', 'confidential', 'anonymous', 'who can see'],
      minScore: 2,
      reply: 'MojoMind keeps this demo’s progress on your device. Study responses are intended to remain anonymous and within the research team, as explained in the consent screen.',
    },
    {
      id: 'offline use',
      terms: ['offline', 'internet', 'connection', 'mobile data', 'network', 'load shedding'],
      reply: 'MojoMind is an offline-first PWA. Once loaded, the app shell remains available without a connection, and your in-progress answers stay on this device until you return.',
    },
    {
      id: 'support pathways',
      terms: ['support service', 'support services', 'counsellor', 'helpline', 'hotline', 'lifeline', 'sadag'],
      reply: 'Open Support Services for Lifeline, SADAG, the Suicide Crisis Helpline and your facilitator. If this is urgent or you feel unsafe, tap Help at the top now. 💜',
    },
    {
      id: 'breathing and grounding',
      terms: ['breathe', 'breathing', 'grounding', 'ground myself', 'panic', 'calm down'],
      reply: 'Tap Help and use the 4–6–7 breathing guide: breathe in for 4, hold for 6, and breathe out for 7. You can also sip cold water or feel your feet against the ground.',
    },
    {
      id: 'incentive',
      terms: ['incentive', 'r400', 'payment', 'reward'],
      reply: 'The study instructions note a R400 incentive after completing both surveys. For timing or eligibility questions, contact your facilitator through Chat.',
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
  ],
  fallback: [
    'Thank you for sharing! How did this make you feel?',
    'I hear you. Tell me more \u2014 I\u2019m listening. \uD83C\uDF38',
    'That\u2019s a lovely thought to bring into {act}. What inspired it?',
    'Beautiful \u2014 keep expressing yourself, there\u2019s no wrong way here. \uD83C\uDFA8',
    'Noted with care. \uD83D\uDC9C Remember your reflections tab is a great place for thoughts like this too.',
  ],
};

/* ── Daily Spark — inspiration library ───────────────────── */
MM.SPARKS = [
  { text: 'However long the night, the dawn will break.', by: 'African proverb' },
  { text: 'Smooth seas do not make skilful sailors.', by: 'African proverb' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', by: 'African proverb' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', by: 'African proverb' },
  { text: 'Rain does not fall on one roof alone.', by: 'African proverb' },
  { text: 'Wisdom is like a baobab tree; no one individual can embrace it.', by: 'African proverb' },
  { text: 'A bird will always use another bird\u2019s feathers to feather its own nest.', by: 'Sotho proverb' },
  { text: 'Umuntu ngumuntu ngabantu \u2014 I am because we are.', by: 'Ubuntu philosophy' },
  { text: 'Little by little, a little becomes a lot.', by: 'Tanzanian proverb' },
  { text: 'When the roots are deep, there is no reason to fear the wind.', by: 'African proverb' },
  { text: 'The lion does not turn around when a small dog barks.', by: 'African proverb' },
  { text: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.', by: 'Maya Angelou' },
  { text: 'Do not judge me by my successes, judge me by how many times I fell down and got back up again.', by: 'Nelson Mandela' },
  { text: 'It always seems impossible until it\u2019s done.', by: 'Nelson Mandela' },
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
  { text: 'Almost everything will work again if you unplug it for a few minutes \u2014 including you.', by: 'Anne Lamott' },
  { text: 'You don\u2019t have to see the whole staircase, just take the first step.', by: 'Martin Luther King Jr.' },
  { text: 'Fall seven times, stand up eight.', by: 'Japanese proverb' },
  { text: 'The flower that blooms in adversity is the rarest and most beautiful of all.', by: 'Mulan' },
  { text: 'Your present circumstances don\u2019t determine where you can go; they merely determine where you start.', by: 'Nido Qubein' },
  { text: 'Healing is not linear \u2014 and that is perfectly okay.', by: 'MojoMind' },
  { text: 'You have survived 100% of your hardest days so far.', by: 'MojoMind' },
  { text: 'Small steps every day. That is how gardens grow.', by: 'MojoMind' },
  { text: 'Breathe. You are exactly where you need to be.', by: 'MojoMind' },
  { text: 'Your story is a work of art in progress \u2014 keep painting.', by: 'MojoMind' },
  { text: 'Rest is productive. Kindness to yourself is strength.', by: 'MojoMind' },
  { text: 'Feel it. Create it. Release it.', by: 'MojoMind' },
  { text: 'The bravest thing you can do is show up as yourself.', by: 'MojoMind' },
];

MM.SPARK_PERSONAL = {
  streak: n => `\uD83D\uDD25 ${n} day${n > 1 ? 's' : ''} of showing up for yourself \u2014 that is real resilience.`,
  acts: n => `\uD83C\uDFA8 ${n} creative activit${n > 1 ? 'ies' : 'y'} completed. Your voice is getting stronger.`,
  moodsGood: 'Your garden shows more sunshine lately \u2014 keep tending it. \uD83C\uDF3B',
  moodsTough: 'Some days felt heavy lately. Be gentle with yourself \u2014 you\u2019re still growing. \uD83C\uDF31',
  week: w => `Week ${w} of your journey \u2014 every week you create, you grow.`,
  firstSpark: 'This is your very first spark. May it light the whole journey. \u2728',
};

