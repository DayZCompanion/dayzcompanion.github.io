/* DayZ Companion website localization (RU source / EN translation).
 * Update index.html Russian copy, then add its English counterpart here.
 * No external dependencies or network requests.
 */
(() => {
  'use strict';
  const english = {
  "DayZ Companion — инструменты для DayZ": "DayZ Companion — tools for DayZ",
  "Инструменты": "Tools",
  "Скачать": "Download",
  "Поддержка": "Support",
  "Поддержать проект": "Support the project",
  "Загрузить": "Download",
  "Меню ☰": "Menu ☰",
  "Компаньон для DayZ · Windows": "YOUR DAYZ COMPANION · WINDOWS",
  "Твой DayZ.": "Your DayZ.",
  "Твои инструменты.": "Your tools.",
  "Девять полезных инструментов в одном бесплатном приложении. Упрощай привычные действия, настраивай изображение и звук, пользуйся картой прямо во время игры.": "Nine useful tools in one free Windows app. Simplify routine actions, adjust visuals and sound, and use the map while you play.",
  "Сосредоточься на игре.": "Focus on the game.",
  "Остальное упростит Companion.": "Let Companion handle the rest.",
  "От автоматического бега до интерактивной карты — меньше рутинных действий и больше внимания тому, что происходит в DayZ.": "From auto-run to an interactive map, spend less time on repetitive actions and more time on what matters in DayZ.",
  "Меньше рутины.": "Less busywork.",
  "Больше времени на выживание.": "More time to survive.",
  "Карта, звук, изображение и быстрые действия в одном приложении — чтобы больше времени оставалось на само выживание.": "Maps, audio, visuals, and quick actions in one app — so you can focus on survival.",
  "↓ Скачать для Windows": "↓ Download for Windows",
  "Посмотреть возможности ↗": "Explore the tools ↗",
  "♡ Поддержать проект": "♡ Support the project",
  "✧ Бесплатно": "✧ Free",
  "Возможности": "Features",
  "Девять инструментов. Одно окно.": "Nine tools. One app.",
  "Быстрый доступ к инструментам и их настройкам без разрозненных утилит.": "Access all your tools and settings in one place instead of juggling separate utilities.",
  "Доп. оптика (лупа)": "Extra Zoom (Magnifier)",
  "Увеличение области в центре экрана для более удобного наблюдения за целью.": "Magnify the center of the screen for a closer look at your target.",
  "Подробнее": "More details",
  "Использует функцию экранного увеличения Windows и показывает увеличенную область в круге по центру экрана. Помогает рассмотреть удалённую цель и мелкие детали, не меняя игровую оптику.": "Uses Windows screen magnification to enlarge a circular area in the center of your display. Take a closer look at distant targets and small details without changing the optics in DayZ.",
  "Морзе / Nasdara": "Morse / Nasdara",
  "Распознавание сигналов Морзе и преобразование их в координаты и код от бункера.": "Decode Morse signals into bunker coordinates and an access code.",
  "Слушает звуки игры и распознаёт сигналы Морзе на Nasdara. Небольшая панель поверх DayZ показывает принимаемые сигналы и цифры в процессе расшифровки. После завершения отображаются координаты X и Y, PIN-код бункера и количество повторений сообщения. Данные сохраняются в истории.": "Listens to DayZ audio and decodes Morse signals on Nasdara. A small in-game overlay displays the incoming signals and digits as they are decoded. When the message is complete, it shows the bunker’s X/Y coordinates, PIN code, and how many times the message was repeated. Results are saved in the history.",
  "Гамма": "Gamma",
  "Осветление изображения для комфортной игры в самые тёмные ночи DayZ.": "Brighten the image to see more clearly during DayZ’s darkest nights.",
  "Ночь в DayZ бывает настолько тёмной, что сложно различить окружающие объекты. Инструмент позволяет корректировать гамму, чтобы лучше видеть местность, здания и ориентиры без постоянной настройки монитора.": "Nights in DayZ can be so dark that the environment is hard to make out. Adjust gamma to better see terrain, buildings, and landmarks without repeatedly changing your monitor settings.",
  "Беруши": "Earplugs",
  "Приглушайте громкие звуки DayZ, чтобы лучше слышать друзей в Discord.": "Turn down loud DayZ sounds so you can hear your friends on Discord.",
  "Шум двигателя, транспорта и другие громкие звуки игры могут заглушать голосовую связь. Беруши быстро уменьшают громкость DayZ, не приглушая звук Discord и других программ, чтобы общаться с командой было удобнее.": "Engines, vehicles, and other loud in-game sounds can drown out voice chat. Earplugs quickly reduce DayZ’s volume without turning down Discord or other apps, making team communication easier.",
  "Автобег": "Auto-run",
  "Преодолевайте большие расстояния без постоянного удержания клавиш.": "Travel long distances without holding down movement keys.",
  "Большие карты DayZ требуют долгих переходов. Включите автобег, и персонаж продолжит движение без удержания кнопок на клавиатуре. Направляйте его мышью и при необходимости корректируйте маршрут.": "DayZ’s large maps mean long journeys. Enable auto-run to keep your character moving without holding a key. Steer with your mouse and adjust your route as needed.",
  "Экранный прицел": "On-screen Crosshair",
  "Настраиваемая точка или перекрестие в центре игрового экрана.": "A customizable dot or crosshair in the center of your screen.",
  "Показывает поверх игры компактный прицел — точку или перекрестие. Доступны настройки формы, цвета, размера и положения, чтобы выбрать удобный ориентир в центре экрана.": "Displays a small aiming marker over the game — either a dot or a crosshair. Adjust its shape, color, size, and position to suit your preference.",
  "Кодлок": "Code Lock",
  "Автоматический ввод шестизначного кода замка одной клавишей.": "Enter a six-digit lock code automatically with one hotkey.",
  "Сохраните шестизначный код и назначьте горячую клавишу. Подойдите к замку: Companion введёт комбинацию и подтвердит её нажатием Enter. Не нужно каждый раз вспоминать и набирать длинный код вручную.": "Save your six-digit code and assign a hotkey. When you approach the lock, Companion types the combination and presses Enter. No need to remember and retype a long code every time.",
  "Карты": "Maps",
  "Игровые карты DayZ для удобной ориентации на местности.": "DayZ maps to help you navigate the game world.",
  "Просматривайте карты игровых локаций и используйте их для ориентирования в DayZ. Раздел сейчас обновляется: список карт, меток и доступные возможности могут измениться после тестирования.": "Explore game location maps and use them to find your way around DayZ. This section is being updated, so the available maps, markers, and features may change after testing.",
  "Автонаклон": "Auto-lean",
  "Автоматический наклон персонажа при движении влево и вправо.": "Automatically lean left or right while moving sideways.",
  "При движении на A или D персонаж автоматически наклоняется соответственно влево или вправо. Это помогает выглядывать из-за углов и двигаться возле укрытий, меняя положение тела. Возможность проходит тестирование в 1.7.0 TEST.": "Press A or D to make your character lean left or right accordingly. This can help when peeking around corners and moving near cover. The feature is currently being tested for version 1.7.0 TEST.",
  "Описание возможностей проекта. Часть функций и новый интерфейс проходят тестирование для версии 1.7.0 TEST; текущая загрузка — STABLE v1.6.4.": "This section describes the project’s tools. Some features and the new interface are still being tested for version 1.7.0 TEST. The current download is STABLE v1.6.4.",
  "Все настройки под рукой": "Everything in one place",
  "Единый интерфейс управления вместо множества отдельных окон.": "One control panel instead of a collection of separate windows.",
  "Горячие клавиши": "Hotkeys",
  "Настраиваемые действия для доступных инструментов.": "Customizable shortcuts for supported tools.",
  "Диагностика и помощь": "Diagnostics and support",
  "Подготовка технического отчёта и обращения разработчику.": "Generate a diagnostic report and contact the developer.",
  "Предпросмотр 1.7.0 TEST": "1.7.0 TEST Preview",
  "Интерфейс DayZ Companion": "DayZ Companion Interface",
  "На скриншотах показан предварительный интерфейс тестовой версии 1.7.0.": "These screenshots show the work-in-progress interface of version 1.7.0 TEST (in Russian).",
  "Главный экран": "Home Screen",
  "Каталог инструментов": "Tool Library",
  "Коррекция изображения": "Image Adjustment",
  "Загрузка": "Download",
  "Установщик не требуется": "No installer required",
  "DayZ Companion для Windows": "DayZ Companion for Windows",
  "Скачайте официальный portable ZIP, распакуйте в удобную папку и запускайте приложение. Сборки размещены в GitHub Releases.": "Download the official portable ZIP, extract it to a folder of your choice, and run the app. Releases are hosted on GitHub.",
  "Все сведения об актуальном стабильном релизе ↗": "View the latest stable release ↗",
  "↓ Скачать ZIP": "↓ Download ZIP",
  "Обратная связь": "Feedback",
  "Вопрос, ошибка или предложение?": "Have a question, bug report, or idea?",
  "Помогите сделать DayZ Companion удобнее. Сообщите о проблеме, предложите новую функцию или задайте вопрос о работе приложения.": "Help us improve DayZ Companion. Report a problem, suggest a feature, or ask a question about the app.",
  "Связаться с разработчиком": "Contact the developer",
  "Откройте короткую форму поддержки в Яндексе. При необходимости можно приложить диагностический ZIP или скриншот. Не отправляйте пароли, ключи и чужие персональные данные.": "Open the support form on Yandex Forms (currently in Russian). You can attach a diagnostic ZIP or screenshot if needed. Never submit passwords, security keys, or anyone else’s personal information.",
  "Открыть форму ↗": "Open support form ↗",
  "Помогите DayZ Companion развиваться": "Help DayZ Companion grow",
  "DayZ Companion создаётся для игроков и остаётся бесплатным. Если наши инструменты оказались полезными, вы можете добровольно поддержать разработку. Ваша поддержка помогает уделять больше времени улучшениям, исправлению ошибок и новым возможностям.": "DayZ Companion is built for players and remains free. If you find these tools useful, you can choose to support development. Your contribution helps us spend more time improving features, fixing bugs, and building what comes next.",
  "Добровольно · Без подписки и платных функций": "Optional support · No subscriptions or paid features",
  "♥ Поддержать разработку ↗": "♥ Support development ↗",
  "Вопросы и ответы": "Frequently Asked Questions",
  "Главное о DayZ Companion": "About DayZ Companion",
  "Немного о том, как работает приложение и что важно знать перед использованием.": "A few essentials about how the app works and what to know before using it.",
  "DayZ Companion бесплатный?": "Is DayZ Companion free?",
  "Да. Приложение распространяется бесплатно, без подписок и платного доступа к инструментам. Если оно оказалось полезным, вы можете добровольно поддержать развитие проекта.": "Yes. The app is free, with no subscriptions or paid tools. If it has been helpful, you can choose to support its development.",
  "Нужно ли устанавливать моды для DayZ?": "Do I need to install DayZ mods?",
  "Нет. Companion работает отдельно от игры и не требует установки внутриигровых модов. Доступные инструменты включаются и настраиваются в самом приложении.": "No. Companion runs separately from DayZ and does not require in-game mods. You can enable and configure its tools in the app.",
  "Изменяет ли Companion файлы DayZ?": "Does Companion modify DayZ files?",
  "Companion работает как отдельное приложение Windows и не модифицирует игровые ресурсы или исполняемые файлы DayZ. Инструменты используют штатные возможности Windows для работы со звуком и изображением, отображения информации поверх игры и управления нажатиями клавиш.": "Companion runs as a separate Windows application and does not modify DayZ game assets or executable files. Its tools use Windows features to work with audio and visuals, display overlays, and send keyboard input.",
  "Можно ли использовать инструменты на любом сервере?": "Can I use these tools on any server?",
  "Правила серверов могут различаться. Некоторые сообщества ограничивают использование сторонних программ и автоматизации. Перед использованием рекомендуем ознакомиться с правилами своего сервера.": "Server rules vary. Some communities restrict third-party software and automation. Check your server’s rules before using these tools.",
  "· Независимый проект для Windows.": "· Independent project for Windows.",
  "Релизы GitHub": "GitHub Releases",
  "DayZ Companion, главная": "DayZ Companion, home",
  "Основная навигация": "Main navigation",
  "Выживший на фоне заката": "Survivor at sunset",
  "Преимущества DayZ Companion": "DayZ Companion benefits",
  "Варианты приветствия": "Hero headline options",
  "Показать первый заголовок": "Show first headline",
  "Показать второй заголовок": "Show second headline",
  "Показать третий заголовок": "Show third headline",
  "Открыть скриншот главного экрана в полном размере": "Open full-size home screen screenshot",
  "Главная страница Центра управления DayZ Companion": "DayZ Companion control center home screen",
  "Открыть скриншот каталога инструментов в полном размере": "Open full-size tool library screenshot",
  "Каталог из девяти инструментов в приложении DayZ Companion": "DayZ Companion library of nine tools",
  "Открыть скриншот коррекции изображения в полном размере": "Open full-size image adjustment screenshot",
  "Экран настройки гаммы с образцами изображения": "Gamma adjustment screen with image examples",
  "Добровольно поддержать DayZ Companion через CloudTips": "Support DayZ Companion voluntarily via CloudTips",
  "DayZ Companion — бесплатное приложение с набором вспомогательных инструментов для DayZ на Windows. Скачать, изучить возможности и обратиться в поддержку.": "DayZ Companion is a free Windows app with helpful tools for DayZ. Explore its features, download the app, or contact support.",
  "Язык сайта": "Website language"
};
  const attrNames = ['aria-label','alt','title','content'];
  const textEntries = [];
  const attributes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('script,style,noscript')) continue;
    const raw = node.nodeValue;
    const content = raw.trim();
    if (!Object.prototype.hasOwnProperty.call(english, content)) continue;
    const index = raw.indexOf(content);
    textEntries.push({node, ru: raw, en: raw.slice(0,index) + english[content] + raw.slice(index+content.length)});
  }
  const meta = document.querySelector('meta[name="description"]');
  for (const el of [...document.querySelectorAll('[aria-label],[alt],[title]'), ...(meta ? [meta] : [])]) {
    for (const attr of attrNames) {
      const original = el.getAttribute(attr);
      if (original && Object.prototype.hasOwnProperty.call(english, original))
        attributes.push({el, attr, ru:original, en:english[original]});
    }
  }
  const russianTitle = document.title;
  const englishTitle = english[russianTitle] || russianTitle;
  const buttons = [...document.querySelectorAll('[data-site-lang]')];
  const cards = [...document.querySelectorAll('.tool')];
  const key = 'dayz-companion-site-language';
  let current = 'ru';
  function toolLabels() {
    for (const card of cards) {
      const ctrl = card.querySelector('.tool-toggle');
      const name = card.querySelector('h3')?.textContent.trim() || '';
      const isOpen = card.classList.contains('is-open');
      const verb = current === 'en' ? (isOpen ? 'Hide details' : 'Show details') : (isOpen ? 'Свернуть' : 'Показать подробности');
      ctrl?.setAttribute('aria-label', `${verb}: ${name}`);
    }
  }
  function setLanguage(lang, remember = true) {
    current = lang === 'en' ? 'en' : 'ru';
    for (const entry of textEntries) entry.node.nodeValue = entry[current];
    for (const entry of attributes) entry.el.setAttribute(entry.attr,entry[current]);
    document.title = current === 'en' ? englishTitle : russianTitle;
    document.documentElement.lang = current;
    for (const btn of buttons) {
      const active = btn.dataset.siteLang === current;
      btn.classList.toggle('is-active',active);
      btn.setAttribute('aria-pressed',String(active));
    }
    toolLabels();
    if (remember) {try {localStorage.setItem(key,current);}catch(e) {/* storage disabled */}}
  }
  buttons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.siteLang)));
  // Existing card handler runs first; refresh the accessible label after each click.
  cards.forEach(card => card.querySelector('.tool-toggle')?.addEventListener('click',toolLabels));
  let initial = 'ru';
  try {if (localStorage.getItem(key) === 'en') initial = 'en';}catch(e) {/* storage disabled */}
  const queryLang = new URLSearchParams(location.search).get('lang');
  if (queryLang === 'en' || queryLang === 'ru') initial = queryLang;
  setLanguage(initial,false);
})();
