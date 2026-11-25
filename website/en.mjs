export default {
  privacy: {
    "name": "Privacy policy",
    "h1": "Privacy policy",
    "title": "Privacy policy — DayZ Companion",
    "description": "Information about visitor data, analytics, feedback and external services on the DayZ Companion website.",
    "intent": "Learn about website visitor data processing",
    "lead": "Information about data processing when visiting dayz-mod.ru.",
    "sections": [
      [
        "1. Scope",
        "This policy describes the processing of personal data of visitors to the DayZ Companion website (dayz-mod.ru) and users of the feedback form. The website does not require registration. Data processing within the Windows app is outside the scope of this document.",
        "The personal data controller is the individual who owns and administers the DayZ Companion project and the dayz-mod.ru website. Contact the controller using the [feedback form](form)."
      ],
      [
        "2. Website visits",
        "The website is hosted on GitHub Pages. The hosting provider logs visitor IP addresses for security purposes. See the [GitHub privacy statement](githubPrivacy)."
      ],
      [
        "3. Analytics and cookies",
        "The website uses Yandex Metrica (Yandex LLC), including Session Replay and click maps, to understand traffic and improve the website. The service receives device and browser information, IP addresses, pages visited, referral sources, interactions and technical identifiers. Clicks on download, feedback and donation links are counted; download events include the build version. Session Replay records website interactions; recordings are available for 15 days, including the current day. [Data collected by Metrica](metricaData).",
        "Metrica uses cookies and localStorage. The website also remembers dismissal of its cookie notice in localStorage. Dismissing the notice does not turn off analytics. Browser settings allow you to restrict and delete cookies and site data and block the counter. See [Metrica cookies](cookies) and the [Metrica terms](metricaTerms)."
      ],
      [
        "4. Feedback",
        "Requests are submitted via an external [Yandex form](form). Message content, contact details if provided, and optional diagnostic archives or screenshots are processed to respond to requests, investigate issues and improve the app. Responses are stored in Yandex Forms; copies may also be delivered to the controller’s email account. The specified retention period for requests and attachments is no more than three months from receipt, unless a different period is required by law. Do not submit passwords, keys, payment credentials or other people’s personal data. [Yandex privacy policy](yandexPrivacy)."
      ],
      [
        "5. External services",
        "Downloads use GitHub Releases; voluntary donations use CloudTips. The website has no card payment fields: payment information is entered on the payment provider’s website. Original XAM interactive maps are accessed via an external link. External services process data under their own rules: [GitHub](githubPrivacy), [CloudTips](cloudtipsPrivacy), [Yandex](yandexPrivacy)."
      ],
      [
        "6. Rights and requests",
        "You have the right to request information about processing of your personal data, correction, blocking or deletion where legally justified, withdrawal of consent and cessation of processing, and to complain to the competent Russian data protection authority or a court. Use the [feedback form](form) and identify your request as a personal data enquiry."
      ],
      [
        "7. Processing and retention",
        "Processing is limited to data necessary for the stated purposes. When the retention period expires or other legal grounds for ending processing arise, personal data must be deleted or anonymised, including copies of requests in email."
      ]
    ]
  },
  ui: {
    skip: 'Skip to content', nav: 'Main navigation', footer: 'Footer links',
    menu: 'Menu', openMenu: 'Open menu', closeMenu: 'Close menu', language: 'Language',
    tools: 'Tools', tool: 'DayZ Companion tool', allTools: 'Browse tools',
    download: 'Download', support: 'Support the project', feedback: 'Feedback',
    form: 'Open the Yandex form', footerNote: 'An independent project for DayZ players',
    jump: 'On this page', capabilities: 'Features', demo: 'Demo',
    guide: 'Guide', processing: 'How it works', questions: 'Questions',
    faq: 'Frequently asked questions', related: 'Other tools', toGuide: 'Go to the guide',
    toDemo: 'View demo', zoom: 'Enlarge', prev: 'Previous screenshot',
    next: 'Next screenshot', close: 'Close viewer',
    cookieTitle: 'Cookies and analytics',
    cookie: "We use Yandex Metrica and cookies to analyse website traffic. [Privacy policy](privacy).",
    dismiss: 'Got it', latest: 'Latest version', mb: 'MB',
  },
  home: {
    name: 'Home', h1: 'Nine tools for DayZ',
    title: 'DayZ Companion — Free DayZ tools for Windows',
    description: 'DayZ Companion brings nine free DayZ tools to Windows, including a magnifier, Nasdara Morse decoder, gamma controls and earplugs.',
    intent: 'Discover DayZ Companion and explore its DayZ tools',
    eyebrow: 'DayZ Companion for Windows', headline: ['Nine tools', 'for DayZ'],
    lead: 'A magnifier, Morse decoder, gamma controls and other DayZ tools in one free app.',
    version: 'Version', catalog: 'Choose a tool to see how it works and how to set it up.',
    hotkeys: ['Hotkeys', 'Set shortcuts for your DayZ Companion tools and control them while you play.'],
    gallery: ['Inside the app', 'Screens from version {capture} STABLE. Select a screenshot to view it at full size.'],
    shots: {
      home: 'Home in the control centre', tools: 'Tools in Companion',
      diagnostics: 'Maintenance and support',
    },
    download: ['Download DayZ Companion', 'Get the current STABLE build, check the requirements and follow the first-run guide.'],
    downloadDetails: 'Requirements and setup',
    donate: ['Support development', 'DayZ Companion is free. Voluntary donations help fix bugs and improve the tools.', 'Support the project'],
    feedback: 'Ask a question, suggest an improvement or report a bug. You can attach a screenshot or diagnostics archive.',
    faq: [
      ['Do I need a subscription?', 'The app is free. Support via CloudTips is optional.'],
      ['Do I need an installer?', 'Download the full Windows ZIP, extract it and run DayZCompanion.exe. [First-launch guide](download#first).'],
      ['Where can I check compatibility?', 'See the [download page](download#requirements) for general requirements. Individual tools may have additional requirements.'],
      ['Where can I report a bug?', 'Use the [Yandex form](form). Include your Companion version and describe what happened before the error.'],
      ['How do I use Morse / Nasdara?', 'Tune the radio, start listening and wait for the decoded result. [Morse / Nasdara guide](morse#guide).'],
      ['What should I consider when using Companion on DayZ servers?', 'Check the rules of your chosen server: its administrators may restrict individual tools. [More about server rules](about#server-rules).'],
    ],
  },
  download: {
    name: 'Download', h1: 'Download DayZ Companion',
    title: 'Download DayZ Companion {version} STABLE for Windows',
    description: 'Download the full DayZ Companion {version} STABLE ZIP for Windows x64. Check system requirements, first launch, updates and stable release history.',
    intent: 'Download, set up or update DayZ Companion for Windows',
    lead: 'A free app for Windows.', stable: 'Stable build',
    fullZip: 'Full ZIP for', zipButton: 'Download ZIP', source: 'Release details',
    requirements: 'System requirements', requirementsLink: 'Requirements',
    first: 'First launch', update: 'Updating', history: 'Release history',
    jump: 'Download and setup',
    facts: [
      ['Windows 10 or 11, 64-bit', 'Install DayZ to use the in-game tools.'],
      ['Windowed DayZ', 'Use windowed mode for full tool support. Borderless windowed mode is recommended for overlays. Exclusive fullscreen can hide overlays and limit screen capture.'],
      ['Disk space', 'Allow about 1 GB for the ZIP and extracted files together, plus extra free space for updates.'],
      ['Radio capture', 'Isolated DayZ audio capture requires Windows build 20348 or later. On Windows 10 22H2 (19045), compatibility is checked when listening starts.'],
    ],
    steps: [
      ['Download the ZIP', 'Select “Download ZIP” at the top of this page.'],
      ['Extract the archive', 'Extract every file into a separate folder.'],
      ['Run DayZCompanion.exe', 'Open the executable from the extracted folder.'],
    ],
    updateText: "In Companion, open About and select the update check button. If a new version is available, confirm the download and wait for it to finish. Close DayZ, then select Install update. Companion closes to install the new version. Do not turn off your computer or launch Companion again until installation finishes.",
    updateSteps: [["Check for updates","Open About and select the update check button."],["Download the new version","If an update is available, confirm the download and wait for it to finish."],["Close DayZ","Exit the game before installing the new version."],["Install the update","Select Install update. Companion closes to install the new version."],["Wait for installation","Wait for the new version to launch automatically. Do not turn off your computer or start Companion manually during installation."]],
    updateNote: "Version 1.7.0 STABLE shows download progress, but there is no separate installation indicator after the app closes. Even if nothing appears to be happening, wait for installation to finish: after a successful update, Companion automatically launches the new version. Do not turn off your computer or reopen the app during installation.",
    historyText: 'The main changes in stable releases. Each entry links to its files and notes on GitHub.',
    archive: 'Official GitHub releases', checksum: 'SHA-256 checksum',
    faq: [
      ["Why did the window disappear when I started installing an update?","This is normal behaviour in version 1.7.0 STABLE. After downloading the update, the app closes to install the files, and this stage does not yet show a progress indicator. Wait for the updated app to launch automatically. If it does not reopen after an extended wait, report the issue using the [feedback form](form)."],
      ['Can I run the app from inside the ZIP?', 'Extract the whole archive first. The executable needs the folders and files beside it.'],
      ['What if the update does not start?', 'Close DayZ and follow the message in Companion. If the issue persists, use the [Yandex form](form).'],
      ['Where can I check the checksum?', 'Open the [release details](release) and find SHA-256 next to the full Windows ZIP.'],
    ],
  },
  about: {
    name: 'About', h1: 'About the project',
    title: 'About DayZ Companion — How it works, BattlEye and feedback',
    description: 'Learn how DayZ Companion started, how its tools work with Windows and DayZ, what the BattlEye review found and where to send feedback.',
    intent: 'Learn about the project, its approach and how to get in touch',
    lead: 'DayZ Companion brings game tools together in a single Windows app. It is developed independently.',
    jump: ['History', 'Principles', 'Technical details', 'BattlEye', 'Server rules', 'Third-party services'],
    historyLink: "[View the release history](download#history)",
    principles: 'Development principles',
    principlesList: [
      ['Transparency', 'Each tool has its own requirements. Its page explains how it works.'],
      ['Player control', 'Enable the tools you need and assign your own shortcuts.'],
      ['Free access', 'A stable build is available for free. Donations are optional.'],
    ],
    technology: ['How Companion works with Windows and DayZ', 'The tools use different Windows features, so compatibility is checked tool by tool.'],
    technologyList: [
      ['Windows and hotkeys', 'Configurable hotkeys control the tools. A separate on-screen HUD shows the decoder output.'],
      ['Game audio', 'When Nasdara listening is active, the decoder processes audio from the DayZ process locally. [How the decoder works](morse#processing).'],
      ['Updates and external maps', 'Update checks connect to the release source. Companion opens XAM maps in its embedded browser without modifying their content. Map and feature availability depends on the service itself. [Open the original site](xam).'],
    ],
    battleye: ['During our audit, we found no explicit prohibitions in BattlEye’s published materials on the DayZ Companion features we reviewed.', '[Official BattlEye FAQ](battleye)'],
    rules: ['DayZ server rules', 'Each server sets its own rules. A server may restrict overlays or input automation. Read the rules before using Companion and ask the server administrators if anything is unclear.'],
    donate: ['Support development', 'The developer plays DayZ and makes Companion available for free. CloudTips is a way to support work on the app voluntarily.'],
    release: 'Full Windows ZIP and first-run instructions.',
  },
};
