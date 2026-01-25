// Кастомное модальное окно
function showCustomModal(title, message, icon = "🔒") {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('custom-modal-title');
    const modalMessage = document.getElementById('custom-modal-message');
    const modalIcon = document.querySelector('.custom-modal-icon');
    
    if (modal && modalTitle && modalMessage && modalIcon) {
        modalTitle.textContent = title;
        modalMessage.innerHTML = message; // Изменено на innerHTML для поддержки HTML
        modalIcon.textContent = icon;
        modal.classList.add('active');
        
        // Закрыть при клике на overlay
        const overlay = modal.querySelector('.custom-modal-overlay');
        if (overlay) {
            overlay.onclick = closeCustomModal;
        }
        
        // Закрыть при нажатии Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeCustomModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

function closeCustomModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('success-modal');
    }
}

// Модальное окно успешной регистрации
function showSuccessModal(title, message, username) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('custom-modal-title');
    const modalMessage = document.getElementById('custom-modal-message');
    const modalIcon = document.querySelector('.custom-modal-icon');
    
    if (modal && modalTitle && modalMessage && modalIcon) {
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        modalIcon.textContent = '🎉';
        modal.classList.add('active');
        modal.classList.add('success-modal');
        
        // Закрыть при клике на overlay
        const overlay = modal.querySelector('.custom-modal-overlay');
        if (overlay) {
            overlay.onclick = () => {
                closeCustomModal();
                modal.classList.remove('success-modal');
            };
        }
        
        // Закрыть при нажатии Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeCustomModal();
                modal.classList.remove('success-modal');
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Система аутентификации
let currentUser = null;

// Загрузить данные пользователя из localStorage
function loadUser() {
    try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
            // Проверить, что данные пользователя валидны
            if (currentUser && currentUser.username) {
        updateUIForLoggedIn();
        return true;
            } else {
                // Если данные невалидны, очистить
                currentUser = null;
                localStorage.removeItem('currentUser');
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        currentUser = null;
        localStorage.removeItem('currentUser');
    }
    return false;
}

// Сохранить данные пользователя
function saveUser(user) {
    try {
        if (!user || !user.username) {
            console.error('Попытка сохранить невалидного пользователя');
            return;
        }
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIForLoggedIn();
    } catch (error) {
        console.error('Ошибка при сохранении пользователя:', error);
    }
}

// Обновить UI для авторизованного пользователя
function updateUIForLoggedIn() {
    if (currentUser) {
        const avatar = document.getElementById('user-avatar');
        const loginBtn = document.getElementById('login-btn');
        if (avatar) {
            avatar.textContent = currentUser.username.charAt(0).toUpperCase();
            avatar.style.display = 'flex';
        }
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        // Обновить монеты из данных пользователя
        practiceCoins = currentUser.coins || 0;
        updateCoinsDisplay();
        updateMobileMenuLoginButton();
    } else {
        const avatar = document.getElementById('user-avatar');
        const loginBtn = document.getElementById('login-btn');
        if (avatar) {
            avatar.style.display = 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = 'block';
        }
        updateMobileMenuLoginButton();
    }
}

// Показать главную страницу
function showHome() {
    showScreen('home-screen');
}

// Показать симулятор недельного бюджета
function showWeeklyBudgetSimulator() {
    showCustomModal(
        '💰 Недельный бюджет',
        `
        <div style="text-align: left;">
            <p style="margin-bottom: 1rem;">У тебя есть 2000 монет на неделю. Распредели их:</p>
            <div style="margin: 1rem 0;">
                <label style="display: block; margin-bottom: 0.5rem;">🍕 Еда с друзьями:</label>
                <input type="range" id="budget-food" min="0" max="2000" value="500" oninput="updateWeeklyBudget()" style="width: 100%;">
                <span id="budget-food-value">500</span> монет
            </div>
            <div style="margin: 1rem 0;">
                <label style="display: block; margin-bottom: 0.5rem;">🚌 Транспорт:</label>
                <input type="range" id="budget-transport" min="0" max="2000" value="300" oninput="updateWeeklyBudget()" style="width: 100%;">
                <span id="budget-transport-value">300</span> монет
            </div>
            <div style="margin: 1rem 0;">
                <label style="display: block; margin-bottom: 0.5rem;">🎮 Развлечения:</label>
                <input type="range" id="budget-entertainment" min="0" max="2000" value="400" oninput="updateWeeklyBudget()" style="width: 100%;">
                <span id="budget-entertainment-value">400</span> монет
            </div>
            <div style="margin: 1rem 0;">
                <label style="display: block; margin-bottom: 0.5rem;">💰 Накопления:</label>
                <input type="range" id="budget-savings" min="0" max="2000" value="800" oninput="updateWeeklyBudget()" style="width: 100%;">
                <span id="budget-savings-value">800</span> монет
            </div>
            <div style="margin-top: 1.5rem; padding: 1rem; background: #f0f9ff; border-radius: 10px;">
                <p style="margin: 0;"><strong>💡 Твои сбережения через месяц:</strong></p>
                <p style="font-size: 1.5rem; font-weight: 800; color: #667eea; margin: 0.5rem 0 0 0;" id="monthly-savings">3200 монет</p>
            </div>
        </div>
        `
    );
    setTimeout(updateWeeklyBudget, 100);
}

// Обновить недельный бюджет
function updateWeeklyBudget() {
    const food = parseInt(document.getElementById('budget-food')?.value || 0);
    const transport = parseInt(document.getElementById('budget-transport')?.value || 0);
    const entertainment = parseInt(document.getElementById('budget-entertainment')?.value || 0);
    const savings = parseInt(document.getElementById('budget-savings')?.value || 0);
    
    const total = food + transport + entertainment + savings;
    const remaining = 2000 - total;
    
    document.getElementById('budget-food-value').textContent = food;
    document.getElementById('budget-transport-value').textContent = transport;
    document.getElementById('budget-entertainment-value').textContent = entertainment;
    document.getElementById('budget-savings-value').textContent = savings;
    
    const monthlySavings = savings * 4;
    document.getElementById('monthly-savings').textContent = `${monthlySavings} монет`;
    
    if (remaining !== 0) {
        document.getElementById('monthly-savings').style.color = remaining < 0 ? '#ef4444' : '#667eea';
    }
}

// Показать квиз про инвестора
let investorQuizAnswers = [];
let currentInvestorQuestion = 0;

const investorQuizData = [
    {
        question: "Какую сумму ты готов выделить на эксперимент (например, на новый, но рискованный способ заработка в интернете)?",
        answers: [
            { text: "Очень небольшую, которую не страшно потерять", points: 2 },
            { text: "До половины своих накоплений, если идея кажется стоящей", points: 3 },
            { text: "Почти все, что есть, если шанс на успех высок", points: 4 },
            { text: "Никакую. Лучше сохранить то, что есть", points: 1 }
        ]
    },
    {
        question: "Твоя цель на ближайший год?",
        answers: [
            { text: "Накопить на что-то конкретное (новый телефон, ноутбук) и не потратить деньги раньше времени", points: 2 },
            { text: "Постепенно увеличить свои сбережения, пробуя разные способы", points: 3 },
            { text: "Увеличить капитал в несколько раз, найдя «золотую жилу»", points: 4 },
            { text: "Просто не остаться без денег к концу месяца", points: 1 }
        ]
    },
    {
        question: "Что ты делаешь, когда видишь выгодную, но непроверенную акцию в магазине?",
        answers: [
            { text: "Взвешиваю: нужна ли мне эта вещь на самом деле?", points: 2 },
            { text: "Изучаю отзывы и сравниваю цены в других местах", points: 3 },
            { text: "Покупаю, не раздумывая, чтобы не упустить выгоду!", points: 4 },
            { text: "Прохожу мимо, не доверяю слишком хорошим скидкам", points: 1 }
        ]
    },
    {
        question: "Криптовалюта резко выросла в цене. Все вокруг говорят, что это шанс. Твои действия?",
        answers: [
            { text: "Почитаю для начала, что это вообще такое", points: 2 },
            { text: "Может, вложу совсем немного, чтобы «прочувствовать рынок»", points: 3 },
            { text: "Постараюсь вложиться как можно скорее, пока тренд не закончился", points: 4 },
            { text: "Не лезу туда, где ничего не понимаю", points: 1 }
        ]
    },
    {
        question: "Как ты относишься к идее «деньги должны работать»?",
        answers: [
            { text: "Согласен, но работа должна быть надежной и понятной", points: 2 },
            { text: "Это логично. Нужно распределять деньги по разным «корзинам»", points: 3 },
            { text: "Абсолютно верно! Нужно искать самые прибыльные возможности", points: 4 },
            { text: "Главное, чтобы их хватало на нужное", points: 1 }
        ]
    },
    {
        question: "Если бы твои небольшие инвестиции упали в цене на 20%, что сделаешь?",
        answers: [
            { text: "Подожду, пока все восстановится. Я же на долгий срок", points: 2 },
            { text: "Проанализирую, почему так произошло, и решу: продавать или докупать еще", points: 3 },
            { text: "Это шанс купить еще дешевле! Увеличу вложения", points: 4 },
            { text: "Немедленно выведу оставшиеся деньги, чтобы не потерять все", points: 1 }
        ]
    },
    {
        question: "Что для тебя важнее в инвестициях?",
        answers: [
            { text: "Сохранение денег от инфляции", points: 2 },
            { text: "Стабильный и предсказуемый рост", points: 3 },
            { text: "Высокая прибыль, даже с риском", points: 4 },
            { text: "Возможность быстро забрать деньги в любой момент", points: 1 }
        ]
    },
    {
        question: "Твой подход к карманным деньгам?",
        answers: [
            { text: "Я стараюсь откладывать какую-то часть с каждой суммы", points: 2 },
            { text: "У меня есть примерный план, на что я трачу", points: 3 },
            { text: "Часто трачу все сразу, но если вижу крутую возможность — вкладываюсь", points: 4 },
            { text: "Трачу по мере поступления, обычно до конца месяца не хватает", points: 1 }
        ]
    },
    {
        question: "«Диверсификация» — это...",
        answers: [
            { text: "...распределение денег в разные активы, чтобы снизить риски", points: 2 },
            { text: "...стратегия, которую я слышал и в целом понимаю", points: 3 },
            { text: "...что-то, что мешает получить максимальную прибыль на одном удачном вложении", points: 4 },
            { text: "...сложное слово из учебника", points: 1 }
        ]
    },
    {
        question: "Горизонт твоего планирования?",
        answers: [
            { text: "Несколько лет (до университета, первой крупной покупки)", points: 2 },
            { text: "Год-два, с возможностью корректировки", points: 3 },
            { text: "Несколько месяцев — ситуации быстро меняются!", points: 4 },
            { text: "Неделя-месяц", points: 1 }
        ]
    }
];

function showInvestorQuiz() {
    currentInvestorQuestion = 0;
    investorQuizAnswers = [];
    renderInvestorQuestion();
}

function renderInvestorQuestion() {
    const questionData = investorQuizData[currentInvestorQuestion];
    const totalQuestions = investorQuizData.length;
    const progress = ((currentInvestorQuestion) / totalQuestions) * 100;
    
    let answersHTML = '';
    questionData.answers.forEach((answer, index) => {
        const letter = ['А', 'Б', 'В', 'Г'][index];
        answersHTML += `
            <button class="quiz-answer-btn" onclick="selectInvestorAnswer(${answer.points})">
                <span class="answer-letter">${letter})</span>
                ${answer.text}
            </button>
        `;
    });
    
    showCustomModal(
        '🎯 Какой ты инвестор?',
        `
        <div class="investor-quiz-container">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${progress}%"></div>
            </div>
            <p class="quiz-progress-text">Вопрос ${currentInvestorQuestion + 1} из ${totalQuestions}</p>
            
            <div class="quiz-question-box">
                <h3>${questionData.question}</h3>
            </div>
            
            <div class="quiz-answers-grid">
                ${answersHTML}
            </div>
        </div>
        `
    );
}

function selectInvestorAnswer(points) {
    investorQuizAnswers.push(points);
    currentInvestorQuestion++;
    
    if (currentInvestorQuestion < investorQuizData.length) {
        renderInvestorQuestion();
    } else {
        showInvestorQuizResults();
    }
}

function showInvestorQuizResults() {
    const totalPoints = investorQuizAnswers.reduce((sum, points) => sum + points, 0);
    
    let resultTitle = '';
    let resultIcon = '';
    let resultDescription = '';
    let resultAdvice = '';
    
    if (totalPoints >= 10 && totalPoints <= 16) {
        resultTitle = 'Осторожный защитник';
        resultIcon = '🛡️';
        resultDescription = 'Ты ценишь стабильность и безопасность. Твой девиз: «Тише едешь — дальше будешь». Ты не склонен к риску и предпочитаешь копить на конкретные цели.';
        resultAdvice = '<strong>Совет:</strong> Начинай с самых надежных инструментов: накопительный счет, короткие депозиты. Главная задача — защитить сбережения от инфляции и выработать привычку откладывать.';
    } else if (totalPoints >= 17 && totalPoints <= 23) {
        resultTitle = 'Уравновешенный стратег';
        resultIcon = '⚖️';
        resultDescription = 'Ты — золотая середина! Ты готов на разумный риск, но всегда сначала анализируешь. Ты понимаешь важность диверсификации и долгосрочного планирования.';
        resultAdvice = '<strong>Совет:</strong> Твой идеальный путь — это сбалансированный портфель: часть в надежное, часть в растущее. Идеально подойдут ETF, долгосрочные вклады, возможно, небольшая доля в акциях надежных компаний.';
    } else if (totalPoints >= 24 && totalPoints <= 30) {
        resultTitle = 'Рисковый искатель';
        resultIcon = '🚀';
        resultDescription = 'Ты амбициозен, веришь в удачу и высокую прибыль. Медленный рост тебе неинтересен, ты готов рискнуть, чтобы получить больше.';
        resultAdvice = '<strong>Совет:</strong> Твоя энергия — это сила, но ее нужно направлять. Выдели для рискованных экспериментов (крипта, отдельные акции) только ту сумму, которую не страшно потерять полностью. Остальное лучше вложить по стратегии «Уравновешенного стратега», чтобы создать надежный фундамент.';
    } else {
        resultTitle = 'Агрессивный новатор';
        resultIcon = '💥';
        resultDescription = 'Ты — максималист, готовый идти ва-банк ради большой цели. Ты быстро принимаешь решения и веришь в тренды.';
        resultAdvice = '<strong>Совет:</strong> Будь осторожен! Такой подход может привести как к быстрым победам, так и к таким же быстрым потерям. Обязательно учись финансовой грамоте, чтобы понимать реальные риски. Начни с малого и выработай железное правило: никогда не вкладывай последние или заемные деньги.';
    }
    
    showCustomModal(
        '🎉 Результаты теста',
        `
        <div class="quiz-results-container">
            <div class="result-icon-big">${resultIcon}</div>
            <h2 class="result-title">${resultTitle}</h2>
            <p class="result-score">Твой результат: ${totalPoints} баллов из 40</p>
            
            <div class="result-description">
                <p>${resultDescription}</p>
            </div>
            
            <div class="result-advice">
                <p>${resultAdvice}</p>
            </div>
            
            <div class="result-note">
                <p><em>💡 Помни, что этот тест — лишь отправная точка для размышлений. Самый мудрый инвестор — это тот, кто постоянно учится и адаптирует свою стратегию под новые цели и обстоятельства. На нашем сайте ты найдешь уроки по каждому из этих подходов!</em></p>
            </div>
            
            <div class="result-actions">
                <button onclick="showInvestorQuiz()" class="quiz-retry-btn">🔄 Пройти еще раз</button>
                <button onclick="closeCustomModal(); showRegister();" class="quiz-register-btn">✨ Зарегистрироваться</button>
            </div>
        </div>
        `
    );
}

// Флаг для отслеживания перехода с главной страницы
let fromHomeScreen = false;

// Начать обучение - переход на первый блок
function startLearning() {
    // Проверить авторизацию
    if (!currentUser) {
        // Если не авторизован, установить флаг и показать экран входа
        fromHomeScreen = true;
        showLogin();
        return;
    }
    
    // Если авторизован, открыть первый блок
    openLesson(1);
}

// Показать экран входа
function showLogin() {
    // Если пользователь уже авторизован, перенаправить на блоки
    if (currentUser) {
        showLessons();
        return;
    }
    showScreen('login-screen');
}

// Показать экран регистрации
function showRegister() {
    // Если пользователь уже авторизован, перенаправить на блоки
    if (currentUser) {
        showLessons();
        return;
    }
    showScreen('register-screen');
    // Монеты будут скрыты автоматически в функции showScreen
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    // Получить всех пользователей из localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        saveUser(user);
        updateUIForLoggedIn();
        updateMobileMenuLoginButton();
        // Показать монеты обратно
        const coinsBadge = document.querySelector('.coins-badge');
        if (coinsBadge) {
            coinsBadge.style.display = 'flex';
        }
        // Если пришли с главной страницы, открыть первый блок
        if (fromHomeScreen) {
            fromHomeScreen = false;
            openLesson(1);
        } else {
            showLessons();
        }
        alert('Добро пожаловать, ' + username + '!');
    } else {
        alert('Неверный логин или пароль!');
    }
}

// Обработка регистрации
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
    }

    if (username.length < 3) {
        alert('Логин должен содержать минимум 3 символа!');
        return;
    }

    if (password.length < 4) {
        alert('Пароль должен содержать минимум 4 символа!');
        return;
    }

    // Получить всех пользователей из localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверить, не существует ли уже такой пользователь
    if (users.find(u => u.username === username)) {
        alert('Пользователь с таким логином уже существует!');
        return;
    }

    // Создать нового пользователя
    const newUser = {
        username: username,
        password: password,
        coins: 0,
        progress: 0,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    saveUser(newUser);
    
    // Показать красивое модальное окно успешной регистрации
    showSuccessModal(
        '🎉 Регистрация успешна!',
        `Добро пожаловать, ${username}! Теперь ты можешь начать обучение и зарабатывать монеты за прохождение уроков.`,
        username
    );
    
    // Показать монеты обратно после регистрации
    const coinsBadge = document.querySelector('.coins-badge');
    if (coinsBadge) {
        coinsBadge.style.display = 'flex';
    }
    
    // Если пришли с главной страницы, открыть первый блок
    if (fromHomeScreen) {
        fromHomeScreen = false;
        setTimeout(() => {
            openLesson(1);
        }, 1500);
    } else {
        setTimeout(() => {
            showLessons();
        }, 1500);
    }
}

// Показать профиль
function showProfile() {
    if (!currentUser) {
        showLogin();
        return;
    }

    // Обновить данные в профиле
    const usernameEl = document.getElementById('profile-username');
    const passwordEl = document.getElementById('profile-password');
    const coinsEl = document.getElementById('profile-coins');
    
    if (usernameEl) {
        usernameEl.textContent = currentUser.username;
    }
    if (passwordEl) {
        passwordEl.textContent = '••••••••';
        passwordEl.setAttribute('data-password', currentUser.password);
        passwordEl.classList.remove('password-visible');
    }
    if (coinsEl) {
        coinsEl.textContent = currentUser.coins || practiceCoins;
    }
    
    const avatarCircle = document.getElementById('profile-avatar-circle');
    if (avatarCircle) {
        avatarCircle.textContent = currentUser.username.charAt(0).toUpperCase();
    }

    // Обновить прогресс
    const progress = currentUser.progress || moduleProgress || 0;
    const progressFill = document.getElementById('profile-progress-fill');
    const progressPercent = document.getElementById('profile-progress-percent');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (progressPercent) {
        progressPercent.textContent = progress + '%';
    }

    showScreen('profile-screen');
}

// Переключить отображение пароля
function togglePassword() {
    const passwordElement = document.getElementById('profile-password');
    const toggleBtn = document.querySelector('.toggle-password-btn');
    
    if (passwordElement.classList.contains('password-visible')) {
        passwordElement.textContent = '••••••••';
        passwordElement.classList.remove('password-visible');
        toggleBtn.textContent = '👁️ Показать';
    } else {
        const actualPassword = passwordElement.getAttribute('data-password');
        passwordElement.textContent = actualPassword;
        passwordElement.classList.add('password-visible');
        toggleBtn.textContent = '🙈 Скрыть';
    }
}

// Выход из аккаунта
function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUIForLoggedIn();
        showLogin();
        alert('Вы вышли из аккаунта');
    }
}

// Обновить отображение монет во всех местах
function updateCoinsDisplay() {
    const headerCoins = document.getElementById('header-coins');
    const practiceCoinsEl = document.getElementById('practice-coins');

    // Показываем текущий баланс сессии (practiceCoins) — это источник правды
    const coinsToShow = getCurrentCoinsBalance();

    if (headerCoins) {
        headerCoins.textContent = coinsToShow;
    }
    if (practiceCoinsEl) {
        practiceCoinsEl.textContent = coinsToShow;
    }

    // Держим currentUser.coins в памяти синхронизированным (сохранение — через saveUserProgress)
    if (currentUser) {
        currentUser.coins = coinsToShow;
    }

    // Синхронизировать баланс в игре "Твоя жизнь" с текущими монетами
    syncLifeGameWithCoins();
}

// Синхронизировать баланс игры "Твоя жизнь" с текущими монетами
function syncLifeGameWithCoins() {
    const currentCoins = getCurrentCoinsBalance();

    // Всегда синхронизировать наличные в игре с текущими монетами
    if (lifeGameState) {
        lifeGameState.cash = currentCoins;

        // Если игра активна (элемент существует), обновить UI
        const cashElement = document.getElementById('life-game-cash');
        if (cashElement) {
            cashElement.textContent = formatMoney(currentCoins);
            // Также обновить общий капитал
            const totalCapital = calculateTotalCapital();
            const totalElement = document.getElementById('life-game-total-capital');
            if (totalElement) {
                totalElement.textContent = formatMoney(totalCapital);
            }
        }
    }
}

// Сохранить прогресс пользователя
function saveUserProgress() {
    if (!currentUser || !currentUser.username) {
        console.error('Попытка сохранить прогресс без авторизованного пользователя');
        return;
    }
    
    try {
        // Убедиться, что прогресс в допустимых пределах перед сохранением
        const validProgress = Math.max(0, Math.min(100, moduleProgress));
        
        // Сохранить текущие данные пользователя
        currentUser.coins = practiceCoins;
        currentUser.progress = validProgress;
        
        // Обновить в массиве пользователей
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = { ...currentUser }; // Создать копию объекта
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Сохранить текущего пользователя
        saveUser(currentUser);
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error);
        // Попытаться перезагрузить пользователя из localStorage
        loadUser();
    }
    updateCoinsDisplay();
}

// Контент блока: Фундамент (Деньги и Я)
const lessonsData = {
    1: {
        title: "Блок 1: Фундамент (Деньги и Я)",
        icon: "🏠",
        theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Откуда берутся деньги?</h3>
                </div>
                <p class="section-intro">Деньги не растут на деревьях, и их получение требует усилий. Есть три основных типа дохода, каждый со своими особенностями:</p>
                
                <div class="income-cards">
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Зарплата</h4>
                        <p>Деньги за работу по найму. Ты обмениваешь свое время и навыки на деньги. Это самый распространенный и стабильный источник дохода.</p>
                    </div>
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Предпринимательский</h4>
                        <p>Деньги за свои идеи, продукты или услуги. Пример: продажа наклеек, дизайн, блог. Требует инициативы и творческого подхода.</p>
                    </div>
                    <div class="income-card">
                        <div class="income-icon">🛋️</div>
                        <h4>Пассивный</h4>
                        <p>Деньги приходят без ежедневных усилий. Пример: проценты по вкладу, дивиденды, аренда. Идеальный вариант для долгосрочного финансового роста.</p>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⚠️</div>
                    <div class="warning-box-content">
                        <strong>Миф о «денежном дереве»:</strong> Нет кнопки «получить деньги навсегда». Даже пассивный доход требует усилий, знаний и стартового капитала. Начни с малого и постепенно развивай свои источники дохода.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🐷</span>
                    <h3>Бюджет — это не скучно!</h3>
                </div>
                <p class="section-intro">Бюджет — это просто план твоих денег: что приходит (доходы) и что уходит (расходы). Это твой финансовый компас, который помогает достигать целей!</p>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">📊</span>
                        <strong>Правило 50/30/20</strong>
                    </div>
                    <p>Популярное правило распределения бюджета, адаптированное для подростков. Оно поможет тебе правильно распоряжаться деньгами.</p>
                </div>
                
                <div class="budget-rule">
                    <div class="budget-block budget-50">
                        <div class="budget-percent">50%</div>
                        <div class="budget-label">Обязательное</div>
                        <div class="budget-examples">Еда, транспорт, связь, учебные расходы</div>
                    </div>
                    <div class="budget-block budget-30">
                        <div class="budget-percent">30%</div>
                        <div class="budget-label">Желаемое</div>
                        <div class="budget-examples">Развлечения, одежда, хобби, подарки</div>
                    </div>
                    <div class="budget-block budget-20">
                        <div class="budget-percent">20%</div>
                        <div class="budget-label">Сбережения</div>
                        <div class="budget-examples">Цели, подушка безопасности, инвестиции</div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📱</span>
                    <h3>Учет финансов: приложение или тетрадь</h3>
                </div>
                <p class="section-intro">Вести бюджет можно как тебе удобно:</p>
                
                <div class="service-options-grid">
                    <div class="service-option-card">
                        <div class="service-option-icon">📱</div>
                        <h4>В приложении</h4>
                        <p>Трекеры расходов, заметки в телефоне</p>
                    </div>
                    <div class="service-option-card">
                        <div class="service-option-icon">📝</div>
                        <h4>В тетради</h4>
                        <p>Дата, доходы, расходы, остаток</p>
                    </div>
                    <div class="service-option-card">
                        <div class="service-option-icon">📊</div>
                        <h4>В таблице</h4>
                        <p>Google/Excel для детального учёта</p>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">💡</span>
                        <strong>Зачем это нужно?</strong>
                    </div>
                    <p>Чтобы не думать «куда всё делось», а видеть: «у меня осталось столько‑то, и я двигаюсь к цели — новым кроссовкам / телефону».</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Цели и мечты: превращаем «хочу» в план</h3>
                </div>
                <p class="section-intro">Мечта без плана — просто мечта. Финансовая цель — мечта с цифрами и сроком.</p>
                
                <div class="step-by-step-guide">
                    <div class="guide-step">
                        <div class="step-icon">1️⃣</div>
                        <div class="step-content">
                            <h4>Реши, чего хочешь</h4>
                            <p>Телефон, поездка, ноутбук — определи свою цель</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">2️⃣</div>
                        <div class="step-content">
                            <h4>Узнай реальную цену</h4>
                            <p>Изучи рынок и узнай точную стоимость желаемого</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">3️⃣</div>
                        <div class="step-content">
                            <h4>Посчитай откладывания</h4>
                            <p>Определи, сколько можешь откладывать в месяц</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">4️⃣</div>
                        <div class="step-content">
                            <h4>Вычисли срок</h4>
                            <p>Раздели цену на сумму откладываний — получишь примерный срок</p>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">✨</div>
                    <div class="info-card-content">
                        <h4>Пример превращения мечты в план</h4>
                        <p>Мечта: «когда‑нибудь куплю телефон»</p>
                        <p><strong>План:</strong> «через 8 месяцев у меня будет смартфон, если я буду откладывать по 2 500 ₽»</p>
                    </div>
                </div>
            </div>
        `,
        practice: {
            game: {
                title: "Игра: Источники дохода",
                icon: "🎮",
                description: "Помоги персонажу выбрать правильный источник дохода в разных ситуациях.",
                situations: [
                    {
                        text: "Марина накопила 50 000 монеток и хочет, чтобы эти деньги приносили ей доход без ежедневных усилий.",
                        options: [
                            { text: "Устроиться на подработку", icon: "💼", correct: false },
                            { text: "Открыть стартап с нуля", icon: "💡", correct: false },
                            { text: "Получать дивиденды с акций", icon: "🛋️", correct: true }
                        ]
                    },
                    {
                        text: "Алексей хочет заработать деньги, продавая свои дизайны в интернете.",
                        options: [
                            { text: "Зарплата", icon: "💼", correct: false },
                            { text: "Предпринимательский доход", icon: "💡", correct: true },
                            { text: "Пассивный доход", icon: "🛋️", correct: false }
                        ]
                    },
                    {
                        text: "София работает официанткой после школы и получает фиксированную оплату за смены.",
                        options: [
                            { text: "Зарплата", icon: "💼", correct: true },
                            { text: "Предпринимательский доход", icon: "💡", correct: false },
                            { text: "Пассивный доход", icon: "🛋️", correct: false }
                        ]
                    }
                ]
            },
            simulator: {
                title: "Симулятор бюджета",
                icon: "📊",
                description: "Распредели бюджет по правилу 50/30/20. У тебя есть доход:"
            }
        },
        finalTest: [
            {
                question: "Что из этого является зарплатой?",
                options: [
                    "Деньги за подработку после школы",
                    "Проценты по вкладу в банке",
                    "Продажа своих стикеров в интернете",
                    "Подарок на день рождения"
                ],
                correct: 0
            },
            {
                question: "Что такое предпринимательский доход?",
                options: [
                    "Фиксированная зарплата по договору",
                    "Деньги за свои идеи, продукты или услуги",
                    "Подарки от родителей",
                    "Поддержка от государства"
                ],
                correct: 1
            },
            {
                question: "В чем смысл правила 50/30/20 для твоего бюджета?",
                options: [
                    "50% копить, 30% тратить, 20% занимать у друзей",
                    "50% на обязательное, 30% на желания, 20% на сбережения",
                    "50% тратить на игры, 30% на еду, 20% на подписки",
                    "Это правило только для взрослых"
                ],
                correct: 1
            },
            {
                question: "Зачем вести учет доходов и расходов?",
                options: [
                    "Чтобы тратить как можно больше каждый день",
                    "Чтобы видеть, куда уходят деньги и хватило на цели",
                    "Чтобы записывать все цены в магазине",
                    "Достаточно всё держать в голове"
                ],
                correct: 1
            },
            {
                question: "Как превратить мечту о новом телефоне в финансовую цель?",
                options: [
                    "Просто сильно хотеть и ждать",
                    "Купить в кредит, не считая платежи",
                    "Определить цену, срок и сумму, которую будешь откладывать регулярно",
                    "Попросить у всех знакомых"
                ],
                correct: 2
            },
            {
                question: "Если у тебя доход 10 000 монеток, сколько по правилу 50/30/20 должно идти на сбережения?",
                options: [
                    "1 000 монеток",
                    "2 000 монеток",
                    "3 000 монеток",
                    "5 000 монеток"
                ],
                correct: 1
            }
        ]
    },
    2: {
        title: "Блок 2: Банки и кредиты",
        icon: "🏦",
        overview: {
            title: "Знания, которые пригодятся каждому",
            intro: "Поговорим о том, какие бывают карты, вклады и кредиты, и как ими пользоваться с выгодой для себя. Вспомним простые правила защиты от мошенников.",
            learningPoints: [
                "на что обратить внимание при подписании банковского договора",
                "чем кредитная карта отличается от дебетовой",
                "когда лучше открыть счёт, а когда вклад",
                "на какую сумму застрахованы ваши сбережения",
                "что отличает кредиты от микрозаймов",
                "что портит кредитную историю",
                "как минимизировать риск отказа в кредите",
                "как защитить свои деньги от мошенников"
            ],
            lessons: [
                {
                    id: 2.1,
                    title: "Строим здоровые отношения с банком",
                    duration: "10 мин",
                    icon: "🏛️",
                    status: "available"
                },
                {
                    id: 2.2,
                    title: "Карта – быстрый доступ к личным финансам",
                    duration: "10 мин",
                    icon: "💳",
                    status: "available"
                },
                {
                    id: 2.3,
                    title: "Кредитки: максимум выгоды, минимум стресса",
                    duration: "10 мин",
                    icon: "💵",
                    status: "available"
                },
                {
                    id: 2.4,
                    title: "Накопления на счетах и вкладах",
                    duration: "10 мин",
                    icon: "💰",
                    status: "available"
                },
                {
                    id: 2.5,
                    title: "Кредиты – искусство управлять заёмными средствами",
                    duration: "15 мин",
                    icon: "📋",
                    status: "available"
                },
                {
                    id: 2.6,
                    title: "Защита от мошенников при использовании банковских продуктов",
                    duration: "5 мин",
                    icon: "🛡️",
                    status: "available"
                }
            ]
        },
        lessons: {
            "2.1": {
                title: "Строим здоровые отношения с банком",
                icon: "🏛️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Банковский договор – основа отношений</h3>
                </div>
                <p class="section-intro">Взаимоотношения с банком начинаются с заключения банковского договора.</p>
                
                <div class="info-card">
                    <div class="info-card-icon">📄</div>
                    <div class="info-card-content">
                        <h4>Что такое банковский договор?</h4>
                        <p><strong>Банковский договор</strong> – это официальное соглашение между клиентом и банком – контракт, где всё чётко прописано: ваши права, обязанности и условия, на которых вам предоставляют услуги.</p>
                        <p>Это важный документ, который защищает обе стороны и устанавливает правила сотрудничества.</p>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">🌐</span>
                        <strong>Где найти договоры?</strong>
                    </div>
                <p>У каждого банка свои шаблоны договоров. Обычно их можно найти на сайте банка – просто загляните в раздел для клиентов. Условия могут отличаться в зависимости от типа услуги (вклад, кредит, карта и т.д.), законов региона и внутренней политики банка.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Типы банковских договоров</h3>
                </div>
                <p class="section-intro">В зависимости от цели выделяют разные типы договоров. Каждый тип имеет свои особенности и условия:</p>
                
                <div class="contract-types-grid">
                    <div class="contract-type-card">
                        <div class="contract-type-icon">💳</div>
                        <h4>Договор об открытии счёта</h4>
                        <p>Для работы с банковским счётом</p>
                    </div>
                    <div class="contract-type-card">
                        <div class="contract-type-icon">🏦</div>
                        <h4>Универсальный договор</h4>
                        <p>Для полного набора банковских услуг</p>
                    </div>
                    <div class="contract-type-card">
                        <div class="contract-type-icon">💰</div>
                        <h4>Кредитный договор</h4>
                        <p>Для получения кредита</p>
                    </div>
                    <div class="contract-type-card">
                        <div class="contract-type-icon">🏠</div>
                        <h4>Ипотечный договор</h4>
                        <p>Для ипотечного кредита</p>
                    </div>
                    <div class="contract-type-card">
                        <div class="contract-type-icon">💵</div>
                        <h4>Договор по карте</h4>
                        <p>Для работы с кредитной картой</p>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⚠️</div>
                    <div class="warning-box-content">
                        <strong>Важно помнить:</strong> В любом договоре обязательно должны быть указаны определённые пункты, их наличие и корректность надо проверить перед подписанием. Не стесняйся задавать вопросы банковскому сотруднику!
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">👀</span>
                    <h3>Как правильно читать договор</h3>
                </div>
                
                <div class="steps-list">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Внимательно изучите</h4>
                            <p>Прочитайте договор полностью, прежде чем подписать его</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Задавайте вопросы</h4>
                            <p>Если что-то непонятно, проясняйте все детали. Лучше потратить 10 минут на уточнение, чем потом разбираться с неприятными сюрпризами</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Сохраните копию</h4>
                            <p>После подписания обязательно сохраните копию договора. Пусть всегда будет под рукой</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚖️</span>
                    <h3>Ваши права как потребителя</h3>
                </div>
                
                <div class="rights-card">
                    <div class="rights-icon">🛡️</div>
                    <div class="rights-content">
                        <p>А ещё знайте, что вы как потребители финансовых услуг имеете не только обязанности по договорам, но и <strong>права</strong>. И если ваши права нарушают, то нужно уметь их защитить.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏦</span>
                    <h3>Банковское обслуживание</h3>
                </div>
                <p class="section-intro">А теперь перейдём к непосредственному предоставлению банковских услуг – к банковскому обслуживанию. Современные банки предлагают несколько удобных способов:</p>
                
                <div class="service-methods">
                    <div class="service-method">
                        <div class="service-method-icon">🏢</div>
                        <h4>В отделении</h4>
                        <p>Обратитесь к сотруднику банка</p>
                    </div>
                    <div class="service-method">
                        <div class="service-method-icon">📱</div>
                        <h4>Онлайн</h4>
                        <p>Через приложение или сайт</p>
                    </div>
                    <div class="service-method">
                        <div class="service-method-icon">🏧</div>
                        <h4>Банкомат</h4>
                        <p>Самообслуживание 24/7</p>
                    </div>
                </div>
                
                <p class="section-note"><strong>Банковское обслуживание</strong> – это различные формы предоставления банковских услуг. Все эти способы позволяют вам управлять своими финансами удобно и безопасно.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💻</span>
                    <h3>Онлайн-банкинг</h3>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <div class="feature-content">
                        <h4>Управление деньгами онлайн</h4>
                <p><strong>Онлайн-банкинг</strong> – это онлайн-доступ к банковскому обслуживанию, когда вы можете управлять своими деньгами через телефон или компьютер, не выходя из дома.</p>
                        <ul class="feature-list">
                            <li>✅ Переводы в один клик</li>
                            <li>✅ Оплата счетов</li>
                            <li>✅ Просмотр истории операций</li>
                            <li>✅ Блокировка карты при необходимости</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✨</span>
                    <h3>Преимущества банковского обслуживания</h3>
                </div>
                
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">⚡</div>
                        <h4>Быстро и просто</h4>
                        <p>Переводы, обмен валюты, оплата услуг – всё это можно делать быстро и просто</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🎁</div>
                        <h4>Бонусы и кэшбэк</h4>
                        <p>Многие банки предлагают дополнительные бонусы за свои услуги</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">📈</div>
                        <h4>Дополнительные услуги</h4>
                        <p>Инвестирование, страхование и другие возможности</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Главное правило</h3>
                </div>
                <p class="myth-busting"><strong>Помните:</strong> Каким бы ни был договор по своему типу и форме, всегда надо внимательно читать все его пункты, задавать уточняющие вопросы, если что-то неясно – и только в случае согласия с условиями договора ставить свою подпись.</p>
            </div>
        `,
                practice: {}, // Нет игры, только финальный тест
                finalTest: [
                    {
                        question: "Что такое банковский договор?",
                        options: [
                            "Неформальное соглашение между клиентом и банком",
                            "Официальное соглашение между клиентом и банком, где прописаны права, обязанности и условия предоставления услуг",
                            "Просто документ для галочки",
                            "Реклама банковских услуг"
                        ],
                        correct: 1
                    },
                    {
                        question: "Где можно найти шаблоны договоров банка?",
                        options: [
                            "Только в отделении банка",
                            "На сайте банка в разделе для клиентов",
                            "Договоры не публикуются",
                            "Только по запросу в письменном виде"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно сделать перед подписанием договора?",
                        options: [
                            "Быстро подписать, не читая",
                            "Внимательно изучить договор, задать вопросы, если что-то непонятно",
                            "Довериться сотруднику банка и подписать",
                            "Подписать и потом разобраться"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое банковское обслуживание?",
                        options: [
                            "Только работа с наличными деньгами",
                            "Различные формы предоставления банковских услуг (в отделении, онлайн, через банкомат)",
                            "Только кредиты",
                            "Только вклады"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое онлайн-банкинг?",
                        options: [
                            "Только мобильное приложение",
                            "Онлайн-доступ к банковскому обслуживанию через телефон или компьютер",
                            "Только для пожилых людей",
                            "Только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно сделать после подписания договора?",
                        options: [
                            "Выбросить договор",
                            "Обязательно сохранить копию договора",
                            "Забыть про договор",
                            "Отдать договор банку"
                        ],
                        correct: 1
                    }
                ]
            },
            "2.2": {
                title: "Карта – быстрый доступ к личным финансам",
                icon: "💳",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💳</span>
                    <h3>Карта – быстрый доступ к личным финансам</h3>
                </div>
                <p class="section-intro">Обслуживание в банке чаще всего начинается с оформления банковской карты.</p>
                
                <div class="info-card">
                    <div class="info-card-icon">💳</div>
                    <div class="info-card-content">
                        <h4>Что такое банковская карта?</h4>
                <p><strong>Банковская карта</strong> – это универсальный финансовый инструмент. Она может быть пластиковой (та, которую вы носите в кошельке) или виртуальной (в приложении на телефоне). Карта может быть привязана к одному или нескольким вашим счётам в банке.</p>
                    </div>
                </div>
                
                <div class="comparison-box">
                    <div class="comparison-item">
                        <div class="comparison-icon">💵</div>
                        <h4>Наличные</h4>
                        <p>Риск потери или кражи</p>
                    </div>
                    <div class="comparison-arrow">→</div>
                    <div class="comparison-item better">
                        <div class="comparison-icon">💳</div>
                        <h4>Банковская карта</h4>
                        <p>Мгновенная блокировка при потере</p>
                    </div>
                </div>
                
                <div class="card-features">
                    <h4>С помощью банковской карты вы можете:</h4>
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-item-icon">🛒</div>
                            <p>Оплачивать покупки в магазинах или онлайн</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-item-icon">🏧</div>
                            <p>Снимать наличные в банкоматах</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-item-icon">💸</div>
                            <p>Переводить деньги друзьям и родным</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-item-icon">🎁</div>
                            <p>Копить бонусы и кэшбэк</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📏</span>
                    <h3>Как выглядит карта</h3>
                </div>
                <p>Обычно это небольшой прямоугольник из пластика размером 8,5 см на 5,5 см (меньше вашего смартфона). Толщина карты – меньше 1 мм, так что она легко помещается в кошелёк.</p>
                <p>На карте есть отличительные элементы, которые делают её уникальной и помогают предотвратить создание дубликата.</p>
                <p>Если пластик вам кажется не актуальным, вы можете выпустить карту в форме специального стикера.</p>
                <p class="myth-busting"><strong>Важно:</strong> Если данные вашей карты стали известны посторонним, незамедлительно блокируйте её и меняйте на новую. Иначе вы рискуете потерять все свои деньги. Отмечу, что банковский счёт при замене утерянной карты останется прежним.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💵</span>
                    <h3>Какие бывают карты</h3>
                </div>
                <p>Карты бывают дебето́вые и кредитные.</p>
                
                <div class="card-types-comparison">
                    <div class="card-type">
                        <div class="card-type-header">
                            <div class="card-type-icon">💳</div>
                            <h4>Дебетовая карта</h4>
                        </div>
                        <div class="card-type-content">
                <p><strong>Дебетовая карта</strong> - банковская карта, которая даёт возможность распоряжаться деньгами в пределах сумм, находящихся на счёте её владельца.</p>
                            <div class="card-type-feature">
                                <span class="feature-badge">💵</span>
                                <span>Тратите только свои деньги</span>
                            </div>
                            <div class="card-type-feature">
                                <span class="feature-badge">➕</span>
                                <span>Можно подключить овердрафт</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-type">
                        <div class="card-type-header">
                            <div class="card-type-icon">💵</div>
                            <h4>Кредитная карта</h4>
                        </div>
                        <div class="card-type-content">
                            <p><strong>Кредитная карта (кредитка)</strong> – это второй вид банковских карт. Она предоставляет вам возможность пользоваться не своими средствами, а средствами банка в рамках определённого лимита.</p>
                            <div class="card-type-feature">
                                <span class="feature-badge">🏦</span>
                                <span>Тратите деньги банка</span>
                            </div>
                            <div class="card-type-feature">
                                <span class="feature-badge">⏰</span>
                                <span>Беспроцентный период</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">ℹ️</span>
                        <strong>Что такое овердрафт?</strong>
                    </div>
                <p>К дебетовой карте можно подключить овердрафт – это специальная услуга, которая позволяет временно «уйти в минус» на вашем счёте. Проще говоря, это небольшой кредит, который предоставляет банк. Если на вашем счёте закончились деньги, но нужно срочно что-то оплатить, банк автоматически добавит недостающую сумму из этого лимита. Потом вы вернёте эти деньги, пополнив счёт.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💳</span>
                    <h3>Как работает кредитная карта</h3>
                </div>
                
                <div class="credit-card-steps">
                    <div class="credit-step">
                        <div class="credit-step-number">1</div>
                        <div class="credit-step-content">
                            <h4>Банк одобряет лимит</h4>
                            <p>Определённая сумма, которую вы можете тратить в долг. Например, 50 000 ₽</p>
                        </div>
                    </div>
                    <div class="credit-step">
                        <div class="credit-step-number">2</div>
                        <div class="credit-step-content">
                            <h4>Используйте с умом</h4>
                            <p>Используйте деньги для оплаты покупок и возвращайте в течение беспроцентного периода</p>
                        </div>
                    </div>
                    <div class="credit-step">
                        <div class="credit-step-number">3</div>
                        <div class="credit-step-content">
                            <h4>Верните вовремя</h4>
                            <p>Если вернёте в срок – переплаты не будет. Если опоздаете – банк начислит проценты</p>
                        </div>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⏰</div>
                    <div class="warning-box-content">
                        <strong>Беспроцентный период</strong> – количество дней, в течение которого банк не начисляет проценты. Чтобы он действовал, нужно каждый месяц вносить минимальный или обязательный платеж (обычно 2-10% от суммы долга).
                        <br><br>
                        <strong>Важно!</strong> Не забывайте вносить минимальный ежемесячный платёж в течение беспроцентного периода, чтобы сохранить его.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤔</span>
                    <h3>Что лучше: дебетовая или кредитная карта?</h3>
                </div>
                <p>Хотя ответ, на первый взгляд, кажется очевидным, стоит рассмотреть преимущества обеих карт, чтобы сделать обоснованные выводы.</p>
                
                <p><strong>Дебетовая карта:</strong></p>
                <ul>
                    <li><strong>Получение зарплаты и социальных выплат</strong> – удобный способ получения средств без необходимости посещать банк</li>
                    <li><strong>Оплата повседневных покупок</strong> – возможность оплаты товаров и услуг с дополнительной выгодой в виде получения кешбэка или бонусов</li>
                    <li><strong>Снятие наличных</strong> – доступ к снятию наличных без комиссии в банкоматах вашего банка или банков-партнеров</li>
                    <li><strong>Перевод денежных средств</strong> – быстрые переводы средств между своими счетами или другим людям с учетом лимитов на бесплатные операции</li>
                </ul>
                
                <p><strong>Кредитная карта:</strong></p>
                <ul>
                    <li><strong>Доступ к дополнительным средствам в экстренной ситуации</strong> – кредитная карта позволяет воспользоваться заемными средствами в случае срочной необходимости. Главное – вернуть деньги в течение беспроцентного периода, чтобы не платить проценты</li>
                    <li><strong>Возможность совершать покупки, даже если денег пока недостаточно</strong> – подходит для приобретения дорогостоящих товаров с возможностью рассрочки благодаря льготному периоду</li>
                    <li><strong>Возможность формировать пассивный доход, даже если нет возможности копить</strong> – денежные средства с дебетовой карты можно разместить на накопительном счёте или краткосрочном вкладе, а покупки и услуги оплачивать с кредитной карты. Главное, вернуть потраченные деньги до конца беспроцентного периода</li>
                </ul>
                
                <p>Каждая карта обладает своими преимуществами, и выбор зависит от конкретных потребностей и финансовых возможностей.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📱</span>
                    <h3>Бесконтактные карты</h3>
                </div>
                <p>В наши дни большинство карт поддерживает бесконтактный способ оплаты. Такие карты имеют ряд преимуществ и поэтому становятся всё популярнее.</p>
                
                <p><strong>Особенности бесконтактных карт:</strong></p>
                <ul>
                    <li><strong>Для оплаты покупки карту не нужно передавать продавцу</strong> – карта всегда находится в руках владельца, что значительно повышает её безопасность</li>
                    <li><strong>Для оплаты покупки нужно лишь приложить карту к терминалу</strong> – это очень просто и быстро!</li>
                    <li><strong>Высокая скорость транзакции (до нескольких секунд)</strong> – это экономит время</li>
                    <li><strong>После оплаты терминал издает звуковой сигнал и сразу отключается</strong> – ваши деньги не спишутся дважды за одну покупку</li>
                    <li><strong>Ограниченная длина действия радиосигнала (до 10 см)</strong> – деньги под контролем. Чтобы снять их с карты, мошенники со специальным устройством должны подойти к вам очень близко – но вы сразу это заметите</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📲</span>
                    <h3>Виртуальные карты</h3>
                </div>
                <p>До сих пор мы говорили о пластиковых картах, а ещё есть карты виртуальные. Реквизиты таких карт хранятся в мобильном приложении банка на вашем телефоне, а физическая пластиковая карта не выпускается. С такой картой можно расплачиваться онлайн либо через терминал в магазине при помощи смартфона или снимать наличные в банкомате.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">😊</span>
                    <h3>Оплата улыбкой</h3>
                </div>
                <p>А ещё можно расплачиваться улыбкой! Да-да! И это не фантазии. Вы легко можете подключить эту функцию в приложении банка или через личный кабинет.</p>
                
                <p><strong>Оплата улыбкой – ваше удобство и уникальность</strong></p>
                <p>Хотите выделиться или удивить друзей – попробуйте этот удобный и безопасный способ оплаты!</p>
                
                <p><strong>Преимущества очевидны:</strong></p>
                <ul>
                    <li><strong>Мгновенная оплата:</strong> никаких карт и авторизаций в приложении</li>
                    <li><strong>Безопасность:</strong> оплату можете сделать только вы, личность невозможно подделать</li>
                    <li><strong>Уверенность:</strong> случайно оплатить за кого-то не получится – система распознаёт именно вас</li>
                </ul>
                
                <p>Даже если вы поменяли прическу или макияж, камера всё равно узнает вас. При этом данные хранятся не в виде фотографии вашего лица, а в виде цифровых кодов, привязанных к вашему счёту. Для дополнительной защиты есть код безопасности. Его нужно будет создать при подключении услуги и вводить, подтверждая свои покупки или снимая деньги в банкомате.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Выбор подходящего варианта</h3>
                </div>
                <p class="myth-busting">Как видите, возможностей для онлайн-оплаты товаров и услуг очень много – надо внимательно изучать условия и выбирать наиболее подходящие для вас варианты.</p>
            </div>
        `,
                practice: {}, // Нет игры, только финальный тест
                finalTest: [
                    {
                        question: "Что такое банковская карта?",
                        options: [
                            "Только пластиковая карта",
                            "Универсальный финансовый инструмент, который может быть пластиковым или виртуальным",
                            "Только виртуальная карта в приложении",
                            "Только для онлайн-покупок"
                        ],
                        correct: 1
                    },
                    {
                        question: "Почему карта безопаснее наличных?",
                        options: [
                            "Карту нельзя потерять",
                            "Деньги хранятся на счёте в банке, а карту можно мгновенно заблокировать при потере",
                            "Карта всегда работает",
                            "Карта не требует защиты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое дебетовая карта?",
                        options: [
                            "Карта, которая позволяет тратить деньги банка",
                            "Карта, которая даёт возможность распоряжаться деньгами в пределах сумм на счёте владельца",
                            "Карта только для онлайн-покупок",
                            "Карта, которая не требует пополнения"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое овердрафт?",
                        options: [
                            "Дополнительная карта",
                            "Услуга, которая позволяет временно «уйти в минус» на счёте",
                            "Беспроцентный период",
                            "Виртуальная карта"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое беспроцентный период по кредитной карте?",
                        options: [
                            "Время, когда можно не платить вообще",
                            "Количество дней, в течение которых банк не начисляет проценты при условии внесения минимального платежа",
                            "Период, когда карта заблокирована",
                            "Время действия карты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какое преимущество бесконтактных карт?",
                        options: [
                            "Нужно передавать карту продавцу",
                            "Карта всегда в руках владельца, оплата очень быстрая и безопасная",
                            "Можно оплачивать только онлайн",
                            "Работают только в банкоматах"
                        ],
                        correct: 1
                    }
                ]
        },
    "2.3": {
        title: "Кредитки: максимум выгоды, минимум стресса",
        icon: "💵",
        theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💳</span>
                    <h3>Кредитки: максимум выгоды, минимум стресса</h3>
                </div>
                <p class="section-intro">В прошлом уроке мы сравнили дебетовые и кредитные карты, а теперь разберёмся, как извлечь максимум пользы из кредитки и не стать её заложником.</p>
                
                <div class="info-card">
                    <div class="info-card-icon">💡</div>
                    <div class="info-card-content">
                        <h4>Главный секрет успеха</h4>
                        <p>Раньше многие боятся кредиток, но потом понимают, что <strong>главное - это планирование</strong>. И тогда можно использовать кредитную карту как запасной кошелёк. Например, если знаешь, что скоро будет стипендия или заплатят деньги за проект, можно не ждать и сделать необходимую покупку в начале беспроцентного периода - пользоваться понравившейся вещью и спокойно всё погашать без переплат.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Пример: как действует беспроцентный период</h3>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-content">
                        <h4>Начни с малого</h4>
                        <p>Когда оформляешь свою первую кредитку, то первое время может быть сложно оставаться в рамках беспроцентного периода. Всё хочется купить, ведь деньги же есть. <strong>Повезло, если сначала банк одобрил не очень большой лимит.</strong> Это спасает от необдуманных чрезмерных трат. И закрывать долг с небольшим лимитом гораздо легче.</p>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">📈</span>
                        <strong>Лимит может вырасти</strong>
                    </div>
                    <p>При своевременной выплате кредита банк может повысить лимит по кредитке. Лимит может стать даже выше, чем изначально запрашивалось.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Что важно узнать перед оформлением кредитки</h3>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">⏰</div>
                    <div class="info-card-content">
                        <h4>Напоминания – ваш друг</h4>
                        <p>Банк обычно присылает напоминание про ежемесячный платёж по кредитке, это очень удобно. Но всегда лучше подстраховаться и <strong>поставить напоминания в телефоне за пару дней до конца беспроцентного периода</strong>, чтобы точно не забыть внести деньги.</p>
                    </div>
                </div>
                
                <div class="comparison-box">
                    <div class="comparison-item">
                        <div class="comparison-icon">💵</div>
                        <h4>Ежемесячный платёж</h4>
                        <p>Минимальная сумма (2-5% от долга)</p>
                        <p class="comparison-note">Остаётесь в беспроцентном периоде</p>
                    </div>
                    <div class="comparison-arrow">→</div>
                    <div class="comparison-item better">
                        <div class="comparison-icon">✅</div>
                        <h4>Полное погашение</h4>
                        <p>Вся сумма долга</p>
                        <p class="comparison-note">Не платите проценты вообще</p>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⚠️</div>
                    <div class="warning-box-content">
                        <strong>Важно помнить:</strong> Чтобы не платить проценты на оставшуюся сумму, необходимо погасить весь долг до конца льготного периода, а не только минимальный платёж.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>5 лайфхаков, как получить выгоду от кредитной карты</h3>
                </div>
                
                <div class="step-by-step-guide">
                    <div class="guide-step">
                        <div class="step-icon">1️⃣</div>
                        <div class="step-content">
                            <h4>Планируй траты заранее</h4>
                            <p>Используй кредитку только для запланированных покупок, которые ты точно сможешь погасить в беспроцентный период</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">2️⃣</div>
                        <div class="step-content">
                            <h4>Ставь напоминания</h4>
                            <p>За несколько дней до конца беспроцентного периода установи напоминание о необходимости погасить долг</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">3️⃣</div>
                        <div class="step-content">
                            <h4>Начинай с небольшого лимита</h4>
                            <p>Если это твоя первая кредитка, лучше начать с небольшого лимита, чтобы научиться управлять долгом</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">4️⃣</div>
                        <div class="step-content">
                            <h4>Используй кэшбэк и бонусы</h4>
                            <p>Многие банки предлагают кэшбэк и бонусы за покупки по кредитной карте, используй это с умом</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">5️⃣</div>
                        <div class="step-content">
                            <h4>Погашай долг полностью</h4>
                            <p>Чтобы не платить проценты, всегда погашай весь долг до конца беспроцентного периода, а не только минимальный платёж</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Лайфхак №6: самая опасная ошибка</h3>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">🚫</div>
                    <div class="warning-box-content">
                        <strong>Самая опасная ошибка:</strong> Не берите новую кредитку, чтобы погасить долг по старой – это самая опасная ошибка! Вы попадаете в замкнутый круг. Лучше сначала посчитайте, сколько сможете отдавать, и потом тратьте кредитные деньги. И, конечно, возвращайте долг вовремя, чтобы избежать переплат и проблем с банком.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Как проанализировать предложения банков</h3>
                </div>
                <p class="section-intro">А теперь закрепим материал! Посмотрите на примере кредитной карты, как можно проанализировать предложения банков. Обратите внимание на ключевые параметры:</p>
                
                <div class="key-features-grid">
                    <div class="feature-item">
                        <div class="feature-item-icon">📊</div>
                        <h4>Процентная ставка</h4>
                        <p>Сколько процентов будет начисляться, если не успеете погасить долг в беспроцентный период</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-item-icon">⏰</div>
                        <h4>Льготный период</h4>
                        <p>Сколько дней у вас есть на беспроцентное пользование деньгами</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-item-icon">🎁</div>
                        <h4>Кэшбэк и бонусы</h4>
                        <p>Какие дополнительные выгоды предлагает банк</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-item-icon">🛡️</div>
                        <h4>Дополнительные услуги</h4>
                        <p>Страховки, программы лояльности и другие возможности</p>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">💡</span>
                        <strong>Практический совет</strong>
                    </div>
                <p>Попробуйте так же проанализировать свою карту или несколько карт разных банков, если своей кредитки у вас пока нет. Сравните условия и выберите наиболее подходящий вариант для ваших потребностей.</p>
                </div>
            </div>
        `,
        practice: {}, // Нет игры, только финальный тест
        finalTest: [
            {
                question: "Как лучше использовать кредитную карту?",
                options: [
                    "Тратить все деньги и не возвращать",
                    "Использовать для запланированных покупок и возвращать деньги в течение беспроцентного периода",
                    "Никогда не использовать",
                    "Использовать только для снятия наличных"
                ],
                correct: 1
            },
            {
                question: "Что такое ежемесячный платёж по кредитной карте?",
                options: [
                    "Вся сумма долга",
                    "Минимальная сумма, которую нужно вносить каждый месяц, чтобы оставаться в беспроцентном периоде",
                    "Произвольная сумма",
                    "Сумма, которую банк списывает автоматически"
                ],
                correct: 1
            },
            {
                question: "Что нужно сделать, чтобы не платить проценты по кредитной карте?",
                options: [
                    "Вносить только минимальный платёж",
                    "Погасить весь долг до конца беспроцентного периода",
                    "Не использовать карту вообще",
                    "Вносить платёж раз в полгода"
                ],
                correct: 1
            },
            {
                question: "Почему не стоит брать новую кредитку для погашения долга по старой?",
                options: [
                    "Это удобно и выгодно",
                    "Это самая опасная ошибка, которая приводит к замкнутому кругу долгов",
                    "Банки не разрешают это делать",
                    "Это слишком сложно"
                ],
                correct: 1
            },
            {
                question: "С какого лимита лучше начинать, если это первая кредитка?",
                options: [
                    "С максимально возможного лимита",
                    "С небольшого лимита, чтобы научиться управлять долгом",
                    "Лимит не важен",
                    "С любого, который одобрит банк"
                ],
                correct: 1
            },
            {
                question: "На какие параметры нужно обратить внимание при выборе кредитной карты?",
                options: [
                    "Только на процентную ставку",
                    "На процентную ставку, льготный период, кэшбэк и дополнительные услуги",
                    "Только на кэшбэк",
                    "Только на дизайн карты"
                ],
                correct: 1
            }
        ]
        },
            "2.4": {
                title: "Накопления на счетах и вкладах",
                icon: "💰",
        theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Счета и вклады</h3>
                </div>
                <p class="section-intro">Не менее популярные финансовые продукты, чем банковские карты – это счета и вклады.</p>
                
                <div class="info-card">
                    <div class="info-card-icon">🏦</div>
                    <div class="info-card-content">
                        <h4>Что такое банковский счёт?</h4>
                        <p><strong>Банковский счёт</strong> – индивидуальный счёт физического или юридического лица, который позволяет хранить, переводить и получать денежные средства, пользуясь услугами банка. Счета открываются как в монетлях, так и в иностранной валюте.</p>
                        <p>Банковский счёт можно сравнить с вашим виртуальным финансовым аккаунтом, где хранится информация о ваших деньгах. У него есть уникальный номер, который закреплён только за вами.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <div class="feature-content">
                        <h4>Открытие счёта онлайн</h4>
                        <p>Открыть банковский счёт можно быстро и легко через интернет-банк или мобильное приложение, не посещая отделение банка.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Какие бывают счета и вклады?</h3>
                </div>
                
                <div class="deposit-types-grid">
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">💳</div>
                        <h4>Текущие счета</h4>
                        <p>Для повседневных операций: оплата, переводы, снятие наличных</p>
                        <div class="deposit-feature">💵 Проценты маленькие или отсутствуют</div>
                    </div>
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">💰</div>
                        <h4>Накопительные счета</h4>
                        <p>Для тех, кто хочет копить и получать проценты</p>
                        <div class="deposit-feature">✅ Можно пополнять и снимать в любой момент</div>
                    </div>
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">📅</div>
                        <h4>Срочные вклады</h4>
                        <p>Для долгосрочных целей</p>
                        <div class="deposit-feature">🔒 Доступ ограничен до окончания срока</div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Чем вклад отличается от накопительного счёта?</h3>
                </div>
                
                <div class="comparison-box">
                    <div class="comparison-item">
                        <div class="comparison-icon">📅</div>
                        <h4>Вклад</h4>
                        <div class="comparison-features">
                            <p>🔒 Доступ ограничен до окончания срока</p>
                            <p>📊 Ставка фиксированная и выше</p>
                            <p>🎯 Для долгосрочных целей</p>
                        </div>
                    </div>
                    <div class="comparison-arrow">↔️</div>
                    <div class="comparison-item better">
                        <div class="comparison-icon">💰</div>
                        <h4>Накопительный счёт</h4>
                        <div class="comparison-features">
                            <p>✅ Свободный доступ к средствам</p>
                            <p>📈 Ставка может меняться</p>
                            <p>🔄 Для гибкого накопления</p>
                        </div>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">💡</span>
                        <strong>Бонус для новых клиентов</strong>
                    </div>
                    <p>Многие банки предлагают накопительные счета, где первые два-три месяца действует повышенная ставка, сопоставимая со срочными вкладами, если вы открываете такой счёт впервые. Процент начисляется на сумму остатка на начало каждого дня, а выплачивается ежемесячно.</p>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⚠️</div>
                    <div class="warning-box-content">
                        <strong>Важно:</strong> Условия по накопительным счетам могут различаться в разных банках, поэтому нужно их внимательно изучать до того, как вы сделаете свой выбор в пользу того или иного варианта.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Виды срочных вкладов</h3>
                </div>
                <p class="section-intro">Срочные вклады могут предусматривать либо не предусматривать возможность совершать определённые действия в течение срока действия вклада:</p>
                
                <div class="deposit-types-grid">
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">🔒</div>
                        <h4>Без пополнения и снятия</h4>
                        <p>Максимальная ставка</p>
                        <div class="deposit-feature">💰 Самый высокий доход</div>
                    </div>
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">➕</div>
                        <h4>С пополнением</h4>
                        <p>Без частичного снятия</p>
                        <div class="deposit-feature">📈 Средняя ставка</div>
                    </div>
                    <div class="deposit-type-card">
                        <div class="deposit-type-icon">🔄</div>
                        <h4>С пополнением и снятием</h4>
                        <p>Максимальная гибкость</p>
                        <div class="deposit-feature">💵 Более низкая ставка</div>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">💡</span>
                        <strong>Лайфхак</strong>
                    </div>
                    <p>Если вы точно не знаете, когда понадобятся деньги, вы можете открыть несколько вкладов на разные сроки. Тогда не придётся из-за понадобившихся 10 000 ₽ разрывать договор вклада на 100 000 ₽ и терять весь доход.</p>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">📚</div>
                    <div class="info-card-content">
                        <h4>Вклад vs Депозит</h4>
                        <p>Иногда вклады называют депозитами, но <strong>банковский депозит</strong> – более широкое понятие, чем банковский вклад. Объектом вклада могут быть только денежные средства, тогда как депозит предполагает размещение в банке разных финансовых активов (ценных бумаг, драгоценных металлов и прочих).</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💵</span>
                    <h3>Условия начисления дохода по вкладам</h3>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">📊</div>
                    <div class="info-card-content">
                        <h4>Процентная ставка</h4>
                        <p><strong>Процентная ставка</strong> – это процент, который банк готов выплатить за пользование вашими деньгами. Чем выше ставка, тем больше вы заработаете. Это основное условие, которое определяет размер дохода от вклада.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <div class="feature-content">
                        <h4>Капитализация процентов</h4>
                        <p><strong>Капитализация</strong> – это начисление процентов по вкладу как на основную сумму, так и на уже начисленные проценты, то есть проценты на проценты, что повышает доходность вклада со временем.</p>
                        <p class="feature-note">✅ Если капитализация есть – для вас это дополнительная выгода!</p>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-box-header">
                        <span class="info-box-icon">💡</span>
                        <strong>Лайфхак: используйте калькуляторы</strong>
                    </div>
                    <p>Для расчёта доходности по вкладам используйте онлайн-калькуляторы – они есть на сайте банков. Вам будет легче сравнить условия по разным счетам и вкладам и выбрать выгодный для себя вариант.</p>
                </div>
                
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">🎁</div>
                        <h4>Надбавки к ставке</h4>
                        <p>Многие банки предлагают надбавки за подписку, траты по картам, получение зарплаты на карту этого банка</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">⚠️</div>
                        <h4>Важно помнить</h4>
                        <p>Реальная доходность может варьироваться в зависимости от налогов, инфляции, изменения ставок. Всегда уточняйте условия у банка</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔑</span>
                    <h3>Ключевая ставка</h3>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">🏛️</div>
                    <div class="info-card-content">
                        <h4>Что такое ключевая ставка?</h4>
                        <p><strong>Ключевая ставка</strong> – минимальная ставка, по которой Банк России готов выдавать кредиты коммерческим банкам. Это основной инструмент денежно-кредитной политики Банка России. Она ключевая, потому что, по сути, является ключом к управлению ставками по кредитам и вкладам.</p>
                    </div>
                </div>
                
                <div class="comparison-box">
                    <div class="comparison-item">
                        <div class="comparison-icon">💰</div>
                        <h4>Ставки по вкладам</h4>
                        <p>Обычно чуть ниже ключевой ставки</p>
                    </div>
                    <div class="comparison-arrow">↕️</div>
                    <div class="comparison-item">
                        <div class="comparison-icon">💳</div>
                        <h4>Ставки по кредитам</h4>
                        <p>Обычно несколько выше ключевой ставки</p>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">📈</div>
                    <div class="warning-box-content">
                        <strong>Важно:</strong> Как правило, если меняется ключевая ставка, следом за ней меняются и ставки по вкладам и накопительным счетам в банках в соответствии с условиями договоров.
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>Надёжно ли хранить деньги на счетах</h3>
                </div>
                
                <div class="info-card">
                    <div class="info-card-icon">🛡️</div>
                    <div class="info-card-content">
                        <h4>Система страхования вкладов</h4>
                        <p>В России действует система страхования вкладов. Если банк обанкротится, вы получите компенсацию за счёт страховой суммы, которая утверждена на законодательном уровне.</p>
                        <p class="highlight-amount"><strong>Страховая сумма: 1,4 млн ₽</strong> за все именные счета и вклады в одном банке</p>
                    </div>
                </div>
                
                <div class="step-by-step-guide">
                    <div class="guide-step">
                        <div class="step-icon">1️⃣</div>
                        <div class="step-content">
                            <h4>Банки в системе</h4>
                            <p>Многие банки входят в систему страхования вкладов и отчисляют взносы в Агентство по страхованию вкладов (АСВ)</p>
                        </div>
                    </div>
                    <div class="guide-step">
                        <div class="step-icon">2️⃣</div>
                        <div class="step-content">
                            <h4>Защита ваших денег</h4>
                            <p>Если что-то случится с банком (обанкротится или будет отозвана лицензия), АСВ вернёт вам деньги в рамках страховой суммы</p>
                        </div>
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-box-icon">⚠️</div>
                    <div class="warning-box-content">
                        <strong>Лайфхаки безопасности:</strong>
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>Перед размещением вклада обязательно проверяйте, входит ли банк в систему страхования вкладов (список есть на сайте АСВ)</li>
                            <li>Если у вас больше 1,4 млн ₽, лучше разделить их на несколько вкладов в разных банках</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
                practice: {}, // Нет игры, только финальный тест
                finalTest: [
                    {
                        question: "Что такое банковский счёт?",
                        options: [
                            "Только карта для оплаты",
                            "Индивидуальный счёт физического или юридического лица, который позволяет хранить, переводить и получать денежные средства",
                            "Только для бизнеса",
                            "Только для валютных операций"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем отличается накопительный счёт от срочного вклада?",
                        options: [
                            "Нет разницы",
                            "Накопительный счёт даёт свободный доступ к средствам, а вклад ограничивает доступ до окончания срока",
                            "Вклад всегда выгоднее",
                            "Накопительный счёт только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое капитализация процентов?",
                        options: [
                            "Только начисление процентов на основную сумму",
                            "Начисление процентов как на основную сумму, так и на уже начисленные проценты",
                            "Снятие процентов",
                            "Закрытие вклада"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какая сумма застрахована в системе страхования вкладов?",
                        options: [
                            "500 000 ₽",
                            "1,4 млн ₽ за все именные счета и вклады в одном банке",
                            "5 млн ₽",
                            "Неограниченная сумма"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое ключевая ставка?",
                        options: [
                            "Ставка по кредитам",
                            "Минимальная ставка, по которой Банк России готов выдавать кредиты коммерческим банкам",
                            "Ставка по вкладам",
                            "Комиссия банка"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какой лайфхак поможет, если вы не знаете, когда понадобятся деньги?",
                        options: [
                            "Открыть один большой вклад",
                            "Открыть несколько вкладов на разные сроки",
                            "Не открывать вклады вообще",
                            "Хранить все деньги на карте"
                        ],
                        correct: 1
                    }
                ]
            },
            "2.5": {
                title: "Кредиты – искусство управлять заёмными средствами",
                icon: "📋",
        theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💳</span>
                    <h3>Что такое кредит?</h3>
                </div>
                <p class="section-intro">Кто-то не готов связываться с кредитами ни при каких условиях, а кто-то, наоборот, берёт их без разбора и тонет в долгах. Выясняем, стоит ли бояться кредитов и как ими пользоваться разумно.</p>
                <p><strong>Кредит</strong> – это деньги, которые банк даёт клиенту в долг на определённое время и на определённых условиях.</p>
                <p><strong>Заёмщик</strong> – тот, кто берёт кредит.</p>
                <p><strong>Кредитор</strong> – тот, кто предоставляет кредит.</p>
                <p>Сегодня, чтобы оформить кредит, совсем не обязательно ехать в офис банка, можно оформить все онлайн. Это удобно и быстро! Многие так и делают. Главное тут, внимательно изучить все условия, выбрать надежного кредитора и заполнить заявку на официальном сайте банка или в официальном приложении, чтобы не отправить свои персональные данные мошенникам.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Какие бывают кредиты</h3>
                </div>
                
                <p><strong>Целевые</strong></p>
                <p>Предоставляются на конкретные цели:</p>
                <ul>
                    <li>ипотека на жильё</li>
                    <li>автокредит</li>
                    <li>образовательный кредит</li>
                </ul>
                
                <p><strong>Нецелевые</strong></p>
                <p>Банк не контролирует, на что будут потрачены деньги – такие кредиты ещё называют потребительскими. Процент по ним, как правило, выше. Зато не нужно подтверждать документами расходы.</p>
                
                <p>Некоторые люди предпочитают копить самостоятельно. Но не всегда можно ждать, пока накопится нужная сумма. Важно своевременно получить образование, купить необходимую для жизни вещь или не жить в затопленной квартире. Да и на саму квартиру копить нужно целую вечность. Кредит позволяет быстро решить свою жизненную ситуацию и возвращать сумму частями.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Сколько стоит кредит на самом деле</h3>
                </div>
                <p><strong>Эффективная ставка</strong> отражает полную стоимость обслуживания долга – то есть сколько всего вам придётся заплатить сверх взятых в долг средств.</p>
                
                <p><strong>Полная стоимость кредита включает:</strong></p>
                <ul>
                    <li><strong>Основная задолженность</strong> – сумма, которую вы взяли в долг.</li>
                    <li><strong>Процентная ставка</strong> – плата за пользование заемными средствами.</li>
                    <li><strong>Комиссионные сборы</strong> – дополнительные платежи, взимаемые банками за обслуживание кредита.</li>
                    <li><strong>Страхование</strong> – дополнительная опция для защиты вас от непредвиденных обстоятельств, по некоторым видам кредитов может быть обязательной.</li>
                    <li><strong>Штрафы за просрочку платежа</strong> – санкции, которые вступают в силу в случае несвоевременной оплаты платежа.</li>
                    <li><strong>Расходы на оформление</strong> – затраты на подготовку необходимых документов.</li>
                    <li><strong>Ежемесячные выплаты</strong> – суммы, подлежащие оплате ежемесячно.</li>
                </ul>
                
                <p>При планировании бюджета с учётом взятого кредита важно точно знать, каким будет ваш ежемесячный платёж.</p>
                
                <p><strong>Аннуитетные платежи</strong> – система погашения кредита равными ежемесячными платежами. Сегодня почти все кредиты выдаются с такой схемой. Это удобно для заёмщика, поскольку легче планировать расходы. Однако вначале придётся выплачивать банку в основном проценты, и только потом основной долг.</p>
                
                <p><strong>Дифференцированные платежи</strong> – система погашения кредита, при которой заёмщик ежемесячно вносит разные суммы, размер которых с каждым разом уменьшается. Сумма основного долга в платеже всегда будет одной и той же. А вот проценты, начисляемые на остаток основного долга, будут уменьшаться по мере выплаты кредита.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Как выгодно взять кредит</h3>
                </div>
                <ul>
                    <li><strong>Сравнивайте условия:</strong> смотрите не только на процентную ставку, но и на дополнительные комиссии.</li>
                    <li><strong>Старайтесь уменьшить срок:</strong> чем больше срок по кредиту, тем меньше ежемесячные платежи, но в итоге вы заплатите больше процентов.</li>
                    <li><strong>Пользуйтесь рефинансированием:</strong> так называется получение нового кредита на более выгодных условиях в другом банке для погашения менее выгодного кредита в первом банке.</li>
                    <li><strong>Не берите лишнего:</strong> рассчитывайте, сколько сможете вернуть.</li>
                </ul>
                <p>Помимо банковских кредитов, существуют и другие способы получить деньги в долг. Например, взять микрозайм в микрофинансовой организации (МФО).</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Микрозаймы и их особенности</h3>
                </div>
                <p><strong>Микрозайм</strong> – это небольшая сумма денег, которую можно получить быстро, часто даже без справок о доходах или проверки кредитной истории. МФО выдают такие займы на короткий срок: от нескольких дней до нескольких месяцев. Однако взамен требуют более высокий процент, чем в банке.</p>
                
                <p><strong>Почему микрозаймы стали популярны?</strong></p>
                <ul>
                    <li><strong>Быстрое оформление:</strong> деньги можно получить день в день, наличными или онлайн. Например, если срочно нужно погасить долг по кредитке.</li>
                    <li><strong>Минимум документов:</strong> часто требуется только паспорт. Хотя банки во многих случаях тоже просят только паспорт.</li>
                    <li><strong>Доступность:</strong> даже если у вас плохая кредитная история, вам могут одобрить займ.</li>
                </ul>
                
                <p class="myth-busting"><strong>Но всё ли так просто, как кажется?</strong></p>
                
                <p><strong>Что нужно знать о микрозаймах? У них могут быть:</strong></p>
                <ul>
                    <li><strong>Высокие проценты.</strong> Далеко не всегда вам озвучивают годовую процентную ставку, а она может достигать сотен процентов. Также возможны нечёткие сроки начисления процентов и скрытые размеры ставок, которые становятся причиной значительных переплат.</li>
                    <li><strong>Дополнительные расходы.</strong> Возможны навязанные услуги (страховки, медицинская или юридическая помощь), которые вычитаются из суммы кредита.</li>
                    <li><strong>Короткий срок.</strong> На первый взгляд, этого достаточно, чтобы перехватить денег до зарплаты. Но короткий срок может стать и существенным минусом – если вдруг не успеете вернуть деньги, попадёте на высокие штрафы и пени. Даже минимальная просрочка может значительно увеличить сумму долга.</li>
                    <li><strong>Скрытые условия.</strong> Например, комиссия за погашение. А договор люди обычно читают невнимательно, думая, что их не коснется.</li>
                    <li><strong>Агрессивное взыскание.</strong> В случае просрочки МФО могут активно напоминать о долге через звонки и сообщения или передать долг коллекторам.</li>
                </ul>
                
                <p>Многие обращаются за микрозаймами на эмоциях. Во-первых, они хотят чувствовать себя самостоятельными и не хотят просить деньги у родителей. Во-вторых, им интересно было попробовать что-то новое или они попадают под влияние рекламы и советов знакомых. А в-третьих, некоторым казалось, что это просто и не повлечёт никаких серьезных обязательств.</p>
                
                <p>Лёгкость оформления обычно создаёт эмоциональный комфорт, ощущение меньшей ответственности, меньшего морального давления. Так возникает ложное чувство безопасности. Многие ошибочно считают, что небольшая просрочка в МФО не очень повлияет на кредитную историю. Думают, что куда хуже испортить кредитную историю в банке. Не зная, что кредитная история включает в себя и кредиты в банке, и микрозаймы в МФО.</p>
                
                <p>Некоторые вообще боятся обращаться в банки. Думают, что им откажут, особенно если у них нет стабильного дохода. Не хотят тратить время и силы на сбор документов и подачу заявки. Они не в курсе, что теперь оформить кредит стало намного проще и быстрее, чем раньше. Даже в банк для этого ходить не надо! Все можно сделать быстро онлайн.</p>
                
                <p>Даже если в первый раз банк не даст вам большую сумму, не стоит воспринимать это как личную обиду. Банк пока не знает, насколько вы платёжеспособны, ответственны и аккуратны. Но когда вы проявите себя с положительной стороны, в следующий раз вам могут предложить уже большие суммы. Главное, чтобы вашего дохода хватало на обслуживание долга.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>Как избежать долговой ямы</h3>
                </div>
                <ul>
                    <li>Перед оформлением кредита здраво оцените свои финансовые возможности. Спланируйте бюджет с учётом ежемесячного платежа по кредиту. Заранее подсчитайте, какую сумму сможете комфортно платить с учётом всех обязательств.</li>
                    <li>Убедитесь, что у вас есть финансовый резерв на тот случай, если вдруг заболеете или потеряете работу, а кредит надо выплачивать.</li>
                    <li>Самая плохая идея – взять новый кредит или заём, чтобы погасить старый (например, задолженность по кредитной карте). Вас может окончательно затянуть в долговую воронку.</li>
                    <li>Убедитесь, что финансовая организация имеет лицензию Банка России на свою деятельность.</li>
                    <li>Почитайте отзывы других клиентов об их опыте кредитования в этой организации.</li>
                    <li>Для этого внимательно прочитайте договор. Не стесняйтесь уточнять все неясные моменты. Обратите особое внимание на то, что написано мелким шрифтом и в сносках – в них могут скрываться дополнительные комиссии.</li>
                    <li>Ничего не подписывайте, пока во всём не разберётесь.</li>
                </ul>
                
                <p>Страхование поможет вам обезопасить себя на случай потери работы, здоровья или других непредвиденных обстоятельств, которые могут помешать вам выплачивать кредит. Тогда кредит будет погашаться за счёт страховых выплат.</p>
                
                <p>Просрочка влечёт не только штрафы и увеличение задолженности, но может сильно испортить вашу кредитную историю и затруднить получение новых кредитов в будущем.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Кредитная история: почему она так важна</h3>
                </div>
                <p><strong>Кредитная история</strong> – это информация обо всех ваших кредитах: где, когда и сколько брали, выступали ли созаёмщиком либо поручителем, аккуратно ли платили.</p>
                <p>Как только вы подаёте заявку на кредит или заём, данные отправляются в бюро кредитных историй (БКИ).</p>
                <p>Кредитную историю определяете вы сами, банки лишь передают информацию в бюро.</p>
                <p>Кредитная история – это ваш личный кредитный рейтинг. Если вы погашаете платежи вовремя, рейтинг растёт – и банки смогут вам предложить более выгодные условия. Но если ваш рейтинг падает вниз из-за постоянных просрочек или большого количества одновременных кредитов и займов, то получить последующие кредиты станет сложнее или просто невозможно.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Как не испортить кредитную историю</h3>
                </div>
                <ul>
                    <li>Выплачивайте кредиты и займы вовремя, в том числе по кредитной карте. Даже одна просрочка – как «неуд» в зачётке: портит всю картину.</li>
                    <li>Не берите кредиты и займы без необходимости. Каждый новый микрозайм – это как подозрительная активность в вашем финансовом профиле, и это может насторожить банки.</li>
                    <li>Проверяйте свою кредитную историю. Всегда полезно убедиться, что в ней нет ошибок и следов мошеннических действий. Бесплатно вы можете запрашивать свою кредитную историю два раза в год.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Как улучшить плохую кредитную историю</h3>
                </div>
                <p>Начните с небольших кредитов в банке (например, на смартфон или ноутбук) и погашайте их в срок. Или оформите кредитную карту. Если вы взяли займ в МФО, постарайтесь вернуть его досрочно. Так вы сэкономите на процентах и покажете, что умеете управлять деньгами. За пару лет вы создадите новую историю взаимоотношений с банками – хорошую. Обычно банки пристально смотрят как раз на последние 2-3 года кредитной истории.</p>
                <p>И не забывайте вовремя оплачивать счета за жильё и телефон: злостные должники тоже получают плохую запись в кредитной истории.</p>
            </div>
        `,
                practice: {}, // Нет игры, только финальный тест
                finalTest: [
                    {
                        question: "Что такое кредит?",
                        options: [
                            "Бесплатные деньги от банка",
                            "Деньги, которые банк даёт клиенту в долг на определённое время и на определённых условиях",
                            "Только ипотека",
                            "Только кредитная карта"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем отличается целевой кредит от нецелевого?",
                        options: [
                            "Нет разницы",
                            "Целевой предоставляется на конкретные цели, нецелевой (потребительский) банк не контролирует, на что потрачены деньги",
                            "Целевой всегда дешевле",
                            "Нецелевой только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое полная стоимость кредита?",
                        options: [
                            "Только процентная ставка",
                            "Вся сумма, которую придётся заплатить сверх взятых в долг средств (основной долг, проценты, комиссии, страхование и т.д.)",
                            "Только основной долг",
                            "Только штрафы"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое аннуитетные платежи?",
                        options: [
                            "Платежи, которые увеличиваются каждый месяц",
                            "Система погашения кредита равными ежемесячными платежами",
                            "Только проценты",
                            "Только основной долг"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое кредитная история?",
                        options: [
                            "Только информация о банковских кредитах",
                            "Информация обо всех ваших кредитах и займах: где, когда и сколько брали, аккуратно ли платили",
                            "Только информация о просрочках",
                            "Только информация о микрозаймах"
                        ],
                        correct: 1
                    },
                    {
                        question: "Как избежать долговой ямы?",
                        options: [
                            "Брать новые кредиты для погашения старых",
                            "Здраво оценить финансовые возможности, спланировать бюджет, иметь финансовый резерв, не брать новый кредит для погашения старого",
                            "Не платить по кредитам",
                            "Брать только микрозаймы"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно знать о микрозаймах?",
                        options: [
                            "Они всегда выгоднее банковских кредитов",
                            "У них могут быть высокие проценты, дополнительные расходы, короткий срок, скрытые условия и агрессивное взыскание",
                            "Они не влияют на кредитную историю",
                            "Их можно не возвращать"
                        ],
                        correct: 1
                    }
                ]
            },
            "2.6": {
                title: "Защита от мошенников при использовании банковских продуктов",
                icon: "🛡️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>Защита финансов и личных данных</h3>
                </div>
                <p class="section-intro">В завершение курса обсудим, как пользоваться банковскими продуктами безопасно.</p>
                <p>Современные технологии значительно упрощают нашу жизнь: оплата в один клик, перевод за секунду, доступ к финансам онлайн. Но и мошенники не дремлют. Мы решили посвятить защите финансов и личных данных отдельный урок. А сейчас сфокусируемся на типичных ошибках пользователей банковских продуктов и как можно их избежать.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔒</span>
                    <h3>Основные правила безопасности</h3>
                </div>
                <ul>
                    <li><strong>Никогда и никому не сообщайте пароли, пин-коды, CVC/CVV-коды или другие данные карт и личных кабинетов</strong> по телефону, почте или в интернете. Никто не имеет права запрашивать эти данные.</li>
                    <li><strong>Не передавайте доступ к интернет-банкингу или мобильному приложению</strong> друзьям и даже близким людям.</li>
                    <li><strong>Перед вводом данных карты на сайте банка или торговой площадки</strong> убедитесь, что вы находитесь на официальном сайте, а не на его фишинговой копии.</li>
                    <li><strong>Не совершайте платежи и переводы, пока не убедитесь в их безопасности</strong> и в подлинности адресата. Иначе есть высокий риск перевести деньги мошенникам.</li>
                    <li><strong>Не оставляйте ваши банковские карты</strong> в общедоступных местах.</li>
                    <li><strong>Немедленно блокируйте карту, если она потерялась или её данные стали известны посторонним.</strong> Сразу же сообщите об этом в банк.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">👀</span>
                    <h3>Контроль операций по счетам и картам</h3>
                </div>
                <p>Это важно, чтобы вовремя заметить мошеннические операции по счетам и картам. Для этого:</p>
                <ul>
                    <li><strong>Регулярно проверяйте выписки по счетам и операции по картам.</strong></li>
                    <li><strong>При обнаружении подозрительных транзакций</strong> сразу свяжитесь с банком и всё выясните.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔑</span>
                    <h3>Надёжные пароли и двухфакторная аутентификация</h3>
                </div>
                <p>Пароли нужно регулярно обновлять и не использовать одни и те же пароли для разных аккаунтов.</p>
                <p>По возможности включите <strong>двухфакторную аутентификацию</strong> для входа в интернет-банкинг или мобильное приложение. Это дополнительный уровень защиты, который значительно снижает риск несанкционированного доступа к вашим счетам.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📶</span>
                    <h3>Безопасность в общедоступных Wi-Fi сетях</h3>
                </div>
                <p>Общедоступные сети Wi-Fi часто не защищены, что позволяет мошенникам перехватывать данные. Поэтому:</p>
                <ul>
                    <li><strong>Не используйте онлайн-банкинг в общедоступных Wi-Fi сетях.</strong></li>
                    <li><strong>Подключайтесь через VPN или мобильный интернет,</strong> если это необходимо.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Внимательное чтение договоров</h3>
                </div>
                <p>Незнание условий может привести к неожиданным комиссиям, просрочкам или потере доходов.</p>
                <p><strong>Что важно:</strong></p>
                <ul>
                    <li><strong>Внимательно читайте договоры перед подписанием.</strong> Можно несколько раз.</li>
                    <li><strong>До подписания договора уточняйте у сотрудника финансовой организации</strong> все неясные моменты.</li>
                    <li><strong>Храните свои экземпляры договоров или их копии под рукой,</strong> чтобы вы могли всегда посмотреть условия, свои права и обязанности.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Итоговые рекомендации</h3>
                </div>
                <p class="myth-busting">Если следовать этим советам, шанс быть обманутыми мошенниками станет намного меньше. Будьте внимательны и не теряйте голову, когда дело касается денег. Берегите себя и свои финансы!</p>
            </div>
        `,
                practice: {}, // Нет игры, только финальный тест
                finalTest: [
                    {
                        question: "Что нужно делать, если карта потерялась или её данные стали известны посторонним?",
                        options: [
                            "Ничего не делать",
                            "Немедленно заблокировать карту и сообщить об этом в банк",
                            "Подождать несколько дней",
                            "Использовать карту как обычно"
                        ],
                        correct: 1
                    },
                    {
                        question: "Можно ли сообщать пароли, пин-коды и CVC/CVV-коды по телефону?",
                        options: [
                            "Да, если звонят из банка",
                            "Никогда и никому не сообщайте эти данные",
                            "Только близким друзьям",
                            "Только по электронной почте"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое двухфакторная аутентификация?",
                        options: [
                            "Два пароля вместо одного",
                            "Дополнительный уровень защиты для входа в интернет-банкинг или мобильное приложение",
                            "Два банковских счёта",
                            "Две кредитные карты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Можно ли использовать онлайн-банкинг в общедоступных Wi-Fi сетях?",
                        options: [
                            "Да, это безопасно",
                            "Нет, лучше использовать VPN или мобильный интернет",
                            "Только если сеть бесплатная",
                            "Только в кафе"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно делать перед подписанием договора?",
                        options: [
                            "Быстро подписать, не читая",
                            "Внимательно прочитать договор и уточнить все неясные моменты у сотрудника",
                            "Довериться сотруднику банка",
                            "Подписать и потом разобраться"
                        ],
                        correct: 1
                    },
                    {
                        question: "Как часто нужно проверять операции по счетам и картам?",
                        options: [
                            "Раз в год",
                            "Регулярно, чтобы вовремя заметить подозрительные транзакции",
                            "Только при получении выписки",
                            "Не нужно проверять"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что делать при обнаружении подозрительных транзакций?",
                        options: [
                            "Ничего не делать",
                            "Сразу связаться с банком и всё выяснить",
                            "Подождать несколько дней",
                            "Игнорировать их"
                        ],
                        correct: 1
                    }
                ]
            }
        }
    },
    3: {
        title: "Блок 3: Инвестиции",
        icon: "📈",
        overview: {
            title: "С чего начать знакомство с ИНВЕСТИЦИЯМИ",
            intro: "Давайте разберёмся, почему инвестирование важно. Кто в нём участвует, как это работает и зачем нам это нужно? Этот курс поможет вам понять основы и начать свой путь в инвестировании.",
            learningPoints: [
                "разберём, что представляет собой фондовый рынок",
                "изучим основы функционирования биржи",
                "познакомимся с различными видами ценных бумаг",
                "научимся принимать обоснованные решения при инвестировании"
            ],
            lessons: [
                {
                    id: 3.1,
                    title: "Что такое фондовый рынок?",
                    duration: "7 мин",
                    icon: "📊",
                    status: "available"
                },
                {
                    id: 3.2,
                    title: "Акции и облигации",
                    duration: "7 мин",
                    icon: "💹",
                    status: "available"
                },
                {
                    id: 3.3,
                    title: "Производные финансовые инструменты",
                    duration: "7 мин",
                    icon: "📉",
                    status: "available"
                },
                {
                    id: 3.4,
                    title: "Готовые решения",
                    duration: "10 мин",
                    icon: "🎯",
                    status: "available"
                },
                {
                    id: 3.5,
                    title: "Введение в инвестиции и рынок ценных бумаг",
                    duration: "10 мин",
                    icon: "📚",
                    status: "available"
                },
                {
                    id: 3.6,
                    title: "Способы инвестирования: выбираем брокера и управляющую компанию",
                    duration: "10 мин",
                    icon: "🤝",
                    status: "available"
                },
                {
                    id: 3.7,
                    title: "Облигации: дать деньги в долг и заработать",
                    duration: "8 мин",
                    icon: "📜",
                    status: "available"
                },
                {
                    id: 3.8,
                    title: "Акции: доли в бизнесе и как на них заработать",
                    duration: "8 мин",
                    icon: "📊",
                    status: "available"
                },
                {
                    id: 3.9,
                    title: "Паевые фонды: открытые и биржевые",
                    duration: "8 мин",
                    icon: "📦",
                    status: "available"
                }
            ]
        },
        lessons: {
            "3.1": {
                title: "Что такое фондовый рынок?",
                icon: "📊",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Добро пожаловать на курс «Знакомство с инвестициями»!</h3>
                </div>
                <p class="section-intro">Если вы когда-либо задумывались о том, как участвовать в финансовых рынках, этот курс предоставит вам ключевые знания для погружения в захватывающий мир инвестиций. Мы рассмотрим основные понятия, выясним, кто участвует в этом процессе и какова роль этих участников, а также изучим базовые финансовые инструменты и их уникальные особенности. Готовьтесь к увлекательному путешествию в мир возможностей и стратегий, открывающихся перед вами в сфере инвестиций.</p>
                <p>Мы только знакомимся с инвестированием, и на старте будет полезно разобраться в терминологии и понять, как устроен фондовый рынок. Разберём на примерах базовые понятия для начинающих инвесторов.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">👥</span>
                    <h3>Участники рынка</h3>
                </div>
                <p class="section-intro">Эмитенты являются ключевыми участниками рынка, ими могут быть как компании, так и государство. Они поставляют ценные бумаги на фондовый рынок, привлекая таким образом капитал. Для того, чтобы это сделать, они должны где-то встречаться с инвесторами и продавать им ценные бумаги. Таким местом встречи стали фондовые биржи и внебиржевые площадки.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Эмитент</h4>
                        <p style="text-align: left;"><strong>«Поставщик ценных бумаг на рынок»</strong></p>
                        <p style="text-align: left;">Компания или государство, которое выпускает ценные бумаги для привлечения капитала.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📄 Выпускает ценные бумаги</li>
                            <li>💰 Привлекает капитал</li>
                            <li>🤝 Встречается с инвесторами на бирже</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏛️</div>
                        <h4>Фондовая биржа</h4>
                        <p style="text-align: left;"><strong>Площадка для совершения сделок</strong></p>
                        <p style="text-align: left;">Сводит покупателей и продавцов, предоставляет им инфраструктуру.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Строгий порядок торгов</li>
                            <li>📋 Все операции фиксируются</li>
                            <li>🔍 Прозрачность сделок</li>
                            <li>🛡️ Защита участников</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Регистратор и депозитарий</h3>
                </div>
                <p class="section-intro">Для обеспечения порядка на рынке работают специализированные организации: регистратор ведёт реестры владельцев ценных бумаг, а депозитарий хранит и учитывает активы.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📝</div>
                        <h4>Регистратор</h4>
                        <p style="text-align: left;"><strong>Ведёт реестр владельцев ценных бумаг</strong></p>
                        <p style="text-align: left;">Профессиональный участник рынка, ведущий реестр на основании договора с компанией-эмитентом.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📊 Ведёт лицевые счета акционеров</li>
                            <li>📧 Сообщает важные новости</li>
                            <li>💰 Начисляет дивиденды</li>
                            <li>✅ Учитывает количество ценных бумаг у каждого владельца</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Депозитарий</h4>
                        <p style="text-align: left;"><strong>Хранит и учитывает активы</strong></p>
                        <p style="text-align: left;">Компания, которая ведет учёт и отслеживает переход прав на ценные бумаги на основании договора о депозитарном обслуживании.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💼 Хранит ценные бумаги</li>
                            <li>📊 Ведёт учёт активов</li>
                            <li>🔄 Отслеживает переход прав</li>
                            <li>✅ Гарантирует принадлежность бумаг при сделках</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚖️</span>
                    <h3>Регулятор</h3>
                </div>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>🛡️ Регулятор</strong> — организация, которая следит за тем, чтобы на фондовой бирже всё происходило законно.</p>
                    <p style="margin-top: 15px;">При колоссальном количестве операций в секунду на рынке кто-то должен следить за отсутствием сбоев и соблюдением законодательства. На российском рынке эту функцию выполняет <strong>Банк России</strong>.</p>
                    <ul style="margin-top: 15px;">
                        <li>✅ Обеспечивает безопасность всех участников торгов</li>
                        <li>👁️ Следит за ходом торговли</li>
                        <li>📜 Задаёт правила ведения дел</li>
                        <li>📋 Выдаёт профессиональным участникам рынка соответствующие лицензии</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏛️</span>
                    <h3>Основные биржи</h3>
                </div>
                <p class="section-intro">В России основными биржами считаются Московская биржа и Санкт-Петербургская международная товарно-сырьевая биржа.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Московская биржа</h4>
                        <p style="text-align: left;">На ней можно купить:</p>
                        <ul style="text-align: left;">
                            <li>📄 Ценные бумаги</li>
                            <li>💱 Валюту</li>
                            <li>📉 Производные финансовые инструменты (фьючерсы и опционы)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🛢️</div>
                        <h4>Санкт-Петербургская биржа</h4>
                        <p style="text-align: left;">На ней торгуют:</p>
                        <ul style="text-align: left;">
                            <li>🛢️ Сырьём</li>
                            <li>📉 Производными финансовыми инструментами</li>
                            <li>🌾 Сельскохозяйственной продукцией</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Ценные бумаги и их выпуск</h3>
                </div>
                <p class="section-intro">Ценные бумаги выпускают, чтобы привлечь деньги. Перед выпуском эмитент оценивает, сколько денег ему нужно и в какой форме он готов их привлечь.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📜</div>
                        <h4>Облигации</h4>
                        <p style="text-align: left;"><strong>Привлечение денег в долг</strong></p>
                        <p style="text-align: left;">Компания или государство занимает деньги, выпустив облигации:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Инвестор даёт деньги в долг</li>
                            <li>💵 Регулярно получает проценты (купон)</li>
                            <li>📅 Через срок получает всю сумму обратно</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Акции</h4>
                        <p style="text-align: left;"><strong>Привлечение денег через продажу доли</strong></p>
                        <p style="text-align: left;">Компания разделяет капитал на доли и продаёт их инвесторам:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🏢 Инвестор становится совладельцем</li>
                            <li>💰 Получает право на часть прибыли (дивиденды)</li>
                            <li>📈 Может заработать на росте стоимости</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>📋 Процесс выпуска ценных бумаг:</strong></p>
                    <ol style="margin-top: 15px; padding-left: 20px;">
                        <li><strong>Оценка:</strong> Компания определяет параметры (количество, номинал, срок действия)</li>
                        <li><strong>Регистрация:</strong> Происходит государственная регистрация выпуска</li>
                        <li><strong>Учёт:</strong> В специализированном реестре делают запись</li>
                        <li><strong>Размещение:</strong> Ценные бумаги размещают на бирже для покупки инвесторами</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤝</span>
                    <h3>Брокеры и управляющие компании</h3>
                </div>
                <p class="section-intro">Когда продавец и покупатель готовы, в дело вступает помощник в совершении сделок. Посредник, который помогает продавцу и покупателю встретиться и совершить сделки — это брокер или управляющая компания.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Брокер</h4>
                        <p style="text-align: left;"><strong>Посредник между инвестором и биржей</strong></p>
                        <p style="text-align: left;">Чаще всего эту функцию выполняют банки и брокерские компании.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Помогает совершать сделки</li>
                            <li>✅ Выполняет ваши поручения</li>
                            <li>⚠️ Вы принимаете все решения сами</li>
                            <li>⚠️ Брокер не несёт ответственности за рискованные сделки</li>
                        </ul>
                        <p style="text-align: left; margin-top: 15px; font-size: 0.9em; color: #6c757d;"><em>Работая с брокером, нужно самостоятельно принимать решения о том, что и когда покупать или продавать.</em></p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Управляющая компания</h4>
                        <p style="text-align: left;"><strong>Профессиональное управление капиталом</strong></p>
                        <p style="text-align: left;">Организация, которой вы доверяете управление своим капиталом по заранее оговорённой стратегии.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Принимает решения за вас</li>
                            <li>✅ Профессиональное управление</li>
                            <li>✅ Подходит для новичков</li>
                            <li>✅ Использует готовые стратегии</li>
                        </ul>
                        <p style="text-align: left; margin-top: 15px; font-size: 0.9em; color: #6c757d;"><em>Если у вас мало опыта и вы не уверены в своих решениях, управляющая компания поможет определиться с выбором бумаг.</em></p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Выводы</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🎲</span>
                                <strong>Торговля на бирже</strong> — это не казино и не лотерея, а непростая работа, требующая знаний и опыта.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛡️</span>
                                <strong>Для начинающих:</strong> Выбирайте самую консервативную стратегию, которая при коррекции рынка убережёт вас от крупных финансовых потерь.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Когда становиться инвестором:</strong> Если у вас есть свободные средства и вы хотите попробовать извлечь из них больше выгоды.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь вы знаете, как устроен фондовый рынок!</p>
                </div>
            </div>
        `,
                practice: {
                    game: {
                        title: "Игра: Участники фондового рынка",
                        icon: "🎮",
                        description: "Проверь свои знания об участниках фондового рынка и их ролях.",
                        situations: [
                            {
                                text: "Компания хочет привлечь деньги для развития бизнеса. Она выпускает ценные бумаги и размещает их на бирже. Кто является эмитентом в этой ситуации?",
                                options: [
                                    { text: "Инвестор, который покупает ценные бумаги", icon: "👤", correct: false },
                                    { text: "Компания, которая выпускает ценные бумаги", icon: "🏢", correct: true },
                                    { text: "Брокер, который помогает совершать сделки", icon: "💼", correct: false }
                                ]
                            },
                            {
                                text: "Инвестор хочет купить акции компании. Где он может это сделать?",
                                options: [
                                    { text: "В обычном магазине", icon: "🛒", correct: false },
                                    { text: "На фондовой бирже через брокера", icon: "📊", correct: true },
                                    { text: "В банке напрямую", icon: "🏦", correct: false }
                                ]
                            },
                            {
                                text: "Кто ведёт реестр владельцев ценных бумаг и начисляет дивиденды?",
                                options: [
                                    { text: "Брокер", icon: "💼", correct: false },
                                    { text: "Регистратор", icon: "📝", correct: true },
                                    { text: "Эмитент", icon: "🏢", correct: false }
                                ]
                            },
                            {
                                text: "Инвестор хочет, чтобы профессионалы управляли его капиталом. К кому ему обратиться?",
                                options: [
                                    { text: "К брокеру (он сам принимает решения)", icon: "💼", correct: false },
                                    { text: "К управляющей компании (она управляет капиталом)", icon: "🏢", correct: true },
                                    { text: "К эмитенту", icon: "📊", correct: false }
                                ]
                            }
                        ]
                    }
                },
                finalTest: [
                    {
                        question: "Что такое эмитент?",
                        options: [
                            "Покупатель ценных бумаг",
                            "Поставщик ценных бумаг на рынок (компания или государство)",
                            "Только банк",
                            "Только физическое лицо"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое фондовая биржа?",
                        options: [
                            "Место для покупки товаров",
                            "Площадка для совершения сделок на рынке, которая сводит покупателей и продавцов",
                            "Только банк",
                            "Только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что делает регистратор?",
                        options: [
                            "Покупает ценные бумаги",
                            "Ведёт реестр владельцев ценных бумаг",
                            "Только торгует на бирже",
                            "Только выдаёт кредиты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что делает депозитарий?",
                        options: [
                            "Выпускает ценные бумаги",
                            "Ведёт учёт и отслеживает переход прав на ценные бумаги, хранит активы",
                            "Только торгует на бирже",
                            "Только выдаёт кредиты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Кто такой брокер?",
                        options: [
                            "Эмитент ценных бумаг",
                            "Посредник, который помогает продавцу и покупателю встретиться и совершить сделки",
                            "Только банк",
                            "Только регулятор"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое управляющая компания?",
                        options: [
                            "Брокер",
                            "Организация, которой вы доверяете управление своим капиталом по заранее оговорённой стратегии",
                            "Только банк",
                            "Только биржа"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.2": {
                title: "Акции и облигации",
                icon: "💹",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💹</span>
                    <h3>Акции и облигации</h3>
                </div>
                <p class="section-intro">Продолжаем знакомиться с миром инвестиций. В предыдущем уроке мы разобрали устройство фондового рынка и его ключевых участников. Теперь разберём, чем акции отличаются от облигаций.</p>
                <p>Наверняка каждому из вас хорошо известно, что инвестиция — это вложение денежных средств с целью получения прибыли. Получение прибыли зависит от того, вырастет стоимость выбранного финансового инструмента или нет. Таких инструментов на рынке большое множество, и у каждого из них есть свои особенности. Рассмотрим самые популярные.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Акции</h3>
                </div>
                <p class="section-intro">Один из самых востребованных финансовых инструментов на бирже.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Что такое акция?</h4>
                        <p style="text-align: left;"><strong>Долевая ценная бумага</strong></p>
                        <p style="text-align: left;">Позволяет приобрести часть компании и стать её совладельцем (акционером).</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Получение дивидендов (выплата с чистой прибыли)</li>
                            <li>📈 Доход от роста стоимости акции</li>
                            <li>🏢 Право участвовать в управлении компанией</li>
                            <li>💼 Совладение бизнесом</li>
                        </ul>
                    </div>
                    
                    <div class="income-card" style="background: #fff3cd; border: 2px solid #ffc107;">
                        <div class="income-icon">⚠️</div>
                        <h4>Важно знать</h4>
                        <p style="text-align: left;"><strong>Не все компании выплачивают дивиденды!</strong></p>
                        <p style="text-align: left;">Компании могут отдать предпочтение не выплате дивидендов, а собственному развитию. Дивидендная политика может меняться в зависимости от финансовых результатов и стратегии развития компании.</p>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>💡 Пример инвестирования в акции</strong></p>
                    <p style="margin-top: 15px;">Представьте, что в <strong>2000 году</strong> одна акция крупной компании стоила всего <strong>1 монетка</strong>.</p>
                    <p>Сегодня такая акция стоит уже около <strong>300 монеток</strong>. Помимо этого, компания выплачивает дивиденды, около <strong>6%</strong> от стоимости одной акции (например, <strong>18,7 монетля</strong> с одной акции).</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📊 Результат инвестирования:</strong></p>
                        <ul style="margin-top: 10px;">
                            <li>💵 Инвестиция в 2000 году: <strong>10 000 монеток</strong></li>
                            <li>📈 Стоимость портфеля через 20 лет: <strong>3 млн монеток</strong></li>
                            <li>💰 Дивидендная выплата за год: <strong>187 000 монеток</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Облигации</h3>
                </div>
                <p class="section-intro"><strong>Долговые ценные бумаги.</strong> Покупая облигацию, мы даём компании в долг.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📜</div>
                        <h4>Как работают облигации?</h4>
                        <p style="text-align: left;"><strong>Долговое обязательство с фиксированным доходом</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📅 У долга есть <strong>срок</strong> (дата погашения)</li>
                            <li>💵 Регулярная процентная выплата — <strong>купон</strong></li>
                            <li>💰 Возврат <strong>номинала</strong> при погашении</li>
                            <li>📈 Возможность продать досрочно</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Пример облигации</h4>
                        <p style="text-align: left;"><strong>Облигация крупного банка:</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Номинал: <strong>1 000 монеток</strong></li>
                            <li>📅 Дата погашения: определена заранее</li>
                            <li>💰 Размер купона: <strong>7,2% годовых</strong></li>
                            <li>📆 Периодичность выплаты: <strong>каждые 6 месяцев</strong></li>
                            <li>⚠️ Стоимость на рынке может меняться</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⚠️ Обратите внимание:</strong> стоимость облигации может измениться как в большую, так в меньшую сторону. Основной фактор, влияющий на стоимость облигаций — <strong>ключевая ставка</strong>.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📈 Если ключевая ставка растёт:</strong></p>
                        <p>Стоимость облигации <strong>падает</strong>, так как на рынке появляются облигации с бóльшим размером купонных выплат.</p>
                        
                        <p style="margin-top: 15px;"><strong>📉 Если ключевая ставка падает:</strong></p>
                        <p>Стоимость <strong>растёт</strong>, так как облигация, выпущенная в период высокой ключевой ставки, более выгодна относительно свежих выпусков.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Выводы</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Выбор ценных бумаг индивидуален</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <p style="margin-bottom: 15px;">Выбор зависит от многих факторов:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                Как вы относитесь к <strong>риску</strong>
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🎯</span>
                                Какая у вас <strong>инвестиционная цель</strong>
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📅</span>
                                Какой <strong>горизонт инвестирования</strong>
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                Размер <strong>инвестируемой суммы</strong>
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь вы знаете, чем отличаются акции от облигаций!</p>
                </div>
            </div>
        `,
                practice: {
                    game: {
                        title: "Игра: Акции и облигации",
                        icon: "🎮",
                        description: "Проверь свои знания об акциях и облигациях. Выбери правильный финансовый инструмент для каждой ситуации.",
                        situations: [
                            {
                                text: "Инвестор хочет стать совладельцем компании и получать часть прибыли. Какой инструмент ему подходит?",
                                options: [
                                    { text: "Облигация (долговое обязательство)", icon: "📜", correct: false },
                                    { text: "Акция (долевая ценная бумага)", icon: "📊", correct: true },
                                    { text: "Депозит в банке", icon: "🏦", correct: false }
                                ]
                            },
                            {
                                text: "Инвестор хочет получать регулярные фиксированные выплаты с минимальным риском. Что ему выбрать?",
                                options: [
                                    { text: "Акции (рискованные, но могут принести большой доход)", icon: "📈", correct: false },
                                    { text: "Облигации (фиксированный купон, меньший риск)", icon: "📜", correct: true },
                                    { text: "Криптовалюты", icon: "₿", correct: false }
                                ]
                            },
                            {
                                text: "Компания выплачивает часть прибыли своим владельцам. Как называется эта выплата?",
                                options: [
                                    { text: "Купон", icon: "💵", correct: false },
                                    { text: "Дивиденд", icon: "💰", correct: true },
                                    { text: "Процент", icon: "📊", correct: false }
                                ]
                            },
                            {
                                text: "Инвестор купил облигацию на 1000 монеток с купоном 7% годовых. Сколько он получит за год?",
                                options: [
                                    { text: "70 монеток (7% от 1000)", icon: "💰", correct: true },
                                    { text: "100 монеток", icon: "💵", correct: false },
                                    { text: "7 монеток", icon: "📊", correct: false }
                                ]
                            }
                        ]
                    }
                },
        finalTest: [
            {
                        question: "Что такое акция?",
                        options: [
                            "Долговое обязательство",
                            "Долевая ценная бумага, позволяющая стать совладельцем компании",
                            "Только для банков",
                            "Только для государства"
                ],
                correct: 1
            },
            {
                        question: "Что такое дивиденды?",
                options: [
                            "Процент по облигации",
                            "Выплата с чистой прибыли компании акционерам",
                            "Только для банков",
                            "Только для государства"
                ],
                correct: 1
            },
            {
                        question: "Что такое облигация?",
                options: [
                            "Доля в компании",
                            "Долговая ценная бумага, по которой инвестор получает фиксированный купон",
                            "Только для физических лиц",
                            "Только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое купон по облигации?",
                options: [
                            "Дивиденд",
                            "Процентная выплата от размера долга, которую компания регулярно выплачивает",
                            "Только номинал",
                            "Только цена продажи"
                ],
                correct: 1
            },
            {
                        question: "Что влияет на стоимость облигации?",
                options: [
                            "Только дивиденды",
                            "Основной фактор — ключевая ставка",
                            "Только цена акций",
                            "Только курс валюты"
                ],
                correct: 1
            },
            {
                        question: "Все ли компании выплачивают дивиденды?",
                options: [
                            "Да, все компании обязаны выплачивать дивиденды",
                            "Нет, не все компании выплачивают дивиденды, некоторые предпочитают вкладывать прибыль в развитие",
                            "Только банки",
                            "Только государственные компании"
                ],
                correct: 1
            }
        ]
            },
            "3.3": {
                title: "Производные финансовые инструменты",
                icon: "📉",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📉</span>
                    <h3>Производные финансовые инструменты</h3>
                </div>
                <p class="section-intro">Продолжаем наше знакомство с миром инвестиций рассказом о производных финансовых инструментах или деривативах, как их ещё называют.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔗</span>
                    <h3>Деривативы</h3>
                </div>
                <p class="section-intro">В переводе с английского дериватив означает «производный», то есть что-то вторичное.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6c757d;">
                    <p><strong>📋 Что такое дериватив?</strong></p>
                    <p style="margin-top: 15px;">По сути, это <strong>контракт между покупателем и продавцом</strong>, цена на который привязывается к определённой рыночной величине. Дериватив зависит от цен на другие активы (золото, акции, валюта и т. д.).</p>
                    <p style="margin-top: 15px;"><strong>Базовый актив</strong> — это актив, от цены которого зависит стоимость дериватива. Поэтому всегда используется словосочетание «производный инструмент на XXX актив».</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📜</span>
                    <h3>Как появились деривативы</h3>
                </div>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>🌾 История: Рисовый рынок Осаки</strong></p>
                    <p style="margin-top: 15px;">Один из первых примеров деривативов связан с рисовым рынком города Осака. Землевладельцев не устраивали колебания цены на рис из-за непредсказуемой погоды. Они стали доставлять рис для хранения на городские склады заранее и продавать складские расписки, которые давали владельцу право на покупку риса в определённую будущую дату по установленной заранее цене.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>✅ Результат:</strong></p>
                        <ul style="margin-top: 10px;">
                            <li>💰 Землевладельцы получали стабильный доход</li>
                            <li>📦 Торговцы получали гарантированные поставки риса</li>
                            <li>💵 Торговцы могли извлечь прибыль с продажи расписок</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>📊 Базовые активы в наши дни:</strong></p>
                    <p style="margin-top: 15px;">В наши дни базовым активом по-прежнему в основном является товарно-сырьевая продукция, однако базовым активом также могут быть практически любые финансовые инструменты:</p>
                    <ul style="margin-top: 10px;">
                        <li>🛢️ Товарно-сырьевая продукция (нефть, газ, металлы)</li>
                        <li>📜 Долговые инструменты (облигации)</li>
                        <li>💱 Процентные ставки</li>
                        <li>📈 Фондовые индексы</li>
                        <li>💵 Валюты</li>
                        <li>🔗 Другие деривативы</li>
                    </ul>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card" style="background: #fff3cd; border: 2px solid #ffc107;">
                        <div class="income-icon">⚠️</div>
                        <h4>Особенности деривативов</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🔗 Дериватив не может существовать сам по себе</li>
                            <li>💰 Его стоимость привязана к базовому активу</li>
                            <li>📊 Владелец дериватива может не владеть базовым активом</li>
                        </ul>
                    </div>
                </div>
                
                <p style="margin-top: 20px; text-align: center; font-size: 1.1em; font-weight: bold;">Два самых популярных вида деривативов — это <strong>фьючерсы</strong> и <strong>опционы</strong></p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📅</span>
                    <h3>Фьючерсы</h3>
                </div>
                <p class="section-intro"><strong>Фьючерс</strong> — это контракт на поставку определённого количества товара через определённый период.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📦</div>
                        <h4>Поставочный фьючерс</h4>
                        <p style="text-align: left;"><strong>Контракт с поставкой товара</strong></p>
                        <p style="text-align: left;">По которому осуществляется реальная поставка товара при наступлении срока контракта.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Реальная поставка товара</li>
                            <li>📦 Товар физически передаётся</li>
                            <li>🏭 Подходит для производителей</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Расчётный фьючерс</h4>
                        <p style="text-align: left;"><strong>Контракт с денежными расчётами</strong></p>
                        <p style="text-align: left;">По которому начисляется или списывается сумма в зависимости от изменения цены базового актива.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Только денежные расчёты</li>
                            <li>📊 Зависит от изменения цены</li>
                            <li>🎯 Подходит для спекуляций</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚙️</span>
                    <h3>Опционы</h3>
                </div>
                <p class="section-intro"><strong>Опцион</strong> — это договор, дающий право (но не обязательство) купить или продать базовый актив по заранее определённой цене и в определённый момент времени.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Опцион колл</h4>
                        <p style="text-align: left;"><strong>Право купить актив</strong></p>
                        <p style="text-align: left;">Договор, дающий право купить базовый актив в будущем по определённой цене.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Право купить актив</li>
                            <li>❌ Можно отказаться, если цена не устраивает</li>
                            <li>📈 Используется при ожидании роста цены</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📉</div>
                        <h4>Опцион пут</h4>
                        <p style="text-align: left;"><strong>Право продать актив</strong></p>
                        <p style="text-align: left;">Договор, дающий право продать базовый актив в будущем по определённой цене.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Право продать актив</li>
                            <li>⚠️ Продавец не может отказаться</li>
                            <li>📉 Используется при ожидании падения цены</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #ffe6e6; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <p><strong>⚠️ Важное отличие:</strong></p>
                    <p style="margin-top: 15px;"><strong>Покупатель опциона</strong> может отказаться от исполнения, если цена на базовый актив его не устраивает. <strong>Продавец опциона</strong>, в отличие от покупателя, не имеет права отказаться от исполнения договора.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Выводы</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛡️</span>
                                <strong>Цель создания:</strong> Изначально производные финансовые инструменты (ПФИ) были созданы для того, чтобы снизить риски производителей от колебания цен.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💼</span>
                                <strong>Для частных инвесторов:</strong> Они могут пригодиться, если нужно заранее зафиксировать цены на покупку или продажу акций, валюты или драгоценных металлов.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛢️</span>
                                <strong>Доступ к активам:</strong> С помощью ПФИ можно заработать на активах, которые обычный инвестор не может приобрести напрямую — например, нефть.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь вы знаете, что такое производные финансовые инструменты!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое дериватив?",
                        options: [
                            "Основная ценная бумага",
                            "Производный финансовый инструмент, контракт, цена которого привязана к базовому активу",
                            "Только акция",
                            "Только облигация"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое базовый актив?",
                        options: [
                            "Только акции",
                            "Актив, от цены которого зависит стоимость дериватива (золото, акции, валюта и т.д.)",
                            "Только облигации",
                            "Только депозиты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое фьючерс?",
                        options: [
                            "Акция компании",
                            "Контракт на поставку определённого количества товара через определённый период",
                            "Облигация",
                            "Депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем отличается поставочный фьючерс от расчётного?",
                        options: [
                            "Нет разницы",
                            "Поставочный предусматривает поставку товара, расчётный — только денежные расчёты в зависимости от изменения цены",
                            "Поставочный только для акций",
                            "Расчётный только для облигаций"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое опцион?",
                        options: [
                            "Обязательство купить актив",
                            "Договор, дающий право купить или продать базовый актив по заранее определённой цене",
                            "Только акция",
                            "Только облигация"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем опцион колл отличается от опциона пут?",
                        options: [
                            "Нет разницы",
                            "Колл даёт право купить актив, пут — право продать актив",
                            "Колл только для акций",
                            "Пут только для облигаций"
                        ],
                        correct: 1
                    },
                    {
                        question: "Для чего изначально были созданы производные финансовые инструменты?",
                        options: [
                            "Только для спекуляций",
                            "Для снижения рисков производителей от колебания цен",
                            "Только для банков",
                            "Только для государства"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.4": {
                title: "Готовые решения",
                icon: "🎯",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Готовые инвестиционные решения</h3>
                </div>
                <p class="section-intro">В завершение расскажем о готовых инвестиционных решениях. Готовые инвестиционные решения подойдут вам, если у вас нет специализированного образования или нет времени следить за изменениями на инвестиционном рынке.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>📋 Что такое готовые решения?</strong></p>
                    <p style="margin-top: 15px;">Готовые инвестиционные решения предоставляют управляющие компании и брокеры, а вы выбираете, какие подходят именно вам.</p>
                    <p style="margin-top: 15px;"><strong>Виды готовых решений:</strong></p>
                    <div class="income-cards" style="margin-top: 15px;">
                        <div class="income-card" style="flex: 1; min-width: 120px;">
                            <div class="income-icon">📊</div>
                            <h5>ПИФы</h5>
                        </div>
                        <div class="income-card" style="flex: 1; min-width: 120px;">
                            <div class="income-icon">📈</div>
                            <h5>БПИФы</h5>
                        </div>
                        <div class="income-card" style="flex: 1; min-width: 120px;">
                            <div class="income-icon">💼</div>
                            <h5>ИИС</h5>
                        </div>
                        <div class="income-card" style="flex: 1; min-width: 120px;">
                            <div class="income-icon">🤝</div>
                            <h5>ДУ</h5>
                        </div>
                        <div class="income-card" style="flex: 1; min-width: 120px;">
                            <div class="income-icon">📦</div>
                            <h5>Структурные продукты</h5>
                        </div>
                    </div>
                </div>
                
                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно:</strong> Чтобы определиться с выбором, нужно знать, какие свойства имеет готовое инвестиционное решение, каких финансовых целей оно поможет вам достичь и в какие сроки.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Паевые инвестиционные фонды или ПИФы</h3>
                </div>
                <p class="section-intro">Они бывают открытые, биржевые и закрытые. Самые популярные и доступные — открытые.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6c757d;">
                    <p><strong>🔄 Как работают ПИФы:</strong></p>
                    <ol style="margin-top: 15px; padding-left: 20px;">
                        <li>💰 Деньги инвесторов собираются внутри фонда</li>
                        <li>📊 На них покупаются ценные бумаги</li>
                        <li>👨‍💼 Портфельный управляющий анализирует рынок</li>
                        <li>📈 Покупает или продаёт ценные бумаги по стратегии</li>
                    </ol>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">👤</div>
                        <h4>Пайщик</h4>
                        <p style="text-align: left;"><strong>Инвестор ПИФа</strong></p>
                        <p style="text-align: left;">То есть держатель пая — ценной бумаги, которая удостоверяет право на долю в фонде.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Гарантия выкупа доли фондом</li>
                            <li>📅 Выкуп в оговорённый срок</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Бенчмарк</h4>
                        <p style="text-align: left;"><strong>Ориентир для управляющих</strong></p>
                        <p style="text-align: left;">Индекс, который показывает, как меняется стоимость ценных бумаг в различных секторах экономики.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📊 Например: индекс Мосбиржи</li>
                            <li>📈 Если фонд растёт быстрее бенчмарка — управляющий сработал хорошо</li>
                            <li>📉 Если медленнее — плохо</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>💡 Преимущество ПИФов:</strong></p>
                    <p style="margin-top: 15px;">Покупая одну акцию, вы получаете акцию только одной компании. Когда вы покупаете пай, вы приобретаете долю в акциях сразу множества компаний. Это позволяет вам <strong>автоматически диверсифицировать портфель</strong>.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Биржевые ПИФы или БПИФы</h3>
                </div>
                <p class="section-intro">Довольно часто бенчмарком является индекс, который напрямую купить нельзя, потому что индексы рассчитываются не в монетлях или долларах, а в пунктах. Это нужно, чтобы показать динамику стоимости активов. А чтобы инвестор мог повторять эту динамику, существуют индексные фонды. В России их называют биржевые паевые фонды, или БПИФ.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📦</div>
                        <h4>Что такое БПИФ?</h4>
                        <p style="text-align: left;"><strong>Инвестиционные фонды</strong></p>
                        <p style="text-align: left;">Инвестируют деньги сразу в активы, находящиеся внутри индекса.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Инструменты отобраны по принципу индекса</li>
                            <li>📊 Зависит от изменения индекса</li>
                            <li>🛒 Покупка на бирже как акции</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌍</div>
                        <h4>Виды индексов</h4>
                        <p style="text-align: left;"><strong>Глобальные и секторные</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🌐 Глобальные (Мосбиржи, S&P 500)</li>
                            <li>💻 Секторные (IT-сектор, нефть, газ)</li>
                            <li>🏭 По странам (Россия, США, Китай)</li>
                            <li>🥇 По типам активов (драгоценные металлы)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏠</span>
                    <h3>Закрытые ПИФы или ЗПИФы</h3>
                </div>
                <p class="section-intro">Закрытые паевые фонды создаются, как правило, для инвестирования в объекты недвижимости (жилой или коммерческой).</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Как работает ЗПИФ</h4>
                        <p style="text-align: left;"><strong>Инвестирование в недвижимость</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🏠 Пайщики становятся совладельцами объекта</li>
                            <li>📈 Рост стоимости объекта = рост стоимости пая</li>
                            <li>💰 Регулярные платежи от аренды</li>
                        </ul>
                    </div>
                    
                    <div class="income-card" style="background: #fff3cd; border: 2px solid #ffc107;">
                        <div class="income-icon">⚠️</div>
                        <h4>Особенности ЗПИФ</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📅 Период покупки паёв определён заранее</li>
                            <li>📅 Конкретная дата погашения</li>
                            <li>🔄 Можно продать на вторичном рынке досрочно</li>
                            <li>❌ Паи нельзя обменивать</li>
                            <li>💰 Периодические выплаты возможны</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤝</span>
                    <h3>Доверительное управление или ДУ</h3>
                </div>
                <p class="section-intro">Доверительное управление — это услуга, при которой вы передаёте управление своими средствами профессионалу.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🤝</div>
                        <h4>Преимущества ДУ</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Индивидуальные договоры</li>
                            <li>✅ Учёт всех пожеланий инвестора</li>
                            <li>✅ Инвестирование в иностранной валюте</li>
                            <li>✅ Регулярные выплаты (купоны и дивиденды)</li>
                            <li>✅ Профессиональное управление</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Индивидуальный инвестиционный счёт или ИИС</h3>
                </div>
                <p class="section-intro">Индивидуальный инвестиционный счёт позволяет получать доходы не только от вложения в ценные бумаги, но и за счёт налоговых вычетов.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>У брокера</h4>
                        <p style="text-align: left;"><strong>Самостоятельное инвестирование</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Инвестирование в отдельные ценные бумаги</li>
                            <li>✅ Выбор инструментов самим инвестором</li>
                            <li>✅ Готовые идеи от аналитиков</li>
                            <li>📊 Как правило, паи БПИФ</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>У управляющей компании</h4>
                        <p style="text-align: left;"><strong>Профессиональное управление</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Передача средств управляющему</li>
                            <li>✅ Действие по определённой стратегии</li>
                            <li>✅ УК приобретает паи ОПИФ или БПИФ</li>
                            <li>👨‍💼 Профессиональное управление</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>💰 Налоговые льготы ИИС:</strong></p>
                    <ul style="margin-top: 15px;">
                        <li>✅ Налоговый вычет на сумму взноса</li>
                        <li>✅ Освобождение от налогообложения дохода от инвестиций</li>
                        <li>🆕 С 1 января 2024 года: два типа льгот одновременно (ИИС-3)</li>
                    </ul>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>🆕 ИИС-3 — новый тип счёта</strong></p>
                    <p style="margin-top: 15px;">Новый тип индивидуального инвестиционного счёта, который заменит ИИС-1 (тип А) и ИИС-2 (тип Б).</p>
                    <ul style="margin-top: 15px;">
                        <li>✅ Переход необязателен</li>
                        <li>✅ Принудительного перевода нет</li>
                        <li>✅ Переход по заявлению (если ИИС открыт в 2023 или ранее)</li>
                        <li>✅ Срок владения сохранится (если не превышает 3 года)</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Особенности ИИС-3</h3>
                </div>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p class="myth-busting"><strong>⚠️ Важно:</strong> С 2024 года можно будет открыть только ИИС-3, при этом ИИС-1 и ИИС-2 продолжат действовать на прежних условиях, если они были открыты ранее.</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6c757d;">
                    <p><strong>📅 Пример перехода на ИИС-3:</strong></p>
                    <p style="margin-top: 15px;">Клиент открыл ИИС с типом вычета А в <strong>2019 году</strong>. В 2024 году срок владения ИИС-1 составит <strong>5 лет</strong>. Если инвестор решит перейти на ИИС-3, будет зачтён срок не более <strong>3 лет</strong>, то есть закрыть ИИС-3 и не потерять налоговые вычеты клиент сможет в <strong>2026 году</strong>.</p>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Несколько счетов ИИС</h4>
                        <p style="text-align: left;"><strong>Новый закон</strong></p>
                        <p style="text-align: left;">Можно одновременно иметь до <strong>трёх счетов ИИС</strong>, но только если у инвестора нет действующих договоров ИИС первых двух типов.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Можно у одного брокера</li>
                            <li>✅ Можно у разных брокеров</li>
                            <li>⚠️ Только если нет ИИС-1 и ИИС-2</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>🔄 Основные отличия ИИС-3 от старых:</strong></p>
                    <ul style="margin-top: 15px;">
                        <li>📅 <strong>Минимальный срок:</strong> 5 лет (затем увеличивается в зависимости от года открытия)</li>
                        <li>🎯 <strong>Цель:</strong> Формирование долгосрочных сбережений и приток инвестиций</li>
                        <li>💰 <strong>Стимул:</strong> Государство стимулирует дольше инвестировать</li>
                        <li>⚠️ <strong>Риск:</strong> При досрочном закрытии — вернуть вычет и заплатить налоги</li>
                    </ul>
                </div>
                
                <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <p><strong>✅ Комбинированный налоговый вычет:</strong></p>
                    <p style="margin-top: 15px;">ИИС-3 фактически объединяет льготы двух предыдущих типов счетов:</p>
                    <ul style="margin-top: 15px;">
                        <li>💰 <strong>Тип А:</strong> Налоговый вычет с ежегодно вносимой суммы</li>
                        <li>📈 <strong>Тип Б:</strong> Налоговый вычет с инвестиционного дохода (при владении более 5 лет)</li>
                        <li>💵 <strong>Лимит:</strong> До 30 млн монеток по всем счетам ИИС-3 суммарно</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Типы налоговых вычетов по ИИС</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card" style="background: #d4edda; border: 2px solid #28a745;">
                        <div class="income-icon">💰</div>
                        <h4>ИИС типа А</h4>
                        <p style="text-align: left;"><strong>Возврат НДФЛ с суммы взноса</strong></p>
                        <p style="text-align: left; margin-top: 10px;"><strong>13%</strong> от внесённых сумм</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Максимум: <strong>52 000 монеток</strong> в год</li>
                            <li>✅ Для максимума: внести <strong>400 000 монеток</strong> за год</li>
                            <li>✅ Можно получать каждый год</li>
                            <li>✅ Даже в декабре считается за целый год</li>
                            <li>⚠️ Минимальный срок: 3 года</li>
                            <li>⚠️ При досрочном закрытии — вернуть вычет</li>
                        </ul>
                        <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 15px;">
                            <p style="font-size: 0.9em; margin: 0;"><strong>💡 Нюансы:</strong></p>
                            <ul style="font-size: 0.85em; margin-top: 5px; padding-left: 20px;">
                                <li>Подать заявление можно в течение 3 лет с момента уплаты НДФЛ</li>
                                <li>При закрытии через 3 года можно перевести бумаги на брокерский счёт</li>
                                <li>13% рассчитываются только от внесённых средств (не от дохода)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="income-card" style="background: #d1ecf1; border: 2px solid #17a2b8;">
                        <div class="income-icon">📈</div>
                        <h4>ИИС типа Б</h4>
                        <p style="text-align: left;"><strong>Освобождение от налога с дохода</strong></p>
                        <p style="text-align: left; margin-top: 10px;">Не платить <strong>13%</strong> с прибыли от операций</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Лимит отсутствует</li>
                            <li>✅ Максимум взноса: <strong>1 млн монеток</strong> в год</li>
                            <li>✅ Максимальный вычет: <strong>130 000 монеток</strong> в год</li>
                            <li>⚠️ Не распространяется на дивиденды и купоны</li>
                            <li>⚠️ Только при закрытии ИИС (через 3+ года)</li>
                            <li>📅 Минимальный срок: 3 года</li>
                        </ul>
                        <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 15px;">
                            <p style="font-size: 0.9em; margin: 0;"><strong>💡 Важно:</strong></p>
                            <p style="font-size: 0.85em; margin-top: 5px;">Вычет можно получить только при закрытии ИИС — не ранее, чем через три года с момента его открытия.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🥇</span>
                    <h3>Обезличенный металлический счёт или ОМС</h3>
                </div>
                <p class="section-intro">Ещё один популярный способ инвестирования — покупка драгоценных металлов с помощью обезличенных металлических счетов.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🥇</div>
                        <h4>Как работает ОМС</h4>
                        <p style="text-align: left;"><strong>Виртуальная покупка металла</strong></p>
                        <p style="text-align: left;">Инвестор покупает металл виртуально, а купленные граммы зачисляются на металлический счёт в банке.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Покупка золота, серебра, платины, палладия</li>
                            <li>✅ Виртуальное хранение (не нужно физически хранить)</li>
                            <li>✅ Учёт в граммах на счёте в банке</li>
                            <li>✅ Защита от инфляции</li>
                            <li>✅ Долгосрочное вложение</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Выводы</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🎓</span>
                                <strong>Для кого подходят:</strong> Готовые финансовые решения подойдут вам, если у вас нет специализированного образования или времени на то, чтобы следить за ситуацией на фондовом рынке.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🤝</span>
                                <strong>Кто предоставляет:</strong> Готовые инвестиционные решения предоставляют управляющие компании и брокеры, а вы выбираете, какие подходят именно вам. У каждого решения есть свои плюсы и минусы.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📦</span>
                                <strong>Виды решений:</strong> Паевые фонды, биржевые паевые фонды, индивидуальный инвестиционный счёт, доверительное управление, обезличенные металлические счета и структурные продукты.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Поздравляем! Теперь вы знаете все о готовых инвестиционных решениях!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое паевой инвестиционный фонд (ПИФ)?",
                        options: [
                            "Только акции одной компании",
                            "Фонд, который собирает деньги инвесторов и покупает на них ценные бумаги, управляемые портфельным управляющим",
                            "Только облигации",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое пай?",
                        options: [
                            "Акция компании",
                            "Ценная бумага, удостоверяющая право на долю в фонде",
                            "Облигация",
                            "Депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое БПИФ?",
                        options: [
                            "Только открытый ПИФ",
                            "Биржевой паевой инвестиционный фонд, который инвестирует в активы, входящие в индекс",
                            "Только закрытый ПИФ",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое ИИС?",
                        options: [
                            "Только брокерский счёт",
                            "Индивидуальный инвестиционный счёт, позволяющий получать доходы от инвестиций и налоговые вычеты",
                            "Только депозит",
                            "Только валютный счёт"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какие налоговые льготы предоставляет ИИС?",
                        options: [
                            "Только освобождение от НДФЛ",
                            "Налоговый вычет на сумму взноса и освобождение от налогообложения дохода от инвестиций",
                            "Только вычет на взнос",
                            "Нет налоговых льгот"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое доверительное управление?",
                        options: [
                            "Только самостоятельное управление",
                            "Услуга, позволяющая создать индивидуальный договор с учётом пожеланий инвестора и передать управление капиталом профессионалу",
                            "Только покупка акций",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое обезличенный металлический счёт (ОМС)?",
                        options: [
                            "Только депозит",
                            "Способ инвестирования в драгоценные металлы, при котором инвестор покупает металл виртуально",
                            "Только акции",
                            "Только облигации"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.5": {
                title: "Введение в инвестиции и рынок ценных бумаг",
                icon: "📚",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>Введение в инвестиции и рынок ценных бумаг</h3>
                </div>
                <p class="section-intro">Для начала давайте разберемся, что такое инвестирование и зачем это нужно. Торговля на бирже стала настолько неотъемлемой частью экономики, что в каждом выпуске новостей ведущие регулярно сообщают то о снижении, то о росте котировок, индексов и состоянии торгов к моменту закрытия биржи. Мы привычно пропускаем мимо ушей непонятные термины, но начинающему инвестору стоит разобраться, как устроены фондовые биржи и другие участники фондового рынка, чтобы понимать, как это все работает.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Способы инвестирования</h3>
                </div>
                <p class="section-intro"><strong>Инвестирование</strong> — это вложение средств в различные материальные и нематериальные активы ради их приумножения. Активы имеют разное соотношение риска и доходности. Как правило, чем выше потенциальная доходность, тем выше и риск потерять свои деньги. Важно выбрать то, что подходит именно вам, и учесть при этом сумму, которую вы хотите инвестировать, срок инвестирования и ваше отношение к риску.</p>
                
                <div class="income-cards">
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Депозит</h4>
                        <p><strong>Риск:</strong> <span style="color: #28a745;">Низкий</span> | <strong>Доход:</strong> <span style="color: #28a745;">Низкий</span></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Низкий уровень риска</li>
                            <li>✅ Страхование до 1,4 млн монеток</li>
                            <li>✅ Высокая ликвидность</li>
                            <li>⚠️ Доходность снижается вслед за ключевой ставкой</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Недвижимость</h4>
                        <p><strong>Риск:</strong> <span style="color: #28a745;">Низкий</span> | <strong>Доход:</strong> <span style="color: #28a745;">Низкий</span></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Стабильный актив</li>
                            <li>✅ Доход от аренды</li>
                            <li>⚠️ Длительный срок окупаемости</li>
                            <li>⚠️ Низкая ликвидность</li>
                            <li>⚠️ Издержки на содержание и ремонт</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🥇</div>
                        <h4>Драгоценные металлы</h4>
                        <p><strong>Риск:</strong> <span style="color: #ffc107;">Средний</span> | <strong>Доход:</strong> <span style="color: #ffc107;">Средний</span></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Защита от инфляции</li>
                            <li>✅ Долгосрочное вложение</li>
                            <li>✅ Золото и серебро — популярные инструменты</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Акции и облигации</h4>
                        <p><strong>Риск:</strong> <span style="color: #ffc107;">Средний-Высокий</span> | <strong>Доход:</strong> <span style="color: #17a2b8;">Высокий</span></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Управление риском и доходностью</li>
                            <li>✅ Доходность выше депозитов</li>
                            <li>✅ Участие в крупном бизнесе</li>
                            <li>✅ Регулируемая деятельность</li>
                            <li>✅ Гибкость в выборе стратегии</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💱</div>
                        <h4>Валюта</h4>
                        <p><strong>Риск:</strong> <span style="color: #dc3545;">Высокий</span> | <strong>Доход:</strong> <span style="color: #dc3545;">Непредсказуемый</span></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Диверсификация вложений</li>
                            <li>✅ Защита от инфляции</li>
                            <li>⚠️ Непредсказуемый курс</li>
                            <li>⚠️ Низкие ставки по валютным депозитам</li>
                            <li>⚠️ Долгие периоды без роста</li>
                        </ul>
                    </div>
                </div>
                
                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Вывод:</strong> Как видите, способов инвестирования довольно много. Все более популярным становится инвестирование на финансовых рынках. Одно из его главных преимуществ — возможность подобрать инструмент, который подходит именно вам.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Фондовый рынок и его участники</h3>
                </div>
                <p><strong>Фондовый рынок</strong> — это совокупность экономических отношений между его участниками по поводу выпуска и обращения ценных бумаг. Регулируют фондовый рынок в разных странах центральные банки и международные органы, которые выдают лицензии участникам рынка. Поэтому фондовый рынок — это абсолютно контролируемая система.</p>
                
                <p><strong>Фондовый рынок</strong> — это место, где продают и покупают акции, облигации, валюту и другие финансовые инструменты. Благодаря современным информационным технологиям сделки совершаются за секунды с помощью программ и мобильных приложений. Большинство сделок на фондовом рынке осуществляются через биржевые торги.</p>
                
                <p><strong>Фондовые биржи</strong> — это место виртуальной встречи всех желающих купить или продать ценные бумаги. У них есть свои названия, график работы, выходные и праздничные дни.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏛️</span>
                    <h3>Главные биржи в России</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Московская биржа (MOEX)</h4>
                        <p style="text-align: left;">Крупнейшая площадка для торгов российскими ценными бумагами. На MOEX обращаются:</p>
                        <ul style="text-align: left;">
                            <li>📄 Ценные бумаги российских компаний</li>
                            <li>💱 Иностранная валюта</li>
                            <li>📦 Товары</li>
                            <li>📉 Деривативы</li>
                        </ul>
                        <p style="margin-top: 10px;"><strong>Валюта торгов:</strong> монетли (₽)</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌍</div>
                        <h4>СПБ Биржа (SPBEX)</h4>
                        <p style="text-align: left;">Крупнейшая площадка для торгов иностранными ценными бумагами. На SPBEX обращаются:</p>
                        <ul style="text-align: left;">
                            <li>📄 Ценные бумаги российских и иностранных компаний</li>
                            <li>💱 Иностранная валюта</li>
                            <li>📦 Товары</li>
                            <li>📉 Деривативы</li>
                        </ul>
                        <p style="margin-top: 10px;"><strong>Валюта торгов:</strong> монетли (₽) и иностранная валюта</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🛢️</div>
                        <h4>Санкт-Петербургская товарно-сырьевая биржа (SPIMEX)</h4>
                        <p style="text-align: left;">Через нее осуществляется 99% объемов организованных торгов:</p>
                        <ul style="text-align: left;">
                            <li>🛢️ Нефтью</li>
                            <li>⛽ Газом</li>
                            <li>🌲 Лесом</li>
                            <li>🌾 Сельскохозяйственной продукцией</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Как работают ценные бумаги: пример компании</h3>
                </div>
                <p class="section-intro">А теперь давайте рассмотрим, как устроены финансовые инструменты, которые торгуются на биржах, и попробуем разобраться в интересах продавцов и покупателей ценных бумаг на примере акций и облигаций.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #007bff;">
                    <p><strong>📌 Пример: Компания «ИКС»</strong></p>
                    <p style="margin-top: 15px;">Компания «ИКС» владеет определенными активами, которые приносят ей прибыль:</p>
                    <ul style="margin-top: 10px;">
                        <li>🏭 Заводы и цехи</li>
                        <li>🚚 Автотранспорт</li>
                        <li>🔧 Спецтехника</li>
                    </ul>
                    
                    <p style="margin-top: 20px;"><strong>💡 Проблема:</strong> Для развития компании нужны дополнительные средства.</p>
                    <p><strong>✅ Решение:</strong> Компания может выпустить ценные бумаги (акции или облигации), чтобы привлечь деньги инвесторов.</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                        <p><strong>🔄 Как это работает:</strong></p>
                        <ol style="margin-top: 10px; padding-left: 20px;">
                            <li>Компания «ИКС» выпускает акции → продает долю в своем бизнесе</li>
                            <li>Если у компании хорошие финансовые показатели и планы развития → найдутся желающие купить акции</li>
                            <li>Инвесторы покупают акции → получают возможность заработать на росте стоимости</li>
                            <li>Компания получает деньги → использует их для роста и развития</li>
                        </ol>
                    </div>
                    
                    <p style="margin-top: 20px;"><strong>📚 Важные понятия:</strong></p>
                    <ul style="margin-top: 10px;">
                        <li><strong>Эмитент</strong> — компания, которая выпускает ценные бумаги</li>
                        <li><strong>Инвестор</strong> — человек или организация, которые покупают ценные бумаги</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤝</span>
                    <h3>Брокер и управляющая компания</h3>
                </div>
                <p class="section-intro">Доступ к бирже частный инвестор напрямую получить не может, для этого используются посредники (профессиональные участники рынка) — брокер или управляющая компания.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Брокер</h4>
                        <p style="text-align: left;"><strong>Особенности:</strong></p>
                        <ul style="text-align: left;">
                            <li>✅ Любая сделка требует поручения от инвестора</li>
                            <li>✅ Все решения принимает инвестор</li>
                            <li>✅ Вы контролируете каждую операцию</li>
                        </ul>
                        <p style="text-align: left; margin-top: 15px;">Брокер — это посредник между инвестором и биржей. Обычный человек не может сам подавать заявки на покупку или продажу ценных бумаг на бирже. Это делает брокер и получает за это со своих клиентов комиссию.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Брокерское обслуживание</strong> — это целый комплекс услуг по предоставлению инвесторам доступа на фондовый рынок. Инвестор через брокерский счет может приобрести или продать практически любой инвестиционный инструмент в реальном времени.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Управляющая компания</h4>
                        <p style="text-align: left;"><strong>Особенности:</strong></p>
                        <ul style="text-align: left;">
                            <li>✅ Сделки не требуют поручения от инвестора</li>
                            <li>✅ Все решения принимает управляющий активами</li>
                            <li>✅ Профессиональное управление портфелем</li>
                        </ul>
                        <p style="text-align: left; margin-top: 15px;"><strong>Управляющая компания</strong> — это коммерческая организация, юридическое лицо, управляющее имуществом других физических и юридических лиц, переданным в соответствии с договором доверительного управления.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Цель:</strong> Управление активами инвестора для увеличения их стоимости.</p>
                        <p style="text-align: left; margin-top: 10px;">Подходит для тех инвесторов, кто не готов уделять время управлению своим портфелем: следить за новостями рынка и анализировать их, вовремя избавляться от падающих ценных бумаг и покупать растущие.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>А торговля на бирже — это безопасно?</h3>
                </div>
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>✅ Да, торговля на бирже безопасна!</strong></p>
                    <p style="margin-top: 15px;">Биржа обеспечивает надежность торговли:</p>
                    <ul style="margin-top: 10px;">
                        <li>🔍 <strong>Прозрачность:</strong> Все сделки прозрачны и публичны</li>
                        <li>✅ <strong>Гарантии:</strong> Взаиморасчеты обеспечиваются специальными клиринговыми центрами</li>
                        <li>💰 <strong>Надежность:</strong> Купленные акции гарантированно окажутся у покупателя, а деньги — у продавца</li>
                    </ul>
                    
                    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                        <p><strong>📋 Регулирование:</strong></p>
                        <p>Работа бирж и посредников строго подотчетна регуляторам. В России такую роль играет <strong>Центральный банк</strong>:</p>
                        <ul style="margin-top: 10px;">
                            <li>✅ Выдает лицензии финансовым организациям</li>
                            <li>✅ Отзывает лицензии при нарушениях</li>
                            <li>✅ Контролирует деятельность брокеров и дилеров</li>
                        </ul>
                        <p style="margin-top: 15px; font-size: 0.9em; color: #6c757d;"><em>Лицензия — один из самых действенных рычагов влияния. Даже перспектива ее отзыва — синоним банкротства организации.</em></p>
                    </div>
                    
                    <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно:</strong> Тем не менее всегда нужно выбирать посредника с умом. О критериях выбора брокеров и управляющих компаний мы поговорим далее.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Что можно купить на фондовом рынке?</h3>
                </div>
                <p class="section-intro">Мы познакомились с ключевыми участниками торговли на фондовом рынке. Давайте перейдем к финансовым инструментам, которые они продают и покупают. На фондовом рынке торгуются акции, облигации и БПИФ — это наиболее популярные инструменты среди частных инвесторов.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📜</div>
                        <h4>Облигация</h4>
                        <p style="text-align: left;"><strong>Долговая ценная бумага</strong></p>
                        <p style="text-align: left;">Компания или государство выпускает облигации, чтобы взять в долг у инвесторов. Вы даете деньги в долг, а взамен получаете:</p>
                        <ul style="text-align: left;">
                            <li>💰 Фиксированные выплаты (купоны)</li>
                            <li>💵 Возврат суммы по истечении срока</li>
                            <li>📈 Доход выше депозита</li>
                            <li>🛡️ Защита от инфляции</li>
                        </ul>
                        <p style="margin-top: 15px; text-align: left;"><strong>Виды дохода:</strong></p>
                        <ul style="text-align: left; font-size: 0.9em;">
                            <li>• Рост стоимости облигации</li>
                            <li>• Получение купонов</li>
                            <li>• Реинвестирование купонов</li>
                            <li>• Валютная переоценка</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Акция</h4>
                        <p style="text-align: left;"><strong>Долевая ценная бумага</strong></p>
                        <p style="text-align: left;">Покупая акцию, вы становитесь совладельцем компании и получаете:</p>
                        <ul style="text-align: left;">
                            <li>💵 Право на дивиденды (часть прибыли)</li>
                            <li>🗳️ Право участвовать в управлении</li>
                            <li>🏢 Право на часть имущества при ликвидации</li>
                            <li>📈 Возможность заработать на росте стоимости</li>
                        </ul>
                        <p style="margin-top: 15px; text-align: left;"><strong>Виды дохода:</strong></p>
                        <ul style="text-align: left; font-size: 0.9em;">
                            <li>• Рост стоимости акций</li>
                            <li>• Получение дивидендов</li>
                            <li>• Реинвестирование дивидендов</li>
                            <li>• Валютная переоценка</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📦</div>
                        <h4>БПИФ (ETF)</h4>
                        <p style="text-align: left;"><strong>Биржевой паевой инвестиционный фонд</strong></p>
                        <p style="text-align: left;">Фонд, который инвестирует в множество инструментов одновременно. Структура БПИФ соответствует определенному индексу.</p>
                        <ul style="text-align: left;">
                            <li>✅ Покупка как обычная акция</li>
                            <li>✅ Пассивное инвестирование</li>
                            <li>✅ Низкий порог входа (от 100₽)</li>
                            <li>✅ Меньше риска, чем отдельные акции</li>
                            <li>✅ Диверсификация портфеля</li>
                        </ul>
                        <p style="margin-top: 15px; text-align: left; font-style: italic; color: #6c757d;">
                            💬 «Купить весь рынок сразу»<br>
                            💬 «Зачем искать иголку в стоге сена, если можно купить целый стог сена»
                        </p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведем итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Биржа</strong> — это большая площадка, где торгуют акциями, облигациями и другими активами.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛡️</span>
                                <strong>Безопасность:</strong> Совершать сделки на бирже безопасно, потому что биржа гарантирует исполнение обязательств.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🤝</span>
                                <strong>Посредники:</strong> Брокер и управляющая компания — это посредники, с помощью которых частный инвестор может получить доступ на биржу.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📜</span>
                                <strong>Облигации</strong> — это долговые ценные бумаги. Покупая их, инвестор дает компании или государству в долг под проценты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Акции</strong> — это доля в компании. Владелец акции получает часть прибыли компании.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📦</span>
                                <strong>БПИФ/ETF</strong> — это доля в фонде, который включает в себя множество акций или облигаций из какого-либо индекса.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Поздравляем! Теперь вы знаете основы инвестирования и рынка ценных бумаг!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое инвестирование?",
                        options: [
                            "Только трата денег",
                            "Вложение средств в различные материальные и нематериальные активы ради их приумножения",
                            "Только кредиты",
                            "Только депозиты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое фондовый рынок?",
                        options: [
                            "Только биржа",
                            "Совокупность экономических отношений между участниками по поводу выпуска и обращения ценных бумаг",
                            "Только банк",
                            "Только для бизнеса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое эмитент?",
                        options: [
                            "Покупатель ценных бумаг",
                            "Компания или государство, которое выпускает ценные бумаги",
                            "Только брокер",
                            "Только инвестор"
                        ],
                        correct: 1
                    },
                    {
                        question: "Кто такой брокер?",
                        options: [
                            "Эмитент ценных бумаг",
                            "Посредник между инвестором и биржей, выполняющий поручения инвестора",
                            "Только банк",
                            "Только управляющая компания"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое акция?",
                        options: [
                            "Долговая ценная бумага",
                            "Долевая ценная бумага, закрепляющая право на часть прибыли компании и участие в управлении",
                            "Только облигация",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое облигация?",
                        options: [
                            "Доля в компании",
                            "Долговая ценная бумага, дающая право на возврат суммы и получение купонов",
                            "Только акция",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое БПИФ?",
                        options: [
                            "Только акции",
                            "Биржевой паевой инвестиционный фонд, инвестирующий в множество инструментов по структуре индекса",
                            "Только облигации",
                            "Только депозит"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.6": {
                title: "Способы инвестирования: выбираем брокера и управляющую компанию",
                icon: "🤝",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤝</span>
                    <h3>Способы инвестирования: выбираем брокера и управляющую компанию</h3>
                </div>
                <p class="section-intro">В этом уроке разберём посредников для выхода на рынки — профессиональных участников рынка ценных бумаг: брокеров и управляющие компании. Узнаем об их сходствах и различиях, тарифах и комиссиях. Чтобы торговать, тебе нужно выбрать подходящего посредника, который обеспечит доступ к бирже. Без этого не получится купить ни акции, ни облигации, ни паи биржевых фондов. Посредников может быть сразу несколько — всё зависит от твоих потребностей и целей.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Что нужно знать о брокерах?</h3>
                </div>
                <p class="section-intro">Начнём с брокеров — без них на биржу никак не попасть. Торгуешь ты сам, но передаёт твои поручения на биржу именно брокер. Он следит, что и в каких количествах ты купил и продал, рассчитывает доходы и убытки от сделок. Также брокер выступает налоговым агентом — рассчитывает, удерживает и отправляет налоги по твоим операциям в налоговую службу. Ты можешь работать с одним брокером, а можешь сразу с несколькими — ограничений по их количеству нет.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>На что обращать внимание при выборе брокера?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🛡️</div>
                        <h4>1. Надёжность и рейтинги</h4>
                        <p style="text-align: left; margin-top: 10px;">Первое, на что нужно обратить внимание — это уровень надёжности компании. Для брокерской деятельности требуется государственная лицензия Банка России. Проверить лицензию компании можно в списке брокеров на сайте ЦБ РФ.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Проверь лицензию ЦБ РФ</li>
                            <li>✅ Посмотри финансовые показатели компании</li>
                            <li>✅ Изучи отзывы других инвесторов</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>2. Комиссии и тарифы</h4>
                        <p style="text-align: left; margin-top: 10px;">Второй важный критерий — комиссии, которые берёт брокер за свои услуги. Крупные брокеры обычно имеют несколько тарифных планов. Чтобы подобрать подходящий, учитывай:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Сумму и количество сделок</li>
                            <li>📊 Какие финансовые инструменты будешь покупать</li>
                            <li>📈 Нужны ли дополнительные услуги (аналитика, консультации)</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📋 Типовые комиссии брокеров</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💸 Расходы на покупку/продажу:</strong></p>
                        <p>Процент от суммы всех сделок за один день. Может быть фиксированным (постоянным) или плавающим (чем выше сумма, тем ниже процент). Обычно 0,03–1%.</p>
                        
                        <p style="margin-top: 15px;"><strong>📅 Регулярные комиссии:</strong></p>
                        <ul style="margin-left: 20px;">
                            <li>Ежемесячные комиссии за депозитарное обслуживание (обычно 0–200 монеток в месяц)</li>
                            <li>Ежемесячные комиссии за обслуживание брокерского счёта (обычно 0–200 монеток в месяц)</li>
                        </ul>
                        
                        <p style="margin-top: 15px;"><strong>➕ Дополнительные расходы:</strong></p>
                        <ul style="margin-left: 20px;">
                            <li>Комиссии за зачисление/списание денег (обычно их нет, но могут быть при переводе между организациями)</li>
                            <li>Прочие расходы</li>
                        </ul>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📱</div>
                        <h4>3. Простота и удобство обслуживания</h4>
                        <p style="text-align: left; margin-top: 10px;">Если у брокера нет приложения или личного кабинета, то для доступа к бирже придётся устанавливать торговый терминал — специальную программу, в которой непросто разобраться. Если же у брокера есть своё приложение, то разобраться и начать работать со своим портфелем будет гораздо проще. Совершать сделки и отслеживать информацию можно будет со смартфона, а обратиться в службу поддержки при необходимости — прямо из мобильного приложения.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>4. Во что можно инвестировать через брокера?</h4>
                        <p style="text-align: left; margin-top: 10px;">Через брокера можно покупать и продавать:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💱 Валюту</li>
                            <li>📈 Акции (российских и иностранных компаний)</li>
                            <li>📜 Облигации и еврооблигации</li>
                            <li>🎯 Структурные продукты</li>
                            <li>📉 Контракты срочного рынка</li>
                            <li>📦 Паи биржевых паевых инвестиционных фондов (БПИФ) или ETF</li>
                        </ul>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> Чем шире перечень торгуемых инструментов у брокера, тем шире возможности его клиентов.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Что нужно знать об управляющих компаниях?</h3>
                </div>
                <p class="section-intro">Преимущество работы с управляющей компанией в том, что тебе не нужно постоянно изучать ситуацию на рынке — за тебя это сделает команда управляющих фондами. Твои доходы будут зависеть от выбранной стратегии и от результатов работы управляющих. Однако инвестору всё же полезно разбираться в основах работы фондового рынка, чтобы лучше понимать принцип работы стратегии и оценивать эффективность управления. Контролировать свои инвестиции можно с помощью личного кабинета или мобильного приложения.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🛡️</div>
                        <h4>1. Надёжность и рейтинги</h4>
                        <p style="text-align: left; margin-top: 10px;">Как и в случае с брокером, первое, на что нужно обратить внимание при выборе управляющей компании — это уровень её надёжности. Для управления активами инвесторов требуется лицензия Банка России. Проверить лицензию можно в справочнике участников финансового рынка.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Проверь лицензию ЦБ РФ</li>
                            <li>✅ Посмотри финансовые показатели</li>
                            <li>✅ Изучи возраст компании и её историю</li>
                            <li>✅ Проверь рейтинги на специализированных ресурсах</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>2. Объёмы бизнеса и активы под управлением</h4>
                        <p style="text-align: left; margin-top: 10px;">Ещё один ключевой критерий выбора — это совокупный объём активов под управлением. Большие объёмы активов говорят о:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>👥 Большом количестве инвесторов, которые доверяют свои деньги</li>
                            <li>🤝 Большом количестве партнёров и агентов</li>
                            <li>📈 Степени влияния на рынке</li>
                            <li>💼 Потенциальной прибыли компании</li>
                        </ul>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🎯</div>
                        <h4>3. Разнообразие стратегий и опыт управляющих</h4>
                        <p style="text-align: left; margin-top: 10px;">Повлиять на выбор управляющей компании может разнообразие доступных стратегий, которые она предлагает инвесторам. Одним из основных правил инвестирования является диверсификация — «не клади все яйца в одну корзину». Широкая и разнообразная линейка продуктов позволяет диверсифицировать вложения.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Также обрати внимание на:</strong></p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>👨‍💼 Опыт портфельных управляющих</li>
                            <li>📊 Аналитическую команду</li>
                            <li>⚠️ Риск-менеджмент</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💰 Комиссии управляющей компании</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💵 Надбавка (при покупке паев):</strong></p>
                        <p>Комиссия может быть разной в зависимости от суммы инвестирования (например, 1% при сумме до 3 млн монеток, 0.5% при большей сумме). При покупке паев через личный кабинет или мобильное приложение комиссии (надбавки) может не быть.</p>
                        
                        <p style="margin-top: 15px;"><strong>💸 Скидка (при продаже/погашении ПИФа):</strong></p>
                        <p>Может взиматься комиссия в зависимости от срока владения паями:</p>
                        <ul style="margin-left: 20px;">
                            <li>2% — если срок владения до 180 дней</li>
                            <li>1% — если срок владения от 181 до 547 дней</li>
                            <li>0.5% — если срок владения от 548 до 731 дня</li>
                            <li>0% — если срок владения более 731 дня</li>
                        </ul>
                        <p style="margin-top: 10px; font-size: 0.9em;"><strong>💡 Важно:</strong> Обмены паёв между фондами не прерывают срок владения паями.</p>
                        
                        <p style="margin-top: 15px;"><strong>📊 Комиссия за управление:</strong></p>
                        <p>Размеры комиссии за управление ПИФом и инфраструктурные расходы фонда указаны в правилах фонда и могут варьироваться. Например, для фондов облигаций комиссия может составлять 1,5–2%, для фондов акций — 2–3,5%.</p>
                        
                        <p style="margin-top: 15px;"><strong>🏆 Вознаграждение за успех:</strong></p>
                        <p>Если инвестиционный доход превысит базовый доход (например, 5% годовых), компания может получить вознаграждение за успех (например, 10% от суммы превышения). Эта комиссия чаще применяется при доверительном управлении.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Важно помнить!</h3>
                </div>
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>⚠️ Никто не гарантирует доход!</strong></p>
                    <p style="margin-top: 10px;">Законодательно ни один управляющий, брокер или любая другая финансовая организация не имеет права гарантировать доход на финансовых рынках. Это закреплено в законе о рынке ценных бумаг.</p>
                    
                    <p style="margin-top: 20px;"><strong>💰 Налоги:</strong></p>
                    <p>Что бы ты ни выбрал — брокера или управляющую компанию — помни о налогах. Подробнее о них мы поговорим в соответствующем разделе.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🚨</span>
                    <h3>Псевдоброкеры — это мошенники!</h3>
                </div>
                <p class="section-intro">Это мошенники, которые предлагают заработать на операциях с ценными бумагами и получить доход выше рыночного, но обещания эти, конечно, не выполняют.</p>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">🎭 Как это работает?</h4>
                    <p>Мошенники пользуются тем, что большинство людей плохо разбирается в законодательном регулировании рынка ценных бумаг и зачастую демонстрируют поддельные лицензии.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💻 Сценарий 1:</strong></p>
                        <p>Тебе предлагают инвестировать деньги с высоким доходом. Для этого просят установить специальные приложения с «автопрограммами», которые якобы сами проводят сверхвыгодные сделки. <strong>НО таких программ не существует!</strong> Курс в этих приложениях фальшивый — мошенники просто присвоят твои деньги.</p>
                        
                        <p style="margin-top: 15px;"><strong>🌍 Сценарий 2:</strong></p>
                        <p>Предлагают торговать на различных финансовых рынках, в частности, Forex. Просят внести деньги на торговый счёт. После чего псевдоброкеры создают видимость проведения операций, а если попытаешься вывести свои деньги — мошенники прекратят любые контакты с тобой.</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">🛡️ Как защитить себя?</h4>
                    <ul style="margin-left: 20px;">
                        <li>✅ <strong>Проверь лицензию:</strong> Прежде чем переводить деньги, убедись, что у компании есть лицензия на осуществление брокерской деятельности на сайте Банка России.</li>
                        <li>✅ <strong>Проверь реквизиты:</strong> Не подтверждай платёжную операцию, пока не убедишься, что все реквизиты указаны верно. Реальные брокерские или управляющие компании не просят перевести деньги на карту третьего лица.</li>
                        <li>✅ <strong>Будь внимателен:</strong> Если обещают гарантированную доходность выше рыночной — это точно мошенники!</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💼</span>
                                <strong>Брокер:</strong> Если хочешь самостоятельно во всём разбираться и принимать решения при инвестировании, можно воспользоваться услугами брокеров.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏢</span>
                                <strong>Управляющая компания:</strong> Если не готов самостоятельно принимать решения и тратить время на изучение рынка, можно воспользоваться услугами управляющей компании.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🔍</span>
                                <strong>При выборе компании:</strong> Обязательно проверь наличие лицензии и включение в списки ЦБ РФ, обрати внимание на уровень надёжности и рейтинги.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Издержки:</strong> Обращай внимание на тарифы и комиссии брокера и управляющей компании.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📱</span>
                                <strong>Удобство:</strong> Инвестируй с помощью мобильного приложения и личного кабинета — это удобно.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Помни:</strong> Доход в прошлом никогда не гарантирует доход в будущем.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выбрать посредника для инвестирования и защитить себя от мошенников!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что важно проверить при выборе брокера в первую очередь?",
                        options: [
                            "Только размер комиссий",
                            "Наличие лицензии Банка России, комиссии, удобство платформы, надёжность компании",
                            "Только отзывы",
                            "Только репутацию"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что важно проверить при выборе управляющей компании?",
                        options: [
                            "Только размер вознаграждения",
                            "Лицензию ЦБ РФ, объёмы активов под управлением, разнообразие стратегий, опыт управляющих",
                            "Только отзывы",
                            "Только репутацию"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое псевдоброкеры?",
                        options: [
                            "Обычные брокеры с высокими комиссиями",
                            "Мошенники, которые обещают сверхвысокую доходность и используют поддельные лицензии",
                            "Международные брокеры",
                            "Брокеры без лицензии, но надёжные"
                        ],
                        correct: 1
                    },
                    {
                        question: "Могут ли брокеры или управляющие компании гарантировать доход?",
                        options: [
                            "Да, если они крупные компании",
                            "Нет, законодательно никто не имеет права гарантировать доход на финансовых рынках",
                            "Да, если это написано в договоре",
                            "Да, если доход невысокий"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.7": {
                title: "Облигации: дать деньги в долг и заработать",
                icon: "📜",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📜</span>
                    <h3>Облигации: дать деньги в долг и заработать</h3>
                </div>
                <p class="section-intro">Теперь ты знаешь, как устроен фондовый рынок, и знаком с его основными участниками. Значит, самое время разобраться в финансовых инструментах! В этом уроке мы поговорим о параметрах облигаций, их ценообразовании, преимуществах и рисках. А также о том, что ещё нужно учесть при выборе этого инструмента.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">☕</span>
                    <h3>Разберём на примере кофейни</h3>
                </div>
                <p class="section-intro">Предположим, ты — владелец кофейни и хочешь развивать бизнес. На развитие понадобятся деньги. Есть несколько способов их привлечь.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Способ 1: Кредит или облигации</h4>
                        <p style="text-align: left; margin-top: 10px;">Можешь взять кредит в банке или выпустить облигации. В этом случае будешь платить проценты по займу, но не придётся ни с кем делить бизнес, и управление останется полностью в твоих руках. Впрочем, как и все риски.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Способ 2: Акции</h4>
                        <p style="text-align: left; margin-top: 10px;">Можешь привлечь инвесторов, выпустив акции. В этом случае не будет обязательства возвращать инвестиции как долг в определённый срок, а уровень рисков бизнеса разделишь с другими акционерами. Если дела будут идти хорошо, будешь делиться с ними частью прибыли — выплачивать дивиденды.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Как работают облигации?</h3>
                </div>
                <p class="section-intro">Как владелец бизнеса, ты можешь привлечь дополнительные деньги через выпуск облигаций. То есть берёшь деньги инвесторов в долг на определённый срок. По этому долгу нужно будет платить процент, и в конце нужно будет обязательно погасить облигацию по заранее оговорённой цене — по номиналу.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📋 Пример</h4>
                    <p>Ты разместил облигацию на 3 года с выплатой процента каждые полгода. Инвестор на 3 года даёт тебе деньги в долг и будет получать заранее известный фиксированный доход каждые полгода. В конце срока инвестор получит свои деньги обратно.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Параметры облигаций</h3>
                </div>
                <p class="section-intro">Все ли облигации одинаковые или они чем-то отличаются? По каким параметрам инвестору выбрать облигацию?</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>1. Тип эмитента</h4>
                        <p style="text-align: left; margin-top: 10px;">Кто выпустил облигацию — то есть кто её эмитент. Это может быть компания или государство.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📅</div>
                        <h4>2. Срок до погашения</h4>
                        <p style="text-align: left; margin-top: 10px;">На какой максимальный срок можно приобрести облигацию. Это ориентир даты, когда эмитент возвратит инвестору средства.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>3. Размер, тип и периодичность купона</h4>
                        <p style="text-align: left; margin-top: 10px;">Как часто и в каком размере инвестор будет получать проценты по облигации и от чего это зависит.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>4. Доходность к погашению</h4>
                        <p style="text-align: left; margin-top: 10px;">Сколько дохода даёт облигация сейчас и сколько она даст дохода, если держать её до погашения.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Тип эмитента</h3>
                </div>
                <p class="section-intro">Эмитент облигаций — это заёмщик, который выпустил облигацию для привлечения денег. Облигации выпускают компании для финансирования своих проектов и государство — для привлечения средств в бюджет.</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>📊 Соотношение доходности и риска</strong></p>
                    <p style="margin-top: 10px;">При построении портфеля или выборе инструмента инвесторы оценивают ставку доходности по государственным облигациям как отправную точку в поиске баланса между доходностью и риском.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💡 Правило:</strong></p>
                        <ul style="margin-left: 20px;">
                            <li>Чем меньше ты готов рисковать, тем к меньшей доходности должен быть готов.</li>
                            <li>Чем большую доходность ты ожидаешь, тем к большему риску должен быть готов.</li>
                        </ul>
                        <p style="margin-top: 15px;"><strong>🏛️ Государственные облигации:</strong></p>
                        <p>Государство — наиболее надёжный эмитент с низким риском и низкой доходностью. В России государственные облигации называют облигациями федерального займа (ОФЗ), а выпускает их Министерство финансов Российской Федерации.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📅</span>
                    <h3>Срок до погашения</h3>
                </div>
                <p class="section-intro">Рынок облигаций разделяют на краткосрочный, среднесрочный и долгосрочный. Для инвестора это важно — по окончании срока эмитент погасит облигацию по её номинальной стоимости: чем ближе срок погашения, тем ближе рыночная цена облигации к её номинальной стоимости.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">⏱️</div>
                        <h4>Краткосрочные</h4>
                        <p style="text-align: left; margin-top: 10px;">До 5 лет</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📆</div>
                        <h4>Среднесрочные</h4>
                        <p style="text-align: left; margin-top: 10px;">От 5 до 10 лет</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🗓️</div>
                        <h4>Долгосрочные</h4>
                        <p style="text-align: left; margin-top: 10px;">От 10 лет</p>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">♾️ Бессрочные облигации</h4>
                    <p>Отдельный вид — бессрочные облигации. Они не имеют конкретного срока возврата долга. Если купить такую облигацию, можно неограниченное время получать купонные выплаты. В любой момент её можно продать на рынке другому инвестору по рыночной цене. При этом эмитент бессрочных облигаций имеет право принудительно погасить их через определённый срок.</p>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно:</strong> С приближением даты погашения стоимость облигации будет стремиться к её первоначальной цене — номиналу (за исключением случаев банкротства организации).</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Размер, тип и периодичность купона</h3>
                </div>
                <p class="section-intro">Размер купона, тип и периодичность выплаты устанавливается эмитентом. При установлении размера купона и периодичности его выплат компания-эмитент принимает во внимание уровень текущих ставок и свой кредитный рейтинг.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Фиксированный купон</h4>
                        <p style="text-align: left; margin-top: 10px;">Размер купона установлен заранее и не меняется в течение срока обращения облигации.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌊</div>
                        <h4>Плавающая доходность</h4>
                        <p style="text-align: left; margin-top: 10px;">Ставка купона привязана к уровню инфляции или ключевой ставке и пересчитывается, подстраиваясь под меняющиеся рыночные условия.</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>💡 Для инвестора:</strong></p>
                    <p style="margin-top: 10px;">Купон показывает, сколько можно заработать, владея облигацией, а периодичность — как быстро и как часто можно получить доход.</p>
                    <p style="margin-top: 15px;"><strong>📈 Преимущество частых выплат:</strong> Чем чаще происходит выплата купона, тем выгоднее инвестиция. Ведь выплаты можно тоже инвестировать и получать ещё больший доход (сложный процент).</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Доходность к погашению</h3>
                </div>
                <p class="section-intro">Ещё один важный параметр при выборе облигации — это доходность к погашению. Он показывает суммарный доход по облигации, если купить её и держать до погашения. Этот показатель рассчитывают брокеры, инвестору самому этого делать не нужно. При расчёте учитываются срок до погашения, размер и частота выплаты купона и другие параметры (такие как рыночная стоимость и накопленный купонный доход).</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>💡 Где посмотреть?</strong></p>
                    <p style="margin-top: 10px;">В мобильном приложении или личном кабинете брокера можно посмотреть этот показатель в графе «Доходность» в разделе «Облигации».</p>
                    <p style="margin-top: 15px;"><strong>✅ Преимущество:</strong> При покупке облигации можно узнать свой будущий суммарный доход, если владеть ей до погашения — достаточно посмотреть на параметр «Доходность к погашению». Получать доходность ты начинаешь до погашения облигации — через купоны.</p>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⚠️ Важно знать:</strong></p>
                    <p style="margin-top: 10px;">Продать облигацию можно и не дожидаясь срока погашения по рыночной цене. Купон ты получишь ровно за то количество дней, которое владел облигацией, но рыночная цена может быть как выше, так и ниже цены покупки.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💵</span>
                    <h3>Номинал и рыночная стоимость</h3>
                </div>
                <p class="section-intro">Стоимость облигаций, как и акций, может расти и падать. От чего это зависит? Разберём, как формируется рыночная цена и что может повлиять на неё.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💎</div>
                        <h4>Номинальная стоимость</h4>
                        <p style="text-align: left; margin-top: 10px;">Установлена эмитентом при её выпуске. Обычно это 1 000 монеток. Размер купонного дохода (ставка годового процента, которую выплачивает эмитент), как правило, привязан к номинальной стоимости облигации.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Рыночная стоимость</h4>
                        <p style="text-align: left; margin-top: 10px;">Это цена, по которой ценная бумага продаётся после выпуска на вторичном рынке. Она выражается в процентах от номинальной стоимости и может быть ниже или выше неё. То есть облигация может продаваться с дисконтом или с премией.</p>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📉 Дисконт и премия</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📉 Дисконт</strong> — это разница между номинальной ценой облигации и стоимостью её покупки, если она продаётся дешевле номинала.</p>
                        <p style="margin-top: 10px;"><strong>Пример:</strong> Если облигация стоит 97% от номинала, клиент заплатит 970 монеток (купит с дисконтом).</p>
                        
                        <p style="margin-top: 15px;"><strong>📈 Премия</strong> — это разница между номинальной ценой облигации и стоимостью её покупки, если она продаётся дороже номинала.</p>
                        <p style="margin-top: 10px;"><strong>Пример:</strong> Если облигация стоит 102%, клиент заплатит 1020 монеток (купит с премией).</p>
                    </div>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно помнить:</strong> Цена облигации может отличаться от номинала. Инвестору важно помнить, что досрочно продать облигации также можно, но цена может быть как выше, так и ниже цены покупки. Погашение облигации происходит по номиналу.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔑</span>
                    <h3>Как ключевая ставка влияет на стоимость облигаций?</h3>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">📊 Пример</h4>
                    <p>Ты приобрел облигацию с ежегодным купонным доходом 8%, когда ключевая ставка была 7,5%. Через какое-то время решил её продать, не дожидаясь погашения, то есть по рыночной стоимости. Однако за этот период ключевая ставка выросла до 8,5%.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📈 Что происходит:</strong></p>
                        <p>Выросли ставки по депозитам, а также и купонная доходность по вновь выпущенным облигациям. Поэтому теперь твоя облигация стоит дешевле, и её привлекательность для нового покупателя ниже, чем в момент твоей покупки. Ведь покупателю проще купить вновь выпущенную облигацию, а не перекупать твою с более низкой доходностью.</p>
                        
                        <p style="margin-top: 15px;"><strong>⚠️ Важно:</strong> Риск рыночной цены актуален только тогда, когда ты собираешься продать облигацию до даты погашения. Если ты ждёшь даты погашения, изменения рыночной стоимости тебя не интересуют, так как облигация закроется по номиналу.</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">📉 Обратная ситуация</h4>
                    <p>При этом верно и обратное: если ключевая ставка понижается, например, с 7,5 до 6,5%, твоя облигация становится более привлекательной для покупателей, чем в момент её выпуска. Купонный доход по твоей облигации, скорее всего, будет выше, чем по вновь выпущенным облигациям.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📅</span>
                    <h3>Накопленный купонный доход (НКД)</h3>
                </div>
                <p class="section-intro">По облигациям ты получаешь доход ровно за то время, которое ими владеешь. Это происходит благодаря НКД — части купонного дохода за каждый день владения облигацией от даты покупки или от даты выплаты предыдущего купона. НКД присоединяется к стоимости облигации в момент её покупки/продажи на вторичном рынке.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">☕ Пример с кофейней</h4>
                    <p>Допустим, для расширения бизнеса владелец кофейни привлёк инвестиции через выпуск облигаций. Инвестор их приобрёл и теперь является их владельцем. Он планировал держать облигации 3 года до погашения, но обстоятельства изменились, и деньги понадобились раньше.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p>Теперь он может продать облигации по рыночной цене. В момент купли-продажи покупатель заплатит инвестору НКД — купон за тот срок, который он владел облигацией (для покупателя облигации этот расход будет возмещён в момент выплаты купона или при её дальнейшей перепродаже).</p>
                    </div>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно знать:</strong> Для облигаций одного выпуска величина НКД на одну и ту же дату всегда одинаковая. Для удобства брокеры в своих торговых приложениях автоматически рассчитывают эту величину и сразу учитывают её в сделках. НКД рассчитывается биржей ежедневно.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Что ещё влияет на цену облигации?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Возможен рост цены</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Повышение кредитного рейтинга эмитента</li>
                            <li>✅ Снижение рыночной процентной ставки</li>
                            <li>✅ Досрочное погашение эмитентом выпуска облигаций</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📉</div>
                        <h4>Возможно снижение цены</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>⚠️ Повышение рыночной процентной ставки</li>
                            <li>⚠️ Негативные события эмитента (дефолт по одному из выпусков, отказ от платежа)</li>
                            <li>⚠️ Снижение кредитного рейтинга эмитента</li>
                            <li>⚠️ Геополитические события: санкции, «бегство» из рискованных активов</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Разновидности облигаций</h3>
                </div>
                <p class="section-intro">При покупке облигации важно обратить внимание на условия выпуска, т. к. могут встречаться особые разновидности облигаций.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">⚠️</div>
                        <h4>Субординированные облигации</h4>
                        <p style="text-align: left; margin-top: 10px;">Это особый класс облигаций, их доходность формируется за счёт купонов. На российском рынке их выпускают коммерческие банки, которые через такие выпуски регулируют уровень достаточности капитала.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>⚠️ Особенности:</strong> По сравнению с «классическими» облигациями субординированные, как правило, имеют более высокую доходность и являются более рискованными. Субординированные облигации могут быть полностью списаны в капитал банка при наступлении неблагоприятной финансовой ситуации. При банкротстве эмитента выплаты держателям происходят в предпоследнюю очередь.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Ипотечные облигации</h4>
                        <p style="text-align: left; margin-top: 10px;">Это облигации, которые обеспечены ипотечными кредитами. Купоны и погашение номинала по таким бумагам формируются за счёт платежей по этим кредитам.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🎯</div>
                        <h4>Структурные облигации</h4>
                        <p style="text-align: left; margin-top: 10px;">Это облигации, выплаты по которым осуществляются в соответствии с заложенными в них условиями. Как правило, доход по таким облигациям зависит от рыночной динамики стоимости базового актива. Таким активом могут быть акции, индексы, ключевая ставка, иностранная валюта и др.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💱</div>
                        <h4>Валютные облигации</h4>
                        <p style="text-align: left; margin-top: 10px;">Выпускать облигации можно не только в национальной валюте страны эмитента, но и в иностранной валюте. Такие долговые ценные бумаги называются валютными.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Преимущества:</strong> Облигации помогают компаниям и государству получить средства на развитие дешевле, чем кредит в банке, а инвесторам — заработать больше, чем, например, в депозитах.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🔍</span>
                                <strong>Параметры выбора:</strong> Тип эмитента, срок до погашения, текущая доходность и доходность к погашению.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛡️</span>
                                <strong>Надёжность:</strong> Облигации бывают разных уровней надёжности в зависимости от типа эмитента: чем надёжнее эмитент, тем надёжнее инструмент и ниже его доходность.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Факторы влияния:</strong> На стоимость и доходность облигаций влияют несколько факторов: надёжность компании, геополитическая ситуация, изменение стоимости денег на рынке и т. д.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь всё об облигациях!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое облигация?",
                        options: [
                            "Доля в компании",
                            "Долговая ценная бумага, по которой эмитент берёт деньги в долг и платит проценты",
                            "Только акция",
                            "Только депозит"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое доходность к погашению?",
                        options: [
                            "Только купонные выплаты",
                            "Суммарный доход по облигации, если купить её и держать до погашения",
                            "Только номинал",
                            "Только рыночная стоимость"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое НКД (накопленный купонный доход)?",
                        options: [
                            "Только купон за год",
                            "Часть купонного дохода за каждый день владения облигацией от даты покупки или от даты выплаты предыдущего купона",
                            "Только номинал",
                            "Только процентная ставка"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что влияет на стоимость облигации?",
                        options: [
                            "Только дивиденды",
                            "Ключевая ставка, кредитный рейтинг эмитента, геополитические события и другие факторы",
                            "Только цена акций",
                            "Только курс валюты"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое субординированные облигации?",
                        options: [
                            "Обычные государственные облигации",
                            "Особый класс облигаций с более высокой доходностью и риском, могут быть списаны в капитал банка",
                            "Облигации с фиксированным купоном",
                            "Только валютные облигации"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.8": {
                title: "Акции: доли в бизнесе и как на них заработать",
                icon: "📊",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Акции: доли в бизнесе и как на них заработать</h3>
                </div>
                <p class="section-intro">Теперь перейдём к акциям. Вернёмся к примеру с кофейней. Допустим, ты всё взвесил и решил, что на данный момент интереснее выпуск акций. Ты знаешь, что тебе это нужно как владельцу бизнеса, чтобы у тебя не было обязательств возвращать инвестиции как долг в определённый срок, а уровень рисков бизнеса ты мог бы разделить с другими акционерами. Теперь узнаем, зачем это нужно инвесторам. Продолжим разбирать наш пример и рассмотрим, что может произойти через 1, 2 или 3 года.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">☕</span>
                    <h3>Что может произойти с акциями кофейни?</h3>
                </div>
                <p class="section-intro">Предположим, что дела у кофейни будут идти хорошо, поэтому вместе с ростом стоимости акций ты ещё будешь делиться прибылью и выплачивать дивиденды. Однако всегда стоит помнить о том, что акции могут и падать в цене, а дивидендные выплаты и вовсе отсутствовать. Именно поэтому всегда важна диверсификация — чем больше разнообразных активов в портфеле инвестора, тем выше его надёжность и устойчивость.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🚀</span>
                    <h3>Первичное размещение акций (IPO)</h3>
                </div>
                <p class="section-intro">Изначально, чтобы привлечь новые деньги на развитие кофейни, необходимо провести первичное размещение акций. Сокращённо его называют IPO (Initial Public Offering).</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>📋 Как это работает:</strong></p>
                    <p style="margin-top: 10px;">Процесс первичного размещения акций кофейни может проходить с помощью специализированных компаний. Таким образом кофейня станет эмитентом акций, то есть тем, кто их выпускает.</p>
                    <p style="margin-top: 15px;"><strong>🔄 Первичный и вторичный рынок:</strong></p>
                    <p>Сначала самые первые инвесторы купят акции у тебя, как у эмитента (на первичном рынке), а потом будут продавать и покупать их друг у друга по разным ценам, но уже на вторичном рынке.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔄</span>
                    <h3>Вторичный рынок ценных бумаг</h3>
                </div>
                <p class="section-intro">Это рынок, на котором покупают и продают ранее выпущенные ценные бумаги, такие как акции и облигации. На этом рынке новые средства уже не привлекаются для эмитента, а только перераспределяются среди последующих инвесторов.</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⚠️ Важно помнить:</strong></p>
                    <p style="margin-top: 10px;">Цена акций на вторичном рынке может сильно отличаться от цены размещения как в большую, так и меньшую сторону. Именно поэтому вторичный рынок считается более безопасным для инвестиций — стоимость одной акции на нём определяется спросом и предложением, а не субъективной оценкой компаний-оценщиков.</p>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💎</div>
                        <h4>«Голубые фишки»</h4>
                        <p style="text-align: left; margin-top: 10px;">На вторичном рынке можно купить стабильные акции крупных компаний. Их принято называть «голубые фишки». В России это, например, Газпром, МТС и другие крупные компании. На международном рынке — Ford, Apple, Microsoft и другие.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏷️</div>
                        <h4>Тикер и котировка</h4>
                        <p style="text-align: left; margin-top: 10px;">Каждой акции при выпуске присваивается <strong>тикер</strong> — уникальный набор символов, упрощающий работу биржи и участников торгов. Также ты наверняка встретишь термин <strong>«котировка»</strong> — это стоимость какого-либо финансового инструмента в конкретный момент.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Дивиденды</h3>
                </div>
                <p class="section-intro">Вернёмся к примеру с кофейней и подробнее поговорим о дивидендах. Допустим, инвестору принадлежит пакет акций твоей кофейни. В этом случае инвестору также полагается часть чистой прибыли, если ты примешь решение её выплатить, а не потратить на развитие бизнеса. Разделение прибыли с акционерами называется выплатой дивидендов. Размер дивиденда может отличаться по обыкновенным и привилегированным акциям.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Обыкновенные и привилегированные акции</h3>
                </div>
                <p class="section-intro">Компания может выпускать два вида акций — обыкновенные и привилегированные, или «обычка» и «префы». Они отличаются разными правами акционера.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Обыкновенные акции</h4>
                        <p style="text-align: left; margin-top: 10px;">Как владелец обыкновенных акций ты сможешь:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🗳️ Принимать участие в управлении бизнесом на собраниях акционеров</li>
                            <li>✅ Голосовать</li>
                            <li>💰 Получать дивиденды</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⭐</div>
                        <h4>Привилегированные акции</h4>
                        <p style="text-align: left; margin-top: 10px;">Если у тебя привилегированные акции, то:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>❌ Нет права участвовать в голосовании акционеров</li>
                            <li>💰 Дивиденд фиксирован и выше, чем по обыкновенным акциям</li>
                            <li>🏆 В случае ликвидации компании эти акции подлежат выплате раньше, чем обыкновенные</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Дивидендная политика</h3>
                </div>
                <p class="section-intro">Как компания принимает решение о том, сколько нужно выплатить дивидендов? Для этого у каждой компании сформирована дивидендная политика. В ней должны быть учтены интересы как акционеров, так и менеджмента, чтобы рыночная стоимость компании росла.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>💡 Как принимается решение:</strong></p>
                    <p style="margin-top: 10px;">В зависимости от наличия чистой прибыли и свободного денежного потока, на основании утверждённой дивидендной политики принимается решение: какую часть денег направить на развитие компании, а какую — на выплату дивидендов акционерам.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💰 Чистая прибыль</strong> — это материальные средства, которые остаются в компании после уплаты всех налогов, сборов, отчислений и других обязательных платежей.</p>
                        
                        <p style="margin-top: 15px;"><strong>💵 Свободный денежный поток</strong> — это денежные средства, которыми компания располагает после инвестиций на поддержание или расширение своей базы активов.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Можно ли купить акции перед выплатой дивидендов?</h3>
                </div>
                <p class="section-intro">Вопрос хороший, но не спеши с покупкой. Во-первых, следует учитывать режим торгов — когда происходит покупка акций и когда они становятся твоими. В России это чаще всего два торговых дня. Необходимо понимать взаимосвязь между ценой акции и выплатой дивидендов.</p>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">📉 Дивидендный ГЭП</h4>
                    <p>После закрытия реестра акции могут упасть в цене на величину большую, чем размер выплачиваемых дивидендов. А на прежний уровень могут выйти только спустя 1,5 месяца или даже дольше. Иногда такое восстановление может длиться гораздо дольше.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>⚠️ Важно:</strong> Но бывают случаи, когда ГЭПа не происходит или акции падают несмотря на дивиденды. Это зависит от текущей бизнес-ситуации в компании.</p>
                        <p style="margin-top: 10px; font-size: 0.9em;"><strong>💡 Примечание:</strong> 1 торговый день = 1 рабочий день биржи (очень похож на производственный календарь, но зачастую также включает ещё несколько торгуемых дней).</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Каким образом можно заработать на акциях?</h3>
                </div>
                <p class="section-intro">Способ заработка на акциях во многом зависит от тренда, в который верит инвестор. Давай рассмотрим, что это означает.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🐂</div>
                        <h4>Растущий тренд («бычий»)</h4>
                        <p style="text-align: left; margin-top: 10px;">Это период времени на рынке, в течение которого происходит рост наблюдаемого инструмента. Причём важно именно изменение инструмента на начало и конец периода. «Бычьим» его называют из-за аналогии: как бык при битве поднимает врага на рога, так и тренд поднимается вверх.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🐻</div>
                        <h4>Падающий тренд («медвежий»)</h4>
                        <p style="text-align: left; margin-top: 10px;">Это период времени на рынке, в течение которого происходит падение стоимости наблюдаемого инструмента. «Медвежьим» его называют также из-за аналогии: как медведь при битве бьёт врага лапой сверху вниз, как будто забивает его, так и тренд падает вниз.</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>💡 Интересный факт:</strong></p>
                    <p style="margin-top: 10px;">Может быть, ты слышал фразу: «Сейчас на рынке побеждают медведи» (или быки). Это разные вариации и профессиональный юмор на тему быков и медведей, то есть направления тренда. Занимательно, что для экономики лучше именно «бычий рынок» — он говорит о росте и развитии. И «трейдеры-быки» живут в ожидании хороших событий, а «трейдеры-медведи» в ожидании плохих.</p>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Таким образом, на акциях можно зарабатывать двумя способами:</strong></p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li><strong>1. Купить, чтобы потом продать дороже.</strong> Такие операции называются лонгом, или длинной позицией.</li>
                    <li><strong>2. Продать акции, которых у тебя нет.</strong> Эти операции называются шортом, или короткой продажей.</li>
                </ul>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Лонг (long) — длинная позиция</h3>
                </div>
                <p class="section-intro">Так называется покупка акции с ожиданием её дальнейшего роста в цене и с целью продать её дороже через какое-то время. Такой способ используется, когда планируется заработать на росте или на «бычьем рынке». Чаще всего цена акций медленно растёт, а вот падает очень быстро. Поэтому такая позиция и получила название длинной.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💵 Покупка на заёмные средства</h4>
                    <p>Покупать ценные бумаги можно не только на собственные средства, но и брать у брокера заём в деньгах с целью купить больший пакет акций. Важно помнить — брокер в этом случае будет брать плату за заём, и если стоимость ценных бумаг снизится, то тебе необходимо будет компенсировать всё снижение. Но и доход в случае роста также весь будет твой. Обычно начинающие инвесторы используют для подобных сделок собственные средства.</p>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">📊 Пример</h4>
                    <p>Инвестор предполагает, что акции компании «ИКС» по 50 монеток недооценены и должны стоить более 70 монеток. В таком случае инвестор открывает длинную позицию, покупая 50 акций на 2 500 монеток. Если акции компании «ИКС» выросли до 70 монеток, инвестор продаёт их уже за 3 500 монеток, то есть на 1 тысячу дороже.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📉</span>
                    <h3>Шорт (short) — короткая позиция</h3>
                </div>
                <p class="section-intro">В противовес лонгу, шорт — это позиция, позволяющая заработать на падении. Технически это выглядит так: ты берёшь у брокера акции в долг по более высокой цене и продаёшь их на рынке. Затем, когда цена снизилась, ты покупаешь акции на рынке и возвращаешь брокеру долг в акциях. На практике это автоматизированный процесс.</p>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>⚠️ Важно обратить внимание:</strong></p>
                    <p style="margin-top: 10px;">За период, что акции будут у тебя в займе, ты будешь платить комиссию. Если акции наоборот будут расти в цене, то эта разница будет твоим убытком. Из-за рисков данного инструмента его используют для спекуляций.</p>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">📊 Пример</h4>
                    <p>Акции компании «ИКС» стоят 70 монеток. Трейдер считает, что цена будет падать до 50 монеток. Он берёт в долг у брокера 50 акций и продаёт их по 70 монеток за штуку. На его счёт приходит 3 500 монеток. Когда ценные бумаги компании «ИКС» подешевеют до 50 монеток, инвестор выкупит 50 акций за 2 500 монеток и возвратит их брокеру. Своих акций компании «ИКС» у трейдера как не было, так и нет, зато появилась прибыль в 1 000 монеток от сделок с ними.</p>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Важно:</strong> Открыть короткие позиции сложнее, чем длинные: сначала придётся брать акции у брокера, потом продавать их, потом выкупать.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>От чего зависит стоимость акций?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Растущий тренд</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Увеличение прибыли компании</li>
                            <li>✅ Положительный новостной фон</li>
                            <li>✅ Эффективное управление</li>
                            <li>✅ Ожидание инвесторов</li>
                            <li>✅ Увеличение стоимости компании</li>
                            <li>✅ Выкуп собственных акций (buyback) с последующим их погашением</li>
                            <li>✅ Высокие дивидендные выплаты</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📉</div>
                        <h4>Падающий тренд</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>⚠️ Негативные внешние факторы</li>
                            <li>⚠️ Резкое падение прибыли компании</li>
                            <li>⚠️ Несоответствие финансовой отчётности ожиданиям аналитиков</li>
                            <li>⚠️ Отрицательная оценка собственника и высшего руководства</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Рынок постоянно меняется:</strong> Никто не знает, как поведут себя акции в будущем.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🔍</span>
                                <strong>Диверсификация:</strong> Лучше рассматривать акции разных компаний и отраслей, не полагаясь только на что-то одно.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📈</span>
                                <strong>Анализ и долгосрочность:</strong> Чтобы снизить риски и получить шансы заработать, надо анализировать бизнес компании и инвестировать долгосрочно.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⏱️</span>
                                <strong>Особенность роста:</strong> Обычно рост акций происходит длительно, в то время как падают в цене акции довольно быстро.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Дивиденды:</strong> Доход от дивидендов во многом зависит от дивидендной политики компании.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Способы заработка:</strong> Зарабатывать на акциях можно как при их росте, так и при падении, но первый вариант проще и безопаснее.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь всё об акциях и способах заработка на них!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое IPO?",
                        options: [
                            "Только вторичный рынок",
                            "Первичное размещение акций (Initial Public Offering)",
                            "Только дивиденды",
                            "Только облигации"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем отличаются обыкновенные акции от привилегированных?",
                        options: [
                            "Ничем не отличаются",
                            "Обыкновенные дают право голосовать, привилегированные — фиксированный дивиденд и приоритет при ликвидации",
                            "Только размером дивидендов",
                            "Только правом голоса"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое «бычий» тренд?",
                        options: [
                            "Падающий тренд",
                            "Растущий тренд, когда цена акций поднимается вверх",
                            "Только боковой тренд",
                            "Только волатильность"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое лонг (длинная позиция)?",
                        options: [
                            "Продажа акций в долг",
                            "Покупка акции с ожиданием её дальнейшего роста в цене и с целью продать дороже",
                            "Только дивиденды",
                            "Только облигации"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое шорт (короткая позиция)?",
                        options: [
                            "Покупка акций",
                            "Позиция, позволяющая заработать на падении: берёшь акции в долг, продаёшь, затем выкупаешь дешевле",
                            "Только дивиденды",
                            "Только облигации"
                        ],
                        correct: 1
                    }
                ]
            },
            "3.9": {
                title: "Паевые фонды: открытые и биржевые",
                icon: "📦",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📦</span>
                    <h3>Паевые фонды: открытые и биржевые</h3>
                </div>
                <p class="section-intro">Давай теперь рассмотрим инструменты, объединённые общей инвестиционной идеей и не требующие активного участия инвестора. Начнём с паевых инвестиционных фондов (ПИФов), которые популярны во всём мире. Например, у каждого третьего жителя США есть их паи.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Что такое ПИФ?</h3>
                </div>
                <p class="section-intro">Паевые инвестиционные фонды (ПИФ) — это простой и доступный способ вложения денег с помощью профессиональных управляющих в ценные бумаги или недвижимость с возможностью получения большего дохода, чем по вкладам. Вложения в паевые фонды удобны для тех, кто не готов самостоятельно принимать инвестиционные решения из-за недостатка времени или опыта.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>🔄 Как это работает:</strong></p>
                    <p style="margin-top: 10px;">Управляющая компания создаёт паевый фонд, привлекая средства инвесторов — пайщиков. Фонд вкладывает средства пайщиков в облигации, акции, недвижимость и другие активы. Эти активы составляют имущество фонда. Инвесторы, покупая паи фонда, получают право собственности на долю в имуществе фонда.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📋 Стратегия фонда</strong> определяет, в какие ценности вкладываются средства пайщиков и какой допустимый инвестиционный риск. Более подробно о стратегиях инвестирования фондов ты можешь узнать на сайте управляющей компании.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>От чего зависит результат работы фонда?</h3>
                </div>
                <p class="section-intro">Решение о том, куда вложить средства фонда, принимает профессиональный управляющий. Ему помогает команда аналитиков. В зависимости от ситуации на рынке в состав фонда приобретаются активы с хорошим потенциалом роста и продаются те, которые уже отработали свою инвестиционную идею.</p>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>🎯 Задача управляющего:</strong></p>
                    <p style="margin-top: 10px;">Увеличивать стоимость имущества фонда и, как следствие, увеличивать доход пайщиков.</p>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>💰 Стоимость пая:</strong></p>
                    <p style="margin-top: 10px;">Стоимость пая каждого открытого фонда рассчитывается ежедневно. Её всегда можно посмотреть на сайте управляющей компании или в личном кабинете клиента. Она зависит и от качества управления фондом, и от ситуации на фондовом рынке — изменяется с учётом его роста или коррекции.</p>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Совет для начинающих:</strong> Начинающие инвесторы, как правило, выбирают паевые фонды облигаций — у них низкий уровень риска, и можно получить первый опыт инвестирования без опасения набить шишки.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">👥</span>
                    <h3>Кому подходит ПИФ?</h3>
                </div>
                <p class="section-intro">Этот инструмент доступен большинству из нас, при этом стоит помнить о его особенностях.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💵</div>
                        <h4>Доступность</h4>
                        <p style="text-align: left; margin-top: 10px;">Инвестиции в паевые фонды доступны многим — порог входа в открытые ПИФы составляет всего 100 монеток.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌍</div>
                        <h4>Возможности</h4>
                        <p style="text-align: left; margin-top: 10px;">Покупка паёв фондов даёт тебе возможность инвестировать в ведущие мировые компании из самых разных областей, покупать российские государственные ценные бумаги, недвижимость.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔄</div>
                        <h4>Ликвидность</h4>
                        <p style="text-align: left; margin-top: 10px;">Важное преимущество ПИФов — ты можешь продать или обменять паи практически в любой момент без потери накопленного дохода.</p>
                    </div>
                </div>

                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>⚠️ Важно помнить:</strong></p>
                    <p style="margin-top: 10px;">При вложении денег в ПИФы следует помнить главное — их доходность в прошлом не определяет её в будущем, а также не гарантируется государством. Это подходит тем, кто готов принимать риски инвестирования — ПИФы не застрахованы и могут в отдельные промежутки времени быть убыточными. При этом вся деятельность управляющих ПИФами компаний находится под строгим контролем Банка России.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Условия инвестирования в ПИФ</h3>
                </div>
                <p class="section-intro">При покупке или погашении паёв иногда тебе нужно заплатить комиссию. Найти полную информацию ты можешь на сайте управляющей компании, а также в личном кабинете и мобильном приложении.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💵</div>
                        <h4>Комиссия при покупке</h4>
                        <p style="text-align: left; margin-top: 10px;">Комиссия при покупке паёв зависит от суммы инвестирования, её может и не быть.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📅</div>
                        <h4>Комиссия при погашении</h4>
                        <p style="text-align: left; margin-top: 10px;">Комиссия при погашении паёв зависит от срока владения паями. Если ты владел паями больше 3 лет, комиссия не взимается.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏠</span>
                    <h3>Закрытые паевые инвестиционные фонды (ЗПИФ)</h3>
                </div>
                <p class="section-intro">Помимо открытых ПИФов, которые продаются свободно и не ограничены во времени покупки-продажи, существуют закрытые паевые инвестиционные фонды (ЗПИФ). Их назвали так потому, что пай в фонде можно приобрести только в момент выпуска ценных бумаг, а погасить — только в конце срока действия фонда.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>🏢 Управление:</strong></p>
                    <p style="margin-top: 10px;">Фондом управляет лицензированная управляющая компания, и в её интересах сделать так, чтобы прибыль инвесторов росла. Например, управляющие компании предлагают инвестиции в складскую и коммерческую недвижимость.</p>
                </div>

                <div class="theory-section" style="margin-top: 20px;">
                    <h4 style="color: #1976D2;">🏠 Недвижимость</h4>
                    <p>Это традиционный вид инвестиций в России, который призван сохранить капитал и защитить сбережения от инфляции. Но это также важная часть для сбалансированного инвестиционного портфеля. Недвижимость создаёт устойчивость портфеля, предусматривает получение регулярного дохода, и в перспективе она потенциально становится дороже, что может обеспечить доход при её продаже.</p>
                    
                    <div class="income-cards" style="margin-top: 20px;">
                        <div class="income-card">
                            <div class="income-icon">💵</div>
                            <h4>Плата от арендаторов</h4>
                            <p style="text-align: left; margin-top: 10px;">Основную часть дохода инвестору приносят арендные платежи от сдачи коммерческой недвижимости.</p>
                        </div>
                        
                        <div class="income-card">
                            <div class="income-icon">📈</div>
                            <h4>Продажа недвижимости</h4>
                            <p style="text-align: left; margin-top: 10px;">Спрос на современные коммерческие помещения в качественных локациях растёт, поэтому потенциально ты сможешь заработать на росте цены объекта при продаже своих паёв.</p>
                        </div>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⏱️ Долгосрочная инвестиция:</strong></p>
                    <p style="margin-top: 10px;">Инвестиции в недвижимость — это всегда долгосрочная инвестиция. Так же и в ЗПИФ — средний срок фонда составляет 5–10 лет, при этом инвестор может продать свои паи на бирже или любому другому человеку по договору купли-продажи.</p>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💎</div>
                        <h4>Преимущества ЗПИФ</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Низкий порог входа (от 100 000 монеток)</li>
                            <li>🏆 Первоклассные объекты инвестирования (класс А)</li>
                            <li>💰 Периодическая выплата дохода</li>
                            <li>📈 Высокие перспективы роста</li>
                            <li>✅ Отсутствие хлопот (не нужно тратить время на покупку, обслуживание, страхование)</li>
                        </ul>
                    </div>
                </div>

                <p class="myth-busting" style="margin-top: 20px;"><strong>💡 Как инвестировать:</strong> Инвестировать в ЗПИФ можно самостоятельно — через специальные приложения или личный кабинет брокера. А ещё можно лично обратиться в офис управляющей компании или к уполномоченным посредникам и там подать заявку.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Биржевые паевые фонды (БПИФ)</h3>
                </div>
                <p class="section-intro">Для тех, кто хочет следовать за рынком, есть инвестирование в биржевые фонды — это простой способ купить ценные бумаги компаний из определённой отрасли или даже целой страны с минимальными затратами.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📊 Что такое БПИФ (ETF)?</h4>
                    <p>Биржевые паевые инвестиционные фонды (БПИФ), или ETF (Exchange Traded Fund) — это фонды, паи которых можно купить и продать на бирже. Они формируются из ценных бумаг с высокой степенью соответствия составу и структуре биржевого индекса, например, индекса МосБиржи.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Биржевые индексы</h3>
                </div>
                <p class="section-intro">В мире есть сотни тысяч компаний, ценные бумаги которых торгуются на бирже. Отслеживать изменения по каждой компании, чтобы сделать выводы о конкретном бизнесе, отрасли или по рынку в целом, очень сложно. Для упрощения этой задачи экономисты создали биржевые индексы — расчётные показатели, которые отражают текущее состояние рынка ценных бумаг по выбранному направлению. Расчётом индексов занимаются независимые компании.</p>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>📈 Как формируется индекс:</strong></p>
                    <p style="margin-top: 10px;">Индексы рассчитываются по совокупности ценных бумаг крупнейших компаний в экономике страны или в конкретной отрасли. Выбранные в индекс компании учитываются в разной пропорции — как ингредиенты в салате. Крупные организации имеют больший вес, небольшие компании — меньший.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>📊 Динамика индекса:</strong> Изменение индекса называют динамикой. По динамике индекса можно увидеть, как растёт или падает экономика страны или отрасли на разных промежутках времени.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Биржевые фонды</h3>
                </div>
                <p class="section-intro">Индекс — это число, расчётная величина. Но говорят, что в индекс можно инвестировать. Это значит, что ты можешь приобрести ценные бумаги, входящие в индекс, в такой же пропорции. Это потребует серьёзных вложений средств и постоянного отслеживания изменений. Однако есть более простой и доступный способ инвестировать в индекс — купить акции БПИФ, построенного на его основе.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <p><strong>📦 БПИФ (ETF) — это фонд, торгуемый на бирже.</strong></p>
                    <p style="margin-top: 10px;">БПИФы привлекают деньги инвесторов в заранее известный биржевой индекс — сектор промышленности, рынок страны или большого региона или, например, драгоценные металлы. Это могут быть как глобальные индексы, так и специально рассчитанные.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>💡 Особенности:</strong></p>
                        <ul style="margin-left: 20px;">
                            <li>Доходность биржевого фонда напрямую зависит от изменения индекса, на основе которого он создан, и не требует специального управления.</li>
                            <li>В отличие от ПИФ, в акции БПИФ можно инвестировать и в иностранной валюте. Но такие покупки доступны только квалифицированным инвесторам.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Преимущества БПИФ</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🔄</div>
                        <h4>Ликвидные</h4>
                        <p style="text-align: left; margin-top: 10px;">Можно купить/продать в любое время по биржевой цене.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔍</div>
                        <h4>Прозрачные</h4>
                        <p style="text-align: left; margin-top: 10px;">Структура фонда соответствует индексу и доступна онлайн.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📦</div>
                        <h4>Диверсифицированные</h4>
                        <p style="text-align: left; margin-top: 10px;">В индексе ценные бумаги множества компаний.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Выгодные</h4>
                        <p style="text-align: left; margin-top: 10px;">Низкий размер комиссий.</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>👤 Биржевые фонды подойдут тебе, если ты:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>✅ Хочешь привязать свои вложения к определённому индексу</li>
                        <li>✅ Нацелен получить доход выше вкладов</li>
                        <li>✅ Ценишь прозрачность и точность</li>
                        <li>✅ Заинтересован диверсифицировать вложения</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🆚</span>
                    <h3>Сравнение открытых и биржевых ПИФов</h3>
                </div>
                <p class="section-intro">Чтобы ты мог выбрать то, что подходит именно тебе, давай сравним открытые и биржевые ПИФы.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🔄</div>
                        <h4>Открытые ПИФы (ОПИФ)</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Покупка/продажа через управляющую компанию</li>
                            <li>✅ Активное управление портфелем</li>
                            <li>✅ Гибкая стратегия инвестирования</li>
                            <li>✅ Ежедневный расчёт стоимости пая</li>
                            <li>⚠️ Могут быть комиссии при покупке/продаже</li>
                            <li>⚠️ Нужно проверять стоимость пая ежедневно</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Биржевые ПИФы (БПИФ/ETF)</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Покупка/продажа на бирже как акция</li>
                            <li>✅ Пассивное управление (следует индексу)</li>
                            <li>✅ Прозрачная структура (соответствует индексу)</li>
                            <li>✅ Торгуется в реальном времени</li>
                            <li>✅ Низкие комиссии</li>
                            <li>✅ Высокая ликвидность</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📱</span>
                    <h3>Как инвестировать в биржевые фонды?</h3>
                </div>
                <p class="section-intro">Для инвестирования в БПИФ тебе нужно открыть брокерский счёт. После этого ты сможешь покупать и продавать акции биржевых фондов точно так же, как обычные акции компаний.</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>💡 Шаги для инвестирования:</strong></p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>Открыть брокерский счёт</li>
                        <li>Пополнить счёт средствами</li>
                        <li>Выбрать БПИФ, соответствующий интересующему тебя индексу</li>
                        <li>Купить акции фонда на бирже</li>
                        <li>Отслеживать изменения стоимости через приложение или личный кабинет</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📦</span>
                                <strong>ПИФ:</strong> Простой и доступный способ вложения денег с помощью профессиональных управляющих. Порог входа — от 100 монеток.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🔄</span>
                                <strong>ОПИФ:</strong> Открытые фонды с ежедневным расчётом стоимости пая и высокой ликвидностью.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏠</span>
                                <strong>ЗПИФ:</strong> Закрытые фонды для долгосрочных инвестиций в недвижимость (5–10 лет).
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📈</span>
                                <strong>БПИФ (ETF):</strong> Биржевые фонды, следующие индексу, с низкими комиссиями и высокой ликвидностью.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Важно:</strong> Доходность в прошлом не гарантирует доходность в будущем. ПИФы не застрахованы и могут быть убыточными в отдельные периоды.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь всё о паевых фондах!</p>
                </div>
            </div>
        `,
                practice: {},
        finalTest: [
            {
                        question: "Что такое ПИФ?",
                options: [
                            "Только биржевой фонд",
                            "Паевой инвестиционный фонд — простой способ вложения денег с помощью профессиональных управляющих",
                            "Только закрытый фонд",
                            "Только депозит"
                ],
                correct: 1
            },
            {
                        question: "Что такое БПИФ (ETF)?",
                options: [
                            "Только открытый фонд",
                            "Биржевой паевой инвестиционный фонд, паи которого можно купить и продать на бирже, следующий индексу",
                            "Только закрытый фонд",
                            "Только облигации"
                ],
                correct: 1
            },
            {
                        question: "Что такое ЗПИФ?",
                options: [
                            "Только открытый фонд",
                            "Закрытый паевой инвестиционный фонд, пай в котором можно приобрести только в момент выпуска, а погасить только в конце срока",
                            "Только биржевой фонд",
                            "Только акции"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какой порог входа в открытые ПИФы?",
                options: [
                            "10 000 монеток",
                            "100 монеток",
                            "1 000 000 монеток",
                            "50 000 монеток"
                ],
                correct: 1
            },
            {
                        question: "Что такое биржевой индекс?",
                options: [
                            "Только цена одной акции",
                            "Расчётный показатель, отражающий текущее состояние рынка ценных бумаг по выбранному направлению",
                            "Только облигации",
                            "Только валюта"
                ],
                correct: 1
                    }
                ]
            }
        }
    },
    5: {
        title: "Блок 5: Недвижимость",
        icon: "🏠",
        overview: {
            title: "Всё о недвижимости: от аренды до инвестиций",
            intro: "Разберёмся, что такое недвижимость, как на неё накопить, стоит ли брать ипотеку и можно ли зарабатывать на недвижимости. Узнай всё, что нужно знать о квартирах, домах и инвестициях в недвижимость!",
            learningPoints: [
                "Что такое недвижимость и какие виды бывают",
                "Аренда или покупка: что выгоднее в твоей ситуации",
                "Как накопить на первый взнос для покупки квартиры",
                "Что такое ипотека и как она работает",
                "Как зарабатывать на недвижимости: сдавать в аренду"
            ],
            lessons: [
                {
                    id: 5.1,
                    title: "Что такое недвижимость и зачем она нужна",
                    duration: "8 мин",
                    icon: "🏠",
                    status: "available"
                },
                {
                    id: 5.2,
                    title: "Аренда или покупка: что выбрать?",
                    duration: "10 мин",
                    icon: "🔑",
                    status: "available"
                },
                {
                    id: 5.3,
                    title: "Как накопить на первый взнос",
                    duration: "9 мин",
                    icon: "💰",
                    status: "available"
                },
                {
                    id: 5.4,
                    title: "Ипотека: что это и как работает",
                    duration: "10 мин",
                    icon: "📋",
                    status: "available"
                },
                {
                    id: 5.5,
                    title: "Инвестиции в недвижимость: пассивный доход",
                    duration: "9 мин",
                    icon: "📈",
                    status: "available"
                },
                {
                    id: 5.6,
                    title: "Как выбрать квартиру: на что обращать внимание",
                    duration: "10 мин",
                    icon: "🔍",
                    status: "available"
                },
                {
                    id: 5.7,
                    title: "Коммунальные платежи: сколько стоит содержание",
                    duration: "8 мин",
                    icon: "💡",
                    status: "available"
                },
                {
                    id: 5.8,
                    title: "Защита от мошенников при покупке недвижимости",
                    duration: "9 мин",
                    icon: "🛡️",
                    status: "available"
                }
            ]
        },
        lessons: {
            "5.1": {
                title: "Что такое недвижимость и зачем она нужна",
                icon: "🏠",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏠</span>
                    <h3>Что такое недвижимость и зачем она нужна</h3>
                </div>
                <p class="section-intro">Представь, что ты живёшь в квартире или доме. Это и есть недвижимость! Но недвижимость — это не просто место, где ты спишь. Это актив, который может стоить миллионы монеток и даже приносить доход. Давай разберёмся, что это такое и зачем тебе это знать уже сейчас.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>Что такое недвижимость?</h3>
                </div>
                <p class="section-intro"><strong>Недвижимость</strong> — это всё, что нельзя просто взять и перенести: квартиры, дома, земельные участки, офисы, магазины. В отличие от телефона или ноутбука, недвижимость "привязана" к земле.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Жилая недвижимость</h4>
                        <p style="text-align: left; margin-top: 10px;">Квартиры, дома, комнаты — то, где люди живут.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Можно жить самому</li>
                            <li>✅ Можно сдавать в аренду</li>
                            <li>✅ Можно продать и заработать</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Коммерческая недвижимость</h4>
                        <p style="text-align: left; margin-top: 10px;">Офисы, магазины, склады — то, где ведётся бизнес.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💼 Сдаётся бизнесу</li>
                            <li>💰 Обычно дороже жилой</li>
                            <li>📈 Может приносить хороший доход</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌳</div>
                        <h4>Земельные участки</h4>
                        <p style="text-align: left; margin-top: 10px;">Земля, на которой можно строить или выращивать что-то.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🏗️ Можно построить дом</li>
                            <li>🌾 Можно использовать для бизнеса</li>
                            <li>📊 Может дорожать со временем</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Зачем тебе знать о недвижимости уже сейчас?</h3>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">🎯 Пример из жизни</h4>
                    <p>Представь, что тебе 18 лет, ты закончил школу и поступил в университет в другом городе. У тебя есть два варианта:</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Вариант 1: Снимать квартиру</strong></p>
                        <p>Ты платишь 20 000 монеток в месяц за аренду. За 4 года учёбы это: 20 000 × 12 × 4 = <strong>960 000 монеток</strong> 💸</p>
                        <p style="margin-top: 10px;">И что? После учёбы у тебя ничего не осталось — все деньги ушли на аренду.</p>
                        
                        <p style="margin-top: 15px;"><strong>Вариант 2: Купить квартиру в ипотеку</strong></p>
                        <p>Ты берёшь ипотеку, платишь примерно столько же (20 000–25 000 монеток в месяц), но через 4 года у тебя уже есть своя квартира! 🏠</p>
                        <p style="margin-top: 10px;">После учёбы ты можешь остаться в этой квартире или сдать её в аренду и получать доход.</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🎓</div>
                        <h4>Планирование будущего</h4>
                        <p style="text-align: left; margin-top: 10px;">Чем раньше ты начнёшь думать о недвижимости, тем больше времени у тебя будет накопить и подготовиться.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Финансовая независимость</h4>
                        <p style="text-align: left; margin-top: 10px;">Своя квартира = не нужно платить аренду = больше денег на другие цели.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Инвестиции</h4>
                        <p style="text-align: left; margin-top: 10px;">Недвижимость может дорожать и приносить доход от аренды — это способ зарабатывать деньги.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Почему недвижимость дорожает?</h3>
                </div>
                <p class="section-intro">Недвижимость обычно дорожает со временем. Это происходит по нескольким причинам:</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Инфляция</h4>
                        <p style="text-align: left; margin-top: 10px;">С каждым годом деньги теряют ценность, а недвижимость остаётся. То, что стоило 3 млн монеток 5 лет назад, сейчас может стоить 4–5 млн.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏙️</div>
                        <h4>Развитие района</h4>
                        <p style="text-align: left; margin-top: 10px;">Если рядом построили метро, школу, торговый центр — квартиры в этом районе становятся дороже.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">👥</div>
                        <h4>Спрос и предложение</h4>
                        <p style="text-align: left; margin-top: 10px;">Чем больше людей хотят купить квартиру, тем выше цена. В больших городах спрос всегда высокий.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏠</span>
                                <strong>Недвижимость</strong> — это квартиры, дома, земля, офисы. Всё, что нельзя просто перенести.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Зачем знать сейчас:</strong> Чем раньше начнёшь планировать, тем больше времени накопить и подготовиться.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📈</span>
                                <strong>Недвижимость дорожает</strong> из-за инфляции, развития районов и высокого спроса.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Своя квартира</strong> = финансовая независимость и возможность зарабатывать на аренде.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь основы недвижимости!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое недвижимость?",
                options: [
                            "Только квартиры",
                            "Всё, что нельзя просто перенести: квартиры, дома, земля, офисы",
                            "Только дома",
                            "Только земля"
                        ],
                        correct: 1
                    },
                    {
                        question: "Почему недвижимость обычно дорожает?",
                        options: [
                            "Только из-за инфляции",
                            "Из-за инфляции, развития районов и высокого спроса",
                            "Только из-за спроса",
                            "Она не дорожает"
                        ],
                        correct: 1
                    },
                    {
                        question: "Зачем знать о недвижимости уже в подростковом возрасте?",
                        options: [
                            "Не нужно знать",
                            "Чтобы раньше начать планировать и накапливать деньги",
                            "Только для инвестиций",
                            "Только для покупки"
                ],
                correct: 1
            }
        ]
            },
            "5.2": {
                title: "Аренда или покупка: что выбрать?",
                icon: "🔑",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔑</span>
                    <h3>Аренда или покупка: что выбрать?</h3>
                </div>
                <p class="section-intro">Когда ты вырастешь и захочешь жить отдельно, перед тобой встанет выбор: снимать квартиру или покупать свою? Оба варианта имеют свои плюсы и минусы. Давай разберёмся, что подойдёт именно тебе!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏠</span>
                    <h3>Аренда квартиры</h3>
                </div>
                <p class="section-intro">Аренда — это когда ты платишь деньги каждый месяц, чтобы жить в чужой квартире. Ты не становишься владельцем, просто временно используешь жильё.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы аренды</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Не нужен большой стартовый капитал</li>
                            <li>🔄 Можно легко переехать</li>
                            <li>🛠️ Ремонт — забота хозяина</li>
                            <li>📋 Не нужно оформлять ипотеку</li>
                            <li>🎯 Подходит для временного проживания</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Минусы аренды</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💸 Деньги "уходят в никуда"</li>
                            <li>📈 Аренда может дорожать</li>
                            <li>🏠 Могут попросить съехать</li>
                            <li>🚫 Нельзя делать капитальный ремонт</li>
                            <li>💰 За 10 лет можно "выбросить" миллионы</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💸 Пример: Сколько уйдёт на аренду?</h4>
                    <p>Допустим, ты снимаешь квартиру за 25 000 монеток в месяц.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>За 1 год:</strong> 25 000 × 12 = 300 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>За 5 лет:</strong> 300 000 × 5 = 1 500 000 монеток (полтора миллиона!)</p>
                        <p style="margin-top: 10px;"><strong>За 10 лет:</strong> 300 000 × 10 = 3 000 000 монеток (три миллиона!)</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #c62828;">И что? После 10 лет у тебя нет ни квартиры, ни этих денег. Всё ушло на аренду.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏡</span>
                    <h3>Покупка квартиры</h3>
                </div>
                <p class="section-intro">Покупка — это когда ты становишься владельцем квартиры. Ты можешь жить в ней, делать ремонт, сдавать в аренду или продать.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы покупки</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🏠 Квартира — твоя собственность</li>
                            <li>📈 Квартира может дорожать</li>
                            <li>💰 Можно сдавать и зарабатывать</li>
                            <li>🛠️ Можешь делать любой ремонт</li>
                            <li>🔒 Никто не выгонит</li>
                            <li>💎 Это актив, который растёт в цене</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Минусы покупки</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💵 Нужен большой стартовый капитал</li>
                            <li>📋 Нужно оформлять ипотеку</li>
                            <li>🔄 Сложнее переехать</li>
                            <li>🛠️ Ремонт — твоя забота</li>
                            <li>📊 Нужно платить налоги</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">💰 Пример: Покупка в ипотеку</h4>
                    <p>Ты покупаешь квартиру за 5 000 000 монеток. Первый взнос 1 000 000 монеток, остальное в ипотеку на 20 лет.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Платеж по ипотеке:</strong> ~30 000 монеток в месяц (примерно как аренда)</p>
                        <p style="margin-top: 10px;"><strong>Через 20 лет:</strong> Квартира полностью твоя! И она уже может стоить 7–8 миллионов.</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">✅ Ты платил столько же, сколько за аренду, но теперь у тебя есть квартира стоимостью миллионы!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤔</span>
                    <h3>Когда что выбирать?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Выбирай аренду, если:</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🎓 Учишься в другом городе</li>
                            <li>🔄 Планируешь часто переезжать</li>
                            <li>💵 Нет денег на первый взнос</li>
                            <li>⏱️ Нужно жильё на короткий срок</li>
                            <li>🎯 Ещё не определился с городом</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏡</div>
                        <h4>Выбирай покупку, если:</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Есть деньги на первый взнос</li>
                            <li>📍 Определился с городом и районом</li>
                            <li>⏰ Планируешь жить долго</li>
                            <li>💼 Есть стабильный доход</li>
                            <li>📈 Хочешь инвестировать в недвижимость</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Золотое правило</h3>
                </div>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>💎 Помни:</strong> Аренда — это расход. Покупка — это инвестиция.</p>
                    <p style="margin-top: 15px;">Когда ты снимаешь квартиру, ты каждый месяц тратишь деньги, и они просто исчезают. Когда ты покупаешь квартиру, ты вкладываешь деньги в актив, который может дорожать и приносить доход.</p>
                    <p style="margin-top: 15px; font-weight: bold;">Но это не значит, что аренда — это плохо! Иногда она — единственный разумный вариант. Главное — понимать разницу и принимать осознанное решение.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏠</span>
                                <strong>Аренда:</strong> Удобно для временного проживания, но деньги "уходят в никуда".
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏡</span>
                                <strong>Покупка:</strong> Требует больше денег, но квартира становится твоим активом.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Выбор зависит от ситуации:</strong> Где живёшь, сколько денег есть, как долго планируешь оставаться.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💎</span>
                                <strong>Помни:</strong> Аренда — расход, покупка — инвестиция.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выбрать между арендой и покупкой!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое аренда?",
                        options: [
                            "Покупка квартиры",
                            "Временное использование чужой квартиры за плату",
                            "Бесплатное проживание",
                            "Продажа квартиры"
                        ],
                        correct: 1
                    },
                    {
                        question: "Главный минус аренды?",
                        options: [
                            "Нужен большой капитал",
                            "Деньги уходят, и ничего не остаётся",
                            "Нужно делать ремонт",
                            "Нельзя переехать"
                        ],
                        correct: 1
                    },
                    {
                        question: "Главный плюс покупки квартиры?",
                        options: [
                            "Не нужно платить",
                            "Квартира становится твоим активом, который может дорожать",
                            "Можно легко переехать",
                            "Не нужно делать ремонт"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.3": {
                title: "Как накопить на первый взнос",
                icon: "💰",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Как накопить на первый взнос</h3>
                </div>
                <p class="section-intro">Чтобы купить квартиру в ипотеку, нужен первый взнос — обычно это 15–20% от стоимости квартиры. Для квартиры за 5 миллионов это 750 000–1 000 000 монеток. Много? Да! Но накопить реально, если начать рано и делать это правильно.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Сколько нужно накопить?</h3>
                </div>
                <p class="section-intro">Первый взнос обычно составляет 15–20% от стоимости квартиры. Чем больше первый взнос, тем меньше переплата по ипотеке и ниже ежемесячный платёж.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Квартира за 3 млн</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Первый взнос (20%):</strong> 600 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Ипотека:</strong> 2 400 000 монеток</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏡</div>
                        <h4>Квартира за 5 млн</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Первый взнос (20%):</strong> 1 000 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Ипотека:</strong> 4 000 000 монеток</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏘️</div>
                        <h4>Квартира за 7 млн</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Первый взнос (20%):</strong> 1 400 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Ипотека:</strong> 5 600 000 монеток</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📅</span>
                    <h3>План накопления: примеры</h3>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Пример 1: Начинаешь в 16 лет</h4>
                    <p>Ты решил начать копить на квартиру в 16 лет. Цель: 1 000 000 монеток к 25 годам (через 9 лет).</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Если откладывать по 10 000 монеток в месяц:</strong></p>
                        <p>10 000 × 12 = 120 000 монеток в год</p>
                        <p>120 000 × 9 = 1 080 000 монеток за 9 лет ✅</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">Отлично! Ты достигнешь цели даже раньше!</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">💡 Пример 2: Начинаешь в 18 лет</h4>
                    <p>Ты закончил школу, поступил в университет, начал подрабатывать. Цель: 1 000 000 монеток к 28 годам (через 10 лет).</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Если откладывать по 8 000 монеток в месяц:</strong></p>
                        <p>8 000 × 12 = 96 000 монеток в год</p>
                        <p>96 000 × 10 = 960 000 монеток за 10 лет</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">Почти достиг цели! Можно немного увеличить сумму или подождать ещё пару месяцев.</p>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💡 Пример 3: Начинаешь в 20 лет</h4>
                    <p>Ты уже работаешь, получаешь зарплату. Цель: 1 000 000 монеток к 30 годам (через 10 лет).</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Если откладывать по 15 000 монеток в месяц:</strong></p>
                        <p>15 000 × 12 = 180 000 монеток в год</p>
                        <p>180 000 × 10 = 1 800 000 монеток за 10 лет</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">Отлично! Ты накопишь даже больше, чем нужно!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Откуда брать деньги для накопления?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💵</div>
                        <h4>Подработка</h4>
                        <p style="text-align: left; margin-top: 10px;">Репетиторство, доставка, помощь в магазине — всё это может приносить 10 000–30 000 монеток в месяц.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> Даже 5 000 монеток в месяц — это 60 000 в год!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🎁</div>
                        <h4>Подарки и стипендия</h4>
                        <p style="text-align: left; margin-top: 10px;">Деньги на день рождения, Новый год, стипендия — откладывай хотя бы часть!</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> 50% от подарков = хорошее начало!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Экономия</h4>
                        <p style="text-align: left; margin-top: 10px;">Не покупай каждый раз кофе навынос, готовь дома, ищи скидки — экономия может быть 3 000–5 000 монеток в месяц.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> Маленькая экономия = большие накопления!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏦</span>
                    <h3>Где хранить накопления?</h3>
                </div>
                <p class="section-intro">Не храни деньги под подушкой! Они должны работать и приносить доход.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💎</div>
                        <h4>Накопительный счёт</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Процент:</strong> 5–8% годовых</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Можно снять в любой момент</li>
                            <li>✅ Безопасно (застраховано до 1,4 млн)</li>
                            <li>✅ Проценты начисляются каждый месяц</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Вклад</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Процент:</strong> 6–10% годовых</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Выше процент, чем на накопительном</li>
                            <li>⚠️ Обычно нельзя снять досрочно без потери процентов</li>
                            <li>✅ Безопасно (застраховано до 1,4 млн)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Инвестиции</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доходность:</strong> 10–15% годовых (но есть риск)</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Может принести больше дохода</li>
                            <li>⚠️ Есть риск потерять часть денег</li>
                            <li>💡 Подходит, если до покупки ещё далеко</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💰 Пример: Сложный процент</h4>
                    <p>Ты откладываешь 10 000 монеток в месяц на накопительный счёт под 7% годовых.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>За 1 год:</strong> 120 000 монеток + проценты ≈ 128 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>За 5 лет:</strong> 600 000 монеток + проценты ≈ 720 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>За 10 лет:</strong> 1 200 000 монеток + проценты ≈ 1 700 000 монеток</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">Проценты дают тебе дополнительные 500 000 монеток за 10 лет!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Правила успешного накопления</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🎯 Поставь цель:</strong> Определи, сколько нужно и к какому сроку.</li>
                        <li style="margin: 10px 0;"><strong>💰 Откладывай сразу:</strong> Как только получил деньги — сразу отложи нужную сумму. Не жди, пока что-то останется.</li>
                        <li style="margin: 10px 0;"><strong>🏦 Отдельный счёт:</strong> Открой отдельный счёт для накоплений, чтобы не тратить эти деньги.</li>
                        <li style="margin: 10px 0;"><strong>📊 Следи за прогрессом:</strong> Записывай, сколько накопил, и радуйся каждому шагу к цели!</li>
                        <li style="margin: 10px 0;"><strong>💪 Не сдавайся:</strong> Даже если пропустил месяц — продолжай! Главное — регулярность.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Первый взнос:</strong> Обычно 15–20% от стоимости квартиры. Для квартиры за 5 млн это 750 000–1 000 000 монеток.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⏱️</span>
                                <strong>Начать рано:</strong> Чем раньше начнёшь копить, тем легче достичь цели. Даже 5 000–10 000 монеток в месяц — это уже начало!
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏦</span>
                                <strong>Хранить правильно:</strong> Не под подушкой! Используй накопительный счёт или вклад, чтобы деньги работали и приносили проценты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💪</span>
                                <strong>Главное — регулярность:</strong> Откладывай каждый месяц, даже если немного. Со временем это превратится в большую сумму!
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как накопить на первый взнос!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Сколько обычно составляет первый взнос при покупке квартиры?",
                        options: [
                            "5–10% от стоимости",
                            "15–20% от стоимости квартиры",
                            "50% от стоимости",
                            "100% от стоимости"
                        ],
                        correct: 1
                    },
                    {
                        question: "Где лучше хранить накопления на первый взнос?",
                        options: [
                            "Под подушкой",
                            "На накопительном счёте или во вкладе, чтобы деньги приносили проценты",
                            "В копилке",
                            "В кармане"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что важнее при накоплении?",
                        options: [
                            "Откладывать большие суммы редко",
                            "Регулярно откладывать даже небольшие суммы каждый месяц",
                            "Откладывать только подарки",
                            "Не откладывать вообще"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.4": {
                title: "Ипотека: что это и как работает",
                icon: "📋",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Ипотека: что это и как работает</h3>
                </div>
                <p class="section-intro">Ипотека — это способ купить квартиру, даже если у тебя нет всей суммы сразу. Ты берёшь деньги в долг у банка, покупаешь квартиру, а потом возвращаешь долг частями каждый месяц. Давай разберёмся, как это работает и стоит ли это делать!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔑</span>
                    <h3>Как работает ипотека?</h3>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📊 Простой пример</h4>
                    <p>Ты хочешь купить квартиру за 5 000 000 монеток. У тебя есть только 1 000 000 монеток (первый взнос).</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Что происходит:</strong></p>
                        <ol style="margin-left: 20px; margin-top: 10px;">
                            <li>Ты даёшь банку свой первый взнос: 1 000 000 монеток</li>
                            <li>Банк даёт тебе в долг: 4 000 000 монеток</li>
                            <li>Ты покупаешь квартиру за 5 000 000 монеток</li>
                            <li>Квартира становится твоей, но банк держит её в залоге</li>
                            <li>Ты возвращаешь банку 4 000 000 монеток + проценты каждый месяц</li>
                            <li>Когда вернёшь всё — квартира полностью твоя!</li>
                        </ol>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы ипотеки</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🏠 Можно купить квартиру сейчас</li>
                            <li>📈 Квартира может дорожать</li>
                            <li>💰 Можно сдавать в аренду</li>
                            <li>🔒 Никто не выгонит</li>
                            <li>💎 Квартира — твой актив</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Минусы ипотеки</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💸 Нужно платить проценты</li>
                            <li>📋 Долг на много лет</li>
                            <li>⚠️ Если не платишь — банк заберёт квартиру</li>
                            <li>💰 Нужен стабильный доход</li>
                            <li>📊 Переплата может быть большой</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Сколько стоит ипотека?</h3>
                </div>
                <p class="section-intro">Ипотека — это не только сумма, которую ты взял в долг, но и проценты, которые ты платишь банку за то, что он дал тебе деньги.</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💸 Пример: Сколько переплатишь?</h4>
                    <p>Ты взял ипотеку 4 000 000 монеток на 20 лет под 10% годовых.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Ежемесячный платёж:</strong> ~38 600 монеток</p>
                        <p style="margin-top: 10px;"><strong>За 20 лет заплатишь:</strong> 38 600 × 12 × 20 = 9 264 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>Переплата:</strong> 9 264 000 - 4 000 000 = <strong style="color: #c62828;">5 264 000 монеток</strong></p>
                        <p style="margin-top: 15px; font-weight: bold;">Да, переплата большая. Но зато у тебя есть квартира, которая может стоить уже 7–8 миллионов!</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Что влияет на процент?</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Размер первого взноса (больше взнос = ниже процент)</li>
                            <li>📋 Срок ипотеки (дольше срок = выше процент)</li>
                            <li>💼 Твой доход и кредитная история</li>
                            <li>🏠 Тип недвижимости</li>
                            <li>📈 Ключевая ставка Банка России</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Как снизить процент?</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Увеличить первый взнос</li>
                            <li>📋 Выбрать меньший срок</li>
                            <li>✅ Иметь хорошую кредитную историю</li>
                            <li>💼 Показать стабильный доход</li>
                            <li>🎯 Использовать льготные программы</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Важные правила ипотеки</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">🚨 Что будет, если не платить?</h4>
                    <p>Если ты перестанешь платить по ипотеке, банк может забрать квартиру. Это называется "обращение взыскания на заложенное имущество".</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>⚠️ Важно:</strong> Ипотеку нужно брать только если ты уверен, что сможешь платить каждый месяц на протяжении всего срока!</p>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">✅ Правило 30%</h4>
                    <p>Финансовые эксперты советуют: платёж по ипотеке не должен превышать 30% от твоего дохода.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Пример:</strong> Если твой доход 100 000 монеток в месяц, то платёж по ипотеке не должен быть больше 30 000 монеток.</p>
                        <p style="margin-top: 10px;">Почему? Потому что у тебя должны оставаться деньги на жизнь, еду, развлечения и непредвиденные расходы!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Когда стоит брать ипотеку?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Бери ипотеку, если:</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Есть стабильный доход</li>
                            <li>💵 Есть деньги на первый взнос</li>
                            <li>📍 Определился с городом и районом</li>
                            <li>⏰ Планируешь жить долго</li>
                            <li>📊 Платёж не больше 30% дохода</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Не бери ипотеку, если:</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💸 Доход нестабильный</li>
                            <li>🚫 Нет денег на первый взнос</li>
                            <li>🔄 Планируешь часто переезжать</li>
                            <li>⚠️ Платёж больше 30% дохода</li>
                            <li>❓ Ещё не определился с планами</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Льготные программы</h3>
                </div>
                <p class="section-intro">В России есть программы, которые помогают молодым людям купить квартиру на более выгодных условиях.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">👨‍👩‍👧</div>
                        <h4>Молодая семья</h4>
                        <p style="text-align: left; margin-top: 10px;">Если тебе меньше 35 лет и у тебя есть семья, можешь получить субсидию от государства на покупку квартиры.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🎓</div>
                        <h4>Сельская ипотека</h4>
                        <p style="text-align: left; margin-top: 10px;">Если готов переехать в сельскую местность, можешь получить ипотеку под очень низкий процент (2–3%).</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📋</span>
                                <strong>Ипотека</strong> — это способ купить квартиру, взяв деньги в долг у банка и возвращая их частями.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Переплата:</strong> Ты платишь не только сумму долга, но и проценты. Переплата может быть большой, но зато у тебя есть квартира.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Правило 30%:</strong> Платёж по ипотеке не должен превышать 30% от дохода.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Бери ипотеку:</strong> Только если есть стабильный доход, первый взнос и ты уверен, что сможешь платить.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как работает ипотека!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое ипотека?",
                        options: [
                            "Подарок от банка",
                            "Способ купить квартиру, взяв деньги в долг у банка и возвращая их частями",
                            "Бесплатная квартира",
                            "Аренда квартиры"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какое правило нужно помнить при ипотеке?",
                        options: [
                            "Платёж должен быть 100% дохода",
                            "Платёж по ипотеке не должен превышать 30% от дохода",
                            "Платёж не важен",
                            "Платёж должен быть 50% дохода"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что будет, если перестать платить по ипотеке?",
                        options: [
                            "Ничего",
                            "Банк может забрать квартиру",
                            "Банк простит долг",
                            "Квартира останется твоей"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.5": {
                title: "Инвестиции в недвижимость: пассивный доход",
                icon: "📈",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📈</span>
                    <h3>Инвестиции в недвижимость: пассивный доход</h3>
                </div>
                <p class="section-intro">Недвижимость — это не только место, где можно жить. Это ещё и способ зарабатывать деньги! Если у тебя есть квартира, которую ты не используешь, ты можешь сдавать её в аренду и получать пассивный доход. Давай разберёмся, как это работает!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Что такое пассивный доход от недвижимости?</h3>
                </div>
                <p class="section-intro">Пассивный доход — это деньги, которые приходят к тебе без ежедневной работы. Ты сдаёшь квартиру в аренду, и каждый месяц получаешь деньги от арендатора. Это и есть пассивный доход!</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Пример из жизни</h4>
                    <p>Ты купил квартиру за 4 000 000 монеток. Сдаёшь её в аренду за 30 000 монеток в месяц.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Доход за год:</strong> 30 000 × 12 = 360 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>Доходность:</strong> 360 000 / 4 000 000 × 100% = 9% годовых</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #2e7d32;">Это больше, чем проценты по вкладу! И квартира ещё и дорожает со временем!</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы сдачи в аренду</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Регулярный доход каждый месяц</li>
                            <li>📈 Квартира дорожает со временем</li>
                            <li>💎 Два источника дохода: аренда + рост цены</li>
                            <li>🛡️ Защита от инфляции</li>
                            <li>📊 Можно использовать для погашения ипотеки</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⚠️</div>
                        <h4>Что нужно учитывать</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🛠️ Нужно делать ремонт</li>
                            <li>👥 Нужно искать арендаторов</li>
                            <li>📋 Нужно платить налоги</li>
                            <li>⚠️ Арендаторы могут испортить квартиру</li>
                            <li>📅 Могут быть периоды без арендаторов</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Сколько можно заработать?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Однокомнатная квартира</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Стоимость:</strong> 3 000 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Аренда:</strong> 25 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доход в год:</strong> 300 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доходность:</strong> 10% годовых</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏡</div>
                        <h4>Двухкомнатная квартира</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Стоимость:</strong> 5 000 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Аренда:</strong> 40 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доход в год:</strong> 480 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доходность:</strong> 9.6% годовых</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏘️</div>
                        <h4>Студия</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Стоимость:</strong> 2 500 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Аренда:</strong> 20 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доход в год:</strong> 240 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Доходность:</strong> 9.6% годовых</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Как использовать аренду для ипотеки?</h3>
                </div>
                <p class="section-intro">Умная стратегия: купить квартиру в ипотеку и сдавать её в аренду. Аренда покрывает платежи по ипотеке, а через 20 лет квартира полностью твоя!</p>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">🎯 Пример: Ипотека + аренда</h4>
                    <p>Ты купил квартиру за 5 000 000 монеток. Первый взнос 1 000 000 монеток, ипотека 4 000 000 монеток на 20 лет.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Платёж по ипотеке:</strong> 38 600 монеток/месяц</p>
                        <p style="margin-top: 10px;"><strong>Аренда:</strong> 40 000 монеток/месяц</p>
                        <p style="margin-top: 10px; font-weight: bold; color: #2e7d32;">Аренда покрывает ипотеку! Ты даже получаешь 1 400 монеток в месяц сверху!</p>
                        <p style="margin-top: 15px;"><strong>Через 20 лет:</strong> Квартира полностью твоя, и ты продолжаешь получать 40 000 монеток в месяц от аренды!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Что нужно знать о сдаче в аренду?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📝</div>
                        <h4>Договор аренды</h4>
                        <p style="text-align: left; margin-top: 10px;">Обязательно заключай письменный договор! В нём должно быть указано:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💰 Размер арендной платы</li>
                            <li>📅 Срок аренды</li>
                            <li>📋 Права и обязанности</li>
                            <li>⚠️ Ответственность за порчу</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Налоги</h4>
                        <p style="text-align: left; margin-top: 10px;">С дохода от аренды нужно платить налог 13% (НДФЛ).</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Пример:</strong> Если получаешь 30 000 монеток/месяц, налог = 3 900 монеток/месяц или 46 800 монеток/год.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;">💡 Можно использовать налоговый вычет и уменьшить налог!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔍</div>
                        <h4>Проверка арендаторов</h4>
                        <p style="text-align: left; margin-top: 10px;">Важно проверять арендаторов:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📄 Паспорт и документы</li>
                            <li>💼 Источник дохода</li>
                            <li>📞 Контакты для связи</li>
                            <li>✅ Отзывы от предыдущих арендодателей</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Стратегии инвестирования в недвижимость</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏠</div>
                        <h4>Купить и сдавать</h4>
                        <p style="text-align: left; margin-top: 10px;">Купить квартиру и сразу сдавать в аренду. Доход идёт на погашение ипотеки или в карман.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>Плюс:</strong> Регулярный доход</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>Купить и продать дороже</h4>
                        <p style="text-align: left; margin-top: 10px;">Купить квартиру, подождать, пока она подорожает, и продать. Заработать на разнице в цене.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>Плюс:</strong> Можно заработать много за раз</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>Минус:</strong> Нужно ждать и угадать момент</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔄</div>
                        <h4>Ремонт и перепродажа</h4>
                        <p style="text-align: left; margin-top: 10px;">Купить старую квартиру, сделать ремонт и продать дороже. Заработать на улучшении.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>Плюс:</strong> Можно быстро заработать</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>Минус:</strong> Нужны навыки ремонта или деньги на рабочих</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Риски инвестирования в недвижимость</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>⚠️ Важно знать о рисках:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>📉 Цена может упасть:</strong> Недвижимость не всегда дорожает. В кризис цены могут падать.</li>
                        <li style="margin: 10px 0;"><strong>👥 Проблемы с арендаторами:</strong> Могут не платить, испортить квартиру, устроить скандал.</li>
                        <li style="margin: 10px 0;"><strong>🛠️ Непредвиденные расходы:</strong> Может сломаться что-то дорогое (тмонеты, крыша, лифт).</li>
                        <li style="margin: 10px 0;"><strong>📅 Простой:</strong> Могут быть периоды, когда квартира пустует и не приносит дохода.</li>
                        <li style="margin: 10px 0;"><strong>💰 Низкая ликвидность:</strong> Квартиру нельзя быстро продать, как акции. Нужно время.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Пассивный доход:</strong> Сдавая квартиру в аренду, ты получаешь деньги каждый месяц без ежедневной работы.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Два источника дохода:</strong> Арендная плата + рост стоимости квартиры со временем.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Умная стратегия:</strong> Купить квартиру в ипотеку и сдавать в аренду. Аренда покрывает ипотеку, а через 20 лет квартира твоя!
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Помни о рисках:</strong> Цена может упасть, могут быть проблемы с арендаторами, нужны деньги на ремонт.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как зарабатывать на недвижимости!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое пассивный доход от недвижимости?",
                        options: [
                            "Работа в офисе",
                            "Деньги, которые приходят от сдачи квартиры в аренду без ежедневной работы",
                            "Продажа квартиры",
                            "Покупка квартиры"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какую стратегию можно использовать с ипотекой?",
                        options: [
                            "Не платить по ипотеке",
                            "Купить квартиру в ипотеку и сдавать в аренду, чтобы аренда покрывала платежи",
                            "Только брать ипотеку",
                            "Только сдавать в аренду"
                        ],
                        correct: 1
                    },
                    {
                        question: "С какого дохода от аренды нужно платить налог?",
                        options: [
                            "Не нужно платить налог",
                            "С любого дохода от аренды нужно платить 13% (НДФЛ)",
                            "Только 50%",
                            "Только 5%"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.6": {
                title: "Как выбрать квартиру: на что обращать внимание",
                icon: "🔍",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Как выбрать квартиру: на что обращать внимание</h3>
                </div>
                <p class="section-intro">Покупка квартиры — это одно из самых важных решений в жизни. Неправильный выбор может обернуться проблемами на годы вперёд. Давай разберёмся, на что нужно обращать внимание, чтобы не пожалеть о покупке!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📍</span>
                    <h3>Расположение и район</h3>
                </div>
                <p class="section-intro">Местоположение — это один из самых важных факторов. От него зависит не только цена, но и твоё качество жизни.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚇</div>
                        <h4>Транспортная доступность</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Близость к метро/остановкам</li>
                            <li>✅ Удобные маршруты до работы/университета</li>
                            <li>✅ Парковка для машины (если есть)</li>
                            <li>✅ Пробки в районе</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏪</div>
                        <h4>Инфраструктура</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🛒 Магазины, супермаркеты рядом</li>
                            <li>🏥 Поликлиники, больницы</li>
                            <li>🎓 Школы, детские сады (если планируешь семью)</li>
                            <li>🏋️ Спортзалы, парки для отдыха</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌳</div>
                        <h4>Окружение</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🌲 Парки, скверы рядом</li>
                            <li>🔇 Тишина (нет шумных дорог, заводов)</li>
                            <li>👥 Безопасность района</li>
                            <li>🏗️ Планы по застройке (новые дома могут закрыть вид)</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💡 Совет</h4>
                    <p>Приезжай в район в разное время суток: утром, днём, вечером, ночью. Посмотри, какая там атмосфера, много ли людей, безопасно ли.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Дом и этаж</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📅</div>
                        <h4>Год постройки</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Новостройка:</strong> Всё новое, но могут быть проблемы с инфраструктурой.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Старый дом:</strong> Может быть дешевле, но нужен ремонт.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Советский дом:</strong> Обычно крепкие, но устаревшие коммуникации.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏗️</div>
                        <h4>Состояние дома</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🔍 Фасад (не обваливается ли)</li>
                            <li>🚪 Подъезд (чистота, ремонт)</li>
                            <li>🛠️ Лифт (работает ли, новый ли)</li>
                            <li>🔧 Коммуникации (когда меняли тмонеты, проводку)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Этаж</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>1 этаж: Дешевле, но шумно, могут быть проблемы с безопасностью</li>
                            <li>2–5 этажи: Золотая середина</li>
                            <li>Последний этаж: Может течь крыша, жарко летом</li>
                            <li>Высокие этажи: Красивый вид, но дороже и зависит от лифта</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏠</span>
                    <h3>Сама квартира</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📐</div>
                        <h4>Планировка</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Удобное расположение комнат</li>
                            <li>✅ Достаточно места для мебели</li>
                            <li>✅ Есть место для хранения</li>
                            <li>✅ Кухня не слишком маленькая</li>
                            <li>✅ Балкон или лоджия</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Состояние</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🔍 Стены (нет ли трещин, плесени)</li>
                            <li>🚰 Сантехника (работает ли, не течёт ли)</li>
                            <li>⚡ Электричество (проводка, розетки)</li>
                            <li>🪟 Окна (новые или старые, не дует ли)</li>
                            <li>🚪 Двери (крепкие ли, замки работают)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌞</div>
                        <h4>Освещение</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>☀️ Окна на солнечную сторону</li>
                            <li>🌅 Восток — утреннее солнце</li>
                            <li>🌇 Запад — вечернее солнце</li>
                            <li>❌ Север — мало солнца, но прохладно</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Финансовые аспекты</h3>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💸 Что нужно учесть в цене</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Цена квартиры — это не всё!</strong> Нужно учесть:</p>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>💰 Стоимость самой квартиры</li>
                            <li>🛠️ Ремонт (если нужен) — может быть 500 000–2 000 000 монеток</li>
                            <li>📋 Налоги и госпошлины при покупке</li>
                            <li>💼 Услуги риелтора (если пользуешься)</li>
                            <li>📄 Оформление документов</li>
                            <li>💡 Коммунальные платежи (ежемесячно)</li>
                        </ul>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Сравнение цен</h4>
                        <p style="text-align: left; margin-top: 10px;">Посмотри цены на похожие квартиры в этом районе. Если цена сильно ниже — возможно, есть скрытые проблемы!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Риелтор или самостоятельно?</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Риелтор:</strong> Поможет найти, проверить документы, но возьмёт комиссию (обычно 2–5% от цены).</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Самостоятельно:</strong> Дешевле, но нужно самому всё проверять и оформлять.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Чек-лист при осмотре квартиры</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ Обязательно проверь:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">🔍 Включи все краны — проверь напор воды, нет ли протечек</li>
                        <li style="margin: 10px 0;">💡 Включи все светильники — работает ли электричество</li>
                        <li style="margin: 10px 0;">🚪 Открой и закрой все окна и двери</li>
                        <li style="margin: 10px 0;">📱 Проверь сигнал мобильной связи и интернета</li>
                        <li style="margin: 10px 0;">👃 Понюхай воздух — нет ли запаха сырости, плесени</li>
                        <li style="margin: 10px 0;">👂 Послушай — не шумно ли от соседей, дороги</li>
                        <li style="margin: 10px 0;">📄 Попроси показать документы на квартиру</li>
                        <li style="margin: 10px 0;">💬 Поговори с соседями — узнай о доме и районе</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📍</span>
                                <strong>Расположение:</strong> Один из самых важных факторов. Проверь транспорт, инфраструктуру, безопасность.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏢</span>
                                <strong>Дом:</strong> Проверь год постройки, состояние, этаж. Не забудь про лифт и коммуникации.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏠</span>
                                <strong>Квартира:</strong> Планировка, состояние, освещение — всё важно для комфортной жизни.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Финансы:</strong> Учти не только цену квартиры, но и ремонт, налоги, коммунальные платежи.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Проверка:</strong> Используй чек-лист при осмотре — лучше потратить время сейчас, чем жалеть потом!
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выбрать хорошую квартиру!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что самое важное при выборе квартиры?",
                        options: [
                            "Только цена",
                            "Расположение, состояние дома и квартиры, финансовая составляющая",
                            "Только размер",
                            "Только этаж"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно проверить при осмотре квартиры?",
                        options: [
                            "Только внешний вид",
                            "Воду, электричество, окна, двери, запахи, документы",
                            "Только документы",
                            "Только цену"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно учесть в общей стоимости покупки?",
                        options: [
                            "Только цену квартиры",
                            "Цену квартиры, ремонт, налоги, услуги риелтора, коммунальные платежи",
                            "Только ремонт",
                            "Только налоги"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.7": {
                title: "Коммунальные платежи: сколько стоит содержание",
                icon: "💡",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Коммунальные платежи: сколько стоит содержание</h3>
                </div>
                <p class="section-intro">Когда ты покупаешь квартиру, это не только разовая покупка. Каждый месяц нужно платить за коммунальные услуги: свет, воду, газ, отопление, домофон и многое другое. Давай разберёмся, сколько это стоит и как планировать эти расходы!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Что входит в коммунальные платежи?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Электричество</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Средняя стоимость:</strong> 1 500–3 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;">Зависит от количества приборов, времени использования.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💻 Компьютер, телевизор</li>
                            <li>❄️ Холодильник (работает постоянно)</li>
                            <li>🌡️ Кондиционер (летом)</li>
                            <li>💡 Освещение</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🚰</div>
                        <h4>Вода (холодная и горячая)</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Средняя стоимость:</strong> 1 000–2 500 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;">Зависит от количества человек и расхода воды.</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🚿 Душ, ванна</li>
                            <li>💧 Мытьё посуды</li>
                            <li>🧺 Стирка</li>
                            <li>🚽 Туалет</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔥</div>
                        <h4>Отопление</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Средняя стоимость:</strong> 2 000–5 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;">Обычно платится только в отопительный сезон (октябрь–апрель).</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;">💡 Зависит от площади квартиры и региона.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⛽</div>
                        <h4>Газ</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Средняя стоимость:</strong> 500–1 500 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;">Если есть газовая плита или колонка для горячей воды.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Содержание дома</h3>
                </div>
                <p class="section-intro">Помимо коммунальных услуг, нужно платить за содержание самого дома. Это называется "содержание и ремонт жилого помещения".</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🧹</div>
                        <h4>Что входит</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>🧹 Уборка подъезда</li>
                            <li>🗑️ Вывоз мусора</li>
                            <li>💡 Освещение подъезда</li>
                            <li>🔧 Ремонт лифта</li>
                            <li>🏗️ Ремонт дома (крыша, фасад)</li>
                            <li>🌳 Уход за двором</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Сколько стоит</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Средняя стоимость:</strong> 3 000–8 000 монеток/месяц</p>
                        <p style="text-align: left; margin-top: 10px;">Зависит от:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📐 Площади квартиры</li>
                            <li>🏢 Состояния дома</li>
                            <li>📍 Региона</li>
                            <li>🛠️ Наличия лифта, консьержа</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>Пример: Сколько платить в месяц?</h3>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Пример для однокомнатной квартиры (40 м²)</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;"><strong>Услуга</strong></td>
                                <td style="padding: 10px; text-align: right;"><strong>Сумма</strong></td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">💡 Электричество</td>
                                <td style="padding: 10px; text-align: right;">2 000 ₽</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">🚰 Вода</td>
                                <td style="padding: 10px; text-align: right;">1 500 ₽</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">🔥 Отопление (в сезон)</td>
                                <td style="padding: 10px; text-align: right;">3 500 ₽</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">⛽ Газ</td>
                                <td style="padding: 10px; text-align: right;">800 ₽</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">🏢 Содержание дома</td>
                                <td style="padding: 10px; text-align: right;">4 500 ₽</td>
                            </tr>
                            <tr style="border-bottom: 2px solid #667eea; font-weight: bold;">
                                <td style="padding: 10px;">📊 ИТОГО</td>
                                <td style="padding: 10px; text-align: right; color: #667eea;">12 300 ₽</td>
                            </tr>
                        </table>
                        <p style="margin-top: 15px; font-size: 0.9em; color: #64748b;">💡 Это средние цифры. В разных регионах и домах суммы могут отличаться!</p>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💸 За год это:</h4>
                    <p style="font-size: 1.2em; font-weight: bold; text-align: center; margin-top: 10px;">12 300 × 12 = <strong style="color: #c62828;">147 600 монеток в год!</strong></p>
                    <p style="margin-top: 15px; text-align: center;">Это почти как небольшая зарплата! Поэтому важно учитывать коммунальные платежи при планировании бюджета.</p>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Как экономить на коммунальных платежах?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Электричество</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Используй энергосберегающие лампы</li>
                            <li>✅ Выключай свет, когда не нужен</li>
                            <li>✅ Не оставляй приборы в режиме ожидания</li>
                            <li>✅ Используй многотарифный счётчик (ночью дешевле)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🚰</div>
                        <h4>Вода</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Принимай душ вместо ванны</li>
                            <li>✅ Закрывай кран, когда чистишь зубы</li>
                            <li>✅ Используй посудомойку (экономит воду)</li>
                            <li>✅ Поставь счётчики воды</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔥</div>
                        <h4>Отопление</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Утепли окна (не будет дуть)</li>
                            <li>✅ Закрывай батареи шторами (тепло не уходит)</li>
                            <li>✅ Проветривай правильно (коротко, но интенсивно)</li>
                            <li>✅ Поставь терморегулятор на батарею</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">💰 Пример экономии</h4>
                    <p>Если экономить на коммунальных, можно сэкономить 20–30% от суммы.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Без экономии:</strong> 12 300 монеток/месяц</p>
                        <p style="margin-top: 10px;"><strong>С экономией (25%):</strong> 9 225 монеток/месяц</p>
                        <p style="margin-top: 10px; font-weight: bold; color: #2e7d32;">Экономия: 3 075 монеток/месяц = 36 900 монеток/год!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Как платить коммунальные?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📱</div>
                        <h4>Онлайн</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Через мобильное приложение банка</li>
                            <li>✅ Через сайт Госуслуг</li>
                            <li>✅ Через сайты управляющих компаний</li>
                            <li>✅ Быстро и удобно</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>В банке или терминале</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Наличными в банке</li>
                            <li>✅ Через банкомат</li>
                            <li>✅ Через платёжный терминал</li>
                            <li>⚠️ Может быть комиссия</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">⚠️ Важно: Не забывай платить!</h4>
                    <p>Если не платить коммунальные, могут:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>💸 Начислить пени (дополнительные проценты)</li>
                        <li>⚖️ Подать в суд</li>
                        <li>🚫 Отключить услуги (свет, воду)</li>
                        <li>📋 Испортить кредитную историю</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Коммунальные платежи:</strong> Электричество, вода, отопление, газ, содержание дома — это ежемесячные расходы.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Средняя сумма:</strong> Для однокомнатной квартиры это примерно 10 000–15 000 монеток/месяц или 120 000–180 000 монеток/год.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Экономия:</strong> Можно сэкономить 20–30%, если правильно использовать ресурсы и установить счётчики.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Важно платить вовремя:</strong> За просрочку начисляют пени, могут отключить услуги и испортить кредитную историю.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, сколько стоит содержание квартиры!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что входит в коммунальные платежи?",
                        options: [
                            "Только электричество",
                            "Электричество, вода, отопление, газ, содержание дома",
                            "Только вода",
                            "Только отопление"
                        ],
                        correct: 1
                    },
                    {
                        question: "Сколько примерно стоят коммунальные платежи для однокомнатной квартиры?",
                        options: [
                            "2 000–3 000 монеток/месяц",
                            "10 000–15 000 монеток/месяц",
                            "50 000 монеток/месяц",
                            "100 000 монеток/месяц"
                        ],
                        correct: 1
                    },
                    {
                        question: "Как можно сэкономить на коммунальных платежах?",
                        options: [
                            "Нельзя экономить",
                            "Использовать энергосберегающие лампы, установить счётчики, правильно использовать ресурсы",
                            "Только не включать свет",
                            "Только не пользоваться водой"
                        ],
                        correct: 1
                    }
                ]
            },
            "5.8": {
                title: "Защита от мошенников при покупке недвижимости",
                icon: "🛡️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>Защита от мошенников при покупке недвижимости</h3>
                </div>
                <p class="section-intro">Покупка квартиры — это большая сделка, и мошенники знают об этом. Они придумывают разные схемы, чтобы обмануть людей и забрать их деньги. Давай разберёмся, как защитить себя и не попасться на удочку мошенников!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🚨</span>
                    <h3>Основные схемы мошенничества</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">👤</div>
                        <h4>Продажа чужой квартиры</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Как это работает:</strong> Мошенник показывает квартиру, которая ему не принадлежит, или использует поддельные документы.</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #c62828;">⚠️ Ты платишь деньги, но квартира не становится твоей!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📄</div>
                        <h4>Поддельные документы</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Как это работает:</strong> Мошенники подделывают документы на квартиру, справки, выписки из реестра.</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #c62828;">⚠️ Документы выглядят настоящими, но это подделка!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Двойная продажа</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Как это работает:</strong> Продавец продаёт одну квартиру нескольким людям одновременно и исчезает с деньгами.</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #c62828;">⚠️ Ты не первый покупатель, и квартира уже продана!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Мошенничество с ипотекой</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Как это работает:</strong> Предлагают "особые условия" по ипотеке, просят предоплату или "комиссию за одобрение".</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #c62828;">⚠️ Настоящие банки не берут деньги за одобрение заранее!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Как защитить себя: чек-лист</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h4 style="margin-top: 0; color: #2e7d32;">📋 Обязательные проверки</h4>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>📄 Проверь документы:</strong> Попроси показать оригиналы документов на квартиру. Проверь, что продавец — настоящий владелец.</li>
                        <li style="margin: 10px 0;"><strong>🔍 Выписка из ЕГРН:</strong> Закажи свежую выписку из Единого государственного реестра недвижимости. Там будет вся информация о квартире и владельце.</li>
                        <li style="margin: 10px 0;"><strong>👤 Проверь продавца:</strong> Убедись, что человек, который продаёт, действительно владелец. Сравни паспорт с документами.</li>
                        <li style="margin: 10px 0;"><strong>🏠 Проверь квартиру:</strong> Убедись, что в квартире никто не прописан (особенно несовершеннолетние дети). Они могут остаться жить даже после продажи.</li>
                        <li style="margin: 10px 0;"><strong>💰 Не передавай деньги заранее:</strong> Никогда не давай деньги до оформления сделки. Используй банковскую ячейку или аккредитив.</li>
                        <li style="margin: 10px 0;"><strong>📋 Используй риелтора или юриста:</strong> Профессионал поможет проверить документы и оформить сделку правильно.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Что проверить в документах?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📄</div>
                        <h4>Свидетельство о праве собственности</h4>
                        <p style="text-align: left; margin-top: 10px;">Или выписка из ЕГРН — это главный документ. Проверь:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ ФИО владельца совпадает с паспортом</li>
                            <li>✅ Адрес квартиры правильный</li>
                            <li>✅ Площадь совпадает</li>
                            <li>✅ Нет обременений (ипотека, арест)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Паспорт продавца</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверь:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ ФИО совпадает с документами на квартиру</li>
                            <li>✅ Фото похоже на человека</li>
                            <li>✅ Документ не просрочен</li>
                            <li>✅ Нет признаков подделки</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">👨‍👩‍👧</div>
                        <h4>Справка о прописанных</h4>
                        <p style="text-align: left; margin-top: 10px;">Очень важно! Проверь:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>✅ Кто прописан в квартире</li>
                            <li>⚠️ Особенно несовершеннолетние дети</li>
                            <li>⚠️ Если есть прописанные — они могут остаться жить</li>
                            <li>✅ Все должны выписаться до сделки</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Безопасная передача денег</h3>
                </div>
                <p class="section-intro">Никогда не передавай деньги наличными до оформления сделки! Используй безопасные способы.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Банковская ячейка</h4>
                        <p style="text-align: left; margin-top: 10px;">Ты кладёшь деньги в ячейку в банке. Продавец получит их только после того, как сделка будет оформлена и ты станешь владельцем.</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #2e7d32;">✅ Самый безопасный способ!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Аккредитив</h4>
                        <p style="text-align: left; margin-top: 10px;">Банк держит деньги и переводит их продавцу только после подтверждения, что сделка оформлена.</p>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #2e7d32;">✅ Очень безопасно!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Наличные или перевод заранее</h4>
                        <p style="text-align: left; margin-top: 10px; font-weight: bold; color: #c62828;">⚠️ НИКОГДА не делай так!</p>
                        <p style="text-align: left; margin-top: 10px;">Если передашь деньги до сделки, можешь их потерять, а квартиры не получить.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Красные флаги: когда насторожиться?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>🚨 Если видишь это — будь осторожен!</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>💰 Цена слишком низкая:</strong> Если квартира стоит намного дешевле похожих — возможно, это обман.</li>
                        <li style="margin: 10px 0;"><strong>⏰ Срочность:</strong> "Нужно срочно, сегодня же!" — мошенники создают искусственную спешку.</li>
                        <li style="margin: 10px 0;"><strong>📄 Не показывает документы:</strong> "Документы в другом месте", "Покажу потом" — это подозрительно.</li>
                        <li style="margin: 10px 0;"><strong>💵 Просит предоплату:</strong> "Дай задаток наличными" — настоящий продавец согласится на банковскую ячейку.</li>
                        <li style="margin: 10px 0;"><strong>👤 Не хочет встречаться лично:</strong> "Всё через посредника" — подозрительно.</li>
                        <li style="margin: 10px 0;"><strong>🏠 Не пускает в квартиру:</strong> "Ключей нет", "Занята" — возможно, квартира не его.</li>
                        <li style="margin: 10px 0;"><strong>📞 Только телефон, нет адреса:</strong> Настоящий продавец даст адрес и встретит.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💼</span>
                    <h3>Помощь профессионалов</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">👨‍💼</div>
                        <h4>Риелтор</h4>
                        <p style="text-align: left; margin-top: 10px;">Поможет найти квартиру, проверить документы, оформить сделку. Берет комиссию (обычно 2–5%), но это стоит того, чтобы не потерять все деньги.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> Выбирай проверенного риелтора с хорошими отзывами!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⚖️</div>
                        <h4>Юрист</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверит все документы, поможет оформить договор, защитит твои интересы. Стоит 10 000–30 000 монеток, но может сэкономить миллионы!</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;"><strong>💡 Совет:</strong> Лучше заплатить юристу, чем потерять все деньги!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🚨</span>
                                <strong>Основные схемы:</strong> Продажа чужой квартиры, поддельные документы, двойная продажа, мошенничество с ипотекой.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Обязательные проверки:</strong> Документы, выписка из ЕГРН, проверка продавца, справка о прописанных.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Безопасная передача денег:</strong> Только через банковскую ячейку или аккредитив. Никогда наличными заранее!
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Красные флаги:</strong> Слишком низкая цена, срочность, не показывает документы, просит предоплату наличными.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💼</span>
                                <strong>Помощь профессионалов:</strong> Риелтор и юрист помогут защитить тебя от мошенников. Лучше заплатить им, чем потерять все деньги!
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как защитить себя от мошенников!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Как безопасно передать деньги при покупке квартиры?",
                        options: [
                            "Наличными заранее",
                            "Через банковскую ячейку или аккредитив — только после оформления сделки",
                            "Переводом на карту продавца",
                            "Через посредника наличными"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что нужно обязательно проверить перед покупкой?",
                        options: [
                            "Только цену",
                            "Документы на квартиру, выписку из ЕГРН, паспорт продавца, справку о прописанных",
                            "Только внешний вид квартиры",
                            "Только адрес"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что должно насторожить при покупке квартиры?",
                        options: [
                            "Нормальная цена",
                            "Слишком низкая цена, срочность, не показывает документы, просит предоплату наличными",
                            "Показывает документы",
                            "Готов встретиться лично"
                        ],
                        correct: 1
                    }
                ]
            }
        }
    },
    6: {
        title: "Блок 6: Страхование",
        icon: "🛡️",
        overview: {
            title: "Гайд для автомобилистов",
            intro: "Поможет определиться с полисом ОСАГО, приобрести его по самой выгодной цене, учесть все нюансы при покупке, правильно воспользоваться в случае ДТП и суметь отличить поддельный полис.",
            learningPoints: [
                "Что такое ОСАГО, какова его роль, его основные принципы и положения",
                "Какие риски покрывает ОСАГО и какие исключения есть у покрытия",
                "Как выбрать страховщика и оформить полис онлайн",
                "Что влияет на стоимость полиса и как можно сэкономить",
                "Как заявить о ДТП, чтобы страховая не отказала в выплате"
            ],
            categories: [
                {
                    name: "ОСАГО",
                    icon: "🚗",
                    intro: "Рассказывать будем об ОСАГО. Каждый урок – отдельная тема, в конце темы – вопрос «Проверьте себя», в конце последнего урока – памятка водителю для печати.",
                    learningPoints: [
                        "что такое ОСАГО? Кто и почему его выбирает;",
                        "какие риски покрывает ОСАГО, что является исключением;",
                        "на что обратить внимание при выборе страховой;",
                        "сколько это будет стоить и как сэкономить на ОСАГО;",
                        "что делать, если попал в ДТП."
                    ],
                    lessons: [
                        {
                            id: "6.1.1",
                            title: "Что такое ОСАГО",
                            duration: "5 мин",
                            icon: "🚗",
                            status: "available"
                        },
                        {
                            id: "6.1.2",
                            title: "Выплаты по ОСАГО: когда и кому положены",
                            duration: "5 мин",
                            icon: "💰",
                            status: "available"
                        },
                        {
                            id: "6.1.3",
                            title: "Как выбрать страховщика",
                            duration: "5 мин",
                            icon: "🔍",
                            status: "available"
                        },
                        {
                            id: "6.1.4",
                            title: "Как оформить полис ОСАГО",
                            duration: "10 мин",
                            icon: "📋",
                            status: "available"
                        },
                        {
                            id: "6.1.5",
                            title: "Как выгодно купить страховку",
                            duration: "5 мин",
                            icon: "💡",
                            status: "available"
                        },
                        {
                            id: "6.1.6",
                            title: "Что делать, если произошло ДТП",
                            duration: "5 мин",
                            icon: "⚠️",
                            status: "available"
                        },
                        {
                            id: "6.1.7",
                            title: "Заключение",
                            duration: "5 мин",
                            icon: "✅",
                            status: "available"
                        }
                    ]
                },
                {
                    name: "КАСКО",
                    icon: "🛡️",
                    intro: "Рассказывать будем о каско. Каждый урок – отдельная тема, в конце темы – вопрос «Проверьте себя», в конце последнего урока – памятка водителю для печати.",
                    learningPoints: [
                        "что такое каско? Кто и почему его выбирает;",
                        "какие риски покрывает каско, что является исключением;",
                        "на что обратить внимание при выборе страховой;",
                        "сколько это будет стоить и как сэкономить на каско;",
                        "что делать, если попал в ДТП или машину угнали."
                    ],
                    lessons: [
                        {
                            id: "6.2.1",
                            title: "Зачем нужен полис каско",
                            duration: "5 мин",
                            icon: "🛡️",
                            status: "available"
                        },
                        {
                            id: "6.2.2",
                            title: "Покрытие и ограничения каско",
                            duration: "5 мин",
                            icon: "📄",
                            status: "available"
                        },
                        {
                            id: "6.2.3",
                            title: "Сколько будет стоить каско",
                            duration: "5 мин",
                            icon: "💰",
                            status: "available"
                        },
                        {
                            id: "6.2.4",
                            title: "Как выбрать страховщика",
                            duration: "5 мин",
                            icon: "🔍",
                            status: "available"
                        },
                        {
                            id: "6.2.5",
                            title: "Процесс оформления каско",
                            duration: "5 мин",
                            icon: "📝",
                            status: "available"
                        },
                        {
                            id: "6.2.6",
                            title: "Урегулирование убытков",
                            duration: "5 мин",
                            icon: "⚖️",
                            status: "available"
                        },
                        {
                            id: "6.2.7",
                            title: "Главное о полисе каско",
                            duration: "5 мин",
                            icon: "🎯",
                            status: "available"
                        }
                    ]
                }
            ]
        },
        lessons: {
            "6.1.1": {
                title: "Что такое ОСАГО",
                icon: "🚗",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🚗</span>
                    <h3>Что такое ОСАГО</h3>
                </div>
                <p class="section-intro">Представь, что ты только что получил права и купил свою первую машину. Ты счастлив, но тут выясняется, что без ОСАГО ездить нельзя! Что это такое и зачем оно нужно? Давай разберёмся!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>ОСАГО — это что?</h3>
                </div>
                <p class="section-intro"><strong>ОСАГО</strong> — это Обязательное Страхование Автогражданской Ответственности. Звучит сложно? На самом деле всё просто!</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Простыми словами</h4>
                    <p>ОСАГО — это страховка, которая защищает не тебя, а других людей, если ты попадёшь в аварию по своей вине. Если ты виноват в ДТП, страховая заплатит пострадавшим за ремонт их машин и лечение.</p>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Обязательное</h4>
                        <p style="text-align: left; margin-top: 10px;">Без ОСАГО нельзя ездить на машине! Это закон. Если остановит инспектор ГИБДД без полиса — штраф и эвакуация машины.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🛡️</div>
                        <h4>Защита других</h4>
                        <p style="text-align: left; margin-top: 10px;">ОСАГО защищает не тебя, а тех, кого ты можешь случайно задеть. Если ты виноват в аварии — страховая заплатит пострадавшим.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Ограниченная сумма</h4>
                        <p style="text-align: left; margin-top: 10px;">Максимальная выплата по ОСАГО — 500 000 монеток за вред имуществу и 500 000 монеток за вред здоровью. Если ущерб больше — доплачиваешь сам.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤔</span>
                    <h3>Зачем это нужно?</h3>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💡 Пример из жизни</h4>
                    <p>Ты едешь на своей новой машине, не заметил знак "Стоп" и врезался в чужую машину. Твоя вина — ты должен заплатить за ремонт.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Без ОСАГО:</strong></p>
                        <p>Ты должен заплатить за ремонт чужой машины из своего кармана. Это может быть 100 000, 200 000 или даже 500 000 монеток! 💸</p>
                        
                        <p style="margin-top: 15px;"><strong>С ОСАГО:</strong></p>
                        <p>Страховая компания заплатит за ремонт пострадавшей машины (до 500 000 монеток). Тебе не нужно доставать деньги из кармана! ✅</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">⚖️</div>
                        <h4>Защита от больших расходов</h4>
                        <p style="text-align: left; margin-top: 10px;">Если попадёшь в аварию по своей вине, не нужно будет платить сотни тысяч монеток из своего кармана.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Это закон</h4>
                        <p style="text-align: left; margin-top: 10px;">Без ОСАГО нельзя ездить. Штраф за отсутствие полиса — 800 монеток, а машину могут забрать на штрафстоянку.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🤝</div>
                        <h4>Защита для всех</h4>
                        <p style="text-align: left; margin-top: 10px;">Если кто-то врежется в тебя по своей вине, его ОСАГО заплатит за ремонт твоей машины.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Что НЕ покрывает ОСАГО?</h3>
                </div>
                <p class="section-intro">Важно понимать, что ОСАГО покрывает не всё. Есть исключения!</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Твоя машина</h4>
                        <p style="text-align: left; margin-top: 10px;">ОСАГО НЕ платит за ремонт твоей машины, даже если ты виноват в аварии. Твоя машина — твоя проблема.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Ущерб больше лимита</h4>
                        <p style="text-align: left; margin-top: 10px;">Если ущерб больше 500 000 монеток, разницу платишь сам. Например, если ущерб 700 000, страховая заплатит 500 000, а 200 000 — ты.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Моральный вред</h4>
                        <p style="text-align: left; margin-top: 10px;">ОСАГО не покрывает моральный вред (стресс, переживания). Это можно взыскать только через суд с виновника.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Кому нужно ОСАГО?</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ ОСАГО нужно ВСЕМ, кто ездит на машине:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">🚗 Владельцам машин (обязательно!)</li>
                        <li style="margin: 10px 0;">👨‍👩‍👧 Всем, кто управляет машиной (даже если это не твоя машина)</li>
                        <li style="margin: 10px 0;">📋 ОСАГО оформляется на машину, а не на водителя</li>
                        <li style="margin: 10px 0;">⚠️ Без полиса ездить нельзя — это нарушение закона!</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🚗</span>
                                <strong>ОСАГО</strong> — обязательная страховка, которая защищает других людей, если ты виноват в аварии.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Максимальная выплата:</strong> 500 000 монеток за имущество и 500 000 монеток за здоровье.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">❌</span>
                                <strong>ОСАГО НЕ покрывает:</strong> Ремонт твоей машины, ущерб больше лимита, моральный вред.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Без ОСАГО нельзя ездить!</strong> Это закон. Штраф и эвакуация машины.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, что такое ОСАГО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое ОСАГО?",
                        options: [
                            "Страховка для ремонта своей машины",
                            "Обязательное страхование, которое защищает других людей, если ты виноват в аварии",
                            "Добровольная страховка",
                            "Страховка только для новых машин"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что покрывает ОСАГО?",
                        options: [
                            "Ремонт твоей машины",
                            "Ущерб другим людям, если ты виноват в аварии (до 500 000 монеток)",
                            "Моральный вред",
                            "Все расходы без ограничений"
                        ],
                        correct: 1
                    },
                    {
                        question: "Можно ли ездить без ОСАГО?",
                        options: [
                            "Да, можно",
                            "Нет, это нарушение закона, штраф и эвакуация машины",
                            "Только по выходным",
                            "Только в своём городе"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.2": {
                title: "Выплаты по ОСАГО: когда и кому положены",
                icon: "💰",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Выплаты по ОСАГО: когда и кому положены</h3>
                </div>
                <p class="section-intro">Ты попал в аварию. Что дальше? Кто получит деньги от страховой? Когда? Сколько? Давай разберёмся, как работают выплаты по ОСАГО!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤔</span>
                    <h3>Кому платят по ОСАГО?</h3>
                </div>
                <p class="section-intro">Выплаты по ОСАГО получает тот, кто пострадал в аварии, а НЕ тот, кто виноват!</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Пример</h4>
                    <p>Ты едешь, не заметил знак "Уступи дорогу" и врезался в чужую машину. Твоя вина.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Кто получает выплату?</strong></p>
                        <p>✅ Владелец пострадавшей машины (не ты!)</p>
                        <p style="margin-top: 10px;"><strong>От чьей страховой?</strong></p>
                        <p>✅ От твоей страховой (ОСАГО виновника)</p>
                        <p style="margin-top: 10px; font-weight: bold; color: #c62828;">❌ Ты НЕ получишь деньги за ремонт своей машины!</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Пострадавший</h4>
                        <p style="text-align: left; margin-top: 10px;">Тот, кто пострадал в аварии (не виноват), получает выплату от страховой виновника.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Виноватый</h4>
                        <p style="text-align: left; margin-top: 10px;">Виноватый в аварии НЕ получает выплату. Его ОСАГО платит пострадавшему, но не ему самому.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Сколько можно получить?</h3>
                </div>
                <p class="section-intro">Есть лимиты выплат по ОСАГО. Больше этой суммы страховая не заплатит.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>Ущерб имуществу</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Максимум:</strong> 500 000 монеток</p>
                        <p style="text-align: left; margin-top: 10px;">Это ремонт машин, повреждение забора, ворота и т.д.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;">💡 Если ущерб больше — разницу платит виновник сам.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏥</div>
                        <h4>Вред здоровью</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Максимум:</strong> 500 000 монеток на каждого пострадавшего</p>
                        <p style="text-align: left; margin-top: 10px;">Лечение, лекарства, реабилитация.</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;">💡 Если несколько пострадавших — каждому до 500 000.</p>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💸 Пример</h4>
                    <p>Ты виноват в аварии. Ущерб пострадавшей машине — 300 000 монеток.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Страховая заплатит:</strong> 300 000 монеток (в пределах лимита 500 000) ✅</p>
                        <p style="margin-top: 10px;">Если бы ущерб был 700 000 монеток:</p>
                        <p><strong>Страховая заплатит:</strong> 500 000 монеток (лимит)</p>
                        <p><strong>Ты доплатишь:</strong> 200 000 монеток из своего кармана 💸</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⏰</span>
                    <h3>Когда платят?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>После подачи заявления</h4>
                        <p style="text-align: left; margin-top: 10px;">Нужно подать заявление в страховую виновника в течение 5 дней после ДТП.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⏱️</div>
                        <h4>Срок выплаты</h4>
                        <p style="text-align: left; margin-top: 10px;">Страховая должна выплатить деньги в течение 20 дней после получения всех документов.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📄</div>
                        <h4>Нужны документы</h4>
                        <p style="text-align: left; margin-top: 10px;">Справка о ДТП, документы на машину, оценка ущерба, заявление.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Когда могут отказать в выплате?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>🚨 Страховая может отказать, если:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">⏰ Пропустил срок подачи заявления (больше 5 дней)</li>
                        <li style="margin: 10px 0;">📄 Не подал все нужные документы</li>
                        <li style="margin: 10px 0;">🚗 У виновника нет ОСАГО или полис просрочен</li>
                        <li style="margin: 10px 0;">🍺 Виновник был пьян (но это не значит, что выплаты не будет — будет, но потом виновника накажут отдельно)</li>
                        <li style="margin: 10px 0;">🚫 Ущерб нанесён умышленно</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Выплату получает пострадавший</strong>, а не виновник. Виноватый НЕ получает деньги за свою машину.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Лимиты:</strong> 500 000 монеток за имущество, 500 000 монеток за здоровье на каждого пострадавшего.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⏰</span>
                                <strong>Сроки:</strong> Подать заявление в течение 5 дней, выплата в течение 20 дней.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Могут отказать:</strong> Если пропустил срок, не подал документы, у виновника нет ОСАГО.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как работают выплаты по ОСАГО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Кто получает выплату по ОСАГО?",
                        options: [
                            "Виноватый в аварии",
                            "Пострадавший в аварии (не виноватый)",
                            "Оба получают",
                            "Никто не получает"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какой максимальный лимит выплаты по ОСАГО за ущерб имуществу?",
                        options: [
                            "100 000 монеток",
                            "500 000 монеток",
                            "1 000 000 монеток",
                            "Без ограничений"
                        ],
                        correct: 1
                    },
                    {
                        question: "В какой срок нужно подать заявление о выплате?",
                        options: [
                            "В течение 1 дня",
                            "В течение 5 дней после ДТП",
                            "В течение месяца",
                            "Неважно когда"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.3": {
                title: "Как выбрать страховщика",
                icon: "🔍",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Как выбрать страховщика</h3>
                </div>
                <p class="section-intro">ОСАГО можно купить у любой страховой компании. Но как выбрать ту, которая не подведёт в трудную минуту? Давай разберёмся, на что обращать внимание!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Критерии выбора</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Лицензия</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверь, что у страховой есть лицензия на ОСАГО. Без лицензии полис недействителен!</p>
                        <p style="text-align: left; margin-top: 10px; font-size: 0.9em;">💡 Проверить можно на сайте Банка России.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⭐</div>
                        <h4>Рейтинг и отзывы</h4>
                        <p style="text-align: left; margin-top: 10px;">Посмотри рейтинг страховой и отзывы клиентов. Особенно важно, как они выплачивают деньги после ДТП.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Цена</h4>
                        <p style="text-align: left; margin-top: 10px;">Сравни цены в разных страховых. Но помни: дешевле — не всегда лучше! Важна надёжность.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Офисы и сервис</h4>
                        <p style="text-align: left; margin-top: 10px;">Есть ли офисы рядом? Можно ли оформить онлайн? Как работает поддержка?</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Советы по выбору</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🔍 Сравни несколько страховых:</strong> Не бери первую попавшуюся. Посмотри 3–5 вариантов.</li>
                        <li style="margin: 10px 0;"><strong>📊 Проверь рейтинг:</strong> Выбирай страховую с высоким рейтингом надёжности.</li>
                        <li style="margin: 10px 0;"><strong>💬 Читай отзывы:</strong> Особенно про выплаты после ДТП. Если много жалоб — лучше не брать.</li>
                        <li style="margin: 10px 0;"><strong>💰 Не гонись за самой дешёвой:</strong> Дешёвая страховая может плохо выплачивать или затягивать выплаты.</li>
                        <li style="margin: 10px 0;"><strong>🏢 Удобство:</strong> Лучше, если есть офис рядом или можно оформить онлайн.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Проверь лицензию</strong> — без неё полис недействителен.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⭐</span>
                                <strong>Смотри рейтинг и отзывы</strong> — особенно про выплаты после ДТП.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Сравни цены, но не гонись за дешёвой</strong> — важна надёжность.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🏢</span>
                                <strong>Удобство тоже важно</strong> — офисы рядом или онлайн-оформление.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выбрать страховщика!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что самое важное при выборе страховщика?",
                        options: [
                            "Только цена",
                            "Лицензия, рейтинг, отзывы, цена, удобство",
                            "Только название",
                            "Только цвет логотипа"
                        ],
                        correct: 1
                    },
                    {
                        question: "Нужно ли проверять лицензию страховой?",
                        options: [
                            "Не нужно",
                            "Да, обязательно — без лицензии полис недействителен",
                            "Только для дорогих полисов",
                            "Только для новых страховых"
                        ],
                        correct: 1
                    },
                    {
                        question: "Стоит ли выбирать самую дешёвую страховую?",
                        options: [
                            "Да, всегда",
                            "Нет, дешёвая может плохо выплачивать — важна надёжность",
                            "Только если нет денег",
                            "Только для старых машин"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.4": {
                title: "Как оформить полис ОСАГО",
                icon: "📋",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Как оформить полис ОСАГО</h3>
                </div>
                <p class="section-intro">Оформить ОСАГО можно онлайн или в офисе страховой. Давай разберёмся, как это сделать быстро и правильно!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💻</span>
                    <h3>Онлайн-оформление</h3>
                </div>
                <p class="section-intro">Самый удобный способ — оформить полис онлайн. Быстро, удобно, без очередей!</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы онлайн</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>⚡ Быстро — 10–15 минут</li>
                            <li>🏠 Не нужно никуда ехать</li>
                            <li>💰 Обычно дешевле</li>
                            <li>📱 Полис приходит на email</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📄</div>
                        <h4>Что нужно</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>📋 Паспорт</li>
                            <li>🚗 Свидетельство о регистрации машины (СТС)</li>
                            <li>📜 Водительское удостоверение</li>
                            <li>💳 Банковская карта для оплаты</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📝 Шаги оформления онлайн</h4>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">Заходишь на сайт страховой</li>
                        <li style="margin: 10px 0;">Вводишь данные машины (номер, марка, модель)</li>
                        <li style="margin: 10px 0;">Вводишь данные водителей</li>
                        <li style="margin: 10px 0;">Выбираешь тариф и оплачиваешь</li>
                        <li style="margin: 10px 0;">Получаешь полис на email — готово! ✅</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🏢</span>
                    <h3>Оформление в офисе</h3>
                </div>
                <p class="section-intro">Можно оформить и в офисе страховой. Пригодится, если нужна консультация или есть вопросы.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Плюсы офиса</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>💬 Можно задать вопросы</li>
                            <li>📄 Получишь полис сразу</li>
                            <li>🤝 Личное общение</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">❌</div>
                        <h4>Минусы офиса</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>⏰ Нужно ехать, может быть очередь</li>
                            <li>💰 Может быть дороже</li>
                            <li>🚗 Нужно везти документы</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Важные моменты</h3>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⚠️ На что обратить внимание:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>✅ Проверь данные:</strong> Все данные в полисе должны быть правильными (номер машины, ФИО, даты).</li>
                        <li style="margin: 10px 0;"><strong>📅 Срок действия:</strong> ОСАГО действует 1 год. Не забудь продлить!</li>
                        <li style="margin: 10px 0;"><strong>👥 Водители:</strong> Укажи всех, кто будет ездить на машине. Если не укажешь — полис не покроет их.</li>
                        <li style="margin: 10px 0;"><strong>💰 Цена:</strong> Сравни цены в разных страховых перед покупкой.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💻</span>
                                <strong>Онлайн</strong> — самый удобный способ: быстро, без очередей, обычно дешевле.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📄</span>
                                <strong>Нужны документы:</strong> Паспорт, СТС, водительское удостоверение, карта для оплаты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Проверь данные:</strong> Все должно быть правильно, укажи всех водителей.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📅</span>
                                <strong>Срок действия:</strong> 1 год, не забудь продлить!
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как оформить ОСАГО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Какой самый удобный способ оформить ОСАГО?",
                        options: [
                            "Только в офисе",
                            "Онлайн — быстро, удобно, без очередей",
                            "Только по телефону",
                            "Только через агента"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какие документы нужны для оформления ОСАГО?",
                        options: [
                            "Только паспорт",
                            "Паспорт, СТС, водительское удостоверение, карта для оплаты",
                            "Только водительское удостоверение",
                            "Никакие документы не нужны"
                        ],
                        correct: 1
                    },
                    {
                        question: "На какой срок оформляется ОСАГО?",
                        options: [
                            "На 6 месяцев",
                            "На 1 год",
                            "На 2 года",
                            "Навсегда"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.5": {
                title: "Как выгодно купить страховку",
                icon: "💡",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Как выгодно купить страховку</h3>
                </div>
                <p class="section-intro">ОСАГО стоит денег, и хочется сэкономить. Как купить страховку выгодно, но не потерять в качестве? Давай разберёмся!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>От чего зависит цена ОСАГО?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>Мощность двигателя</h4>
                        <p style="text-align: left; margin-top: 10px;">Чем мощнее двигатель — тем дороже ОСАГО. За каждую лошадиную силу нужно платить.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">👤</div>
                        <h4>Возраст и стаж водителя</h4>
                        <p style="text-align: left; margin-top: 10px;">Молодые водители (до 22 лет) и новички (стаж меньше 3 лет) платят больше.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📍</div>
                        <h4>Регион</h4>
                        <p style="text-align: left; margin-top: 10px;">В больших городах (Москва, СПб) ОСАГО дороже, чем в маленьких.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📊</div>
                        <h4>Коэффициент бонус-малус (КБМ)</h4>
                        <p style="text-align: left; margin-top: 10px;">Если ездишь без аварий — получаешь скидку. Если попадаешь в аварии — доплачиваешь.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Как сэкономить?</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ Способы сэкономить:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🔍 Сравни цены:</strong> В разных страховых цены могут отличаться. Посмотри 5–7 вариантов.</li>
                        <li style="margin: 10px 0;"><strong>💻 Оформляй онлайн:</strong> Обычно дешевле, чем в офисе.</li>
                        <li style="margin: 10px 0;"><strong>🚗 Езди аккуратно:</strong> Без аварий — получаешь скидку до 50%!</li>
                        <li style="margin: 10px 0;"><strong>👥 Ограничь водителей:</strong> Если укажешь только себя — дешевле, чем если укажешь всех.</li>
                        <li style="margin: 10px 0;"><strong>📅 Продлевай вовремя:</strong> Не пропускай срок — иначе потеряешь скидку за безаварийную езду.</li>
                    </ul>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💰 Пример экономии</h4>
                    <p>Если ездишь без аварий 5 лет, скидка может быть до 50%!</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Без скидки:</strong> 10 000 монеток</p>
                        <p style="margin-top: 10px;"><strong>Со скидкой 50%:</strong> 5 000 монеток</p>
                        <p style="margin-top: 10px; font-weight: bold; color: #2e7d32;">Экономия: 5 000 монеток в год! 💰</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Чего НЕ стоит делать ради экономии?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>❌ Не делай так:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">🚫 Не покупай у сомнительных страховых только из-за низкой цены — могут не выплатить.</li>
                        <li style="margin: 10px 0;">🚫 Не скрывай водителей — если не укажешь, полис не покроет их, и это нарушение.</li>
                        <li style="margin: 10px 0;">🚫 Не покупай поддельный полис — это мошенничество, штраф и проблемы.</li>
                        <li style="margin: 10px 0;">🚫 Не пропускай срок продления — потеряешь скидку и можешь получить штраф.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Цена зависит от:</strong> Мощности двигателя, возраста водителя, региона, коэффициента бонус-малус.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Как сэкономить:</strong> Сравни цены, оформляй онлайн, езди аккуратно (скидка до 50%).
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Не гонись за дешёвой:</strong> Сомнительные страховые могут не выплатить. Важна надёжность.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выгодно купить страховку!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "От чего зависит цена ОСАГО?",
                        options: [
                            "Только от марки машины",
                            "От мощности двигателя, возраста водителя, региона, коэффициента бонус-малус",
                            "Только от цвета машины",
                            "Только от года выпуска"
                        ],
                        correct: 1
                    },
                    {
                        question: "Как можно сэкономить на ОСАГО?",
                        options: [
                            "Нельзя сэкономить",
                            "Сравни цены, оформляй онлайн, езди аккуратно (скидка до 50%)",
                            "Только покупая поддельный полис",
                            "Только скрывая водителей"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какую максимальную скидку можно получить за безаварийную езду?",
                        options: [
                            "10%",
                            "До 50%",
                            "100%",
                            "Скидки нет"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.6": {
                title: "Что делать, если произошло ДТП",
                icon: "⚠️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Что делать, если произошло ДТП</h3>
                </div>
                <p class="section-intro">Попал в аварию? Не паникуй! Есть чёткий план действий. Давай разберёмся, что делать пошагово, чтобы всё оформить правильно и получить выплату.</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🚨</span>
                    <h3>Первые действия на месте ДТП</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">⚠️ Немедленно после аварии:</h4>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🛑 Остановись:</strong> Не уезжай с места ДТП! Это нарушение закона.</li>
                        <li style="margin: 10px 0;"><strong>⚠️ Включи аварийку:</strong> Включи аварийную сигнализацию и выставь знак аварийной остановки.</li>
                        <li style="margin: 10px 0;"><strong>👥 Проверь людей:</strong> Есть ли пострадавшие? Если да — вызывай скорую (103) и полицию (102).</li>
                        <li style="margin: 10px 0;"><strong>📸 Сфотографируй:</strong> Сделай фото места ДТП, машин, повреждений, знаков, разметки.</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Оформление ДТП</h3>
                </div>
                <p class="section-intro">Есть два способа оформить ДТП: Европротокол (без ГИБДД) или с вызовом ГИБДД.</p>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Европротокол</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Когда можно:</strong> Если нет пострадавших, только 2 машины, ущерб до 400 000 монеток, нет спора о вине.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Плюсы:</strong> Быстро, не нужно ждать ГИБДД.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">👮</div>
                        <h4>С вызовом ГИБДД</h4>
                        <p style="text-align: left; margin-top: 10px;"><strong>Когда нужно:</strong> Есть пострадавшие, спор о вине, ущерб больше 400 000, больше 2 машин.</p>
                        <p style="text-align: left; margin-top: 10px;"><strong>Плюсы:</strong> Официальное оформление, справка для страховой.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Что делать после оформления</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ После оформления ДТП:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>📞 Позвони в страховую:</strong> В течение 5 дней сообщи о ДТП в страховую виновника (если ты пострадавший) или в свою (если виноват).</li>
                        <li style="margin: 10px 0;"><strong>📋 Подай заявление:</strong> Подай заявление о выплате в страховую виновника в течение 5 дней.</li>
                        <li style="margin: 10px 0;"><strong>🔍 Оценка ущерба:</strong> Страховая осмотрит машину и оценит ущерб.</li>
                        <li style="margin: 10px 0;"><strong>💰 Получи выплату:</strong> В течение 20 дней страховая должна выплатить деньги.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🚨</span>
                                <strong>Первые действия:</strong> Остановись, включи аварийку, проверь людей, сфотографируй всё.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📋</span>
                                <strong>Оформление:</strong> Европротокол (если условия подходят) или вызов ГИБДД.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📞</span>
                                <strong>После ДТП:</strong> Позвони в страховую в течение 5 дней, подай заявление, получи выплату.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, что делать при ДТП!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что нужно сделать сразу после ДТП?",
                        options: [
                            "Уехать с места",
                            "Остановиться, включить аварийку, проверить людей, сфотографировать",
                            "Только вызвать полицию",
                            "Ничего не делать"
                        ],
                        correct: 1
                    },
                    {
                        question: "Когда можно оформить ДТП по Европротоколу?",
                        options: [
                            "Всегда",
                            "Если нет пострадавших, только 2 машины, ущерб до 400 000, нет спора о вине",
                            "Только если есть пострадавшие",
                            "Только если ущерб больше 1 млн"
                        ],
                        correct: 1
                    },
                    {
                        question: "В какой срок нужно сообщить о ДТП в страховую?",
                        options: [
                            "В течение 1 дня",
                            "В течение 5 дней",
                            "В течение месяца",
                            "Неважно когда"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.1.7": {
                title: "Заключение",
                icon: "✅",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Заключение по ОСАГО</h3>
                </div>
                <p class="section-intro">Поздравляю! Ты прошёл все уроки про ОСАГО. Давай повторим самое важное, что нужно помнить!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>Главное, что ты узнал</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>Что такое ОСАГО</h4>
                        <p style="text-align: left; margin-top: 10px;">Обязательная страховка, которая защищает других людей, если ты виноват в аварии. Без неё нельзя ездить!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Выплаты</h4>
                        <p style="text-align: left; margin-top: 10px;">Выплату получает пострадавший, а не виновник. Лимит — 500 000 монеток за имущество и 500 000 за здоровье.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔍</div>
                        <h4>Выбор страховщика</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверь лицензию, рейтинг, отзывы. Сравни цены, но не гонись за самой дешёвой.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Оформление</h4>
                        <p style="text-align: left; margin-top: 10px;">Можно онлайн или в офисе. Нужны: паспорт, СТС, водительское удостоверение. Срок действия — 1 год.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💡</div>
                        <h4>Экономия</h4>
                        <p style="text-align: left; margin-top: 10px;">Сравни цены, оформляй онлайн, езди аккуратно — получишь скидку до 50%!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⚠️</div>
                        <h4>При ДТП</h4>
                        <p style="text-align: left; margin-top: 10px;">Остановись, включи аварийку, сфотографируй, оформи (Европротокол или ГИБДД), сообщи в страховую в течение 5 дней.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">🎓 Поздравляем с завершением курса по ОСАГО!</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <p style="text-align: center; font-size: 1.1em; margin-bottom: 15px;">Теперь ты знаешь:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Что такое ОСАГО и зачем оно нужно
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как работают выплаты
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как выбрать страховщика
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как оформить полис
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как сэкономить
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Что делать при ДТП
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🚗 Удачи на дорогах и будь аккуратен!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое ОСАГО?",
                        options: [
                            "Добровольная страховка",
                            "Обязательная страховка, которая защищает других людей, если ты виноват в аварии",
                            "Страховка только для новых машин",
                            "Страховка только для дорогих машин"
                        ],
                        correct: 1
                    },
                    {
                        question: "Кто получает выплату по ОСАГО?",
                        options: [
                            "Виноватый",
                            "Пострадавший",
                            "Оба",
                            "Никто"
                        ],
                        correct: 1
                    },
                    {
                        question: "В какой срок нужно сообщить о ДТП в страховую?",
                        options: [
                            "В течение 1 дня",
                            "В течение 5 дней",
                            "В течение месяца",
                            "Неважно"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.1": {
                title: "Зачем нужен полис каско",
                icon: "🛡️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🛡️</span>
                    <h3>Зачем нужен полис каско</h3>
                </div>
                <p class="section-intro">КАСКО — это добровольная страховка твоей машины. В отличие от ОСАГО, которое защищает других, КАСКО защищает именно тебя и твою машину. Давай разберёмся, зачем оно нужно!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>Что такое КАСКО?</h3>
                </div>
                <p class="section-intro"><strong>КАСКО</strong> — это Комплексное Автомобильное Страхование Кроме ОСАГО. Простыми словами — это страховка твоей машины от разных неприятностей.</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💡 Главное отличие от ОСАГО</h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>ОСАГО:</strong> Защищает других людей, если ты виноват. НЕ защищает твою машину.</p>
                        <p style="margin-top: 10px;"><strong>КАСКО:</strong> Защищает именно твою машину, независимо от того, кто виноват в аварии.</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Добровольное</h4>
                        <p style="text-align: left; margin-top: 10px;">КАСКО — это не обязательно. Ты сам решаешь, нужно ли оно тебе.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🛡️</div>
                        <h4>Защита твоей машины</h4>
                        <p style="text-align: left; margin-top: 10px;">Если что-то случится с твоей машиной, КАСКО заплатит за ремонт.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Дороже ОСАГО</h4>
                        <p style="text-align: left; margin-top: 10px;">КАСКО стоит дороже, чем ОСАГО, потому что покрывает больше рисков.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🤔</span>
                    <h3>Зачем нужно КАСКО?</h3>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💡 Пример</h4>
                    <p>Ты купил новую машину за 2 000 000 монеток. Через месяц кто-то поцарапал её на парковке и скрылся.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Без КАСКО:</strong></p>
                        <p>Ты платишь за ремонт сам — 50 000 монеток из своего кармана 💸</p>
                        
                        <p style="margin-top: 15px;"><strong>С КАСКО:</strong></p>
                        <p>Страховая платит за ремонт — 50 000 монеток. Тебе не нужно доставать деньги! ✅</p>
                    </div>
                </div>

                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>Защита от больших расходов</h4>
                        <p style="text-align: left; margin-top: 10px;">Если попадёшь в аварию или машину угонят, не нужно будет платить сотни тысяч монеток самому.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💼</div>
                        <h4>Спокойствие</h4>
                        <p style="text-align: left; margin-top: 10px;">Знаешь, что если что-то случится, страховая поможет. Можно ездить спокойнее.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏦</div>
                        <h4>Требование банка</h4>
                        <p style="text-align: left; margin-top: 10px;">Если покупаешь машину в кредит, банк обычно требует КАСКО.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🛡️</span>
                                <strong>КАСКО</strong> — добровольная страховка твоей машины от разных неприятностей.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">🔄</span>
                                <strong>Отличие от ОСАГО:</strong> ОСАГО защищает других, КАСКО защищает твою машину.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Зачем нужно:</strong> Защита от больших расходов, спокойствие, требование банка при кредите.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Добровольное:</strong> Ты сам решаешь, нужно ли оно тебе.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, зачем нужен полис КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое КАСКО?",
                        options: [
                            "Обязательная страховка",
                            "Добровольная страховка твоей машины от разных неприятностей",
                            "Страховка только для новых машин",
                            "То же самое, что ОСАГО"
                        ],
                        correct: 1
                    },
                    {
                        question: "Чем КАСКО отличается от ОСАГО?",
                        options: [
                            "Ничем",
                            "ОСАГО защищает других, КАСКО защищает твою машину",
                            "КАСКО дешевле",
                            "ОСАГО добровольное, КАСКО обязательное"
                        ],
                        correct: 1
                    },
                    {
                        question: "Обязательно ли иметь КАСКО?",
                        options: [
                            "Да, обязательно",
                            "Нет, это добровольная страховка, ты сам решаешь",
                            "Только для новых машин",
                            "Только для дорогих машин"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.2": {
                title: "Покрытие и ограничения каско",
                icon: "📄",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Покрытие и ограничения каско</h3>
                </div>
                <p class="section-intro">КАСКО покрывает разные неприятности с твоей машиной, но не всё. Давай разберёмся, что покрывается, а что нет!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Что покрывает КАСКО?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>ДТП</h4>
                        <p style="text-align: left; margin-top: 10px;">Аварии, столкновения, наезды — всё это покрывается.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔥</div>
                        <h4>Пожар и взрыв</h4>
                        <p style="text-align: left; margin-top: 10px;">Если машина загорится или взорвётся.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🌊</div>
                        <h4>Стихийные бедствия</h4>
                        <p style="text-align: left; margin-top: 10px;">Наводнение, град, ураган, падение деревьев.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🚫</div>
                        <h4>Угон</h4>
                        <p style="text-align: left; margin-top: 10px;">Если машину украдут, страховая выплатит её стоимость.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💥</div>
                        <h4>Повреждения</h4>
                        <p style="text-align: left; margin-top: 10px;">Царапины, вмятины, разбитые стёкла, повреждения от вандалов.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">❌</span>
                    <h3>Что НЕ покрывает КАСКО?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>🚫 КАСКО НЕ покрывает:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">⚙️ Износ и естественный износ деталей</li>
                        <li style="margin: 10px 0;">🔧 Поломки из-за неисправности (если не застраховано отдельно)</li>
                        <li style="margin: 10px 0;">🍺 Ущерб, если водитель был пьян</li>
                        <li style="margin: 10px 0;">🚫 Умышленный ущерб (если сам специально повредил)</li>
                        <li style="margin: 10px 0;">💰 Ущерб, если превысил лимит выплаты</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Лимиты выплат</h3>
                </div>
                <p class="section-intro">КАСКО обычно имеет лимит выплаты — максимальную сумму, которую страховая заплатит за один случай или за весь срок.</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">💡 Пример</h4>
                    <p>У тебя КАСКО с лимитом 1 500 000 монеток. Попал в аварию, ущерб 800 000 монеток.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Страховая заплатит:</strong> 800 000 монеток (в пределах лимита) ✅</p>
                        <p style="margin-top: 10px;">Если бы ущерб был 2 000 000 монеток:</p>
                        <p><strong>Страховая заплатит:</strong> 1 500 000 монеток (лимит)</p>
                        <p><strong>Ты доплатишь:</strong> 500 000 монеток 💸</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Покрывает:</strong> ДТП, пожар, стихийные бедствия, угон, повреждения.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">❌</span>
                                <strong>НЕ покрывает:</strong> Износ, поломки, ущерб при пьяном вождении, умышленный ущерб.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Лимиты:</strong> Есть максимальная сумма выплаты. Если ущерб больше — доплачиваешь сам.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, что покрывает КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что покрывает КАСКО?",
                        options: [
                            "Только ДТП",
                            "ДТП, пожар, стихийные бедствия, угон, повреждения",
                            "Только угон",
                            "Ничего не покрывает"
                        ],
                        correct: 1
                    },
                    {
                        question: "Покрывает ли КАСКО ущерб, если водитель был пьян?",
                        options: [
                            "Да, всегда",
                            "Нет, не покрывает",
                            "Только частично",
                            "Только если это не его вина"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что такое лимит выплаты?",
                        options: [
                            "Минимальная сумма",
                            "Максимальная сумма, которую страховая заплатит",
                            "Средняя сумма",
                            "Лимита нет"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.3": {
                title: "Сколько будет стоить каско",
                icon: "💰",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💰</span>
                    <h3>Сколько будет стоить каско</h3>
                </div>
                <p class="section-intro">КАСКО стоит дороже ОСАГО. От чего зависит цена и можно ли сэкономить? Давай разберёмся!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📊</span>
                    <h3>От чего зависит цена КАСКО?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🚗</div>
                        <h4>Стоимость машины</h4>
                        <p style="text-align: left; margin-top: 10px;">Чем дороже машина — тем дороже КАСКО. Обычно 3–10% от стоимости машины в год.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">👤</div>
                        <h4>Возраст и стаж водителя</h4>
                        <p style="text-align: left; margin-top: 10px;">Молодые водители (до 22 лет) и новички платят больше.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📍</div>
                        <h4>Регион</h4>
                        <p style="text-align: left; margin-top: 10px;">В больших городах (Москва, СПб) дороже из-за большего риска.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📈</div>
                        <h4>История аварий</h4>
                        <p style="text-align: left; margin-top: 10px;">Если были аварии — дороже. Если ездишь аккуратно — дешевле.</p>
                    </div>
                </div>

                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">💸 Пример</h4>
                    <p>Машина стоит 2 000 000 монеток.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>КАСКО может стоить:</strong> 60 000–200 000 монеток в год (3–10% от стоимости)</p>
                        <p style="margin-top: 10px;">Это намного дороже ОСАГО (которое стоит 5 000–15 000 монеток)!</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Как сэкономить на КАСКО?</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ Способы сэкономить:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🔍 Сравни цены:</strong> В разных страховых цены могут сильно отличаться.</li>
                        <li style="margin: 10px 0;"><strong>🚗 Езди аккуратно:</strong> Без аварий — получаешь скидку.</li>
                        <li style="margin: 10px 0;"><strong>📋 Выбери франшизу:</strong> Если согласишься платить часть ремонта сам (например, 30 000 монеток), полис будет дешевле.</li>
                        <li style="margin: 10px 0;"><strong>👥 Ограничь водителей:</strong> Если укажешь только опытных водителей — дешевле.</li>
                        <li style="margin: 10px 0;"><strong>💻 Оформляй онлайн:</strong> Обычно дешевле, чем в офисе.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Цена зависит от:</strong> Стоимости машины, возраста водителя, региона, истории аварий.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📊</span>
                                <strong>Обычно стоит:</strong> 3–10% от стоимости машины в год (60 000–200 000 для машины за 2 млн).
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💡</span>
                                <strong>Как сэкономить:</strong> Сравни цены, езди аккуратно, выбери франшизу, ограничь водителей.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, сколько стоит КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "От чего зависит цена КАСКО?",
                        options: [
                            "Только от марки машины",
                            "От стоимости машины, возраста водителя, региона, истории аварий",
                            "Только от цвета",
                            "Только от года выпуска"
                        ],
                        correct: 1
                    },
                    {
                        question: "Сколько примерно стоит КАСКО для машины за 2 млн монеток?",
                        options: [
                            "5 000–15 000 монеток",
                            "60 000–200 000 монеток в год (3–10% от стоимости)",
                            "500 000 монеток",
                            "1 000 000 монеток"
                        ],
                        correct: 1
                    },
                    {
                        question: "Как можно сэкономить на КАСКО?",
                        options: [
                            "Нельзя сэкономить",
                            "Сравни цены, езди аккуратно, выбери франшизу, ограничь водителей",
                            "Только покупая поддельный полис",
                            "Только скрывая аварии"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.4": {
                title: "Как выбрать страховщика",
                icon: "🔍",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🔍</span>
                    <h3>Как выбрать страховщика для КАСКО</h3>
                </div>
                <p class="section-intro">Выбор страховщика для КАСКО ещё важнее, чем для ОСАГО, потому что КАСКО дороже. Давай разберёмся, на что обращать внимание!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Критерии выбора</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Лицензия</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверь лицензию на КАСКО. Без лицензии полис недействителен!</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⭐</div>
                        <h4>Рейтинг и отзывы</h4>
                        <p style="text-align: left; margin-top: 10px;">Особенно важно, как выплачивают после ДТП. Читай отзывы про выплаты.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Цена и условия</h4>
                        <p style="text-align: left; margin-top: 10px;">Сравни цены, но смотри и на условия: лимиты, франшизу, что покрывается.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🏢</div>
                        <h4>Сервис</h4>
                        <p style="text-align: left; margin-top: 10px;">Как быстро выплачивают? Есть ли офисы? Можно ли оформить онлайн?</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Советы по выбору</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🔍 Сравни несколько:</strong> Посмотри 5–7 страховых, сравни цены и условия.</li>
                        <li style="margin: 10px 0;"><strong>📊 Проверь рейтинг:</strong> Выбирай с высоким рейтингом надёжности.</li>
                        <li style="margin: 10px 0;"><strong>💬 Читай отзывы:</strong> Особенно про выплаты. Если много жалоб — не бери.</li>
                        <li style="margin: 10px 0;"><strong>💰 Не гонись за дешёвой:</strong> Дешёвая может плохо выплачивать или затягивать.</li>
                        <li style="margin: 10px 0;"><strong>📋 Читай договор:</strong> Смотри, что покрывается, какие лимиты, есть ли франшиза.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Проверь лицензию</strong> — без неё полис недействителен.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⭐</span>
                                <strong>Смотри рейтинг и отзывы</strong> — особенно про выплаты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💰</span>
                                <strong>Сравни цены и условия</strong> — не гонись за самой дешёвой.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📋</span>
                                <strong>Читай договор</strong> — смотри лимиты, франшизу, что покрывается.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как выбрать страховщика для КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что самое важное при выборе страховщика для КАСКО?",
                        options: [
                            "Только цена",
                            "Лицензия, рейтинг, отзывы, цена, условия, сервис",
                            "Только название",
                            "Только цвет логотипа"
                        ],
                        correct: 1
                    },
                    {
                        question: "Нужно ли читать договор КАСКО?",
                        options: [
                            "Не нужно",
                            "Да, обязательно — смотри лимиты, франшизу, что покрывается",
                            "Только если дорогой полис",
                            "Только если новый страховщик"
                        ],
                        correct: 1
                    },
                    {
                        question: "Стоит ли выбирать самую дешёвую страховую для КАСКО?",
                        options: [
                            "Да, всегда",
                            "Нет, дешёвая может плохо выплачивать — важна надёжность",
                            "Только если нет денег",
                            "Только для старых машин"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.5": {
                title: "Процесс оформления каско",
                icon: "📝",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📝</span>
                    <h3>Процесс оформления каско</h3>
                </div>
                <p class="section-intro">Оформить КАСКО можно онлайн или в офисе. Процесс похож на ОСАГО, но есть нюансы. Давай разберёмся!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💻</span>
                    <h3>Онлайн-оформление</h3>
                </div>
                <p class="section-intro">Самый удобный способ — оформить КАСКО онлайн. Быстро и удобно!</p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                    <h4 style="margin-top: 0; color: #1976D2;">📝 Шаги оформления онлайн</h4>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">Заходишь на сайт страховой</li>
                        <li style="margin: 10px 0;">Вводишь данные машины (номер, марка, модель, год, стоимость)</li>
                        <li style="margin: 10px 0;">Вводишь данные водителей</li>
                        <li style="margin: 10px 0;">Выбираешь условия (лимиты, франшизу, что покрывается)</li>
                        <li style="margin: 10px 0;">Видишь цену и оплачиваешь</li>
                        <li style="margin: 10px 0;">Получаешь полис на email — готово! ✅</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Что нужно для оформления?</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📋</div>
                        <h4>Документы</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Паспорт</li>
                            <li>СТС (свидетельство о регистрации)</li>
                            <li>Водительское удостоверение</li>
                            <li>ПТС (паспорт транспортного средства)</li>
                        </ul>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Для оплаты</h4>
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Банковская карта</li>
                            <li>Или можно оплатить в офисе</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Важные моменты</h3>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <p><strong>⚠️ На что обратить внимание:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>✅ Проверь данные:</strong> Все должно быть правильно.</li>
                        <li style="margin: 10px 0;"><strong>📋 Читай условия:</strong> Что покрывается, лимиты, франшиза.</li>
                        <li style="margin: 10px 0;"><strong>📅 Срок действия:</strong> Обычно 1 год, не забудь продлить!</li>
                        <li style="margin: 10px 0;"><strong>💰 Цена:</strong> Сравни цены в разных страховых перед покупкой.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">💻</span>
                                <strong>Онлайн</strong> — самый удобный способ: быстро, без очередей.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📄</span>
                                <strong>Нужны документы:</strong> Паспорт, СТС, ПТС, водительское удостоверение, карта для оплаты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                <strong>Проверь данные и условия:</strong> Все должно быть правильно, читай что покрывается.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📅</span>
                                <strong>Срок действия:</strong> Обычно 1 год, не забудь продлить!
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как оформить КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Какой самый удобный способ оформить КАСКО?",
                        options: [
                            "Только в офисе",
                            "Онлайн — быстро, удобно, без очередей",
                            "Только по телефону",
                            "Только через агента"
                        ],
                        correct: 1
                    },
                    {
                        question: "Какие документы нужны для оформления КАСКО?",
                        options: [
                            "Только паспорт",
                            "Паспорт, СТС, ПТС, водительское удостоверение, карта для оплаты",
                            "Только водительское удостоверение",
                            "Никакие документы не нужны"
                        ],
                        correct: 1
                    },
                    {
                        question: "На какой срок обычно оформляется КАСКО?",
                        options: [
                            "На 6 месяцев",
                            "На 1 год",
                            "На 2 года",
                            "Навсегда"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.6": {
                title: "Урегулирование убытков",
                icon: "⚖️",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚖️</span>
                    <h3>Урегулирование убытков</h3>
                </div>
                <p class="section-intro">Попал в аварию или машину повредили? Нужно получить выплату от страховой. Давай разберёмся, как это сделать правильно!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📞</span>
                    <h3>Что делать после происшествия?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <h4 style="margin-top: 0; color: #c62828;">⚠️ Немедленно после происшествия:</h4>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;"><strong>🛑 Остановись:</strong> Не уезжай с места!</li>
                        <li style="margin: 10px 0;"><strong>⚠️ Включи аварийку:</strong> Включи аварийную сигнализацию.</li>
                        <li style="margin: 10px 0;"><strong>📸 Сфотографируй:</strong> Сделай фото места, машин, повреждений.</li>
                        <li style="margin: 10px 0;"><strong>👮 Вызови полицию:</strong> Если ДТП — вызови ГИБДД (102).</li>
                        <li style="margin: 10px 0;"><strong>📞 Позвони в страховую:</strong> Сообщи о происшествии в течение суток.</li>
                    </ol>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📋</span>
                    <h3>Процесс получения выплаты</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">📞</div>
                        <h4>1. Уведомление</h4>
                        <p style="text-align: left; margin-top: 10px;">Позвони в страховую в течение суток после происшествия.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📄</div>
                        <h4>2. Подача заявления</h4>
                        <p style="text-align: left; margin-top: 10px;">Подай заявление о выплате в течение 5 дней. Приложи документы.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔍</div>
                        <h4>3. Осмотр машины</h4>
                        <p style="text-align: left; margin-top: 10px;">Страховая осмотрит машину и оценит ущерб.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>4. Выплата</h4>
                        <p style="text-align: left; margin-top: 10px;">В течение 20 дней страховая должна выплатить деньги.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📄</span>
                    <h3>Какие документы нужны?</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p><strong>✅ Нужные документы:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">📋 Заявление о выплате</li>
                        <li style="margin: 10px 0;">🚗 Документы на машину (СТС, ПТС)</li>
                        <li style="margin: 10px 0;">📜 Полис КАСКО</li>
                        <li style="margin: 10px 0;">👮 Справка о ДТП (если было ДТП)</li>
                        <li style="margin: 10px 0;">📸 Фото повреждений</li>
                        <li style="margin: 10px 0;">💳 Реквизиты для выплаты</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">⚠️</span>
                    <h3>Когда могут отказать?</h3>
                </div>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
                    <p><strong>🚨 Страховая может отказать, если:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">⏰ Пропустил срок уведомления (больше суток)</li>
                        <li style="margin: 10px 0;">📄 Не подал документы в срок</li>
                        <li style="margin: 10px 0;">🍺 Водитель был пьян</li>
                        <li style="margin: 10px 0;">🚫 Ущерб не покрывается полисом</li>
                        <li style="margin: 10px 0;">💰 Ущерб превышает лимит (но заплатят до лимита)</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">📚 Основные выводы урока</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📞</span>
                                <strong>Уведомление:</strong> Позвони в страховую в течение суток после происшествия.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📋</span>
                                <strong>Процесс:</strong> Подай заявление в течение 5 дней, осмотр машины, выплата в течение 20 дней.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">📄</span>
                                <strong>Документы:</strong> Заявление, документы на машину, полис, справка о ДТП, фото, реквизиты.
                            </li>
                            <li style="margin: 15px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">⚠️</span>
                                <strong>Могут отказать:</strong> Если пропустил срок, не подал документы, водитель был пьян.
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🎓 Теперь ты знаешь, как получить выплату по КАСКО!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "В какой срок нужно уведомить страховую о происшествии?",
                        options: [
                            "В течение 1 часа",
                            "В течение суток",
                            "В течение недели",
                            "Неважно когда"
                        ],
                        correct: 1
                    },
                    {
                        question: "В какой срок страховая должна выплатить деньги?",
                        options: [
                            "В течение 5 дней",
                            "В течение 20 дней",
                            "В течение месяца",
                            "В течение года"
                        ],
                        correct: 1
                    },
                    {
                        question: "Когда страховая может отказать в выплате?",
                        options: [
                            "Никогда не может отказать",
                            "Если пропустил срок, не подал документы, водитель был пьян",
                            "Только если дорогая машина",
                            "Только если новый полис"
                        ],
                        correct: 1
                    }
                ]
            },
            "6.2.7": {
                title: "Главное о полисе каско",
                icon: "🎯",
                theory: `
            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">🎯</span>
                    <h3>Главное о полисе каско</h3>
                </div>
                <p class="section-intro">Поздравляю! Ты прошёл все уроки про КАСКО. Давай повторим самое важное, что нужно помнить!</p>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">📚</span>
                    <h3>Главное, что ты узнал</h3>
                </div>
                
                <div class="income-cards" style="margin-top: 20px;">
                    <div class="income-card">
                        <div class="income-icon">🛡️</div>
                        <h4>Что такое КАСКО</h4>
                        <p style="text-align: left; margin-top: 10px;">Добровольная страховка твоей машины от разных неприятностей. Защищает именно твою машину.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">✅</div>
                        <h4>Что покрывает</h4>
                        <p style="text-align: left; margin-top: 10px;">ДТП, пожар, стихийные бедствия, угон, повреждения. Но не покрывает износ, поломки, ущерб при пьяном вождении.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">💰</div>
                        <h4>Сколько стоит</h4>
                        <p style="text-align: left; margin-top: 10px;">Обычно 3–10% от стоимости машины в год. Зависит от стоимости машины, возраста водителя, региона, истории аварий.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">🔍</div>
                        <h4>Выбор страховщика</h4>
                        <p style="text-align: left; margin-top: 10px;">Проверь лицензию, рейтинг, отзывы. Сравни цены и условия. Не гонись за самой дешёвой.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">📝</div>
                        <h4>Оформление</h4>
                        <p style="text-align: left; margin-top: 10px;">Можно онлайн или в офисе. Нужны: паспорт, СТС, ПТС, водительское удостоверение. Срок действия — обычно 1 год.</p>
                    </div>
                    
                    <div class="income-card">
                        <div class="income-icon">⚖️</div>
                        <h4>Урегулирование</h4>
                        <p style="text-align: left; margin-top: 10px;">Уведоми страховую в течение суток, подай заявление в течение 5 дней, получи выплату в течение 20 дней.</p>
                    </div>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">💡</span>
                    <h3>Помни главное</h3>
                </div>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li style="margin: 10px 0;">🛡️ <strong>КАСКО — это защита твоей машины</strong>, а не других людей (как ОСАГО).</li>
                        <li style="margin: 10px 0;">💰 <strong>КАСКО дороже ОСАГО</strong>, но защищает больше.</li>
                        <li style="margin: 10px 0;">✅ <strong>КАСКО добровольное</strong> — ты сам решаешь, нужно ли оно.</li>
                        <li style="margin: 10px 0;">🔍 <strong>Выбирай страховщика с умом</strong> — важна надёжность, а не только цена.</li>
                        <li style="margin: 10px 0;">📋 <strong>Читай договор</strong> — смотри, что покрывается, лимиты, франшизу.</li>
                        <li style="margin: 10px 0;">⚠️ <strong>Езди аккуратно</strong> — без аварий получишь скидку на следующий год.</li>
                    </ul>
                </div>
            </div>

            <div class="theory-section">
                <div class="section-header">
                    <span class="section-badge">✅</span>
                    <h3>Подведём итоги</h3>
                </div>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 20px 0; color: white;">
                    <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 20px; text-align: center;">🎓 Поздравляем с завершением курса по КАСКО!</p>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <p style="text-align: center; font-size: 1.1em; margin-bottom: 15px;">Теперь ты знаешь:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Что такое КАСКО и зачем оно нужно
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Что покрывает и что не покрывает
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Сколько стоит и от чего зависит цена
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как выбрать страховщика
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как оформить полис
                            </li>
                            <li style="margin: 10px 0; padding-left: 30px; position: relative;">
                                <span style="position: absolute; left: 0; font-size: 1.3em;">✅</span>
                                Как получить выплату
                            </li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 1.05em; font-weight: 500;">🚗 Удачи на дорогах и будь аккуратен!</p>
                </div>
            </div>
        `,
                practice: {},
                finalTest: [
                    {
                        question: "Что такое КАСКО?",
                        options: [
                            "Обязательная страховка",
                            "Добровольная страховка твоей машины от разных неприятностей",
                            "То же самое, что ОСАГО",
                            "Страховка только для новых машин"
                        ],
                        correct: 1
                    },
                    {
                        question: "Что покрывает КАСКО?",
                        options: [
                            "Только ДТП",
                            "ДТП, пожар, стихийные бедствия, угон, повреждения",
                            "Только угон",
                            "Ничего не покрывает"
                        ],
                        correct: 1
                    },
                    {
                        question: "В какой срок нужно уведомить страховую о происшествии?",
                        options: [
                            "В течение 1 часа",
                            "В течение суток",
                            "В течение недели",
                            "Неважно когда"
                        ],
                        correct: 1
                    }
                ]
            }
        }
    }
};

// Данные для практического симулятора
const simulatorData = {
    1: {
        title: "Практический симулятор: Фундамент (Деньги и Я)",
        icon: "💰",
        questions: [
            {
                type: "question",
                text: "Какой тип дохода получает человек, который работает официантом и получает зарплату?",
                options: [
                    "Зарплата",
                    "Предпринимательский доход",
                    "Пассивный доход",
                    "Все перечисленное"
                ],
                correct: 0
            },
            {
                type: "question",
                text: "По правилу 50/30/20, сколько процентов дохода должно идти на сбережения?",
                options: [
                    "10%",
                    "20%",
                    "30%",
                    "50%"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Маша хочет купить новый телефон за 30 000 монеток. Она может откладывать по 3 000 монеток в месяц. Сколько месяцев ей понадобится?",
                options: [
                    "8 месяцев",
                    "10 месяцев",
                    "12 месяцев",
                    "15 месяцев"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что такое финансовая цель?",
                options: [
                    "Просто мечта о покупке",
                    "Мечта с цифрами и сроком",
                    "План без конкретных действий",
                    "Желание без плана"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Алексей продает свои дизайны в интернете и получает за это деньги. Какой это тип дохода?",
                options: [
                    "Зарплата",
                    "Предпринимательский доход",
                    "Пассивный доход",
                    "Подарок"
                ],
                correct: 1
            }
        ]
    },
    2: {
        title: "Практический симулятор: Банки и кредиты",
        icon: "🏦",
        questions: [
            {
                type: "question",
                text: "Что такое дебетовая карта?",
                options: [
                    "Карта, которая позволяет тратить деньги банка",
                    "Карта, которая дает возможность распоряжаться деньгами в пределах сумм на счете",
                    "Карта только для онлайн-покупок",
                    "Карта, которая не требует пополнения"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Иван хочет взять кредит на 200 000 монеток на 2 года под 15% годовых. Какой будет переплата?",
                options: [
                    "30 000 монеток",
                    "60 000 монеток",
                    "90 000 монеток",
                    "120 000 монеток"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что такое беспроцентный период по кредитной карте?",
                options: [
                    "Время, когда можно не платить вообще",
                    "Количество дней, в течение которых банк не начисляет проценты при условии внесения минимального платежа",
                    "Период, когда карта заблокирована",
                    "Время действия карты"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Мария открыла накопительный счет со ставкой 5% годовых и положила 100 000 монеток. Сколько она получит через год?",
                options: [
                    "100 000 монеток",
                    "105 000 монеток",
                    "110 000 монеток",
                    "115 000 монеток"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "На какую сумму застрахованы вклады в банках?",
                options: [
                    "До 1 000 000 монеток",
                    "До 1 400 000 монеток",
                    "До 2 000 000 монеток",
                    "Не застрахованы"
                ],
                correct: 1
            }
        ]
    },
    3: {
        title: "Практический симулятор: Инвестиции",
        icon: "📈",
        questions: [
            {
                type: "question",
                text: "Что такое акция?",
                options: [
                    "Долговая ценная бумага",
                    "Доля в собственности компании",
                    "Вид кредита",
                    "Банковский вклад"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Петр купил 10 акций по 1000 монеток каждая. Через год цена выросла до 1200 монеток. Какова его прибыль?",
                options: [
                    "1 000 монеток",
                    "2 000 монеток",
                    "10 000 монеток",
                    "12 000 монеток"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что такое диверсификация портфеля?",
                options: [
                    "Вложение всех денег в один актив",
                    "Распределение инвестиций между разными активами для снижения риска",
                    "Продажа всех активов",
                    "Покупка только акций"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Анна хочет начать инвестировать, но боится рисков. Какой вариант для неё наиболее подходящий?",
                options: [
                    "Покупка акций одной компании",
                    "Индексные фонды с диверсификацией",
                    "Хранение денег под матрасом",
                    "Кредит для инвестиций"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что такое облигация?",
                options: [
                    "Доля в компании",
                    "Долговая ценная бумага, по которой эмитент обязуется выплатить номинальную стоимость и проценты",
                    "Вид акции",
                    "Банковский депозит"
                ],
                correct: 1
            }
        ]
    },
    5: {
        title: "Практический симулятор: Недвижимость",
        icon: "🏠",
        questions: [
            {
                type: "question",
                text: "Что такое ипотека?",
                options: [
                    "Беспроцентный кредит",
                    "Долгосрочный кредит под залог недвижимости",
                    "Подарок от банка",
                    "Временная аренда"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Сергей хочет купить квартиру за 5 000 000 монеток. Банк требует первоначальный взнос 20%. Сколько нужно накопить?",
                options: [
                    "500 000 монеток",
                    "1 000 000 монеток",
                    "2 000 000 монеток",
                    "3 000 000 монеток"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что выгоднее: аренда или покупка недвижимости?",
                options: [
                    "Всегда аренда",
                    "Всегда покупка",
                    "Зависит от ситуации, финансовых возможностей и планов",
                    "Не имеет значения"
                ],
                correct: 2
            },
            {
                type: "situation",
                text: "Ольга сдает квартиру в аренду за 30 000 монеток в месяц. Какой это тип дохода?",
                options: [
                    "Зарплата",
                    "Предпринимательский доход",
                    "Пассивный доход",
                    "Подарок"
                ],
                correct: 2
            },
            {
                type: "question",
                text: "Что такое первоначальный взнос при ипотеке?",
                options: [
                    "Проценты по кредиту",
                    "Часть стоимости недвижимости, которую нужно заплатить сразу",
                    "Ежемесячный платеж",
                    "Страховка"
                ],
                correct: 1
            }
        ]
    },
    6: {
        title: "Практический симулятор: Страхование",
        icon: "🛡️",
        questions: [
            {
                type: "question",
                text: "Что такое ОСАГО?",
                options: [
                    "Страхование жизни",
                    "Обязательное страхование автогражданской ответственности",
                    "Страхование имущества",
                    "Медицинское страхование"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Дмитрий попал в ДТП по своей вине. У него есть ОСАГО. Что покрывает страховка?",
                options: [
                    "Ущерб его автомобилю",
                    "Ущерб автомобилю пострадавшего",
                    "Все расходы",
                    "Ничего не покрывает"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что влияет на стоимость полиса ОСАГО?",
                options: [
                    "Только марка автомобиля",
                    "Возраст водителя, стаж, история вождения, мощность автомобиля",
                    "Только цвет автомобиля",
                    "Ничего не влияет"
                ],
                correct: 1
            },
            {
                type: "situation",
                text: "Елена хочет сэкономить на страховке. Что она может сделать?",
                options: [
                    "Не оформлять страховку",
                    "Выбрать страховую с выгодными условиями, использовать скидки за безаварийную езду",
                    "Указать неверные данные",
                    "Купить поддельный полис"
                ],
                correct: 1
            },
            {
                type: "question",
                text: "Что делать при ДТП?",
                options: [
                    "Уехать с места происшествия",
                    "Вызвать ГИБДД, оформить документы, уведомить страховую",
                    "Ничего не делать",
                    "Спрятать автомобиль"
                ],
                correct: 1
            }
        ]
    }
};

// Состояние приложения
let currentLesson = 1;
let currentSimulatorBlock = null;
let currentSimulatorQuestion = 0;
let simulatorScore = 0;
let simulatorAnswers = [];

// ==================== ИГРА "ТВОЯ ЖИЗНЬ" ====================

// Получить текущий баланс монет
function getCurrentCoinsBalance() {
    // Если пользователь не авторизован, возвращаем 0
    if (!currentUser) {
        return 0;
    }
    
    // Источник правды для баланса монет в сессии — practiceCoins.
    // currentUser.coins может быть не обновлён до saveUserProgress().
    if (typeof practiceCoins !== 'undefined') {
        return practiceCoins || 0;
    }
    return (currentUser && typeof currentUser.coins === 'number') ? currentUser.coins : 0;
}

// Состояние игры
let lifeGameState = {
    playerName: "Игрок",
    cash: 0, // Будет установлен при инициализации
    bankBalance: 0,
    gameMonth: 1,
    gameYear: 1,
    gameTimer: null,
    
    // Доходы
    salary: 80000,
    
    // Расходы
    livingExpenses: 40000,
    rent: 20000, // если нет своей квартиры
    hasOwnApartment: false,
    
    // Активы
    stocks: {}, // {company: {quantity: 0, avgPrice: 0}}
    bonds: {}, // {bondId: {quantity: 0, price: 0}}
    properties: [], // массив объектов недвижимости
    deposits: [], // массив депозитов
    credits: [], // массив кредитов
    insurance: {
        life: false,
        medical: false,
        property: []
    },
    
    // История для графиков
    history: {
        months: [],
        capital: [],
        income: [],
        expenses: []
    },
    
    // Цели
    goals: {
        buyApartment: { target: 1, current: 0, completed: false },
        passiveIncome100: { target: 100, current: 0, completed: false },
        diversify3: { target: 3, current: 0, completed: false },
        payCredit: { target: 1, current: 0, completed: false }
    },
    
    // Достижения
    achievements: {
        firstDeposit: false,
        firstStock: false,
        firstProperty: false,
        insured: false,
        creditPaid: false,
        millionaire: false
    },
    
    // События
    pendingEvents: []
};

// Данные для игры
const lifeGameData = {
    stocks: [
        { id: 'metal', name: 'МеталлПром', icon: '🏭', basePrice: 150, change: 0 },
        { id: 'tech', name: 'ТехноКорп', icon: '🍏', basePrice: 280, change: 0 },
        { id: 'energy', name: 'ЭнергоСистемы', icon: '⚡', basePrice: 75, change: 0 },
        { id: 'bank', name: 'ГорБанк', icon: '🏦', basePrice: 120, change: 0 },
        { id: 'trade', name: 'ТоргСеть', icon: '🛒', basePrice: 95, change: 0 }
    ],
    bonds: [
        { id: 'ofz1', name: 'ОФЗ-26238', icon: '🏛', price: 980, yield: 7.5, term: 36 },
        { id: 'mun1', name: 'МунОбл-2025', icon: '🏙', price: 1010, yield: 8.2, term: 24 },
        { id: 'corp1', name: 'КорпОблигация', icon: '🏢', price: 995, yield: 9.0, term: 60 }
    ],
    properties: [
        { id: 1, name: 'Квартира-студия', area: 30, district: 'Спальный', price: 3500, rentIncome: 15, type: 'apartment' },
        { id: 2, name: '1-комнатная квартира', area: 45, district: 'Центр', price: 7000, rentIncome: 30, type: 'apartment' },
        { id: 3, name: 'Коммерческое помещение', area: 60, district: 'Деловой', price: 12000, rentIncome: 70, type: 'commercial' }
    ],
    events: [
        { type: 'illness', name: 'Болезнь', cost: 50000, requiresInsurance: 'medical' },
        { type: 'flood', name: 'Потоп в квартире', cost: 200000, requiresInsurance: 'property' },
        { type: 'crisis', name: 'Кризис на бирже', effect: 'stocks_down_30' },
        { type: 'promotion', name: 'Повышение на работе', effect: 'salary_up_20' }
    ]
};

// Показать игру "Твоя жизнь"
function showLifeGame() {
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к игре!");
        showLogin();
        return;
    }

    // Инициализировать баланс перед загрузкой
    lifeGameState.cash = getCurrentCoinsBalance();

    // Загрузить сохраненное состояние
    loadLifeGameState();

    showScreen("life-game-screen");
    initializeLifeGame();
    startLifeGameTimer();
}

// Вернуться к урокам
function backToLessons() {
    // Остановить таймер игры
    if (lifeGameState.gameTimer) {
        clearInterval(lifeGameState.gameTimer);
        lifeGameState.gameTimer = null;
    }
    
    // Сохранить состояние игры
    saveLifeGameState();
    
    // Закрыть все открытые панели
    closeAllPanels();
    
    // Вернуться к экрану уроков
    showLessons();
}

// Инициализация игры
function initializeLifeGame() {
    // Синхронизировать с текущими монетами перед инициализацией
    syncLifeGameWithCoins();

    updateLifeGameUI();
    renderStocksTable();
    renderBondsTable();
    renderPropertiesList();
    updatePortfolio();
    updateStatistics();
    checkGoals();
}

// Загрузить состояние игры из localStorage
function loadLifeGameState() {
    const saved = localStorage.getItem('lifeGameState');
    const isFirstTime = !localStorage.getItem('lifeGameInitialized');
    const saveVersion = localStorage.getItem('lifeGameSaveVersion');

    // Проверяем версию сохранения - если версия старая или отсутствует, сбрасываем
    if (!saveVersion || saveVersion !== '1.4') {
        // Новая версия сохранения - сбрасываем все старые данные
        localStorage.removeItem('lifeGameState');
        localStorage.removeItem('lifeGameInitialized');
        resetLifeGameToInitial();
        localStorage.setItem('lifeGameSaveVersion', '1.4');
        localStorage.setItem('lifeGameInitialized', 'true');
        return;
    }

    if (isFirstTime) {
        // Первый запуск - устанавливаем начальные значения
        resetLifeGameToInitial();
        localStorage.setItem('lifeGameInitialized', 'true');
    } else if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            // Проверяем, есть ли сохраненное состояние с данными
            if (loadedState && loadedState.cash !== undefined) {
                lifeGameState = loadedState;
            } else {
                // Если сохраненное состояние некорректно, сбрасываем на начальные значения
                resetLifeGameToInitial();
            }
        } catch (e) {
            console.error('Ошибка загрузки состояния игры:', e);
            resetLifeGameToInitial();
        }
    } else {
        // Если нет сохраненного состояния, но игра уже инициализирована
        // (не должно происходить, но на всякий случай)
        resetLifeGameToInitial();
    }

    // Синхронизировать наличные в игре с текущим балансом монет
    lifeGameState.cash = getCurrentCoinsBalance();
}

// Полностью сбросить все сохранения игры
function resetLifeGameCompletely() {
    localStorage.removeItem('lifeGameState');
    localStorage.removeItem('lifeGameInitialized');
    localStorage.removeItem('lifeGameSaveVersion');
    resetLifeGameToInitial();
    alert('Все сохранения игры сброшены! Баланс теперь 0 🪙');
}

// Сбросить игру к начальным значениям
function resetLifeGameToInitial() {
    lifeGameState = {
        playerName: "Игрок",
        cash: getCurrentCoinsBalance(),
        bankBalance: 0,
        gameMonth: 1,
        gameYear: 1,
        gameTimer: null,
        
        // Доходы
        salary: 80000,
        
        // Расходы
        livingExpenses: 40000,
        rent: 20000,
        hasOwnApartment: false,
        
        // Активы
        stocks: {},
        bonds: {},
        properties: [],
        deposits: [],
        credits: [],
        insurance: {
            life: false,
            medical: false,
            property: []
        },
        
        // История для графиков
        history: {
            months: [],
            capital: [],
            income: [],
            expenses: []
        },
        
        // Цели
        goals: {
            buyApartment: { target: 1, current: 0, completed: false },
            passiveIncome100: { target: 100, current: 0, completed: false },
            diversify3: { target: 3, current: 0, completed: false },
            payCredit: { target: 1, current: 0, completed: false }
        },
        
        // Достижения
        achievements: {
            firstDeposit: false,
            firstStock: false,
            firstProperty: false,
            insured: false,
            creditPaid: false,
            millionaire: false
        },
        
        // События
        pendingEvents: []
    };
    
    // Сохранить начальное состояние
    saveLifeGameState();
}

// Сохранить состояние игры
function saveLifeGameState() {
    try {
        localStorage.setItem('lifeGameState', JSON.stringify(lifeGameState));
        localStorage.setItem('lifeGameSaveVersion', '1.4');
    } catch (e) {
        console.error('Ошибка сохранения состояния игры:', e);
    }
}

// Обновить UI игры
function updateLifeGameUI() {
    document.getElementById('life-game-player-name').textContent = lifeGameState.playerName;
    document.getElementById('life-game-cash').textContent = formatMoney(lifeGameState.cash);
    document.getElementById('life-game-bank').textContent = formatMoney(lifeGameState.bankBalance);
    
    const totalCapital = calculateTotalCapital();
    document.getElementById('life-game-total-capital').textContent = formatMoney(totalCapital);
    
    // Обновить активы
    const stocksValue = calculateStocksValue();
    const bondsValue = calculateBondsValue();
    const propertiesValue = calculatePropertiesValue();
    const depositsValue = calculateDepositsValue();
    
    document.getElementById('life-game-assets-stocks').textContent = formatMoney(stocksValue);
    document.getElementById('life-game-assets-bonds').textContent = formatMoney(bondsValue);
    document.getElementById('life-game-assets-realestate').textContent = formatMoney(propertiesValue);
    document.getElementById('life-game-assets-deposits').textContent = formatMoney(depositsValue);
    
    // Обновить время
    const timeText = `${lifeGameState.gameMonth} МЕСЯЦ${lifeGameState.gameMonth > 1 ? 'А' : ''} ${lifeGameState.gameYear > 1 ? `, ${lifeGameState.gameYear} ГОД` : ''}`;
    document.getElementById('life-game-time').textContent = timeText;

    // Синхронизировать изменения в игре с общими монетами
    if (currentUser && lifeGameState.cash !== currentUser.coins) {
        currentUser.coins = lifeGameState.cash;
        practiceCoins = lifeGameState.cash;
        updateCoinsDisplay();
        saveUser(currentUser);
    }
}

// Форматирование денег
function formatMoney(amount) {
    return Math.round(amount).toLocaleString('ru-RU');
}

// Вычислить общий капитал
function calculateTotalCapital() {
    return lifeGameState.cash + 
           lifeGameState.bankBalance + 
           calculateStocksValue() + 
           calculateBondsValue() + 
           calculatePropertiesValue() + 
           calculateDepositsValue();
}

// Вычислить стоимость акций
function calculateStocksValue() {
    let total = 0;
    for (let stockId in lifeGameState.stocks) {
        const stock = lifeGameData.stocks.find(s => s.id === stockId);
        if (stock) {
            total += lifeGameState.stocks[stockId].quantity * stock.basePrice;
        }
    }
    return total;
}

// Вычислить стоимость облигаций
function calculateBondsValue() {
    let total = 0;
    for (let bondId in lifeGameState.bonds) {
        const bond = lifeGameData.bonds.find(b => b.id === bondId);
        if (bond) {
            total += lifeGameState.bonds[bondId].quantity * bond.price;
        }
    }
    return total;
}

// Вычислить стоимость недвижимости
function calculatePropertiesValue() {
    return lifeGameState.properties.reduce((sum, prop) => sum + prop.price, 0);
}

// Вычислить стоимость депозитов
function calculateDepositsValue() {
    return lifeGameState.deposits.reduce((sum, dep) => sum + dep.amount, 0);
}

// Таймер игры
function startLifeGameTimer() {
    if (lifeGameState.gameTimer) {
        clearInterval(lifeGameState.gameTimer);
    }

    // Один месяц = 10 минут (600000 миллисекунд)
    const interval = 600000;

    lifeGameState.gameTimer = setInterval(() => {
        processGameMonth();
    }, interval);
}

// Обработка игрового месяца
function processGameMonth() {
    // Доходы
    let income = lifeGameState.salary;
    
    // Арендный доход
    lifeGameState.properties.forEach(prop => {
        if (prop.rented) {
            income += prop.rentIncome;
        }
    });
    
    // Дивиденды (раз в год)
    if (lifeGameState.gameMonth % 12 === 0) {
        for (let stockId in lifeGameState.stocks) {
            const stock = lifeGameData.stocks.find(s => s.id === stockId);
            if (stock && lifeGameState.stocks[stockId].quantity > 0) {
                const dividend = stock.basePrice * lifeGameState.stocks[stockId].quantity * (0.02 + Math.random() * 0.03);
                income += dividend;
            }
        }
    }
    
    // Купоны по облигациям (раз в 6 месяцев)
    if (lifeGameState.gameMonth % 6 === 0) {
        for (let bondId in lifeGameState.bonds) {
            const bond = lifeGameData.bonds.find(b => b.id === bondId);
            if (bond && lifeGameState.bonds[bondId].quantity > 0) {
                const coupon = bond.price * lifeGameState.bonds[bondId].quantity * (bond.yield / 100) / 2;
                income += coupon;
            }
        }
    }
    
    // Проценты по депозитам
    lifeGameState.deposits.forEach(dep => {
        if (dep.monthsLeft > 0) {
            const monthlyInterest = dep.amount * (dep.rate / 100) / 12;
            lifeGameState.bankBalance += monthlyInterest;
        }
    });
    
    // Расходы
    let expenses = lifeGameState.livingExpenses;
    
    if (!lifeGameState.hasOwnApartment) {
        expenses += lifeGameState.rent;
    }
    
    // Кредитные платежи
    lifeGameState.credits.forEach(credit => {
        if (credit.monthsLeft > 0) {
            expenses += credit.monthlyPayment;
            credit.monthsLeft--;
            credit.totalPaid += credit.monthlyPayment;
            
            if (credit.monthsLeft === 0) {
                // Кредит погашен
                lifeGameState.goals.payCredit.current = 1;
                checkGoals();
            }
        }
    });
    
    // Страховые платежи
    if (lifeGameState.insurance.life) expenses += 100;
    if (lifeGameState.insurance.medical) expenses += 200;
    lifeGameState.insurance.property.forEach(() => {
        expenses += 50;
    });
    
    // Баланс всегда синхронизируется с общими монетами - не изменяем его здесь
    
    // Обновить депозиты
    lifeGameState.deposits.forEach(dep => {
        if (dep.monthsLeft > 0) {
            dep.monthsLeft--;
        }
    });
    
    // Изменить цены на акции (случайно ±10%)
    lifeGameData.stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 0.2; // -10% до +10%
        stock.change = change * 100;
        stock.basePrice = Math.max(1, stock.basePrice * (1 + change));
    });
    
    // Изменить цены на недвижимость (рост 5-15% в год)
    if (lifeGameState.gameMonth % 12 === 0) {
        const growth = 0.05 + Math.random() * 0.1; // 5-15%
        lifeGameState.properties.forEach(prop => {
            prop.price = Math.round(prop.price * (1 + growth));
            prop.rentIncome = Math.round(prop.rentIncome * (1 + growth * 0.5));
        });
    }
    
    // Инфляция (каждый год)
    if (lifeGameState.gameMonth % 12 === 0) {
        lifeGameState.livingExpenses = Math.round(lifeGameState.livingExpenses * 1.05);
        lifeGameState.salary = Math.round(lifeGameState.salary * 1.05);
    }
    
    // События убраны по запросу пользователя
    
    // Переход к следующему месяцу
    lifeGameState.gameMonth++;
    if (lifeGameState.gameMonth > 12) {
        lifeGameState.gameMonth = 1;
        lifeGameState.gameYear++;
    }
    
    // Сохранить историю
    const totalCapital = calculateTotalCapital();
    lifeGameState.history.months.push(lifeGameState.gameMonth + (lifeGameState.gameYear - 1) * 12);
    lifeGameState.history.capital.push(totalCapital);
    lifeGameState.history.income.push(income);
    lifeGameState.history.expenses.push(expenses);
    
    // Обновить UI
    updateLifeGameUI();
    renderStocksTable();
    updatePortfolio();
    updateStatistics();
    checkGoals();
    saveLifeGameState();
}


// Открыть панель банка
function openBankPanel() {
    closeAllPanels();
    document.getElementById('life-game-bank-panel').style.display = 'block';
    updateDepositsList();
    updateCreditsList();
}

// Открыть панель биржи
function openStockPanel() {
    closeAllPanels();
    document.getElementById('life-game-stock-panel').style.display = 'block';
    renderStocksTable();
    renderBondsTable();
    updatePortfolio();
}

// Открыть панель недвижимости
function openRealEstatePanel() {
    closeAllPanels();
    document.getElementById('life-game-realestate-panel').style.display = 'block';
    renderPropertiesList();
    updateMyProperties();
}

// Открыть панель страхования
function openInsurancePanel() {
    closeAllPanels();
    document.getElementById('life-game-insurance-panel').style.display = 'block';
    updateInsuranceList();
    updateInsurancePropertySelect();
}

// Открыть панель статистики
function openStatisticsPanel() {
    closeAllPanels();
    document.getElementById('life-game-statistics-panel').style.display = 'block';
    updateStatistics();
}

// Проверить события
function checkEvents() {
    closeAllPanels();
    document.getElementById('life-game-events-panel').style.display = 'block';
    renderEvents();
}

// Закрыть все панели
function closeAllPanels() {
    document.querySelectorAll('.game-panel').forEach(panel => {
        panel.style.display = 'none';
    });
}

// Закрыть конкретную панель
function closePanel(panelId) {
    document.getElementById(panelId).style.display = 'none';
}

// Переключить вкладку банка
function switchBankTab(tab) {
    document.querySelectorAll('#life-game-bank-panel .panel-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#life-game-bank-panel .panel-content').forEach(content => content.style.display = 'none');
    
    if (tab === 'deposits') {
        document.querySelector('#life-game-bank-panel .panel-tab').classList.add('active');
        document.getElementById('bank-deposits-content').style.display = 'block';
    } else {
        document.querySelectorAll('#life-game-bank-panel .panel-tab')[1].classList.add('active');
        document.getElementById('bank-credits-content').style.display = 'block';
    }
}

// Переключить вкладку биржи
function switchStockTab(tab) {
    document.querySelectorAll('#life-game-stock-panel .panel-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#life-game-stock-panel .panel-content').forEach(content => content.style.display = 'none');
    
    const tabs = document.querySelectorAll('#life-game-stock-panel .panel-tab');
    const contents = ['stock-stocks-content', 'stock-bonds-content', 'stock-portfolio-content'];
    const tabIndex = tab === 'stocks' ? 0 : tab === 'bonds' ? 1 : 2;
    
    tabs[tabIndex].classList.add('active');
    document.getElementById(contents[tabIndex]).style.display = 'block';
}

// Переключить вкладку недвижимости
function switchRealEstateTab(tab) {
    document.querySelectorAll('#life-game-realestate-panel .panel-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#life-game-realestate-panel .panel-content').forEach(content => content.style.display = 'none');
    
    if (tab === 'buy') {
        document.querySelector('#life-game-realestate-panel .panel-tab').classList.add('active');
        document.getElementById('realestate-buy-content').style.display = 'block';
    } else {
        document.querySelectorAll('#life-game-realestate-panel .panel-tab')[1].classList.add('active');
        document.getElementById('realestate-my-content').style.display = 'block';
        updateMyPropertiesList();
    }
}

// Обновить список своей недвижимости
function updateMyPropertiesList() {
    const content = document.getElementById('realestate-my-content');
    if (!content) return;
    
    if (lifeGameState.properties.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">У вас нет недвижимости</p>';
        return;
    }
    
    let html = '<div class="my-properties-list">';
    
    lifeGameState.properties.forEach((prop, index) => {
        const rentStatus = prop.rented ? '🟢 Сдается в аренду' : '🔴 Не сдается';
        const rentButton = prop.rented ? 
            `<button class="product-btn" onclick="togglePropertyRent(${index})" style="background: #ef4444;">Прекратить аренду</button>` :
            `<button class="product-btn" onclick="togglePropertyRent(${index})" style="background: #10b981;">Сдать в аренду</button>`;
        
        html += `
            <div class="my-property-card">
                <div class="my-property-info">
                    <h4>${prop.name}</h4>
                    <p>${prop.location}</p>
                    <div class="property-stats">
                        <span>Цена покупки: ${formatMoney(prop.purchasePrice)} 🪙</span>
                        <span>Текущая стоимость: ${formatMoney(prop.price)} 🪙</span>
                        <span>Доход от аренды: ${formatMoney(prop.rentIncome)} 🪙/мес</span>
                    </div>
                    <p style="margin-top: 0.5rem; font-weight: 600; color: ${prop.rented ? '#10b981' : '#ef4444'};">${rentStatus}</p>
                </div>
                <div class="my-property-actions">
                    ${rentButton}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// Открыть депозит
function openDeposit(type) {
    const inputId = type === 'savings' ? 'deposit-amount-input' : 'deposit-express-amount-input';
    const amount = parseInt(document.getElementById(inputId).value);
    
    if (!amount || amount < 1000) {
        alert('Минимальная сумма депозита: 1 000 🪙');
        return;
    }
    
    if (amount > lifeGameState.cash) {
        alert('Недостаточно средств!');
        return;
    }
    
    const deposit = {
        type: type,
        amount: amount,
        rate: type === 'savings' ? 6 : 4,
        monthsLeft: type === 'savings' ? 12 : 3,
        startMonth: lifeGameState.gameMonth,
        startYear: lifeGameState.gameYear
    };
    
    lifeGameState.deposits.push(deposit);
    // Баланс всегда берется из общих монет - не изменяем его
    lifeGameState.bankBalance += amount;
    
    if (!lifeGameState.achievements.firstDeposit) {
        lifeGameState.achievements.firstDeposit = true;
        showAchievementNotification('💰 Первый депозит!', 'Вы открыли свой первый депозит. Отличное начало!');
    }
    
    updateLifeGameUI();
    updateDepositsList();
    saveLifeGameState();
    alert(`Депозит открыт на сумму ${formatMoney(amount)} 🪙`);
}

// Взять кредит
function takeCredit() {
    const amount = parseInt(document.getElementById('credit-amount-input').value);
    const term = parseInt(document.getElementById('credit-term-input').value);
    
    if (!amount || amount < 10000 || amount > 1000000) {
        alert('Сумма кредита должна быть от 10 000 до 1 000 000 🪙');
        return;
    }
    
    if (!term || term < 6 || term > 60) {
        alert('Срок кредита должен быть от 6 до 60 месяцев');
        return;
    }
    
    const rate = 18 / 100 / 12; // месячная ставка
    const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    
    const credit = {
        type: 'consumer',
        amount: amount,
        term: term,
        monthsLeft: term,
        rate: 18,
        monthlyPayment: Math.round(monthlyPayment),
        totalPaid: 0
    };
    
    lifeGameState.credits.push(credit);
    lifeGameState.cash += amount;
    
    updateLifeGameUI();
    updateCreditsList();
    saveLifeGameState();
    alert(`Кредит получен! Ежемесячный платеж: ${formatMoney(monthlyPayment)} 🪙`);
}

// Взять ипотеку
function takeMortgage() {
    const amount = parseInt(document.getElementById('mortgage-amount-input').value);
    const term = parseInt(document.getElementById('mortgage-term-input').value);
    
    if (!amount || amount < 1000000 || amount > 10000000) {
        alert('Сумма ипотеки должна быть от 1 000 000 до 10 000 000 🪙');
        return;
    }
    
    if (!term || term < 5 || term > 30) {
        alert('Срок ипотеки должен быть от 5 до 30 лет');
        return;
    }
    
    const downPayment = amount * 0.2;
    if (lifeGameState.cash < downPayment) {
        alert(`Недостаточно средств для первоначального взноса! Нужно: ${formatMoney(downPayment)} 🪙`);
        return;
    }
    
    const loanAmount = amount - downPayment;
    const termMonths = term * 12;
    const rate = 12 / 100 / 12;
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
    
    const credit = {
        type: 'mortgage',
        amount: loanAmount,
        term: termMonths,
        monthsLeft: termMonths,
        rate: 12,
        monthlyPayment: Math.round(monthlyPayment),
        totalPaid: 0
    };
    
    lifeGameState.credits.push(credit);
    lifeGameState.cash -= downPayment;
    
    updateLifeGameUI();
    updateCreditsList();
    saveLifeGameState();
    alert(`Ипотека оформлена! Первоначальный взнос: ${formatMoney(downPayment)} 🪙, ежемесячный платеж: ${formatMoney(monthlyPayment)} 🪙`);
}

// Обновить список депозитов
function updateDepositsList() {
    const list = document.getElementById('my-deposits-list');
    if (lifeGameState.deposits.length === 0) {
        list.innerHTML = '<p style="color: #64748b;">У вас нет открытых депозитов</p>';
        return;
    }
    
    list.innerHTML = lifeGameState.deposits.map((dep, index) => `
        <div class="deposit-item">
            <div>${dep.type === 'savings' ? 'Накопительный' : 'Экспресс'} депозит</div>
            <div>Сумма: ${formatMoney(dep.amount)} 🪙</div>
            <div>Ставка: ${dep.rate}% годовых</div>
            <div>Осталось месяцев: ${dep.monthsLeft}</div>
            ${dep.monthsLeft === 0 ? '<button class="product-btn" onclick="closeDeposit(' + index + ')">ЗАКРЫТЬ</button>' : ''}
        </div>
    `).join('');
}

// Обновить список кредитов
function updateCreditsList() {
    const list = document.getElementById('my-credits-list');
    if (lifeGameState.credits.length === 0) {
        list.innerHTML = '<p style="color: #64748b;">У вас нет активных кредитов</p>';
        return;
    }
    
    list.innerHTML = lifeGameState.credits.map((credit, index) => `
        <div class="credit-item">
            <div>${credit.type === 'mortgage' ? 'Ипотека' : 'Потребительский кредит'}</div>
            <div>Сумма: ${formatMoney(credit.amount)} 🪙</div>
            <div>Ежемесячный платеж: ${formatMoney(credit.monthlyPayment)} 🪙</div>
            <div>Осталось месяцев: ${credit.monthsLeft}</div>
        </div>
    `).join('');
}

// Закрыть депозит
function closeDeposit(index) {
    const dep = lifeGameState.deposits[index];
    lifeGameState.bankBalance -= dep.amount;
    lifeGameState.cash += dep.amount;
    lifeGameState.deposits.splice(index, 1);
    updateLifeGameUI();
    updateDepositsList();
    saveLifeGameState();
    alert(`Депозит закрыт. Получено: ${formatMoney(dep.amount)} 🪙`);
}

// Рассчитать доход депозита
function calculateDepositIncome() {
    const amount = parseInt(document.getElementById('deposit-amount-input').value) || 0;
    const income = amount * 0.06;
    document.getElementById('deposit-calc').textContent = `Доход через год: ${formatMoney(income)} 🪙`;
}

function calculateDepositExpressIncome() {
    const amount = parseInt(document.getElementById('deposit-express-amount-input').value) || 0;
    const income = amount * 0.04 / 4;
    document.getElementById('deposit-express-calc').textContent = `Доход через 3 месяца: ${formatMoney(income)} 🪙`;
}

// Рассчитать платеж по кредиту
function calculateCreditPayment() {
    const amount = parseInt(document.getElementById('credit-amount-input').value) || 0;
    const term = parseInt(document.getElementById('credit-term-input').value) || 12;
    if (amount && term) {
        const rate = 18 / 100 / 12;
        const payment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        document.getElementById('credit-calc').textContent = `Ежемесячный платеж: ${formatMoney(payment)} 🪙`;
    }
}

// Рассчитать платеж по ипотеке
function calculateMortgagePayment() {
    const amount = parseInt(document.getElementById('mortgage-amount-input').value) || 0;
    const term = parseInt(document.getElementById('mortgage-term-input').value) || 20;
    if (amount && term) {
        const downPayment = amount * 0.2;
        const loanAmount = amount - downPayment;
        const termMonths = term * 12;
        const rate = 12 / 100 / 12;
        const payment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
        document.getElementById('mortgage-calc').textContent = `Ежемесячный платеж: ${formatMoney(payment)} 🪙 (первый взнос: ${formatMoney(downPayment)} 🪙)`;
    }
}

// Отрисовать таблицу акций
function renderStocksTable() {
    const tbody = document.getElementById('stocks-table-body');
    tbody.innerHTML = lifeGameData.stocks.map(stock => {
        const owned = lifeGameState.stocks[stock.id] || { quantity: 0, avgPrice: 0 };
        const changeClass = stock.change > 0 ? 'positive' : stock.change < 0 ? 'negative' : '';
        const changeSign = stock.change > 0 ? '+' : '';
        
        return `
            <tr onclick="selectStock('${stock.id}')" class="stock-row">
                <td>${stock.icon}</td>
                <td><strong>${stock.name}</strong></td>
                <td>${formatMoney(stock.basePrice)} 🪙</td>
                <td class="${changeClass}">${changeSign}${stock.change.toFixed(1)}%</td>
                <td>${owned.quantity} шт (${formatMoney(owned.quantity * stock.basePrice)} 🪙)</td>
            </tr>
        `;
    }).join('');
}

// Отрисовать таблицу облигаций
function renderBondsTable() {
    const tbody = document.getElementById('bonds-table-body');
    tbody.innerHTML = lifeGameData.bonds.map(bond => {
        const owned = lifeGameState.bonds[bond.id] || { quantity: 0, price: bond.price };
        
        return `
            <tr onclick="selectBond('${bond.id}')" class="bond-row">
                <td>${bond.icon}</td>
                <td><strong>${bond.name}</strong></td>
                <td>${formatMoney(bond.price)} 🪙</td>
                <td>${bond.yield}%</td>
                <td>${bond.term} мес</td>
                <td>${owned.quantity} шт (${formatMoney(owned.quantity * bond.price)} 🪙)</td>
            </tr>
        `;
    }).join('');
}

// Выбрать акцию
let selectedStockId = null;
function selectStock(stockId) {
    selectedStockId = stockId;
    const stock = lifeGameData.stocks.find(s => s.id === stockId);
    document.getElementById('selected-stock-info').textContent = `${stock.icon} ${stock.name} - ${formatMoney(stock.basePrice)} 🪙`;
    updateStockPurchase();
}

// Обновить покупку акций
function updateStockPurchase() {
    if (!selectedStockId) return;
    const stock = lifeGameData.stocks.find(s => s.id === selectedStockId);
    const quantity = parseInt(document.getElementById('stock-quantity-slider').value);
    const amount = quantity * stock.basePrice;
    document.getElementById('stock-quantity-display').textContent = quantity;
    document.getElementById('stock-purchase-amount').textContent = formatMoney(amount);
}

// Купить акции
function buyStock() {
    if (!selectedStockId) {
        alert('Выберите акцию!');
        return;
    }
    
    const stock = lifeGameData.stocks.find(s => s.id === selectedStockId);
    const quantity = parseInt(document.getElementById('stock-quantity-slider').value);
    const amount = quantity * stock.basePrice;
    
    if (amount > lifeGameState.cash) {
        alert('Недостаточно средств!');
        return;
    }
    
    if (!lifeGameState.stocks[selectedStockId]) {
        lifeGameState.stocks[selectedStockId] = { quantity: 0, avgPrice: 0 };
    }
    
    const oldQuantity = lifeGameState.stocks[selectedStockId].quantity;
    const oldAvgPrice = lifeGameState.stocks[selectedStockId].avgPrice;
    const newQuantity = oldQuantity + quantity;
    const newAvgPrice = oldQuantity > 0 
        ? (oldAvgPrice * oldQuantity + stock.basePrice * quantity) / newQuantity
        : stock.basePrice;
    
    lifeGameState.stocks[selectedStockId] = {
        quantity: newQuantity,
        avgPrice: newAvgPrice
    };
    
    lifeGameState.cash -= amount;
    
    if (!lifeGameState.achievements.firstStock) {
        lifeGameState.achievements.firstStock = true;
        showAchievementNotification('📈 Первая акция!', 'Вы купили свою первую акцию. Добро пожаловать в мир инвестиций!');
    }
    
    updateLifeGameUI();
    renderStocksTable();
    updatePortfolio();
    saveLifeGameState();
    alert(`Куплено ${quantity} акций ${stock.name} на сумму ${formatMoney(amount)} 🪙`);
}

// Продать все акции
function sellAllStocks() {
    let totalAmount = 0;
    for (let stockId in lifeGameState.stocks) {
        const stock = lifeGameData.stocks.find(s => s.id === stockId);
        if (stock && lifeGameState.stocks[stockId].quantity > 0) {
            const quantity = lifeGameState.stocks[stockId].quantity;
            const amount = quantity * stock.basePrice;
            totalAmount += amount;
            lifeGameState.stocks[stockId].quantity = 0;
        }
    }
    
    if (totalAmount > 0) {
        lifeGameState.cash += totalAmount;
        updateLifeGameUI();
        renderStocksTable();
        updatePortfolio();
        saveLifeGameState();
        alert(`Продано акций на сумму ${formatMoney(totalAmount)} 🪙`);
    } else {
        alert('У вас нет акций для продажи');
    }
}

// Выбрать облигацию
let selectedBondId = null;
function selectBond(bondId) {
    selectedBondId = bondId;
    const bond = lifeGameData.bonds.find(b => b.id === bondId);
    document.getElementById('selected-bond-info').textContent = `${bond.icon} ${bond.name} - ${formatMoney(bond.price)} 🪙`;
    updateBondPurchase();
}

// Обновить покупку облигаций
function updateBondPurchase() {
    if (!selectedBondId) return;
    const bond = lifeGameData.bonds.find(b => b.id === selectedBondId);
    const quantity = parseInt(document.getElementById('bond-quantity-input').value) || 0;
    const amount = quantity * bond.price;
    document.getElementById('bond-calc').textContent = `Сумма: ${formatMoney(amount)} 🪙`;
}

// Купить облигации
function buyBond() {
    if (!selectedBondId) {
        alert('Выберите облигацию!');
        return;
    }
    
    const bond = lifeGameData.bonds.find(b => b.id === selectedBondId);
    const quantity = parseInt(document.getElementById('bond-quantity-input').value);
    
    if (!quantity || quantity < 1) {
        alert('Введите количество облигаций!');
        return;
    }
    
    const amount = quantity * bond.price;
    
    if (amount > lifeGameState.cash) {
        alert('Недостаточно средств!');
        return;
    }
    
    if (!lifeGameState.bonds[selectedBondId]) {
        lifeGameState.bonds[selectedBondId] = { quantity: 0, price: bond.price };
    }
    
    lifeGameState.bonds[selectedBondId].quantity += quantity;
    lifeGameState.cash -= amount;
    
    updateLifeGameUI();
    renderBondsTable();
    updatePortfolio();
    saveLifeGameState();
    alert(`Куплено ${quantity} облигаций ${bond.name} на сумму ${formatMoney(amount)} 🪙`);
}

// Обновить портфель
function updatePortfolio() {
    const portfolioDiv = document.getElementById('portfolio-details');
    let html = '<div class="portfolio-stats">';
    
    const stocksValue = calculateStocksValue();
    const bondsValue = calculateBondsValue();
    const total = stocksValue + bondsValue;
    
    html += `<div class="portfolio-stat"><span>Акции:</span> <strong>${formatMoney(stocksValue)} 🪙</strong></div>`;
    html += `<div class="portfolio-stat"><span>Облигации:</span> <strong>${formatMoney(bondsValue)} 🪙</strong></div>`;
    html += `<div class="portfolio-stat total"><span>Всего:</span> <strong>${formatMoney(total)} 🪙</strong></div>`;
    
    html += '</div><div class="portfolio-details">';
    
    // Детали акций
    html += '<h5>Акции:</h5>';
    for (let stockId in lifeGameState.stocks) {
        const stock = lifeGameData.stocks.find(s => s.id === stockId);
        if (stock && lifeGameState.stocks[stockId].quantity > 0) {
            const owned = lifeGameState.stocks[stockId];
            const currentValue = owned.quantity * stock.basePrice;
            const profit = currentValue - (owned.avgPrice * owned.quantity);
            html += `<div class="portfolio-item" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                <div>${stock.icon} ${stock.name}: ${owned.quantity} шт, стоимость: ${formatMoney(currentValue)} 🪙, ${profit >= 0 ? '+' : ''}${formatMoney(profit)} 🪙</div>
                <button class="product-btn" onclick="sellStockFromPortfolio('${stockId}')" style="padding: 0.5rem 1rem; font-size: 0.9rem; white-space: nowrap;">Продать все</button>
            </div>`;
        }
    }
    
    // Детали облигаций
    html += '<h5>Облигации:</h5>';
    for (let bondId in lifeGameState.bonds) {
        const bond = lifeGameData.bonds.find(b => b.id === bondId);
        if (bond && lifeGameState.bonds[bondId].quantity > 0) {
            const owned = lifeGameState.bonds[bondId];
            const value = owned.quantity * bond.price;
            html += `<div class="portfolio-item" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                <div>${bond.icon} ${bond.name}: ${owned.quantity} шт, стоимость: ${formatMoney(value)} 🪙</div>
                <button class="product-btn" onclick="sellBondFromPortfolio('${bondId}')" style="padding: 0.5rem 1rem; font-size: 0.9rem; white-space: nowrap;">Продать все</button>
            </div>`;
        }
    }
    
    html += '</div>';
    portfolioDiv.innerHTML = html;
}

// Продать акции из портфеля
function sellStockFromPortfolio(stockId) {
    if (!lifeGameState.stocks[stockId] || lifeGameState.stocks[stockId].quantity === 0) {
        alert('У вас нет этих акций!');
        return;
    }
    
    const stock = lifeGameData.stocks.find(s => s.id === stockId);
    if (!stock) return;
    
    const quantity = lifeGameState.stocks[stockId].quantity;
    const amount = quantity * stock.basePrice;
    
    lifeGameState.cash += amount;
    lifeGameState.stocks[stockId].quantity = 0;
    
    updateLifeGameUI();
    renderStocksTable();
    updatePortfolio();
    saveLifeGameState();
    alert(`Продано ${quantity} акций ${stock.name} на сумму ${formatMoney(amount)} 🪙`);
}

// Продать облигации из портфеля
function sellBondFromPortfolio(bondId) {
    if (!lifeGameState.bonds[bondId] || lifeGameState.bonds[bondId].quantity === 0) {
        alert('У вас нет этих облигаций!');
        return;
    }
    
    const bond = lifeGameData.bonds.find(b => b.id === bondId);
    if (!bond) return;
    
    const quantity = lifeGameState.bonds[bondId].quantity;
    const amount = quantity * bond.price;
    
    lifeGameState.cash += amount;
    lifeGameState.bonds[bondId].quantity = 0;
    
    updateLifeGameUI();
    renderBondsTable();
    updatePortfolio();
    saveLifeGameState();
    alert(`Продано ${quantity} облигаций ${bond.name} на сумму ${formatMoney(amount)} 🪙`);
}

// Отрисовать список недвижимости
function renderPropertiesList() {
    const list = document.getElementById('available-properties-list');
    list.innerHTML = lifeGameData.properties.map(prop => `
        <div class="property-card">
            <h4>${prop.name}</h4>
            <div class="property-info">
                <div>Площадь: ${prop.area} м²</div>
                <div>Район: ${prop.district}</div>
                <div>Цена: ${formatMoney(prop.price)} 🪙</div>
                <div>Арендный доход: ${formatMoney(prop.rentIncome)} 🪙/мес</div>
            </div>
            <div class="property-actions">
                <button class="product-btn" onclick="buyProperty(${prop.id})">КУПИТЬ</button>
                ${!lifeGameState.hasOwnApartment ? `<button class="product-btn" onclick="rentProperty(${prop.id})">АРЕНДОВАТЬ за ${formatMoney(prop.rentIncome * 1.3)}🪙/мес</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Купить недвижимость
function buyProperty(propertyId) {
    const prop = lifeGameData.properties.find(p => p.id === propertyId);
    if (!prop) return;
    
    if (lifeGameState.cash < prop.price) {
        alert('Недостаточно средств!');
        return;
    }
    
    const tax = prop.price * 0.02; // Налог 2%
    const totalCost = prop.price + tax;
    
    if (lifeGameState.cash < totalCost) {
        alert(`Недостаточно средств! Нужно: ${formatMoney(totalCost)} 🪙 (включая налог 2%)`);
        return;
    }
    
    const newProperty = {
        ...prop,
        purchasePrice: prop.price,
        purchaseMonth: lifeGameState.gameMonth,
        purchaseYear: lifeGameState.gameYear,
        rented: false
    };
    
    lifeGameState.properties.push(newProperty);
    lifeGameState.cash -= totalCost;
    
    if (prop.type === 'apartment' && !lifeGameState.hasOwnApartment) {
        lifeGameState.hasOwnApartment = true;
        lifeGameState.goals.buyApartment.current = 1;
    }
    
    if (!lifeGameState.achievements.firstProperty) {
        lifeGameState.achievements.firstProperty = true;
        showAchievementNotification('🏠 Первая недвижимость!', 'Поздравляем с первой покупкой недвижимости!');
    }
    
    updateLifeGameUI();
    renderPropertiesList();
    updateMyProperties();
    checkGoals();
    saveLifeGameState();
    alert(`Недвижимость куплена! Потрачено: ${formatMoney(totalCost)} 🪙 (включая налог)`);
}

// Арендовать недвижимость
function rentProperty(propertyId) {
    const prop = lifeGameData.properties.find(p => p.id === propertyId);
    if (!prop) return;
    
    lifeGameState.rent = Math.round(prop.rentIncome * 1.3);
    alert(`Вы арендуете ${prop.name}. Ежемесячная плата: ${formatMoney(lifeGameState.rent)} 🪙`);
    saveLifeGameState();
}

// Обновить список моей недвижимости
function updateMyProperties() {
    const list = document.getElementById('my-properties-list');
    if (lifeGameState.properties.length === 0) {
        list.innerHTML = '<p style="color: #64748b;">У вас нет недвижимости</p>';
        return;
    }
    
    list.innerHTML = lifeGameState.properties.map((prop, index) => `
        <div class="property-card">
            <h4>${prop.name}</h4>
            <div class="property-info">
                <div>Стоимость: ${formatMoney(prop.price)} 🪙</div>
                <div>Арендный доход: ${formatMoney(prop.rentIncome)} 🪙/мес</div>
                <div>Статус: ${prop.rented ? 'Сдается в аренду' : 'Не сдается'}</div>
            </div>
            <div class="property-actions">
                <button class="product-btn" onclick="togglePropertyRent(${index})">${prop.rented ? 'ПЕРЕСТАТЬ СДАВАТЬ' : 'СДАТЬ В АРЕНДУ'}</button>
                <button class="product-btn" onclick="sellProperty(${index})" style="background: #ef4444;">ПРОДАТЬ</button>
            </div>
        </div>
    `).join('');
}

// Переключить аренду недвижимости
function togglePropertyRent(index) {
    const prop = lifeGameState.properties[index];
    prop.rented = !prop.rented;
    updateMyProperties();
    saveLifeGameState();
}

// Продать недвижимость
function sellProperty(index) {
    const prop = lifeGameState.properties[index];
    const profit = prop.price - prop.purchasePrice;
    const tax = profit > 0 ? profit * 0.13 : 0; // Налог 13% с прибыли
    const finalAmount = prop.price - tax;
    
    if (confirm(`Продать ${prop.name} за ${formatMoney(finalAmount)} 🪙?${tax > 0 ? ` (налог с прибыли: ${formatMoney(tax)} 🪙)` : ''}`)) {
        lifeGameState.cash += finalAmount;
        lifeGameState.properties.splice(index, 1);
        
        if (lifeGameState.properties.filter(p => p.type === 'apartment').length === 0) {
            lifeGameState.hasOwnApartment = false;
        }
        
        updateLifeGameUI();
        updateMyProperties();
        saveLifeGameState();
        alert(`Недвижимость продана! Получено: ${formatMoney(finalAmount)} 🪙`);
    }
}

// Купить страховку
function buyInsurance(type) {
    if (type === 'life') {
        if (lifeGameState.insurance.life) {
            alert('У вас уже есть страховка жизни');
            return;
        }
        if (lifeGameState.cash < 100) {
            alert('Недостаточно средств!');
            return;
        }
        lifeGameState.insurance.life = true;
        lifeGameState.cash -= 100;
        alert('Страховка жизни оформлена! Платеж: 100 🪙/мес');
    } else if (type === 'medical') {
        if (lifeGameState.insurance.medical) {
            alert('У вас уже есть медицинская страховка');
            return;
        }
        if (lifeGameState.cash < 200) {
            alert('Недостаточно средств!');
            return;
        }
        lifeGameState.insurance.medical = true;
        lifeGameState.cash -= 200;
        alert('Медицинская страховка оформлена! Платеж: 200 🪙/мес');
    } else if (type === 'property') {
        const select = document.getElementById('insurance-property-select');
        const propertyIndex = parseInt(select.value);
        if (propertyIndex === -1) {
            alert('Выберите объект недвижимости!');
            return;
        }
        const prop = lifeGameState.properties[propertyIndex];
        if (lifeGameState.insurance.property.includes(propertyIndex)) {
            alert('Этот объект уже застрахован');
            return;
        }
        if (lifeGameState.cash < 50) {
            alert('Недостаточно средств!');
            return;
        }
        lifeGameState.insurance.property.push(propertyIndex);
        lifeGameState.cash -= 50;
        alert(`Страховка недвижимости оформлена! Платеж: 50 🪙/мес`);
    }
    
    if (!lifeGameState.achievements.insured) {
        lifeGameState.achievements.insured = true;
        showAchievementNotification('🛡️ Страхованный человек!', 'Вы оформили свою первую страховку');
    }
    
    updateLifeGameUI();
    updateInsuranceList();
    saveLifeGameState();
}

// Переключить аренду недвижимости
function togglePropertyRent(propertyIndex) {
    const prop = lifeGameState.properties[propertyIndex];
    if (!prop) return;
    
    prop.rented = !prop.rented;
    
    if (prop.rented) {
        showAchievementNotification('🏠 Сдача в аренду!', `Вы начали сдавать "${prop.name}" в аренду. Доход: ${formatMoney(prop.rentIncome)} 🪙/мес`);
    } else {
        alert(`Вы прекратили сдавать "${prop.name}" в аренду`);
    }
    
    updateLifeGameUI();
    saveLifeGameState();
}

// Красивое уведомление о достижении
function showAchievementNotification(title, description) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">🎉</div>
            <div class="achievement-text">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Показать анимацию
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Скрыть через 4 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Обновить список страховок
function updateInsuranceList() {
    const list = document.getElementById('my-insurance-list');
    let html = '';
    
    if (lifeGameState.insurance.life) {
        html += '<div class="insurance-item">✅ Страховка жизни - 100 🪙/мес</div>';
    }
    if (lifeGameState.insurance.medical) {
        html += '<div class="insurance-item">✅ Медицинская страховка - 200 🪙/мес</div>';
    }
    lifeGameState.insurance.property.forEach(index => {
        const prop = lifeGameState.properties[index];
        if (prop) {
            html += `<div class="insurance-item">✅ Страховка "${prop.name}" - 50 🪙/мес</div>`;
        }
    });
    
    if (!html) {
        html = '<p style="color: #64748b;">У вас нет страховок</p>';
    }
    
    list.innerHTML = html;
}

// Обновить селект недвижимости для страховки
function updateInsurancePropertySelect() {
    const select = document.getElementById('insurance-property-select');
    select.innerHTML = '<option value="-1">Выберите объект</option>' + 
        lifeGameState.properties.map((prop, index) => 
            `<option value="${index}">${prop.name} - ${formatMoney(prop.price)} 🪙</option>`
        ).join('');
}

// Генерировать случайное событие
function generateRandomEvent() {
    const event = lifeGameData.events[Math.floor(Math.random() * lifeGameData.events.length)];
    lifeGameState.pendingEvents.push({
        ...event,
        id: Date.now()
    });
    showEventNotification(event);
}

// Показать уведомление о событии
function showEventNotification(event) {
    const eventPanel = document.getElementById('life-game-events-panel');
    if (eventPanel.style.display === 'none') {
        // Показать модальное окно события
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="event-modal-content">
                <h3>📰 СОБЫТИЕ: ${event.name}</h3>
                <div class="event-description">${getEventDescription(event)}</div>
                <div class="event-actions">${getEventActions(event)}</div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Получить описание события
function getEventDescription(event) {
    if (event.type === 'illness') {
        return 'Вы заболели. Лечение стоит 50 000 ₽. Если есть медстраховка — бесплатно.';
    } else if (event.type === 'flood') {
        return 'Потоп в квартире. Ущерб: 200 000 ₽. Если есть страховка недвижимости — страховка покрывает.';
    } else if (event.type === 'crisis') {
        return 'Кризис на бирже! Все акции падают на 30%.';
    } else if (event.type === 'promotion') {
        return 'Повышение на работе! Ваш доход увеличивается на 20%.';
    }
    return '';
}

// Получить действия для события
function getEventActions(event) {
    if (event.type === 'illness') {
        if (lifeGameState.insurance.medical) {
            return '<button class="product-btn" onclick="handleEvent(\'illness\', \'insurance\')">ИСПОЛЬЗОВАТЬ СТРАХОВКУ</button>';
        } else {
            return '<button class="product-btn" onclick="handleEvent(\'illness\', \'pay\')">ОПЛАТИТЬ</button><button class="product-btn" onclick="handleEvent(\'illness\', \'ignore\')">ПРОИГНОРИРОВАТЬ</button>';
        }
    } else if (event.type === 'flood') {
        const hasPropertyInsurance = lifeGameState.insurance.property.length > 0;
        if (hasPropertyInsurance) {
            return '<button class="product-btn" onclick="handleEvent(\'flood\', \'insurance\')">ИСПОЛЬЗОВАТЬ СТРАХОВКУ</button>';
        } else {
            return '<button class="product-btn" onclick="handleEvent(\'flood\', \'pay\')">ОПЛАТИТЬ</button>';
        }
    } else if (event.type === 'crisis') {
        return '<button class="product-btn" onclick="handleEvent(\'crisis\', \'sell\')">ПРОДАТЬ ВСЕ</button><button class="product-btn" onclick="handleEvent(\'crisis\', \'buy\')">КУПИТЬ ЕЩЕ</button><button class="product-btn" onclick="handleEvent(\'crisis\', \'wait\')">ЖДАТЬ</button>';
    } else if (event.type === 'promotion') {
        return '<button class="product-btn" onclick="handleEvent(\'promotion\', \'ok\')">УРА!</button>';
    }
    return '';
}

// Обработать событие
function handleEvent(eventType, action) {
    if (eventType === 'illness') {
        if (action === 'insurance' && lifeGameState.insurance.medical) {
            alert('Лечение оплачено страховкой!');
        } else if (action === 'pay') {
            if (lifeGameState.cash >= 50000) {
                lifeGameState.cash -= 50000;
                alert('Лечение оплачено: 50 000 🪙');
            } else {
                alert('Недостаточно средств!');
            }
        } else if (action === 'ignore') {
            alert('Вы проигнорировали болезнь. Здоровье ухудшилось.');
        }
    } else if (eventType === 'flood') {
        if (action === 'insurance' && lifeGameState.insurance.property.length > 0) {
            alert('Ущерб покрыт страховкой!');
        } else if (action === 'pay') {
            if (lifeGameState.cash >= 200000) {
                lifeGameState.cash -= 200000;
                alert('Ущерб оплачен: 200 000 🪙');
            } else {
                alert('Недостаточно средств!');
            }
        }
    } else if (eventType === 'crisis') {
        if (action === 'sell') {
            sellAllStocks();
        } else if (action === 'buy') {
            // Снизить цены на 30%
            lifeGameData.stocks.forEach(stock => {
                stock.basePrice = Math.round(stock.basePrice * 0.7);
            });
            alert('Цены на акции упали на 30%! Хорошее время для покупки.');
            renderStocksTable();
        } else if (action === 'wait') {
            // Снизить цены на 30%
            lifeGameData.stocks.forEach(stock => {
                stock.basePrice = Math.round(stock.basePrice * 0.7);
            });
            renderStocksTable();
        }
    } else if (eventType === 'promotion') {
        lifeGameState.salary = Math.round(lifeGameState.salary * 1.2);
        alert('Поздравляем с повышением! Зарплата увеличена на 20%.');
    }
    
    // Удалить событие из списка
    lifeGameState.pendingEvents = lifeGameState.pendingEvents.filter(e => e.type !== eventType);
    
    // Закрыть модальное окно
    const modal = document.querySelector('.event-modal');
    if (modal) {
        modal.remove();
    }
    
    updateLifeGameUI();
    saveLifeGameState();
}

// Отрисовать события
function renderEvents() {
    const list = document.getElementById('events-list');
    if (lifeGameState.pendingEvents.length === 0) {
        list.innerHTML = '<p style="color: #64748b;">Нет активных событий</p>';
        return;
    }
    
    list.innerHTML = lifeGameState.pendingEvents.map(event => `
        <div class="event-card">
            <h4>${event.name}</h4>
            <p>${getEventDescription(event)}</p>
            <div class="event-actions">${getEventActions(event)}</div>
        </div>
    `).join('');
}

// Обновить статистику
function updateStatistics() {
    // Обновить цели
    const goalsList = document.getElementById('goals-list');
    const goals = lifeGameState.goals;
    
    const totalCapital = calculateTotalCapital();
    
    const passiveIncome = calculatePassiveIncome();
    goals.passiveIncome100.current = passiveIncome;
    
    const assetTypes = calculateAssetTypes();
    goals.diversify3.current = assetTypes;
    
    goalsList.innerHTML = `
        <div class="goal-item ${goals.buyApartment.completed ? 'completed' : ''}">
            <input type="checkbox" ${goals.buyApartment.completed ? 'checked' : ''} disabled>
            <span>Купить первую квартиру [${goals.buyApartment.current}/1]</span>
        </div>
        <div class="goal-item ${goals.passiveIncome100.completed ? 'completed' : ''}">
            <input type="checkbox" ${goals.passiveIncome100.completed ? 'checked' : ''} disabled>
            <span>Создать пассивный доход 100 🪙/мес [${formatMoney(goals.passiveIncome100.current)}/100]</span>
        </div>
        <div class="goal-item ${goals.diversify3.completed ? 'completed' : ''}">
            <input type="checkbox" ${goals.diversify3.completed ? 'checked' : ''} disabled>
            <span>Диверсифицировать портфель (3+ типа активов) [${goals.diversify3.current}/3]</span>
        </div>
        <div class="goal-item ${goals.payCredit.completed ? 'completed' : ''}">
            <input type="checkbox" ${goals.payCredit.completed ? 'checked' : ''} disabled>
            <span>Взять и вернуть первый кредит [${goals.payCredit.current}/1]</span>
        </div>
    `;
    
    // Обновить достижения
    const achievementsList = document.getElementById('achievements-list');
    const achievements = lifeGameState.achievements;
    achievementsList.innerHTML = `
        <div class="achievement-item ${achievements.firstDeposit ? 'unlocked' : ''}">
            ${achievements.firstDeposit ? '✅' : '🔒'} Первый депозит
        </div>
        <div class="achievement-item ${achievements.firstStock ? 'unlocked' : ''}">
            ${achievements.firstStock ? '✅' : '🔒'} Первая акция
        </div>
        <div class="achievement-item ${achievements.firstProperty ? 'unlocked' : ''}">
            ${achievements.firstProperty ? '✅' : '🔒'} Первая недвижимость
        </div>
        <div class="achievement-item ${achievements.insured ? 'unlocked' : ''}">
            ${achievements.insured ? '✅' : '🔒'} Страхованный человек
        </div>
        <div class="achievement-item ${achievements.creditPaid ? 'unlocked' : ''}">
            ${achievements.creditPaid ? '✅' : '🔒'} Кредит погашен
        </div>
        <div class="achievement-item ${achievements.millionaire ? 'unlocked' : ''}">
            ${achievements.millionaire ? '✅' : '🔒'} Миллионер
        </div>
    `;
}

// Вычислить пассивный доход
function calculatePassiveIncome() {
    let income = 0;
    
    // Арендный доход
    lifeGameState.properties.forEach(prop => {
        if (prop.rented) {
            income += prop.rentIncome;
        }
    });
    
    // Дивиденды (годовые, делим на 12)
    let annualDividends = 0;
    for (let stockId in lifeGameState.stocks) {
        const stock = lifeGameData.stocks.find(s => s.id === stockId);
        if (stock && lifeGameState.stocks[stockId].quantity > 0) {
            annualDividends += stock.basePrice * lifeGameState.stocks[stockId].quantity * 0.035; // средние 3.5%
        }
    }
    income += annualDividends / 12;
    
    // Купоны (полугодовые, делим на 6)
    let semiAnnualCoupons = 0;
    for (let bondId in lifeGameState.bonds) {
        const bond = lifeGameData.bonds.find(b => b.id === bondId);
        if (bond && lifeGameState.bonds[bondId].quantity > 0) {
            semiAnnualCoupons += bond.price * lifeGameState.bonds[bondId].quantity * (bond.yield / 100) / 2;
        }
    }
    income += semiAnnualCoupons / 6;
    
    return Math.round(income);
}

// Вычислить количество типов активов
function calculateAssetTypes() {
    let types = 0;
    if (calculateStocksValue() > 0) types++;
    if (calculateBondsValue() > 0) types++;
    if (calculatePropertiesValue() > 0) types++;
    if (calculateDepositsValue() > 0) types++;
    return types;
}

// Проверить цели
function checkGoals() {
    const goals = lifeGameState.goals;
    
    if (goals.buyApartment.current >= goals.buyApartment.target && !goals.buyApartment.completed) {
        goals.buyApartment.completed = true;
        showAchievementNotification('🏠 Первая квартира!', 'Цель достигнута: Купить первую квартиру!');
    }
    
    if (goals.passiveIncome100.current >= goals.passiveIncome100.target && !goals.passiveIncome100.completed) {
        goals.passiveIncome100.completed = true;
        showAchievementNotification('💰 Пассивный доход!', 'Цель достигнута: Создать пассивный доход 100 🪙/мес!');
    }
    
    if (goals.diversify3.current >= goals.diversify3.target && !goals.diversify3.completed) {
        goals.diversify3.completed = true;
        showAchievementNotification('📊 Диверсификация!', 'Цель достигнута: Диверсифицировать портфель!');
    }
    
    if (goals.payCredit.current >= goals.payCredit.target && !goals.payCredit.completed) {
        goals.payCredit.completed = true;
        lifeGameState.achievements.creditPaid = true;
        showAchievementNotification('💳 Первый кредит!', 'Цель достигнута: Взять и вернуть первый кредит!');
    }
}


// Добавить обработчики для расчета депозитов и кредитов
document.addEventListener('DOMContentLoaded', function() {
    // Эти обработчики будут добавлены после загрузки DOM
    setTimeout(() => {
        const depositInput = document.getElementById('deposit-amount-input');
        const depositExpressInput = document.getElementById('deposit-express-amount-input');
        const creditAmountInput = document.getElementById('credit-amount-input');
        const creditTermInput = document.getElementById('credit-term-input');
        const mortgageAmountInput = document.getElementById('mortgage-amount-input');
        const mortgageTermInput = document.getElementById('mortgage-term-input');
        const bondQuantityInput = document.getElementById('bond-quantity-input');
        
        if (depositInput) depositInput.addEventListener('input', calculateDepositIncome);
        if (depositExpressInput) depositExpressInput.addEventListener('input', calculateDepositExpressIncome);
        if (creditAmountInput) creditAmountInput.addEventListener('input', calculateCreditPayment);
        if (creditTermInput) creditTermInput.addEventListener('input', calculateCreditPayment);
        if (mortgageAmountInput) mortgageAmountInput.addEventListener('input', calculateMortgagePayment);
        if (mortgageTermInput) mortgageTermInput.addEventListener('input', calculateMortgagePayment);
        if (bondQuantityInput) bondQuantityInput.addEventListener('input', updateBondPurchase);
    }, 1000);
});
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let practiceCoins = 0; // Изначально 0, обновится после авторизации
let moduleProgress = 0;
let currentSituation = 0;
let finalTestScore = 0;
let finalTestAnswers = [];
let currentBlockLesson = null; // ID текущего урока внутри блока (например, 2.1)
let currentFinalTest = null; // Текущий финальный тест (для урока или блока)
let currentPractice = null; // Текущая практика (для урока или блока)

// Показ нужного экрана
function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    for (let i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add("active");
    }
    
    // Управление отображением монет
    const coinsBadge = document.querySelector('.coins-badge');
    if (coinsBadge) {
        // Скрыть монеты только на странице регистрации
        if (screenId === 'register-screen') {
            coinsBadge.style.display = 'none';
        } else {
            // Показать монеты на всех остальных страницах
            coinsBadge.style.display = 'flex';
        }
    }
}

function showLessons() {
    // Проверить, что пользователь все еще авторизован
    if (!currentUser) {
        // Попытаться загрузить пользователя из localStorage
        if (!loadUser()) {
            // Если не удалось загрузить, показать экран входа
            showLogin();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            return;
        }
    }
    
    showScreen("lessons-screen");
    updateProgress();
    // Обновить прогресс блоков при показе экрана
    if (currentUser) {
        updateLessonsScreenProgress();
    }
}

function showBlockOverviewScreen() {
    showScreen("block-overview-screen");
}

function showTheory() {
    showScreen("theory-screen");
}

function showPractice() {
    try {
        // Проверить, что currentLesson установлен
        if (!currentLesson) {
            alert("Ошибка: урок не выбран. Попробуйте вернуться к списку уроков.");
            if (typeof showLessons === 'function') {
                showLessons();
            }
            return;
        }
        
        // Проверить, что экран практики существует
        const practiceScreen = document.getElementById("practice-screen");
        if (!practiceScreen) {
            alert("Ошибка: экран практики не найден.");
            return;
        }
        
        // Показать экран практики
    showScreen("practice-screen");
        
        // Загрузить практику
    loadPractice();
    } catch (error) {
        console.error("Ошибка в showPractice:", error);
        alert("Произошла ошибка при загрузке практики. Попробуйте обновить страницу.");
    }
}

function showQuiz() {
    showScreen("quiz-screen");
}

function showResults() {
    showScreen("results-screen");
}

function showFinalTest() {
    showScreen("final-test-screen");
}

// Показать обзор блока
function showBlockOverview(blockId) {
    // Проверить авторизацию
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к блокам!");
        showLogin();
        return;
    }

    // Проверить, разблокирован ли блок (предыдущий должен быть завершен на 100%)
    if (!isBlockUnlocked(blockId)) {
        const previousBlockId = getPreviousBlockId(blockId);
        if (previousBlockId) {
            const previousBlock = lessonsData[previousBlockId];
            showCustomModal(
                "🔒 Блок заблокирован",
                `Этот блок заблокирован! Сначала заверши блок "${previousBlock ? previousBlock.title : 'предыдущий'}" на 100%. Для завершения блока нужно пройти все уроки и ответить правильно на все вопросы финального теста.`
            );
        } else {
            showCustomModal(
                "🔒 Блок заблокирован",
                "Этот блок еще заблокирован. Пройди предыдущий блок!"
            );
        }
        return;
    }

    const block = lessonsData[blockId];
    if (!block || !block.overview) {
        // Если у блока нет overview, открываем напрямую теорию (для блока 1)
        openLesson(blockId);
        return;
    }

    currentLesson = blockId;
    
    // Заполнить данные обзора блока
    document.getElementById("block-overview-title").textContent = block.title;
    const blockOverviewIntro = document.getElementById("block-overview-intro");
    if (blockOverviewIntro) {
        blockOverviewIntro.textContent = block.overview.intro;
    }
    
    // Заполнить список "В этом модуле вы узнаете"
    const learningPointsList = document.getElementById("block-learning-points");
    learningPointsList.innerHTML = "";
    block.overview.learningPoints.forEach(point => {
        const li = document.createElement("li");
        li.textContent = point;
        learningPointsList.appendChild(li);
    });
    
    // Заполнить список уроков
    const lessonsGrid = document.getElementById("block-lessons");
    lessonsGrid.innerHTML = "";
    
    // Собрать все уроки блока в правильном порядке для проверки последовательности
    let allLessonsInOrder = [];
    if (block.overview.categories) {
        block.overview.categories.forEach(category => {
            if (category.lessons && category.lessons.length > 0) {
                allLessonsInOrder = allLessonsInOrder.concat(category.lessons);
            }
        });
    } else if (block.overview.lessons) {
        allLessonsInOrder = block.overview.lessons;
    }
    
    // Функция для получения предыдущего урока
    function getPreviousLessonInBlock(currentLessonId) {
        const currentIndex = allLessonsInOrder.findIndex(l => String(l.id) === String(currentLessonId));
        if (currentIndex > 0) {
            return allLessonsInOrder[currentIndex - 1];
        }
        return null;
    }
    
    // Проверяем, есть ли категории (новый формат) или просто уроки (старый формат)
    if (block.overview.categories) {
        // Новый формат с категориями
        block.overview.categories.forEach((category, categoryIndex) => {
            const categoryContainer = document.createElement("div");
            categoryContainer.className = "category-container";
            
            // Создаем заголовок категории
            const categoryHeader = document.createElement("div");
            categoryHeader.className = "category-header";
            categoryHeader.onclick = () => toggleCategory(blockId, categoryIndex);
            
            const categoryTitleSection = document.createElement("div");
            categoryTitleSection.className = "category-title-section";
            
            const categoryIcon = document.createElement("span");
            categoryIcon.className = "category-icon";
            categoryIcon.textContent = category.icon;
            
            const categoryName = document.createElement("span");
            categoryName.className = "category-name";
            categoryName.textContent = category.name;
            
            categoryTitleSection.appendChild(categoryIcon);
            categoryTitleSection.appendChild(categoryName);
            
            const categoryArrow = document.createElement("span");
            categoryArrow.className = "category-arrow";
            categoryArrow.id = `arrow-${blockId}-${categoryIndex}`;
            categoryArrow.textContent = "▶";
            
            categoryHeader.appendChild(categoryTitleSection);
            categoryHeader.appendChild(categoryArrow);
            
            // Создаем контейнер для информации о категории и уроков
            const categoryContent = document.createElement("div");
            categoryContent.className = "category-content";
            categoryContent.id = `category-content-${blockId}-${categoryIndex}`;
            categoryContent.style.display = "none";
            
            // Добавляем информацию "В этом модуле мы узнаем"
            if (category.intro || category.learningPoints) {
                const categoryInfo = document.createElement("div");
                categoryInfo.className = "category-info";
                
                if (category.intro) {
                    const categoryIntro = document.createElement("p");
                    categoryIntro.className = "category-intro";
                    categoryIntro.textContent = category.intro;
                    categoryInfo.appendChild(categoryIntro);
                }
                
                if (category.learningPoints && category.learningPoints.length > 0) {
                    const learningPointsTitle = document.createElement("h4");
                    learningPointsTitle.className = "category-learning-title";
                    learningPointsTitle.textContent = "Из курса вы узнаете:";
                    categoryInfo.appendChild(learningPointsTitle);
                    
                    const learningPointsList = document.createElement("ul");
                    learningPointsList.className = "category-learning-points";
                    category.learningPoints.forEach(point => {
                        const li = document.createElement("li");
                        li.textContent = point;
                        learningPointsList.appendChild(li);
                    });
                    categoryInfo.appendChild(learningPointsList);
                }
                
                categoryContent.appendChild(categoryInfo);
            }
            
            // Создаем контейнер для уроков
            const categoryLessons = document.createElement("div");
            categoryLessons.className = "category-lessons";
            categoryLessons.id = `category-${blockId}-${categoryIndex}`;
            
            if (category.lessons.length > 0) {
                category.lessons.forEach((lesson, lessonIndex) => {
        const lessonCard = document.createElement("div");
        lessonCard.className = "block-lesson-card";
                    
                    // Извлекаем последнюю цифру из ID (например, из "6.1.1" получаем "1")
                    const lessonNumber = lesson.id.toString().split('.').pop();
                    
                    // Определить статус урока
                    let lessonStatus = '';
                    let statusIcon = '';
                    let isLocked = false;
                    
                    // Проверить, заблокирован ли урок (проверяем предыдущий урок во всем блоке)
                    const previousLesson = getPreviousLessonInBlock(lesson.id);
                    if (previousLesson) {
                        const previousLessonKey = String(previousLesson.id);
                        if (!isLessonCompleted(blockId, previousLessonKey)) {
                            isLocked = true;
                            lessonStatus = 'Заблокировано';
                            statusIcon = '🔒';
                        }
                    }
                    
                    // Если урок не заблокирован, проверить его статус
                    if (!isLocked) {
                        const lessonKey = String(lesson.id);
                        if (isLessonCompleted(blockId, lessonKey)) {
                            lessonStatus = 'Пройдено';
                            statusIcon = '✅';
                        } else {
                            lessonStatus = 'Не пройдено';
                            statusIcon = '❌';
                        }
                    }
                    
                    // Если урок заблокирован, не добавляем обработчик клика
                    if (!isLocked) {
        lessonCard.onclick = () => openBlockLesson(blockId, lesson.id);
                    } else {
                        lessonCard.style.cursor = 'not-allowed';
                        lessonCard.style.opacity = '0.6';
                    }
                    
                    lessonCard.innerHTML = `
                        <div class="block-lesson-info">
                            <div class="block-lesson-number">Урок ${lessonNumber}</div>
                            <div class="block-lesson-duration">⏱️ ${lesson.duration}</div>
                        </div>
                        <div class="block-lesson-title">${lesson.title}</div>
                        <div class="block-lesson-status">
                            <span class="lesson-status-text">${lessonStatus}</span>
                            <span class="lesson-status-icon">${statusIcon}</span>
                        </div>
                        <div class="block-lesson-icon">${lesson.icon}</div>
                    `;
                    
                    categoryLessons.appendChild(lessonCard);
                });
            } else {
                const noLessons = document.createElement("div");
                noLessons.className = "no-lessons";
                noLessons.textContent = "Уроки появятся скоро";
                categoryLessons.appendChild(noLessons);
            }
            
            categoryContent.appendChild(categoryLessons);
            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(categoryContent);
            lessonsGrid.appendChild(categoryContainer);
        });
    } else if (block.overview.lessons) {
        // Старый формат с простым списком уроков
        block.overview.lessons.forEach((lesson, lessonIndex) => {
            const lessonCard = document.createElement("div");
            lessonCard.className = "block-lesson-card";
            
            // Определить статус урока
            let lessonStatus = '';
            let statusIcon = '';
            let isLocked = false;
            
            // Проверить, заблокирован ли урок (проверяем предыдущий урок во всем блоке)
            const previousLesson = getPreviousLessonInBlock(lesson.id);
            if (previousLesson) {
                const previousLessonKey = String(previousLesson.id);
                if (!isLessonCompleted(blockId, previousLessonKey)) {
                    isLocked = true;
                    lessonStatus = 'Заблокировано';
                    statusIcon = '🔒';
                }
            }
            
            // Если урок не заблокирован, проверить его статус
            if (!isLocked) {
                const lessonKey = String(lesson.id);
                if (isLessonCompleted(blockId, lessonKey)) {
                    lessonStatus = 'Пройдено';
                    statusIcon = '✅';
                } else {
                    lessonStatus = 'Не пройдено';
                    statusIcon = '❌';
                }
            }
            
            // Если урок заблокирован, не добавляем обработчик клика
            if (!isLocked) {
                lessonCard.onclick = () => openBlockLesson(blockId, lesson.id);
            } else {
                lessonCard.style.cursor = 'not-allowed';
                lessonCard.style.opacity = '0.6';
            }
        
        lessonCard.innerHTML = `
            <div class="block-lesson-info">
                <div class="block-lesson-number">Урок ${lesson.id.toString().split('.')[1]}</div>
                <div class="block-lesson-duration">⏱️ ${lesson.duration}</div>
            </div>
            <div class="block-lesson-title">${lesson.title}</div>
                <div class="block-lesson-status">
                    <span class="lesson-status-text">${lessonStatus}</span>
                    <span class="lesson-status-icon">${statusIcon}</span>
                </div>
            <div class="block-lesson-icon">${lesson.icon}</div>
        `;
        
        lessonsGrid.appendChild(lessonCard);
    });
    }
    
    showBlockOverviewScreen();
}

// Переключить видимость категории
function toggleCategory(blockId, categoryIndex) {
    const categoryContent = document.getElementById(`category-content-${blockId}-${categoryIndex}`);
    const arrow = document.getElementById(`arrow-${blockId}-${categoryIndex}`);
    
    if (categoryContent.style.display === 'none') {
        categoryContent.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
    } else {
        categoryContent.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Открыть конкретный урок внутри блока
function openBlockLesson(blockId, lessonNumber) {
    // Проверить авторизацию
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к урокам!");
        showLogin();
        return;
    }

    const block = lessonsData[blockId];
    if (!block) {
        alert("Этот блок еще заблокирован. Пройди предыдущий блок!");
        return;
    }

    // Проверить, есть ли отдельные уроки в блоке
    // Преобразовать lessonNumber в строку для доступа к ключам объекта
    const lessonKey = String(lessonNumber);
    if (block.lessons && block.lessons[lessonKey]) {
        // Проверить, пройден ли предыдущий урок на 100%
        const previousLesson = getPreviousLesson(blockId, lessonKey);
        if (previousLesson && !isLessonCompleted(blockId, previousLesson)) {
            alert("Сначала пройди предыдущий урок на 100%! Для прохождения урока нужно ответить правильно на все вопросы теста.");
            return;
        }
        
        const lesson = block.lessons[lessonKey];
        
        // Сохранить текущий урок для отслеживания прогресса
        currentLesson = blockId;
        currentBlockLesson = lessonKey;
        
        // Сбросить прогресс модуля для нового урока
        moduleProgress = 0;
        
        // Отобразить теорию урока
        document.getElementById("theory-title").textContent = lesson.title;
        document.getElementById("theory-icon").textContent = lesson.icon;
        document.getElementById("theory-content").innerHTML = lesson.theory;
        
        // Изменить текст кнопки в зависимости от блока
        const practiceButton = document.querySelector('.theory-footer .next-btn');
        if (practiceButton) {
            practiceButton.style.display = 'block';
            // Для блока 1 - "Перейти к практике", для остальных - "Пройти финальный тест"
            if (blockId === 1) {
                practiceButton.textContent = 'Перейти к практике →';
            } else {
                practiceButton.textContent = 'Пройти финальный тест →';
            }
        }
        
        // Обновить прогресс
        updateModuleProgress();
        showTheory();
    } else {
        // Если отдельного урока нет, открываем общую теорию блока
        currentBlockLesson = null;
        openLesson(blockId);
    }
}

// Открыть урок (старая функция для обратной совместимости)
// Показать экран выбора блока симулятора
function showSimulatorSelection() {
    // Проверить авторизацию
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к симулятору!");
        showLogin();
        return;
    }
    
    showScreen("simulator-selection-screen");
    updateSimulatorBlocksUI();
}

// Обновить UI блоков симулятора (заблокированные/разблокированные)
function updateSimulatorBlocksUI() {
    if (!currentUser) return;
    
    const completedSimulators = currentUser.completedSimulators || [];
    const simulatorCards = document.querySelectorAll('#simulator-selection-screen .lesson-card');
    
    simulatorCards.forEach((card, index) => {
        const blockId = index + 1;
        const icon = card.querySelector('.lesson-icon');
        
        if (!icon) return;
        
        // Блок 1 всегда открыт
        if (blockId === 1) {
            icon.classList.remove('locked');
            icon.classList.add('current');
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.pointerEvents = 'auto';
        } 
        // Проверить, завершен ли предыдущий блок
        else if (completedSimulators.includes(blockId - 1)) {
            icon.classList.remove('locked');
            icon.classList.add('current');
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.pointerEvents = 'auto';
        } 
        // Заблокирован
        else {
            icon.classList.add('locked');
            icon.classList.remove('current');
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.style.pointerEvents = 'none';
        }
    });
}

// Открыть практический симулятор
function openSimulator(blockId) {
    // Проверить авторизацию
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к симулятору!");
        showLogin();
        return;
    }
    
    // Проверить, доступен ли блок
    // Блок 1 всегда доступен
    // Остальные блоки доступны, только если предыдущий пройден
    if (blockId > 1) {
        const previousBlockId = blockId - 1;
        const completedSimulators = currentUser.completedSimulators || [];
        
        if (!completedSimulators.includes(previousBlockId)) {
            alert(`Этот блок заблокирован! Сначала пройди предыдущий блок с результатом не менее 60%.`);
            return;
        }
    }

    const simulator = simulatorData[blockId];
    if (!simulator) {
        alert("Симулятор для этого блока еще не доступен!");
        return;
    }

    currentSimulatorBlock = blockId;
    currentSimulatorQuestion = 0;
    simulatorScore = 0;
    simulatorAnswers = [];

    // Обновить заголовок и иконку
    document.getElementById("simulator-title").textContent = simulator.title;
    document.getElementById("simulator-icon").textContent = simulator.icon;
    document.getElementById("simulator-total-questions").textContent = simulator.questions.length;
    
    // Показать первый вопрос
    showSimulatorQuestion();
    showScreen("simulator-screen");
}

// Показать экран выбора блока симулятора (для кнопки "Назад" в симуляторе)
function showSimulatorSelectionFromSimulator() {
    showScreen("simulator-selection-screen");
    updateSimulatorBlocksUI();
}

// Показать вопрос/ситуацию в симуляторе
function showSimulatorQuestion() {
    const simulator = simulatorData[currentSimulatorBlock];
    if (!simulator) return;

    const question = simulator.questions[currentSimulatorQuestion];
    if (!question) {
        showSimulatorResults();
        return;
    }

    document.getElementById("simulator-current-question").textContent = currentSimulatorQuestion + 1;
    
    const content = document.getElementById("simulator-content");
    let html = '';

    if (question.type === "situation") {
        html = `
            <div class="simulator-situation">
                <h3>📋 Практическая ситуация</h3>
                <p>${question.text}</p>
            </div>
        `;
    } else {
        html = `
            <div class="simulator-question">
                <h3>❓ ${question.text}</h3>
            </div>
        `;
    }

    html += '<div class="simulator-options">';
    question.options.forEach((option, index) => {
        html += `
            <div class="simulator-option" onclick="selectSimulatorAnswer(${index})">
                ${option}
            </div>
        `;
    });
    html += '</div>';

    html += `
        <div class="simulator-actions">
            <div class="simulator-score">
                Правильных ответов: <span>${simulatorScore}</span> / ${currentSimulatorQuestion}
            </div>
            <button class="simulator-btn" id="simulator-next-btn" onclick="nextSimulatorQuestion()" disabled>
                ${currentSimulatorQuestion === simulator.questions.length - 1 ? 'Завершить' : 'Следующий вопрос'}
            </button>
        </div>
    `;

    content.innerHTML = html;
}

// Выбрать ответ в симуляторе
function selectSimulatorAnswer(answerIndex) {
    const simulator = simulatorData[currentSimulatorBlock];
    if (!simulator) return;

    const question = simulator.questions[currentSimulatorQuestion];
    if (!question) return;

    // Убрать предыдущий выбор
    document.querySelectorAll('.simulator-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Выделить выбранный ответ
    const options = document.querySelectorAll('.simulator-option');
    options[answerIndex].classList.add('selected');

    // Сохранить ответ
    simulatorAnswers[currentSimulatorQuestion] = answerIndex;

    // Включить кнопку "Следующий вопрос"
    document.getElementById("simulator-next-btn").disabled = false;
}

// Следующий вопрос в симуляторе
function nextSimulatorQuestion() {
    const simulator = simulatorData[currentSimulatorBlock];
    if (!simulator) return;

    const question = simulator.questions[currentSimulatorQuestion];
    if (!question) return;

    // Проверить ответ
    const selectedAnswer = simulatorAnswers[currentSimulatorQuestion];
    if (selectedAnswer === question.correct) {
        simulatorScore++;
        // Показать правильный ответ
        const options = document.querySelectorAll('.simulator-option');
        options[selectedAnswer].classList.add('correct');
    } else {
        // Показать неправильный и правильный ответы
        const options = document.querySelectorAll('.simulator-option');
        if (selectedAnswer !== undefined) {
            options[selectedAnswer].classList.add('incorrect');
        }
        options[question.correct].classList.add('correct');
    }

    // Подождать немного, чтобы пользователь увидел результат
    setTimeout(() => {
        currentSimulatorQuestion++;
        if (currentSimulatorQuestion < simulator.questions.length) {
            showSimulatorQuestion();
        } else {
            showSimulatorResults();
        }
    }, 1500);
}

// Показать результаты симулятора
function showSimulatorResults() {
    const simulator = simulatorData[currentSimulatorBlock];
    if (!simulator) return;

    const totalQuestions = simulator.questions.length;
    const percentage = Math.round((simulatorScore / totalQuestions) * 100);
    
    // Если пользователь прошел симулятор успешно (>= 60%), сохранить прогресс
    if (percentage >= 60 && currentUser) {
        if (!currentUser.completedSimulators) {
            currentUser.completedSimulators = [];
        }
        if (!currentUser.completedSimulators.includes(currentSimulatorBlock)) {
            currentUser.completedSimulators.push(currentSimulatorBlock);
            saveUser(currentUser);
        }
    }

    const content = document.getElementById("simulator-content");
    content.innerHTML = `
        <div class="simulator-results">
            <div class="results-header">
                <h2>🎉 Результаты симулятора</h2>
                <div class="results-score-circle">
                    <div class="score-value">${simulatorScore}</div>
                    <div class="score-total">из ${totalQuestions}</div>
                </div>
            </div>
            <div class="results-percentage">
                <div class="percentage-value">${percentage}%</div>
                <div class="percentage-label">правильных ответов</div>
            </div>
            <div class="results-message">
                ${percentage >= 80 ? 'Отлично! Ты отлично усвоил материал! 🎉' : 
                  percentage >= 60 ? 'Хорошо! Следующий блок разблокирован! 🔓' : 
                  'Попробуй еще раз! Нужно набрать хотя бы 60% для разблокировки следующего блока.'}
            </div>
            <div class="results-actions">
                <button class="simulator-btn" onclick="openSimulator(${currentSimulatorBlock})">
                    🔄 Пройти еще раз
                </button>
                <button class="simulator-btn" onclick="showSimulatorSelectionFromSimulator()" style="background: linear-gradient(135deg, #64748b, #475569);">
                    ← Вернуться к выбору блока
                </button>
            </div>
        </div>
    `;
}

function openLesson(lessonId) {
    // Проверить авторизацию
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к урокам!");
        showLogin();
        return;
    }

    const lesson = lessonsData[lessonId];
    if (!lesson) {
        alert("Этот блок еще заблокирован. Пройди предыдущий блок!");
        return;
    }

    // Проверить, разблокирован ли блок (предыдущий должен быть завершен на 100%)
    if (!isBlockUnlocked(lessonId)) {
        const previousBlockId = getPreviousBlockId(lessonId);
        if (previousBlockId) {
            const previousBlock = lessonsData[previousBlockId];
            showCustomModal(
                "🔒 Блок заблокирован",
                `Этот блок заблокирован! Сначала заверши блок "${previousBlock ? previousBlock.title : 'предыдущий'}" на 100%. Для завершения блока нужно пройти все уроки и ответить правильно на все вопросы финального теста.`
            );
        } else {
            showCustomModal(
                "🔒 Блок заблокирован",
                "Этот блок еще заблокирован. Пройди предыдущий блок!"
            );
        }
        return;
    }

    // Если у блока есть overview, показываем его вместо теории
    if (lesson.overview) {
        currentBlockLesson = null;
        showBlockOverview(lessonId);
        return;
    }

    currentLesson = lessonId;
    currentBlockLesson = null;
    document.getElementById("theory-title").textContent = lesson.title;
    document.getElementById("theory-icon").textContent = lesson.icon;
    document.getElementById("theory-content").innerHTML = lesson.theory;
    
    // Изменить текст кнопки в зависимости от блока
    const practiceButton = document.querySelector('.theory-footer .next-btn');
    if (practiceButton) {
        practiceButton.style.display = 'block';
        // Для блока 1 - "Перейти к практике", для остальных - "Пройти финальный тест"
        if (lessonId === 1) {
            practiceButton.textContent = 'Перейти к практике →';
        } else {
            practiceButton.textContent = 'Пройти финальный тест →';
        }
    }
    
    // Обновить отображение прогресса (прогресс сохраняется для текущего урока)
    updateModuleProgress();
    showTheory();
}

// Обновить прогресс модуля
function updateModuleProgress() {
    const lesson = lessonsData[currentLesson];
    if (!lesson) return;
    
    // Убедиться, что прогресс в допустимых пределах (0-100%)
    moduleProgress = Math.max(0, Math.min(100, moduleProgress));
    
    // Прогресс отображается напрямую из moduleProgress
    // Этапы: 0% -> 25% (теория) -> 50% (практика) -> 75% (тест начат) -> 100% (тест пройден)
    const progressFill = document.getElementById("module-progress-fill");
    const progressPercent = document.getElementById("module-progress-percent");
    if (progressFill) {
        progressFill.style.width = moduleProgress + "%";
    }
    if (progressPercent) {
        progressPercent.textContent = Math.round(moduleProgress) + "%";
    }
    
    saveUserProgress();
}

// Начать практику (глобальная функция)
window.startPractice = function startPractice() {
    try {
        // Проверить, что currentLesson установлен
        if (!currentLesson) {
            alert("Ошибка: урок не выбран. Попробуйте вернуться к списку уроков.");
            if (typeof showLessons === 'function') {
                showLessons();
            }
            return;
        }
        
        // Проверить, есть ли практика у текущего урока
        const block = lessonsData[currentLesson];
        if (!block) {
            alert("Ошибка: блок не найден. Попробуйте вернуться к списку уроков.");
            if (typeof showLessons === 'function') {
                showLessons();
            }
            return;
        }
        
        // Проверить, есть ли практика у текущего урока внутри блока
        let hasPractice = false;
        
        if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson]) {
            const practice = block.lessons[currentBlockLesson].practice;
            if (practice && (practice.game || practice.simulator)) {
                hasPractice = true;
            }
        }
        
        // Если нет практики у урока, проверяем практику блока
        if (!hasPractice && block.practice) {
            const practice = block.practice;
            if (practice && (practice.game || practice.simulator)) {
                hasPractice = true;
            }
        }
        
        if (!hasPractice) {
            // Если нет практики, перейти сразу к финальному тесту
            if (moduleProgress < 50) {
                moduleProgress = 50;
                updateModuleProgress();
            }
            showFinalTest();
            return;
        }
        
    // Установить прогресс на 25% только если он меньше (теория прочитана)
    if (moduleProgress < 25) {
        moduleProgress = 25;
        updateModuleProgress();
    }
        
        // Перейти к практике
    showPractice();
    } catch (error) {
        console.error("Ошибка в startPractice:", error);
        alert("Произошла ошибка при переходе к практике. Попробуйте обновить страницу.");
}
};

// Загрузить практику
function loadPractice() {
    const block = lessonsData[currentLesson];
    if (!block) {
        console.error("Ошибка: блок не найден в loadPractice, currentLesson =", currentLesson);
        const practiceContent = document.getElementById("practice-content");
        if (practiceContent) {
            practiceContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: #ef4444; margin-bottom: 1.5rem;">Ошибка загрузки практики. Попробуйте вернуться к списку уроков.</p>
                    <button class="next-btn" onclick="showLessons()">Вернуться к урокам</button>
                </div>
            `;
        }
        return;
    }
    
    // Проверить, есть ли практика у текущего урока внутри блока
    let practice = null;
    if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson]) {
        const lessonPractice = block.lessons[currentBlockLesson].practice;
        // Проверяем, что практика существует и не пустая
        if (lessonPractice && (lessonPractice.game || lessonPractice.simulator)) {
            practice = lessonPractice;
        }
    }
    
    // Если нет практики у урока, проверяем практику блока
    if (!practice && block.practice) {
        const blockPractice = block.practice;
        if (blockPractice && (blockPractice.game || blockPractice.simulator)) {
            practice = blockPractice;
        }
    }
    
    if (!practice) {
        // Если нет практики, показываем сообщение и кнопку перехода к тесту
        const practiceContent = document.getElementById("practice-content");
        if (practiceContent) {
            practiceContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: #64748b; margin-bottom: 1.5rem;">Практика для этого урока не предусмотрена.</p>
                    <button class="next-btn" onclick="showFinalTest()">Перейти к финальному тесту →</button>
                </div>
            `;
        }
        return;
    }
    
    // Сохранить текущую практику
    currentPractice = practice;

    const practiceContent = document.getElementById("practice-content");
    let html = "";

    // Игра: Источники дохода
    if (practice.game) {
        html += `
            <div class="practice-game">
                <div class="practice-game-header">
                    <span class="practice-icon">${practice.game.icon}</span>
                    <h3>${practice.game.title}</h3>
                </div>
                <p>${practice.game.description}</p>
                <div class="game-situation" id="game-situation">
                    ${loadGameSituation(0)}
                </div>
            </div>
        `;
    }

    // Симулятор (бюджет или беспроцентный период)
    if (practice.simulator) {
        if (currentLesson === 1) {
            // Симулятор бюджета для первого блока
            html += `
                <div class="budget-simulator">
                    <div class="simulator-header">
                        <span class="practice-icon">${practice.simulator.icon}</span>
                        <h3>${practice.simulator.title}</h3>
                    </div>
                    <p>${practice.simulator.description}</p>
                    <div class="simulator-content">
                        <label>Твой месячный доход (монет):</label>
                        <input type="number" id="income-input" value="10000" min="1000" step="1000">
                        <button class="calculate-btn" onclick="calculateBudget()">Рассчитать бюджет</button>
                        <div class="budget-result" id="budget-result" style="display: none;">
                            <div class="result-item">
                                <strong>Обязательные расходы (50%):</strong> <span id="result-50">0</span> монет
                            </div>
                            <div class="result-item">
                                <strong>Желаемые расходы (30%):</strong> <span id="result-30">0</span> монет
                            </div>
                            <div class="result-item">
                                <strong>Сбережения (20%):</strong> <span id="result-20">0</span> монет
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentLesson === 4) {
            // Калькулятор беспроцентного периода для блока 4
            html += `
                <div class="budget-simulator">
                    <div class="simulator-header">
                        <span class="practice-icon">${practice.simulator.icon}</span>
                        <h3>${practice.simulator.title}</h3>
                    </div>
                    <p>${practice.simulator.description}</p>
                    <div class="simulator-content">
                        <label>Сумма покупки по кредитной карте (монет):</label>
                        <input type="number" id="credit-amount" value="20000" min="1000" step="1000">
                        <label>Минимальный платёж (% от суммы долга):</label>
                        <input type="number" id="min-payment-percent" value="5" min="2" max="10" step="1">
                        <button class="calculate-btn" onclick="calculateCreditPayment()">Рассчитать платёж</button>
                        <div class="budget-result" id="credit-result" style="display: none;">
                            <div class="result-item">
                                <strong>Минимальный платёж:</strong> <span id="result-min-payment">0</span> монет
                            </div>
                            <div class="result-item">
                                <strong>Рекомендуется вернуть всю сумму:</strong> <span id="result-full-payment">0</span> монет
                            </div>
                            <div class="result-item" style="color: #10b981; font-weight: 600;">
                                <strong>💡 Совет:</strong> Верни всю сумму до конца беспроцентного периода, чтобы не платить проценты!
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Кнопка для симулятора инвестиций (для блока 3)
    if (currentLesson === 3) {
        html += `
            <div class="practice-footer" style="margin-top: 2rem;">
                <div class="final-test-cta" style="background: #f0f9ff; border: 2px solid #3b82f6;">
                    <h3 style="color: #1e40af;">💼 Практика инвестирования</h3>
                    <p style="color: #1e40af;">Попробуй купить акции и облигации в симуляторе!</p>
                    <button class="start-final-test-btn" onclick="showInvestmentPractice()" style="background: #3b82f6;">
                        <span>📈</span>
                        Открыть симулятор инвестиций
                    </button>
                </div>
            </div>
        `;
    }

    // Кнопка перехода к финальному тесту
    html += `
        <div class="practice-footer">
            <div class="final-test-cta">
                <h3>Готов проверить свои знания?</h3>
                <p>Пройди финальный тест по модулю и получи награду!</p>
                <button class="start-final-test-btn" onclick="showFinalTest()">
                    <span>▶</span>
                    Начать финальный тест
                </button>
            </div>
        </div>
    `;

    practiceContent.innerHTML = html;
    currentSituation = 0;
}

// Загрузить ситуацию игры
function loadGameSituation(index) {
    if (!currentPractice || !currentPractice.game) return "";

    const situations = currentPractice.game.situations;
    if (index >= situations.length) {
        return `<div class="game-complete">🎉 Отлично! Ты прошел все ситуации!</div>`;
    }

    const situation = situations[index];
    let optionsHtml = situation.options.map((opt, i) => `
        <button class="game-option" onclick="selectGameOption(${i}, ${index})">
            <span>${opt.icon}</span>
            ${opt.text}
        </button>
    `).join("");

    return `
        <div class="situation-text">
            <strong>Ситуация:</strong> ${situation.text}
        </div>
        <div class="game-options">
            ${optionsHtml}
        </div>
        <button class="next-situation-btn" id="next-situation-btn" onclick="nextSituation()" style="display: none;">
            Следующая ситуация
        </button>
    `;
}

// Выбрать вариант в игре
function selectGameOption(optionIndex, situationIndex) {
    if (!currentPractice || !currentPractice.game) return;
    
    const situation = currentPractice.game.situations[situationIndex];
    const option = situation.options[optionIndex];

    const buttons = document.querySelectorAll(".game-option");
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === optionIndex) {
            if (option.correct) {
                btn.classList.add("correct");
                practiceCoins += 10;
            } else {
                btn.classList.add("incorrect");
            }
        } else if (situation.options[i].correct) {
            btn.classList.add("correct");
        }
    });

    updateCoinsDisplay();
    document.getElementById("next-situation-btn").style.display = "block";
    saveUserProgress();
}

// Следующая ситуация
function nextSituation() {
    currentSituation++;
    const situationContainer = document.getElementById("game-situation");
    situationContainer.innerHTML = loadGameSituation(currentSituation);
    
    if (currentPractice && currentPractice.game && currentSituation >= currentPractice.game.situations.length) {
        // Практика пройдена - установить 50% только если еще не достигнут
        if (moduleProgress < 50) {
            moduleProgress = 50;
            updateModuleProgress();
        }
        saveUserProgress();
    }
}

// Рассчитать бюджет
function calculateBudget() {
    const income = parseInt(document.getElementById("income-input").value) || 10000;
    const result50 = Math.round(income * 0.5);
    const result30 = Math.round(income * 0.3);
    const result20 = Math.round(income * 0.2);

    document.getElementById("result-50").textContent = result50;
    document.getElementById("result-30").textContent = result30;
    document.getElementById("result-20").textContent = result20;
    document.getElementById("budget-result").style.display = "block";
    
    // Начислить монеты только один раз (привязано к пользователю)
    let coinsKey = 'budget-calculator-coins-given';
    if (currentUser && currentUser.username) {
        coinsKey = `budget-calculator-coins-given-${currentUser.username}`;
    }
    const coinsGiven = localStorage.getItem(coinsKey);
    
    if (!coinsGiven) {
    practiceCoins += 20;
    updateCoinsDisplay();
        localStorage.setItem(coinsKey, 'true');
    }
    
    // Если симулятор использован, это часть практики - установить 50% если еще не достигнут
    if (moduleProgress < 50) {
        moduleProgress = 50;
        updateModuleProgress();
    }
    
    saveUserProgress();
}

// Рассчитать платёж по кредитной карте
function calculateCreditPayment() {
    const creditAmount = parseInt(document.getElementById("credit-amount").value) || 20000;
    const minPaymentPercent = parseInt(document.getElementById("min-payment-percent").value) || 5;
    
    const minPayment = Math.round(creditAmount * (minPaymentPercent / 100));
    const fullPayment = creditAmount;

    document.getElementById("result-min-payment").textContent = minPayment;
    document.getElementById("result-full-payment").textContent = fullPayment;
    document.getElementById("credit-result").style.display = "block";
    
    practiceCoins += 20;
    updateCoinsDisplay();
    
    // Если симулятор использован, это часть практики - установить 50% если еще не достигнут
    if (moduleProgress < 50) {
        moduleProgress = 50;
        updateModuleProgress();
    }
    
    saveUserProgress();
}

// Показать экран финального теста
function showFinalTest() {
    const block = lessonsData[currentLesson];
    if (!block) {
        alert("Ошибка: блок не найден. Попробуйте вернуться к списку уроков.");
        return;
    }
    
    // Проверить, есть ли финальный тест у текущего урока внутри блока
    let finalTest = null;
    if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson] && block.lessons[currentBlockLesson].finalTest) {
        finalTest = block.lessons[currentBlockLesson].finalTest;
    } else if (block.finalTest) {
        finalTest = block.finalTest;
    }
    
    if (!finalTest || finalTest.length === 0) {
        alert("Финальный тест для этого урока не найден.");
        return;
    }
    
    // Сохранить текущий финальный тест
    currentFinalTest = finalTest;
    
    // Сбросить состояние теста
    currentQuestion = 0;
    finalTestAnswers = [];
    finalTestScore = 0;
    
    // Показать экран финального теста
    showScreen("final-test-screen");
    
    // Показать вступление и скрыть контент теста
    const intro = document.querySelector(".final-test-intro");
    const content = document.getElementById("final-test-content");
    if (intro) {
        intro.style.display = "block";
    }
    if (content) {
        content.style.display = "none";
        content.innerHTML = ""; // Очистить предыдущий контент
    }
}

// Начать финальный тест
// Функция для перемешивания массива (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array]; // Создаем копию массива
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startFinalTest() {
    const block = lessonsData[currentLesson];
    if (!block) return;
    
    // Проверить, есть ли финальный тест у текущего урока внутри блока
    let finalTest = null;
    if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson] && block.lessons[currentBlockLesson].finalTest) {
        finalTest = block.lessons[currentBlockLesson].finalTest;
    } else if (block.finalTest) {
        finalTest = block.finalTest;
    }
    
    if (!finalTest || finalTest.length === 0) return;

    // Перемешать варианты ответов для каждого вопроса
    currentFinalTest = finalTest.map(question => {
        // Создать массив индексов для перемешивания
        const indices = question.options.map((_, index) => index);
        const shuffledIndices = shuffleArray(indices);
        
        // Перемешать варианты ответов
        const shuffledOptions = shuffledIndices.map(index => question.options[index]);
        
        // Найти новый индекс правильного ответа
        const newCorrectIndex = shuffledIndices.indexOf(question.correct);
        
        return {
            question: question.question,
            options: shuffledOptions,
            correct: newCorrectIndex
        };
    });

    // Финальный тест начат - установить 75% только если еще не достигнут
    if (moduleProgress < 75) {
        moduleProgress = 75;
        updateModuleProgress();
    }

    currentQuestion = 0;
    finalTestAnswers = [];
    finalTestScore = 0;

    document.querySelector(".final-test-intro").style.display = "none";
    document.getElementById("final-test-content").style.display = "block";
    
    loadFinalTestQuestion();
}

// Загрузить вопрос финального теста
function loadFinalTestQuestion() {
    if (!currentFinalTest || !currentFinalTest[currentQuestion]) return;
    
    const question = currentFinalTest[currentQuestion];

    let html = `
        <div class="final-test-question">
            <div class="final-test-progress">
                Вопрос <strong>${currentQuestion + 1}</strong> из <strong>${currentFinalTest.length}</strong>
            </div>
            <h3>${question.question}</h3>
            <div class="final-test-options">
    `;

    question.options.forEach((option, index) => {
        html += `
            <button class="final-test-option" onclick="selectFinalTestOption(${index})">
                ${option}
            </button>
        `;
    });

    html += `
            </div>
            <button class="next-final-question-btn" id="next-final-btn" onclick="nextFinalQuestion()" disabled>
                ${currentQuestion < currentFinalTest.length - 1 ? "Следующий вопрос" : "Завершить тест"}
            </button>
        </div>
    `;

    document.getElementById("final-test-content").innerHTML = html;
}

// Выбрать вариант в финальном тесте
function selectFinalTestOption(optionIndex) {
    if (!currentFinalTest || !currentFinalTest[currentQuestion]) return;
    
    const question = currentFinalTest[currentQuestion];

    const buttons = document.querySelectorAll(".final-test-option");
    buttons.forEach((btn, i) => {
        // Убираем блокировку кнопок, чтобы можно было переключать ответы
        btn.classList.remove("selected");
        if (i === optionIndex) {
            btn.classList.add("selected");
        }
    });

    finalTestAnswers[currentQuestion] = optionIndex;
    document.getElementById("next-final-btn").disabled = false;
}

// Следующий вопрос финального теста
function nextFinalQuestion() {
    if (!currentFinalTest || !currentFinalTest[currentQuestion]) return;
    
    const question = currentFinalTest[currentQuestion];
    const userAnswer = finalTestAnswers[currentQuestion];

    if (userAnswer === question.correct) {
        finalTestScore++;
    }

    if (currentQuestion < currentFinalTest.length - 1) {
        currentQuestion++;
        loadFinalTestQuestion();
    } else {
        finishFinalTest();
    }
}

// Завершить финальный тест
// Маппинг блоков к практическим симуляторам
const blockToPracticeMapping = {
    1: null, // Блок 1 (Фундамент) - нет отдельного симулятора, есть встроенный в урок
    2: null, // Блок 2 (Банки и кредиты) - пока нет отдельного симулятора
    3: 'investment-practice', // Блок 3 (Инвестиции) - симулятор инвестиций
    5: null, // Блок 5 (Недвижимость) - пока нет отдельного симулятора
    6: null  // Блок 6 (Страхование) - пока нет отдельного симулятора
};

// Получить рекомендуемый практический симулятор для блока
function getRecommendedPracticeForBlock(blockId) {
    return blockToPracticeMapping[blockId] || null;
}

function finishFinalTest() {
    if (!currentFinalTest) return;
    
    // Проверить, что пользователь все еще авторизован
    if (!currentUser || !currentUser.username) {
        console.error('Пользователь не авторизован при завершении теста');
        if (!loadUser()) {
            showLogin();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            return;
        }
    }
    
    const totalQuestions = currentFinalTest.length;
    const percentage = Math.round((finalTestScore / totalQuestions) * 100);
    const isPerfect = (finalTestScore === totalQuestions); // 100% правильных ответов

    let html = `
        <div class="final-test-results">
            <h2>🎉 Тест завершен!</h2>
            <div class="final-score-display">
                <div class="final-score-circle">
                    <span>${finalTestScore}/${totalQuestions}</span>
                </div>
            </div>
            <p class="final-score-message">
    `;

    // Прогресс обновляется ТОЛЬКО при 100% правильных ответов
    if (isPerfect) {
        // Установить 100% только если все ответы правильные
        moduleProgress = 100;
        updateModuleProgress();
        
        // Обновить прогресс блока при успешном завершении теста
        if (currentBlockLesson) {
            // Если это урок внутри блока (например, 2.1, 2.2)
            updateBlockProgress(currentLesson, currentBlockLesson);
            
            // Проверить, есть ли следующий урок в блоке и разблокировать его
            const nextLesson = getNextLesson(currentLesson, currentBlockLesson);
            if (nextLesson) {
                // Следующий урок разблокирован автоматически, т.к. предыдущий завершен на 100%
                console.log(`Урок ${currentBlockLesson} завершен, следующий урок ${nextLesson} теперь доступен`);
            }
        } else {
            // Если это основной блок без подуроков
            updateBlockProgress(currentLesson);
        }
        
        // Автоматически разблокировать следующий блок, если текущий завершен на 100%
        if (isBlockCompleted(currentLesson)) {
            const nextBlockId = getNextBlockId(currentLesson);
            if (nextBlockId) {
                unlockBlock(nextBlockId);
            }
        }
        
        html += "Отлично! Ты отлично усвоил материал! Все ответы правильные!";
        
        // Начислить монетки только если тест пройден впервые
        const testKey = currentBlockLesson ? `test-${currentLesson}-${currentBlockLesson}` : `test-${currentLesson}`;
        if (!currentUser.completedTests) {
            currentUser.completedTests = [];
        }
        
        if (!currentUser.completedTests.includes(testKey)) {
            practiceCoins += 100;
            currentUser.completedTests.push(testKey);
            currentUser.coins = practiceCoins;
            
            // Обновить в массиве пользователей
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex] = { ...currentUser };
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            saveUser(currentUser);
            updateCoinsDisplay();
            
            html += " <strong>+100 🪙</strong>";
        } else {
            html += " (Тест уже был пройден ранее)";
        }
        
        // Проверить, есть ли рекомендуемый практический симулятор для этого блока
        const recommendedPractice = getRecommendedPracticeForBlock(currentLesson);
        const blockTitle = lessonsData[currentLesson] ? lessonsData[currentLesson].title : `Блок ${currentLesson}`;

    html += `
            </p>`;

        // Добавить рекомендацию пройти практический симулятор, если он есть
        if (recommendedPractice) {
        html += `
            <div class="practice-recommendation">
                <div class="recommendation-icon">🎮</div>
                <div class="recommendation-content">
                    <h3>Рекомендация</h3>
                    <p>Отлично! Теперь закрепи знания на практике. Пройди практический симулятор по блоку "${blockTitle}"!</p>
                </div>
            </div>`;
        }
        
        html += `
            <div class="final-test-actions">`;
        
        // Если это урок внутри блока, проверяем есть ли следующий урок
        if (currentBlockLesson) {
            const nextLesson = getNextLesson(currentLesson, currentBlockLesson);
            if (nextLesson) {
                html += `
                <button class="unlock-next-btn" onclick="openBlockLesson(${currentLesson}, '${nextLesson}')">
                    📖 Перейти к следующему уроку
                </button>`;
            } else {
                // Это последний урок в блоке
                html += `
                <button class="unlock-next-btn" onclick="showBlockOverview(${currentLesson})">
                    ✅ Вернуться к обзору блока
                </button>`;
            }
        } else {
            // Это основной блок, показываем кнопку разблокировки следующего блока
            html += `
            <button class="unlock-next-btn" onclick="unlockNextBlock()">
                    🔓 Разблокировать следующий урок
                </button>`;
        }
        
        // Добавить кнопку для перехода к практическому симулятору, если он есть
        if (recommendedPractice) {
            html += `
                <button class="practice-simulator-btn" onclick="goToPracticeSimulator('${recommendedPractice}')">
                    🎮 Пройти практический симулятор
                </button>`;
        }
        
        html += `
                <button class="back-to-lessons-btn" onclick="showLessons()">
                    Вернуться к блокам
            </button>
            </div>
        </div>
        `;
    } else {
        // Если тест не пройден на 100%, прогресс НЕ обновляется
        html += `Попробуй еще раз! Для прохождения урока нужно ответить правильно на все вопросы (${finalTestScore}/${totalQuestions}). Изучи теорию внимательнее.`;
        
        html += `
            </p>
            <div class="final-test-actions">
            <button class="retry-final-btn" onclick="startFinalTest()">
                Повторить тест
            </button>
                <button class="back-to-lessons-btn" onclick="showLessons()">
                    Вернуться к блокам
                </button>
            </div>
        </div>
    `;
    }

    document.getElementById("final-test-content").innerHTML = html;
    updateCoinsDisplay();
    saveUserProgress();
    
    // Обновить отображение прогресса на экране уроков после завершения теста
    if (isPerfect) {
        updateLessonsScreenProgress();
    }
}

// Перейти к практическому симулятору
function goToPracticeSimulator(practiceId) {
    showGame();
    // Небольшая задержка, чтобы экран успел загрузиться
    setTimeout(() => {
        startPracticeSimulator(practiceId);
    }, 100);
}

// Разблокировать следующий блок (используется для обратной совместимости)
function unlockNextBlock() {
    // Проверить, что пользователь все еще авторизован
    if (!currentUser || !currentUser.username) {
        console.error('Пользователь не авторизован при разблокировке блока');
        if (!loadUser()) {
            showLogin();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            return;
        }
    }
    
    // Проверить, завершен ли текущий блок на 100%
    if (!isBlockCompleted(currentLesson)) {
        alert("Сначала заверши текущий блок на 100%! Для завершения блока нужно пройти все уроки и ответить правильно на все вопросы финального теста.");
        return;
    }
    
    // Получить следующий блок
    const nextBlockId = getNextBlockId(currentLesson);
    if (!nextBlockId) {
        alert("Это последний блок! Поздравляем с завершением всех блоков!");
        return;
    }
    
    // Разблокировать следующий блок
    unlockBlock(nextBlockId);
    
    const nextBlock = lessonsData[nextBlockId];
    const blockTitle = nextBlock ? nextBlock.title : `Блок ${nextBlockId}`;
    alert(`🎉 Поздравляю! Блок "${blockTitle}" разблокирован!`);
    
    showLessons();
}

// Обновить общий прогресс
function updateProgress() {
    // Обновление прогресса в шапке на основе завершенных блоков
}

// Рассчитать прогресс блока на основе пройденных уроков
function calculateBlockProgress(blockId) {
    if (!currentUser) return 0;
    
    const block = lessonsData[blockId];
    if (!block) return 0;
    
    // Получить сохраненный прогресс блока
    const blockProgressKey = `block-${blockId}-progress`;
    const savedProgress = currentUser[blockProgressKey] || {};
    
    // Если у блока есть уроки (например, блок 2 с уроками 2.1, 2.2 и т.д.)
    if (block.lessons) {
        const lessonIds = Object.keys(block.lessons);
        let completedLessons = 0;
        
        lessonIds.forEach(lessonId => {
            // Урок считается пройденным ТОЛЬКО если финальный тест пройден на 100%
            if (savedProgress[lessonId] === 100) {
                completedLessons++;
            }
        });
        
        // Прогресс = (количество пройденных уроков / общее количество уроков) * 100
        return lessonIds.length > 0 ? Math.round((completedLessons / lessonIds.length) * 100) : 0;
    } else {
        // Для блоков без подуроков (например, блок 1) используем общий прогресс модуля
        // Только если он равен 100%
        return savedProgress.overall === 100 ? 100 : 0;
    }
}

// Проверить, пройден ли урок на 100%
function isLessonCompleted(blockId, lessonId) {
    if (!currentUser) return false;
    
    const blockProgressKey = `block-${blockId}-progress`;
    const savedProgress = currentUser[blockProgressKey] || {};
    
    // Урок считается пройденным, если его прогресс = 100%
    return savedProgress[lessonId] === 100;
}

// Проверить, завершен ли блок на 100%
function isBlockCompleted(blockId) {
    return calculateBlockProgress(blockId) === 100;
}

// Получить ID предыдущего блока
function getPreviousBlockId(blockId) {
    // Последовательность блоков: 1 -> 2 -> 3 -> 5 -> 6
    const blockSequence = [1, 2, 3, 5, 6];
    const currentIndex = blockSequence.indexOf(blockId);
    if (currentIndex <= 0) {
        return null; // Первый блок или блок не найден
    }
    return blockSequence[currentIndex - 1];
}

// Получить ID следующего блока
function getNextBlockId(blockId) {
    // Последовательность блоков: 1 -> 2 -> 3 -> 5 -> 6
    const blockSequence = [1, 2, 3, 5, 6];
    const currentIndex = blockSequence.indexOf(blockId);
    if (currentIndex < 0 || currentIndex >= blockSequence.length - 1) {
        return null; // Последний блок или блок не найден
    }
    return blockSequence[currentIndex + 1];
}

// Проверить, разблокирован ли блок
function isBlockUnlocked(blockId) {
    // Блок 1 всегда разблокирован
    if (blockId === 1) {
        return true;
    }
    
    // Проверить, завершен ли предыдущий блок на 100%
    const previousBlockId = getPreviousBlockId(blockId);
    if (!previousBlockId) {
        return false;
    }
    
    return isBlockCompleted(previousBlockId);
}

// Разблокировать блок
function unlockBlock(blockId) {
    if (!currentUser) return;
    
    const nextCard = document.getElementById(`lesson-${blockId}-card`);
    if (!nextCard) return;
    
    // Проверить, не разблокирован ли уже
    const lessonIcon = nextCard.querySelector(".lesson-icon");
    if (lessonIcon && !lessonIcon.classList.contains('locked')) {
        return; // Уже разблокирован
    }
    
    // Разблокировать визуально
    if (lessonIcon) {
        lessonIcon.classList.remove("locked");
        lessonIcon.classList.add("current");
    }
    
    const progressText = document.getElementById(`lesson-${blockId}-progress-text`);
    if (progressText) {
        progressText.textContent = "Открыто";
    }
    
    // Сохранить разблокировку в профиле пользователя
    if (!currentUser.unlockedLessons) {
        currentUser.unlockedLessons = [];
    }
    if (!currentUser.unlockedLessons.includes(blockId)) {
        currentUser.unlockedLessons.push(blockId);
        saveUser(currentUser);
    }
    
    // Обновить отображение прогресса
    updateLessonsScreenProgress();
}

// Получить предыдущий урок в блоке
function getPreviousLesson(blockId, currentLessonId) {
    const block = lessonsData[blockId];
    if (!block || !block.lessons) return null;
    
    const lessonIds = Object.keys(block.lessons).sort((a, b) => {
        // Сортировка по числовому значению (2.1, 2.2, 2.3 и т.д.)
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
    });
    
    const currentIndex = lessonIds.indexOf(String(currentLessonId));
    if (currentIndex > 0) {
        return lessonIds[currentIndex - 1];
    }
    return null;
}

// Получить следующий урок в блоке
function getNextLesson(blockId, currentLessonId) {
    const block = lessonsData[blockId];
    if (!block || !block.lessons) return null;
    
    const lessonIds = Object.keys(block.lessons).sort((a, b) => {
        // Сортировка по числовому значению (2.1, 2.2, 2.3 и т.д.)
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
    });
    
    const currentIndex = lessonIds.indexOf(String(currentLessonId));
    if (currentIndex >= 0 && currentIndex < lessonIds.length - 1) {
        return lessonIds[currentIndex + 1];
    }
    return null;
}

// Сгенерировать HTML для вопросов
function generateQuestionsHTML(questions) {
    let html = `
        <div class="lesson-questions-container" id="lesson-questions-container">
            <div class="lesson-questions-header">
                <h3>📝 Проверь свои знания</h3>
                <p>Ответь на вопросы, чтобы проверить, насколько хорошо ты усвоил материал</p>
            </div>
            <div class="lesson-questions-list" id="lesson-questions-list">
    `;
    
    questions.forEach((question, index) => {
        html += `
            <div class="lesson-question-item" data-question-index="${index}">
                <div class="lesson-question-header">
                    <span class="question-number">Вопрос ${index + 1}</span>
                </div>
                <h4 class="lesson-question-text">${question.question}</h4>
                <div class="lesson-question-options">
        `;
        
        question.options.forEach((option, optionIndex) => {
            html += `
                <label class="lesson-option-label">
                    <input type="radio" name="question-${index}" value="${optionIndex}" class="lesson-option-input">
                    <span class="lesson-option-text">${option}</span>
                </label>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="lesson-questions-footer">
                <button class="check-answers-btn" onclick="checkLessonAnswers()">Проверить ответы</button>
            </div>
        </div>
    `;
    
    return html;
}

// Проверить ответы на вопросы урока
function checkLessonAnswers() {
    const block = lessonsData[currentLesson];
    if (!block) return;
    
    let questions = null;
    if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson] && block.lessons[currentBlockLesson].finalTest) {
        questions = block.lessons[currentBlockLesson].finalTest;
    } else if (block.finalTest) {
        questions = block.finalTest;
    }
    
    if (!questions || questions.length === 0) return;
    
    let correctCount = 0;
    let totalQuestions = questions.length;
    
    // Проверить каждый вопрос
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const questionItem = document.querySelector(`.lesson-question-item[data-question-index="${index}"]`);
        const optionLabels = questionItem.querySelectorAll('.lesson-option-label');
        
        if (!selectedOption) {
            // Если ответ не выбран, подчеркнуть все варианты
            optionLabels.forEach(label => {
                label.classList.add('no-answer');
            });
            return;
        }
        
        const userAnswer = parseInt(selectedOption.value);
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correctCount++;
            // Подсветить правильный ответ зеленым
            optionLabels[userAnswer].classList.add('correct-answer');
        } else {
            // Подчеркнуть неправильный ответ красным
            optionLabels[userAnswer].classList.add('incorrect-answer');
            // Подсветить правильный ответ зеленым
            optionLabels[question.correct].classList.add('correct-answer');
        }
        
        // Отключить все радиокнопки после проверки
        questionItem.querySelectorAll('.lesson-option-input').forEach(input => {
            input.disabled = true;
        });
    });
    
    // Показать результат
    const checkButton = document.querySelector('.check-answers-btn');
    if (checkButton) {
        checkButton.disabled = true;
        
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        let resultMessage = '';
        let resultClass = '';
        
        if (correctCount === totalQuestions) {
            resultMessage = `🎉 Отлично! Все ответы правильные (${correctCount}/${totalQuestions})!`;
            resultClass = 'result-success';
            
            // Если все ответы правильные, можно перейти к следующему уроку
            setTimeout(() => {
                if (confirm('Поздравляем! Все ответы правильные. Перейти к финальному тесту?')) {
                    showFinalTest();
                }
            }, 1000);
        } else {
            resultMessage = `Правильных ответов: ${correctCount} из ${totalQuestions} (${percentage}%). Попробуй еще раз!`;
            resultClass = 'result-partial';
        }
        
        const resultDiv = document.createElement('div');
        resultDiv.className = `lesson-questions-result ${resultClass}`;
        resultDiv.innerHTML = `
            <div class="result-content">
                <p>${resultMessage}</p>
                ${correctCount < totalQuestions ? '<button class="retry-questions-btn" onclick="retryLessonQuestions()">Попробовать снова</button>' : ''}
            </div>
        `;
        
        const questionsContainer = document.getElementById('lesson-questions-container');
        if (questionsContainer) {
            const existingResult = questionsContainer.querySelector('.lesson-questions-result');
            if (existingResult) {
                existingResult.remove();
            }
            questionsContainer.appendChild(resultDiv);
        }
    }
}

// Повторить вопросы урока
function retryLessonQuestions() {
    const block = lessonsData[currentLesson];
    if (!block) return;
    
    let questions = null;
    if (currentBlockLesson && block.lessons && block.lessons[currentBlockLesson] && block.lessons[currentBlockLesson].finalTest) {
        questions = block.lessons[currentBlockLesson].finalTest;
    } else if (block.finalTest) {
        questions = block.finalTest;
    }
    
    if (!questions || questions.length === 0) return;
    
    // Сбросить все ответы
    questions.forEach((question, index) => {
        const questionItem = document.querySelector(`.lesson-question-item[data-question-index="${index}"]`);
        if (questionItem) {
            const optionLabels = questionItem.querySelectorAll('.lesson-option-label');
            const inputs = questionItem.querySelectorAll('.lesson-option-input');
            
            // Снять все классы
            optionLabels.forEach(label => {
                label.classList.remove('correct-answer', 'incorrect-answer', 'no-answer');
            });
            
            // Сбросить выбор
            inputs.forEach(input => {
                input.checked = false;
                input.disabled = false;
            });
        }
    });
    
    // Включить кнопку проверки
    const checkButton = document.querySelector('.check-answers-btn');
    if (checkButton) {
        checkButton.disabled = false;
    }
    
    // Удалить результат
    const resultDiv = document.querySelector('.lesson-questions-result');
    if (resultDiv) {
        resultDiv.remove();
    }
}

// Обновить прогресс блока при завершении урока
function updateBlockProgress(blockId, lessonId = null) {
    // Проверить, что пользователь авторизован
    if (!currentUser || !currentUser.username) {
        console.error('Пользователь не авторизован при обновлении прогресса блока');
        if (!loadUser()) {
            return;
        }
    }
    
    const block = lessonsData[blockId];
    if (!block) return;
    
    try {
        const blockProgressKey = `block-${blockId}-progress`;
        if (!currentUser[blockProgressKey]) {
            currentUser[blockProgressKey] = {};
        }
        
        // Если указан конкретный урок, обновить его прогресс
        if (lessonId) {
            // Сохранить прогресс урока (100% если тест пройден)
            currentUser[blockProgressKey][lessonId] = 100;
        } else {
            // Для блоков без подуроков (например, блок 1) - сохранить общий прогресс
            currentUser[blockProgressKey].overall = 100;
        }
        
        // Пересчитать общий прогресс блока на основе пройденных уроков
        const newProgress = calculateBlockProgress(blockId);
        currentUser[blockProgressKey].overall = newProgress;
        
        saveUserProgress();
        updateLessonsScreenProgress();
    } catch (error) {
        console.error('Ошибка при обновлении прогресса блока:', error);
        // Попытаться перезагрузить пользователя
        loadUser();
    }
}

// Обновить отображение прогресса на экране уроков
function updateLessonsScreenProgress() {
    if (!currentUser) return;
    
    // Обновить прогресс для каждого блока
    [1, 2, 3, 5, 6].forEach(blockId => {
        const progress = calculateBlockProgress(blockId);
        
        const progressFill = document.getElementById(`lesson-${blockId}-progress-fill`);
        const progressText = document.getElementById(`lesson-${blockId}-progress-text`);
        const lessonCard = document.getElementById(`lesson-${blockId}-card`);
        const lessonIcon = lessonCard ? lessonCard.querySelector('.lesson-icon') : null;
        
        // Обновить шкалу прогресса
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Обновить текст прогресса
        if (progressText) {
            if (progress === 0) {
                // Проверяем, разблокирован ли блок
                const isUnlocked = isBlockUnlocked(blockId);
                if (blockId === 1) {
                    progressText.textContent = 'Новый урок';
                } else if (isUnlocked) {
                    progressText.textContent = 'Открыто';
                } else {
                    progressText.textContent = 'Заблокировано';
                }
            } else if (progress === 100) {
                progressText.textContent = 'Завершено';
                if (lessonIcon) {
                    lessonIcon.classList.remove('current', 'locked');
                    lessonIcon.classList.add('completed');
                }
            } else {
                progressText.textContent = `${progress}%`;
                if (lessonIcon && !lessonIcon.classList.contains('completed')) {
                    lessonIcon.classList.remove('locked');
                    lessonIcon.classList.add('current');
                }
            }
        }
        
        // Разблокировать следующий блок, если текущий завершен на 100%
        if (progress === 100) {
            const nextBlockId = getNextBlockId(blockId);
            if (nextBlockId) {
                unlockBlock(nextBlockId);
            }
        }
    });
}

// Инициализация
// Загрузить разблокированные блоки
function loadUnlockedLessons() {
    if (!currentUser) {
        return;
    }
    
    // Проверить каждый блок и разблокировать его, если предыдущий завершен
    const blockSequence = [1, 2, 3, 5, 6];
    blockSequence.forEach(blockId => {
        if (isBlockUnlocked(blockId)) {
            const card = document.getElementById(`lesson-${blockId}-card`);
            if (card) {
                const lessonIcon = card.querySelector(".lesson-icon");
                if (lessonIcon) {
                    lessonIcon.classList.remove("locked");
                    if (!lessonIcon.classList.contains('completed')) {
                        lessonIcon.classList.add("current");
                    }
                }
                
                // Обновить статус только если блок не завершен
                const progress = calculateBlockProgress(blockId);
                const statusSpan = document.getElementById(`lesson-${blockId}-progress-text`);
                if (statusSpan && progress < 100) {
                    statusSpan.textContent = "Доступно";
                }
            }
            
            // Добавить в разблокированные, если еще не добавлен
            if (!currentUser.unlockedLessons) {
                currentUser.unlockedLessons = [];
            }
            if (!currentUser.unlockedLessons.includes(blockId)) {
                currentUser.unlockedLessons.push(blockId);
            }
        }
    });
    
    // Сохранить обновленный список разблокированных блоков
    if (currentUser.unlockedLessons && currentUser.unlockedLessons.length > 0) {
        saveUser(currentUser);
    }
    
    // Обновить прогресс блоков
    updateLessonsScreenProgress();
}

// Загрузить данные практики при загрузке страницы
loadPracticeData();

document.addEventListener("DOMContentLoaded", function () {
    // Проверить авторизацию
    if (loadUser()) {
        // Пользователь авторизован, загрузить его данные
        practiceCoins = currentUser.coins || 0;
        // Загрузить прогресс модуля, но ограничить его максимумом 100%
        moduleProgress = Math.min(currentUser.progress || 0, 100);
        showScreen("lessons-screen");
        // Загрузить разблокированные блоки
        loadUnlockedLessons();
    } else {
        // Пользователь не авторизован, показать главную страницу
        showScreen("home-screen");
        // Для неавторизованных пользователей прогресс начинается с 0
        moduleProgress = 0;
    }
    
    updateCoinsDisplay();
    updateUIForLoggedIn();
    // Обновить отображение прогресса модуля при загрузке
    updateModuleProgress();
    
    // Инициализация игры
    initGame();
});

// ==================== ПРАКТИЧЕСКИЙ СИМУЛЯТОР ====================

// Состояние игры
let gameState = {
    currentCategory: null,
    currentScenarioIndex: 0,
    score: 0,
    correctAnswers: 0,
    totalScenarios: 0,
    completedCategories: []
};

// Категории игры (соответствуют блокам)
const gameCategories = [
    {
        id: 'foundation',
        title: 'Фундамент (Деньги и Я)',
        icon: '💰',
        color: '#667eea',
        description: 'Бюджет, цели, учет финансов'
    },
    {
        id: 'banks',
        title: 'Банки и кредиты',
        icon: '🏦',
        color: '#10b981',
        description: 'Карты, кредиты, вклады'
    },
    {
        id: 'investments',
        title: 'Инвестиции',
        icon: '📈',
        color: '#f59e0b',
        description: 'Акции, облигации, портфель'
    },
    {
        id: 'realestate',
        title: 'Недвижимость',
        icon: '🏠',
        color: '#8b5cf6',
        description: 'Аренда, покупка, ипотека'
    },
    {
        id: 'insurance',
        title: 'Страхование',
        icon: '🛡️',
        color: '#ef4444',
        description: 'ОСАГО, КАСКО, защита'
    }
];

// Сценарии для каждой категории
const gameScenarios = {
    foundation: [
        {
            title: "Планирование бюджета",
            description: "У тебя есть 10 000 ₽ в месяц. Ты хочешь купить новый телефон за 30 000 ₽ через 3 месяца. Также нужно оплатить: еда (3 000 ₽), транспорт (1 500 ₽), развлечения (2 000 ₽). Как правильно распределить деньги?",
            options: [
                "Откладывать по 10 000 ₽ в месяц, не тратить на еду и развлечения",
                "Откладывать по 5 000 ₽ в месяц, остальное тратить на текущие нужды",
                "Откладывать по 8 000 ₽ в месяц, экономить на развлечениях",
                "Не откладывать, купить телефон в кредит"
            ],
            correct: 1,
            explanation: "Правильно! При доходе 10 000 ₽ в месяц и обязательных расходах (еда 3 000 + транспорт 1 500 = 4 500 ₽) реально откладывать около 5 000 ₽ в месяц, оставляя немного на развлечения. За 3 месяца накопишь 15 000 ₽. Для достижения цели в 30 000 ₽ нужно либо увеличить срок до 6 месяцев, либо найти дополнительный доход, либо взять кредит (но это менее выгодно)."
        },
        {
            title: "Учет расходов",
            description: "Ты потратил деньги, но не помнишь на что. В кошельке осталось 2 500 ₽ из 5 000 ₽. Что нужно сделать, чтобы в будущем не терять контроль над деньгами?",
            options: [
                "Ничего, это нормально",
                "Начать вести учет расходов в приложении или тетради",
                "Просить родителей давать больше денег",
                "Тратить только наличные, чтобы видеть остаток"
            ],
            correct: 1,
            explanation: "Правильно! Ведение учета расходов помогает понимать, куда уходят деньги, и планировать бюджет. Можно использовать приложение, тетрадь или таблицу - главное делать это регулярно."
        },
        {
            title: "Финансовая цель",
            description: "Ты хочешь накопить 20 000 ₽ на новый ноутбук. Можешь откладывать по 2 500 ₽ в месяц. Сколько месяцев потребуется?",
            options: [
                "6 месяцев",
                "8 месяцев",
                "10 месяцев",
                "12 месяцев"
            ],
            correct: 1,
            explanation: "Правильно! 20 000 ÷ 2 500 = 8 месяцев. Это пример превращения мечты в конкретную цель с цифрами и сроком."
        },
        {
            title: "Правило 50/30/20",
            description: "У тебя доход 8 000 ₽ в месяц. По правилу 50/30/20 сколько нужно отложить на сбережения?",
            options: [
                "1 600 ₽ (20%)",
                "2 400 ₽ (30%)",
                "4 000 ₽ (50%)",
                "Не нужно откладывать"
            ],
            correct: 0,
            explanation: "Правильно! По правилу 50/30/20 на сбережения идет 20% от дохода: 8 000 × 0.2 = 1 600 ₽. Остальное: 50% на обязательное (4 000 ₽) и 30% на желаемое (2 400 ₽)."
        },
        {
            title: "Пассивный доход",
            description: "Ты хочешь получать пассивный доход. Какой вариант подходит лучше всего для начала?",
            options: [
                "Открыть вклад в банке под проценты",
                "Купить дорогую вещь и перепродать",
                "Взять кредит и инвестировать",
                "Ничего не делать, деньги появятся сами"
            ],
            correct: 0,
            explanation: "Правильно! Банковский вклад - самый простой и безопасный способ начать получать пассивный доход. Проценты будут начисляться автоматически, без ежедневных усилий."
        }
    ],
    banks: [
        {
            title: "Выбор карты",
            description: "Тебе нужна карта для получения стипендии и оплаты покупок. У тебя нет стабильного дохода. Какую карту лучше выбрать?",
            options: [
                "Кредитную карту с большим лимитом",
                "Дебетовую карту",
                "Виртуальную карту",
                "Любую, какая понравится"
            ],
            correct: 1,
            explanation: "Правильно! Дебетовая карта - лучший выбор для начала. Она позволяет распоряжаться только своими деньгами, что учит финансовой дисциплине. Кредитную карту стоит брать только когда есть стабильный доход."
        },
        {
            title: "Беспроцентный период",
            description: "Ты использовал кредитную карту на 10 000 ₽. Беспроцентный период 50 дней. Минимальный платеж 2 000 ₽. Что нужно сделать, чтобы не платить проценты?",
            options: [
                "Ничего не делать, проценты не начислятся",
                "Внести минимальный платеж в течение беспроцентного периода",
                "Внести всю сумму до конца беспроцентного периода",
                "Внести деньги после окончания периода"
            ],
            correct: 2,
            explanation: "Правильно! Чтобы не платить проценты, нужно вернуть всю потраченную сумму (10 000 ₽) до окончания беспроцентного периода. Минимальный платеж сохраняет период, но проценты все равно начислятся на остаток долга."
        },
        {
            title: "Безопасность карты",
            description: "Ты потерял карту в кафе. Что нужно сделать в первую очередь?",
            options: [
                "Подождать, может кто-то вернет",
                "Немедленно заблокировать карту через приложение банка или по телефону",
                "Пойти в банк на следующий день",
                "Ничего не делать, деньги защищены"
            ],
            correct: 1,
            explanation: "Правильно! Карту нужно заблокировать немедленно, чтобы мошенники не смогли ею воспользоваться. Это можно сделать через мобильное приложение банка или позвонив в службу поддержки."
        },
        {
            title: "Онлайн-банкинг",
            description: "Ты получил сообщение с просьбой перейти по ссылке и ввести данные карты для 'проверки безопасности'. Что делать?",
            options: [
                "Перейти по ссылке и ввести данные",
                "Игнорировать сообщение, это мошенники",
                "Позвонить по номеру из сообщения",
                "Переслать сообщение друзьям"
            ],
            correct: 1,
            explanation: "Правильно! Банки никогда не просят данные карты по телефону, почте или в сообщениях. Это классическая схема мошенников. Нужно игнорировать такие сообщения и никому не сообщать данные карты."
        },
        {
            title: "Выбор вклада",
            description: "У тебя есть 50 000 ₽, которые не понадобятся в ближайший год. Какой вклад лучше выбрать?",
            options: [
                "Вклад с высокой процентной ставкой, но без возможности снятия",
                "Вклад с возможностью пополнения и снятия",
                "Держать деньги на карте",
                "Вклад с низкой ставкой, но с бонусами"
            ],
            correct: 0,
            explanation: "Правильно! Если деньги точно не понадобятся, лучше выбрать вклад с фиксированным сроком и высокой ставкой. Это даст максимальный доход. Вклады с возможностью снятия обычно имеют меньшую ставку."
        }
    ],
    investments: [
        {
            title: "Выбор акций",
            description: "Ты начинающий инвестор с небольшим капиталом. Какую стратегию лучше выбрать?",
            options: [
                "Купить акции одной компании, которая обещает большой рост",
                "Купить акции нескольких разных компаний (диверсификация)",
                "Вложить все в одну отрасль",
                "Покупать только дешевые акции"
            ],
            correct: 1,
            explanation: "Правильно! Диверсификация (распределение инвестиций между разными активами) снижает риски. Если одна компания упадет в цене, другие могут компенсировать убытки."
        },
        {
            title: "Облигации vs Акции",
            description: "Ты хочешь стабильный доход с минимальным риском. Что выбрать?",
            options: [
                "Только акции",
                "Облигации",
                "Криптовалюту",
                "Только наличные"
            ],
            correct: 1,
            explanation: "Правильно! Облигации дают фиксированный доход (купонные выплаты) и менее рискованны, чем акции. Они подходят для консервативных инвесторов, которые хотят стабильности."
        },
        {
            title: "БПИФ",
            description: "Ты не хочешь выбирать отдельные акции, но хочешь инвестировать в фондовый рынок. Что выбрать?",
            options: [
                "Купить акции одной компании",
                "Купить БПИФ (биржевой паевой инвестиционный фонд)",
                "Не инвестировать вообще",
                "Купить только облигации"
            ],
            correct: 1,
            explanation: "Правильно! БПИФ позволяет 'купить весь рынок сразу' - фонд автоматически инвестирует в множество акций по определенному принципу (например, индекс МосБиржи). Это проще и менее рискованно, чем выбирать отдельные акции."
        },
        {
            title: "ИИС",
            description: "Ты хочешь начать инвестировать и получить налоговые льготы. Что нужно сделать?",
            options: [
                "Открыть обычный брокерский счет",
                "Открыть ИИС (индивидуальный инвестиционный счет)",
                "Купить акции напрямую",
                "Инвестировать через друзей"
            ],
            correct: 1,
            explanation: "Правильно! ИИС дает налоговые льготы: можно вернуть 13% от внесенных сумм (до 52 000 ₽ в год) или освободить от налога доход от инвестиций. Это выгодно для долгосрочного инвестирования."
        },
        {
            title: "Долгосрочное инвестирование",
            description: "Ты инвестировал в акции, и они упали в цене на 10%. Что делать?",
            options: [
                "Срочно продать, чтобы не потерять больше",
                "Подождать, если инвестируешь на долгий срок",
                "Купить еще больше акций",
                "Ничего не делать, забыть про инвестиции"
            ],
            correct: 1,
            explanation: "Правильно! Если ты инвестируешь на долгий срок (годы), краткосрочные падения - это нормально. Рынок имеет циклы роста и падения. Важно не паниковать и придерживаться своей стратегии."
        }
    ],
    realestate: [
        {
            title: "Аренда vs Покупка",
            description: "Ты студент, переезжаешь в другой город на 4 года учебы. Что выгоднее?",
            options: [
                "Купить квартиру в ипотеку",
                "Снимать квартиру",
                "Жить в общежитии",
                "Купить квартиру за наличные"
            ],
            correct: 1,
            explanation: "Правильно! Для временного проживания (4 года) аренда обычно выгоднее покупки. Не нужно платить первоначальный взнос, проценты по ипотеке, коммунальные платежи и налоги. Можно сэкономить и накопить на будущую покупку."
        },
        {
            title: "Первый взнос",
            description: "Ты хочешь купить квартиру за 5 000 000 ₽. Банк требует 20% первоначального взноса. Сколько нужно накопить?",
            options: [
                "500 000 ₽",
                "1 000 000 ₽",
                "2 000 000 ₽",
                "5 000 000 ₽"
            ],
            correct: 1,
            explanation: "Правильно! 20% от 5 000 000 = 1 000 000 ₽. Это минимальный первоначальный взнос для ипотеки. Чем больше взнос, тем меньше переплата по кредиту."
        },
        {
            title: "Выбор квартиры",
            description: "Ты выбираешь квартиру для покупки. На что обратить внимание в первую очередь?",
            options: [
                "Только на цену",
                "Расположение, состояние, документы, цена",
                "Только на внешний вид",
                "Только на размер"
            ],
            correct: 1,
            explanation: "Правильно! При выборе квартиры важно учитывать все факторы: расположение (транспорт, инфраструктура), состояние (ремонт, коммуникации), документы (право собственности, обременения) и цену. Нельзя выбирать только по одному критерию."
        },
        {
            title: "Коммунальные платежи",
            description: "Ты купил квартиру. Какие регулярные расходы нужно учитывать?",
            options: [
                "Только ипотечный платеж",
                "Ипотечный платеж + коммунальные услуги + налоги + содержание",
                "Только коммунальные услуги",
                "Никаких дополнительных расходов"
            ],
            correct: 1,
            explanation: "Правильно! Помимо ипотечного платежа нужно платить: коммунальные услуги (электричество, вода, газ), налог на недвижимость, взносы на содержание дома и капремонт. Это важно учитывать при планировании бюджета."
        },
        {
            title: "Защита от мошенников",
            description: "При покупке квартиры продавец просит перевести деньги на личную карту до оформления документов. Что делать?",
            options: [
                "Согласиться и перевести деньги",
                "Отказаться, все расчеты должны проходить через банковскую ячейку или эскроу",
                "Перевести часть денег",
                "Попросить скидку за наличные"
            ],
            correct: 1,
            explanation: "Правильно! Никогда не переводите деньги продавцу до полного оформления сделки. Используйте банковскую ячейку или счет эскроу - деньги будут заблокированы до регистрации права собственности. Это защищает от мошенников."
        }
    ],
    insurance: [
        {
            title: "ОСАГО обязательно?",
            description: "Ты купил первую машину. Нужно ли оформлять ОСАГО?",
            options: [
                "Нет, это необязательно",
                "Да, ОСАГО обязателен для всех водителей",
                "Только если ездишь по городу",
                "Только для новых машин"
            ],
            correct: 1,
            explanation: "Правильно! ОСАГО (обязательное страхование автогражданской ответственности) обязателен для всех водителей в России. Без него нельзя управлять автомобилем. ОСАГО покрывает ущерб, причиненный другим участникам дорожного движения."
        },
        {
            title: "Что покрывает ОСАГО",
            description: "Ты попал в ДТП по своей вине. Что покроет ОСАГО?",
            options: [
                "Ущерб твоей машине",
                "Ущерб машине пострадавшего и здоровью людей",
                "Только ущерб машине пострадавшего",
                "Ничего не покроет"
            ],
            correct: 1,
            explanation: "Правильно! ОСАГО покрывает ущерб, причиненный другим участникам ДТП: повреждение их автомобиля и возмещение вреда здоровью. Ущерб своей машине ОСАГО не покрывает - для этого нужно КАСКО."
        },
        {
            title: "Выбор страховой",
            description: "Ты выбираешь страховую для ОСАГО. На что обратить внимание?",
            options: [
                "Только на цену",
                "Надежность компании, отзывы, условия выплат, цена",
                "Только на красивый сайт",
                "На самую дешевую цену"
            ],
            correct: 1,
            explanation: "Правильно! При выборе страховой важно проверить: наличие лицензии, финансовую надежность, отзывы клиентов, условия выплат и только потом сравнивать цены. Дешевая страховка может обернуться проблемами при выплате."
        },
        {
            title: "ДТП - что делать",
            description: "Ты попал в ДТП. Какие первые действия?",
            options: [
                "Уехать с места ДТП",
                "Остановиться, включить аварийку, вызвать ГИБДД, позвонить в страховую",
                "Только вызвать ГИБДД",
                "Разобраться с другим водителем без документов"
            ],
            correct: 1,
            explanation: "Правильно! При ДТП нужно: остановиться, включить аварийную сигнализацию, выставить знак аварийной остановки, вызвать ГИБДД, позвонить в страховую компанию, зафиксировать обстоятельства (фото, видео). Нельзя покидать место ДТП!"
        },
        {
            title: "КАСКО vs ОСАГО",
            description: "В чем разница между КАСКО и ОСАГО?",
            options: [
                "Это одно и то же",
                "ОСАГО обязателен и покрывает ущерб другим, КАСКО добровольный и покрывает ущерб твоей машине",
                "КАСКО обязателен, ОСАГО нет",
                "Разницы нет"
            ],
            correct: 1,
            explanation: "Правильно! ОСАГО - обязательное страхование, покрывает ущерб другим участникам ДТП. КАСКО - добровольное страхование, покрывает ущерб твоей машине (ДТП, угон, ущерб от стихии). КАСКО дороже, но защищает твое имущество."
        }
    ]
};

// Инициализация игры
function initGame() {
    // Загрузить данные игры из localStorage
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
        gameState = JSON.parse(savedGameState);
    }
    loadPracticeData();
    loadGameCategories();
}

// Показать экран игры
function showGame() {
    if (!currentUser) {
        alert("Пожалуйста, войдите в аккаунт для доступа к игре!");
        showLogin();
        return;
    }
    
    showScreen("game-screen");
    
    // По умолчанию показываем практические симуляторы (режим practice)
    // Это обеспечивает доступ к симулятору инвестиций
    if (currentGameMode !== 'practice') {
        currentGameMode = 'practice';
    }
    
    // Показать правильный режим
    if (currentGameMode === 'practice') {
        const gameCategoriesSection = document.getElementById('game-categories-section');
        const practiceSection = document.getElementById('practice-section');
        if (gameCategoriesSection) gameCategoriesSection.style.display = 'none';
        if (practiceSection) {
            practiceSection.style.display = 'block';
            loadPracticeCategories();
        }
    } else {
        const gameCategoriesSection = document.getElementById('game-categories-section');
        const practiceSection = document.getElementById('practice-section');
        if (gameCategoriesSection) gameCategoriesSection.style.display = 'block';
        if (practiceSection) practiceSection.style.display = 'none';
        loadGameCategories();
    }
    
    // Обновить активную кнопку режима
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const practiceBtn = document.getElementById('mode-practice');
    if (practiceBtn) {
        practiceBtn.classList.add('active');
    }
    
    updateGameStats();
    updateStockPrices(); // Обновить цены акций
}

// Режим игры (scenarios или practice)
// По умолчанию показываем практические симуляторы для доступа к инвестициям
let currentGameMode = 'practice';

// Переключить режим игры
function switchGameMode(mode) {
    currentGameMode = mode;
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    if (mode === 'scenarios') {
        document.getElementById('game-categories-section').style.display = 'block';
        document.getElementById('practice-section').style.display = 'none';
        loadGameCategories();
    } else {
        document.getElementById('game-categories-section').style.display = 'none';
        document.getElementById('practice-section').style.display = 'block';
        loadPracticeCategories();
    }
}

// Загрузить категории игры
function loadGameCategories() {
    const categoriesGrid = document.getElementById('game-categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    gameCategories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.borderLeftColor = category.color;
        categoryCard.onclick = () => startCategory(category.id);
        
        const isCompleted = gameState.completedCategories.includes(category.id);
        
        categoryCard.innerHTML = `
            <div class="category-card-icon" style="background: ${category.color}20; color: ${category.color}">
                ${category.icon}
            </div>
            <div class="category-card-content">
                <h3>${category.title}</h3>
                <p>${category.description}</p>
                ${isCompleted ? '<span class="category-completed-badge">✓ Пройдено</span>' : ''}
            </div>
            <div class="category-card-arrow">→</div>
        `;
        
        categoriesGrid.appendChild(categoryCard);
    });
}

// Загрузить категории практики
function loadPracticeCategories() {
    const practiceGrid = document.getElementById('practice-categories-grid');
    if (!practiceGrid) {
        console.error("Элемент practice-categories-grid не найден");
        return;
    }
    
    practiceGrid.innerHTML = '';
    
    // Симулятор инвестиций всегда доступен
    const practiceCategories = [
        {
            id: 'investment-practice',
            title: 'Инвестиции',
            icon: '📈',
            color: '#f59e0b',
            description: 'Покупай акции и облигации, формируй портфель'
        }
    ];
    
    practiceCategories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.borderLeftColor = category.color;
        categoryCard.style.cursor = 'pointer';
        categoryCard.onclick = () => {
            console.log("Открываем симулятор:", category.id);
            startPracticeSimulator(category.id);
        };
        
        categoryCard.innerHTML = `
            <div class="category-card-icon" style="background: ${category.color}20; color: ${category.color}">
                ${category.icon}
            </div>
            <div class="category-card-content">
                <h3>${category.title}</h3>
                <p>${category.description}</p>
            </div>
            <div class="category-card-arrow">→</div>
        `;
        
        practiceGrid.appendChild(categoryCard);
    });
    
    console.log("Категории практики загружены:", practiceCategories.length);
}

// Начать категорию
function startCategory(categoryId) {
    const category = gameCategories.find(c => c.id === categoryId);
    const scenarios = gameScenarios[categoryId];
    
    if (!category || !scenarios || scenarios.length === 0) {
        alert('Сценарии для этой категории пока не готовы!');
        return;
    }
    
    gameState.currentCategory = categoryId;
    gameState.currentScenarioIndex = 0;
    gameState.totalScenarios = scenarios.length;
    gameState.correctAnswers = 0;
    
    showScenario();
}

// Показать сценарий
function showScenario() {
    const category = gameCategories.find(c => c.id === gameState.currentCategory);
    const scenarios = gameScenarios[gameState.currentCategory];
    const scenario = scenarios[gameState.currentScenarioIndex];
    
    if (!scenario) {
        showCategoryComplete();
        return;
    }
    
    showScreen("scenario-screen");
    
    // Обновить заголовок и описание
    document.getElementById('scenario-category-badge').textContent = `${category.icon} ${category.title}`;
    document.getElementById('scenario-category-badge').style.borderColor = category.color;
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;
    
    // Обновить прогресс
    const progress = ((gameState.currentScenarioIndex + 1) / gameState.totalScenarios) * 100;
    document.getElementById('scenario-progress-fill').style.width = progress + '%';
    document.getElementById('scenario-number').textContent = `Ситуация ${gameState.currentScenarioIndex + 1} из ${gameState.totalScenarios}`;
    
    // Загрузить варианты ответов
    const optionsContainer = document.getElementById('scenario-options');
    optionsContainer.innerHTML = '';
    
    scenario.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'scenario-option';
        optionButton.textContent = option;
        optionButton.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionButton);
    });
}

// Выбрать вариант ответа
function selectOption(optionIndex) {
    const scenarios = gameScenarios[gameState.currentCategory];
    const scenario = scenarios[gameState.currentScenarioIndex];
    
    const isCorrect = optionIndex === scenario.correct;
    
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.score += 10;
    }
    
    // Показать результат
    showScenarioResult(isCorrect, scenario.explanation);
}

// Показать результат сценария
function showScenarioResult(isCorrect, explanation) {
    showScreen("scenario-result-screen");
    
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultExplanation = document.getElementById('result-explanation');
    const resultPoints = document.getElementById('result-points');
    
    if (isCorrect) {
        resultIcon.textContent = '✅';
        resultIcon.style.color = '#10b981';
        resultTitle.textContent = 'Правильно!';
        resultTitle.style.color = '#10b981';
        resultPoints.textContent = '+10 очков';
        resultPoints.style.color = '#10b981';
    } else {
        resultIcon.textContent = '❌';
        resultIcon.style.color = '#ef4444';
        resultTitle.textContent = 'Неверно';
        resultTitle.style.color = '#ef4444';
        resultPoints.textContent = '+0 очков';
        resultPoints.style.color = '#64748b';
    }
    
    resultExplanation.textContent = explanation;
    
    saveGameState();
    updateGameStats();
}

// Следующий сценарий
function nextScenario() {
    gameState.currentScenarioIndex++;
    
    const scenarios = gameScenarios[gameState.currentCategory];
    
    if (gameState.currentScenarioIndex >= scenarios.length) {
        // Категория завершена
        if (!gameState.completedCategories.includes(gameState.currentCategory)) {
            gameState.completedCategories.push(gameState.currentCategory);
        }
        showCategoryComplete();
    } else {
        showScenario();
    }
}

// Показать экран завершения категории
function showCategoryComplete() {
    showScreen("category-complete-screen");
    
    const scenarios = gameScenarios[gameState.currentCategory];
    const total = scenarios.length;
    const correct = gameState.correctAnswers;
    
    document.getElementById('complete-correct').textContent = `${correct}/${total}`;
    document.getElementById('complete-points').textContent = `${gameState.score} очков`;
    
    saveGameState();
}

// Перезапустить категорию
function restartCategory() {
    startCategory(gameState.currentCategory);
}

// Начать практику после завершения категории
function startPracticeMode() {
    switchGameMode('practice');
    showGame();
}

// Начать практический симулятор (переименовано, чтобы избежать конфликта с window.startPractice)
function startPracticeSimulator(practiceId) {
    console.log("Запуск практического симулятора:", practiceId);
    
    if (practiceId === 'investment-practice') {
        console.log("Открываем симулятор инвестиций");
        showInvestmentPractice();
    } else if (practiceId === 'bank-practice') {
        showBankPractice();
    } else if (practiceId === 'realestate-practice') {
        showRealEstatePractice();
    } else {
        console.error("Неизвестный симулятор:", practiceId);
        alert("Симулятор не найден. Попробуйте обновить страницу.");
    }
}

// ==================== ПРАКТИЧЕСКИЕ СИМУЛЯТОРЫ ====================

// Данные для практики
let practiceData = {
    balance: 100000,
    portfolio: {
        stocks: [],
        bonds: []
    },
    realEstate: {
        balance: 200000, // Отдельный баланс для недвижимости
        properties: [],
        totalIncome: 0
    }
};

// Данные акций для практики (цены в монетках)
const practiceStocks = [
    { 
        id: 1, 
        name: "ТехноКорп", 
        symbol: "TECH", 
        price: 25, 
        change: 1, 
        changePercent: 4.0, 
        dividend: 3.5,
        description: "ТехноКорп — ведущая российская IT-компания, специализирующаяся на разработке программного обеспечения и облачных решений. Компания имеет стабильный рост выручки и активно инвестирует в инновации.",
        history: [23, 24, 24, 24, 25, 25, 25] // Исторические цены за последние 7 дней
    },
    { 
        id: 2, 
        name: "ЭнергоПлюс", 
        symbol: "ENER", 
        price: 18, 
        change: -1, 
        changePercent: -5.3, 
        dividend: 4.2,
        description: "ЭнергоПлюс — крупная энергетическая компания, занимающаяся производством и распределением электроэнергии. Компания имеет диверсифицированный портфель активов и стабильные дивиденды.",
        history: [19, 19, 19, 18, 18, 18, 18]
    },
    { 
        id: 3, 
        name: "МедиаГрупп", 
        symbol: "MEDI", 
        price: 42, 
        change: 2, 
        changePercent: 5.0, 
        dividend: 2.8,
        description: "МедиаГрупп — медиа-холдинг, владеющий телеканалами, интернет-порталами и издательствами. Компания демонстрирует сильный рост благодаря развитию цифровых платформ.",
        history: [40, 40, 41, 41, 42, 42, 42]
    },
    { 
        id: 4, 
        name: "СтройИнвест", 
        symbol: "BUIL", 
        price: 13, 
        change: 1, 
        changePercent: 8.3, 
        dividend: 5.1,
        description: "СтройИнвест — строительная компания, специализирующаяся на жилищном и коммерческом строительстве. Компания имеет хорошую дивидендную доходность и стабильный бизнес.",
        history: [12, 12, 13, 13, 13, 13, 13]
    },
    { 
        id: 5, 
        name: "ТрансЛогик", 
        symbol: "TRAN", 
        price: 29, 
        change: -2, 
        changePercent: -6.5, 
        dividend: 3.9,
        description: "ТрансЛогик — логистическая компания, предоставляющая услуги грузоперевозок и складского хранения. Компания имеет широкую сеть филиалов по всей России.",
        history: [31, 30, 30, 29, 29, 29, 29]
    }
];

// Данные облигаций для практики (цены в монетках)
const practiceBonds = [
    { 
        id: 1, 
        name: "ОФЗ 26238", 
        price: 20, 
        yield: 7.5, 
        maturity: "2025-12-15", 
        coupon: 1.5, 
        frequency: "Полугодие",
        description: "ОФЗ 26238 — облигация федерального займа с фиксированным купоном. Это государственная облигация с низким уровнем риска, гарантированная правительством России. Подходит для консервативных инвесторов.",
        history: [20, 20, 20, 20, 20, 20, 20]
    },
    { 
        id: 2, 
        name: "ОФЗ 26239", 
        price: 20, 
        yield: 8.2, 
        maturity: "2026-06-20", 
        coupon: 1.6, 
        frequency: "Полугодие",
        description: "ОФЗ 26239 — облигация федерального займа с более высокой доходностью. Государственная гарантия обеспечивает надежность вложений. Купоны выплачиваются дважды в год.",
        history: [20, 20, 20, 20, 20, 20, 20]
    },
    { 
        id: 3, 
        name: "Корп. ТехноКорп", 
        price: 20, 
        yield: 9.1, 
        maturity: "2027-03-10", 
        coupon: 1.8, 
        frequency: "Квартал",
        description: "Корпоративная облигация компании ТехноКорп. Имеет более высокую доходность по сравнению с ОФЗ, но и более высокий риск. Купоны выплачиваются ежеквартально.",
        history: [20, 20, 20, 20, 20, 20, 20]
    },
    { 
        id: 4, 
        name: "Корп. ЭнергоПлюс", 
        price: 20, 
        yield: 8.8, 
        maturity: "2026-09-25", 
        coupon: 1.8, 
        frequency: "Полугодие",
        description: "Корпоративная облигация энергетической компании ЭнергоПлюс. Обеспечена активами компании. Имеет хорошую доходность при умеренном риске.",
        history: [20, 20, 20, 20, 20, 20, 20]
    }
];

// Показать симулятор инвестиций
function showInvestmentPractice() {
    // Убедиться, что данные загружены
    loadPracticeData();
    showScreen("investment-practice-screen");
    loadPracticeStocks();
    loadPracticeBonds();
    updatePracticePortfolio();
    updatePracticeBalance();
}

// Загрузить акции для практики
function loadPracticeStocks() {
    const stocksList = document.getElementById('practice-stocks-list');
    if (!stocksList) return;
    
    stocksList.innerHTML = '';
    
    practiceStocks.forEach(stock => {
        const stockItem = document.createElement('div');
        stockItem.className = 'practice-stock-item';
        stockItem.innerHTML = `
            <div class="practice-stock-info">
                <div class="practice-stock-name">
                    <strong>${stock.name}</strong>
                    <span class="practice-stock-symbol">${stock.symbol}</span>
                </div>
                <div class="practice-stock-price">
                    <div class="practice-price-value">${stock.price} 🪙</div>
                    <div class="practice-price-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                        ${stock.change >= 0 ? '+' : ''}${stock.change} (${stock.change >= 0 ? '+' : ''}${stock.changePercent}%)
                    </div>
                </div>
                <div class="practice-stock-dividend">Дивиденд: ${stock.dividend}%</div>
            </div>
            <div class="practice-stock-actions">
                <button class="practice-buy-btn" onclick="buyPracticeStock(${stock.id})">Купить</button>
            </div>
        `;
        stocksList.appendChild(stockItem);
    });
}

// Загрузить облигации для практики
function loadPracticeBonds() {
    const bondsList = document.getElementById('practice-bonds-list');
    if (!bondsList) return;
    
    bondsList.innerHTML = '';
    
    practiceBonds.forEach(bond => {
        const bondItem = document.createElement('div');
        bondItem.className = 'practice-bond-item';
        bondItem.innerHTML = `
            <div class="practice-bond-info">
                <div class="practice-bond-name"><strong>${bond.name}</strong></div>
                <div class="practice-bond-details">
                    <div>Цена: ${bond.price} 🪙</div>
                    <div>Доходность: ${bond.yield}%</div>
                    <div>Купон: ${bond.coupon} 🪙 (${bond.frequency})</div>
                    <div>Погашение: ${bond.maturity}</div>
                </div>
            </div>
            <div class="practice-bond-actions">
                <button class="practice-buy-btn" onclick="buyPracticeBond(${bond.id})">Купить</button>
            </div>
        `;
        bondsList.appendChild(bondItem);
    });
}

// Переменная для хранения текущего выбранного актива
let currentInvestmentSelection = null;
let currentInvestmentType = null; // 'stock' или 'bond'

// Купить акцию в практике
function buyPracticeStock(stockId) {
    const stock = practiceStocks.find(s => s.id === stockId);
    if (!stock) return;
    
    // Использовать баланс из practiceData, если он есть, иначе использовать монетки
    const currentBalance = practiceData && practiceData.balance !== undefined ? practiceData.balance : practiceCoins;
    
    const quantity = prompt(
        `Сколько акций ${stock.name} (${stock.symbol}) вы хотите купить?\nЦена за акцию: ${stock.price} 🪙\nВаш баланс: ${currentBalance.toLocaleString()} 🪙`
    );
    
    if (!quantity || isNaN(quantity) || quantity <= 0) return;
    
    const totalCost = stock.price * quantity;
    
    if (totalCost > currentBalance) {
        alert('Недостаточно средств!');
        return;
    }
    
    // Добавить в портфель
    const existingPosition = practiceData.portfolio.stocks.find(s => s.id === stock.id);
    
    if (existingPosition) {
        const avgPrice = (existingPosition.avgPrice * existingPosition.quantity + totalCost) / (existingPosition.quantity + parseFloat(quantity));
        existingPosition.quantity += parseFloat(quantity);
        existingPosition.avgPrice = avgPrice;
    } else {
        practiceData.portfolio.stocks.push({
            id: stock.id,
            name: stock.name,
            symbol: stock.symbol,
            quantity: parseFloat(quantity),
            avgPrice: stock.price,
            currentPrice: stock.price
        });
    }
    
    // Использовать баланс из practiceData
    if (practiceData && practiceData.balance !== undefined) {
        practiceData.balance -= totalCost;
    } else {
        practiceCoins -= totalCost;
    }
    savePracticeData();
    updateCoinsDisplay();
    saveUserProgress();
    updatePracticeBalance();
    updatePracticePortfolio();
    loadPracticeStocks();
    loadPracticePortfolio();
    
    alert(`Вы купили ${quantity} акций ${stock.name} за ${totalCost.toLocaleString()} 🪙`);
}

// Купить облигацию в практике
function buyPracticeBond(bondId) {
    const bond = practiceBonds.find(b => b.id === bondId);
    if (!bond) return;
    
    // Использовать баланс из practiceData, если он есть, иначе использовать монетки
    const currentBalance = practiceData && practiceData.balance !== undefined ? practiceData.balance : practiceCoins;
    
    const quantity = prompt(
        `Сколько облигаций ${bond.name} вы хотите купить?\nЦена за облигацию: ${bond.price} 🪙\nВаш баланс: ${currentBalance.toLocaleString()} 🪙`
    );
    
    if (!quantity || isNaN(quantity) || quantity <= 0) return;
    
    const totalCost = bond.price * quantity;
    
    if (totalCost > currentBalance) {
        alert('Недостаточно средств!');
        return;
    }
    
    // Добавить в портфель
    const existingPosition = practiceData.portfolio.bonds.find(b => b.id === bond.id);
    
    if (existingPosition) {
        existingPosition.quantity += parseFloat(quantity);
    } else {
        practiceData.portfolio.bonds.push({
            id: bond.id,
            name: bond.name,
            quantity: parseFloat(quantity),
            price: bond.price,
            yield: bond.yield,
            coupon: bond.coupon
        });
    }
    
    // Использовать баланс из practiceData
    if (practiceData && practiceData.balance !== undefined) {
        practiceData.balance -= totalCost;
    } else {
        practiceCoins -= totalCost;
    }
    savePracticeData();
    updateCoinsDisplay();
    saveUserProgress();
    updatePracticeBalance();
    updatePracticePortfolio();
    loadPracticeBonds();
    loadPracticePortfolio();
    
    alert(`Вы купили ${quantity} облигаций ${bond.name} за ${totalCost.toLocaleString()} 🪙`);
}

// Показать модальное окно с деталями акции/облигации
function showInvestmentModal(investment, type) {
    const modal = document.getElementById('investment-detail-modal');
    if (!modal) return;
    
    // Заполнить заголовок
    document.getElementById('modal-title').textContent = type === 'stock' ? 'Детали акции' : 'Детали облигации';
    
    // Заполнить основную информацию
    if (type === 'stock') {
        document.getElementById('modal-symbol').textContent = investment.symbol;
        document.getElementById('modal-price').textContent = `${investment.price} 🪙`;
        const changeClass = investment.change >= 0 ? 'positive' : 'negative';
        document.getElementById('modal-change').innerHTML = 
            `<span class="${changeClass}">${investment.change >= 0 ? '+' : ''}${investment.change} (${investment.change >= 0 ? '+' : ''}${investment.changePercent}%)</span>`;
        
        // Дополнительные детали для акции
        document.getElementById('modal-details').innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Дивидендная доходность:</span>
                <span class="detail-value">${investment.dividend}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Текущая цена:</span>
                <span class="detail-value">${investment.price} 🪙</span>
            </div>
        `;
    } else {
        document.getElementById('modal-symbol').textContent = investment.name;
        document.getElementById('modal-price').textContent = `${investment.price} 🪙`;
        document.getElementById('modal-change').innerHTML = 
            `<span class="positive">Доходность: ${investment.yield}%</span>`;
        
        // Дополнительные детали для облигации
        document.getElementById('modal-details').innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Доходность:</span>
                <span class="detail-value">${investment.yield}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Купон:</span>
                <span class="detail-value">${investment.coupon} 🪙 (${investment.frequency})</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Погашение:</span>
                <span class="detail-value">${investment.maturity}</span>
            </div>
        `;
    }
    
    // Заполнить описание
    document.getElementById('modal-description').textContent = investment.description || 'Описание недоступно';
    
    // Нарисовать график
    drawInvestmentChart(investment.history || []);
    
    // Показать модальное окно
    modal.style.display = 'flex';
}

// Закрыть модальное окно
function closeInvestmentModal() {
    const modal = document.getElementById('investment-detail-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentInvestmentSelection = null;
    currentInvestmentType = null;
}

// Закрыть модальное окно при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('investment-detail-modal');
    if (event.target === modal) {
        closeInvestmentModal();
    }
}

// Нарисовать график цены
function drawInvestmentChart(history) {
    const canvas = document.getElementById('investment-chart');
    if (!canvas || !history || history.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Очистить canvas
    ctx.clearRect(0, 0, width, height);
    
    // Найти минимальное и максимальное значение
    const minPrice = Math.min(...history);
    const maxPrice = Math.max(...history);
    const priceRange = maxPrice - minPrice || 1;
    
    // Нарисовать сетку
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Нарисовать линию графика
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const isPositive = history[history.length - 1] >= history[0];
    const lineColor = isPositive ? '#10b981' : '#ef4444';
    
    history.forEach((price, index) => {
        const x = padding + (chartWidth / (history.length - 1)) * index;
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    
    // Нарисовать точки
    ctx.fillStyle = lineColor;
    history.forEach((price, index) => {
        const x = padding + (chartWidth / (history.length - 1)) * index;
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Подписи осей
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Подписи по оси X (дни)
    history.forEach((price, index) => {
        const x = padding + (chartWidth / (history.length - 1)) * index;
        ctx.fillText(`День ${index + 1}`, x, height - 10);
    });
    
    // Подписи по оси Y (цены)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const price = minPrice + (priceRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(Math.round(price).toString(), padding - 10, y + 4);
    }
}

// Подтвердить покупку
function confirmBuyInvestment() {
    if (!currentInvestmentSelection || !currentInvestmentType) return;
    
    const investment = currentInvestmentSelection;
    const type = currentInvestmentType;
    
    // Использовать баланс из practiceData, если он есть, иначе использовать монетки
    const currentBalance = practiceData && practiceData.balance !== undefined ? practiceData.balance : practiceCoins;
    
    const quantity = prompt(
        type === 'stock' 
            ? `Сколько акций ${investment.name} (${investment.symbol}) вы хотите купить?\nЦена за акцию: ${investment.price} 🪙\nВаш баланс: ${currentBalance.toLocaleString()} 🪙`
            : `Сколько облигаций ${investment.name} вы хотите купить?\nЦена за облигацию: ${investment.price} 🪙\nВаш баланс: ${currentBalance.toLocaleString()} 🪙`
    );
    
    if (!quantity || isNaN(quantity) || quantity <= 0) return;
    
    const totalCost = investment.price * quantity;
    
    if (totalCost > currentBalance) {
        alert('Недостаточно средств!');
        return;
    }
    
    if (type === 'stock') {
        const existingPosition = practiceData.portfolio.stocks.find(s => s.id === investment.id);
        
        if (existingPosition) {
            const avgPrice = (existingPosition.avgPrice * existingPosition.quantity + totalCost) / (existingPosition.quantity + parseFloat(quantity));
            existingPosition.quantity += parseFloat(quantity);
            existingPosition.avgPrice = avgPrice;
        } else {
            practiceData.portfolio.stocks.push({
                id: investment.id,
                name: investment.name,
                symbol: investment.symbol,
                quantity: parseFloat(quantity),
                avgPrice: investment.price,
                currentPrice: investment.price
            });
        }
        
        // Использовать баланс из practiceData
        if (practiceData && practiceData.balance !== undefined) {
            practiceData.balance -= totalCost;
        } else {
            practiceCoins -= totalCost;
        }
        savePracticeData();
        updateCoinsDisplay();
        saveUserProgress();
        updatePracticeBalance();
        updatePracticePortfolio();
        loadPracticeStocks();
        loadPracticePortfolio(); // Обновить отображение портфеля
        
        alert(`Вы купили ${quantity} акций ${investment.name} за ${totalCost.toLocaleString()} 🪙`);
    } else {
        const existingPosition = practiceData.portfolio.bonds.find(b => b.id === investment.id);
        
        if (existingPosition) {
            existingPosition.quantity += parseFloat(quantity);
        } else {
            practiceData.portfolio.bonds.push({
                id: investment.id,
                name: investment.name,
                quantity: parseFloat(quantity),
                price: investment.price,
                yield: investment.yield,
                coupon: investment.coupon
            });
        }
        
        // Использовать баланс из practiceData
        if (practiceData && practiceData.balance !== undefined) {
            practiceData.balance -= totalCost;
        } else {
            practiceCoins -= totalCost;
        }
        savePracticeData();
        updateCoinsDisplay();
        saveUserProgress();
        updatePracticeBalance();
        updatePracticePortfolio();
        loadPracticeBonds();
        loadPracticePortfolio(); // Обновить отображение портфеля
        
        alert(`Вы купили ${quantity} облигаций ${investment.name} за ${totalCost.toLocaleString()} 🪙`);
    }
    
    closeInvestmentModal();
}

// Переключить вкладку практики
function switchPracticeTab(tabName) {
    document.querySelectorAll('.practice-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.practice-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="switchPracticeTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`practice-${tabName}`).classList.add('active');
    
    if (tabName === 'portfolio') {
        loadPracticePortfolio();
    }
}

// Загрузить портфель
function loadPracticePortfolio() {
    const portfolioItems = document.getElementById('practice-portfolio-items');
    if (!portfolioItems) return;
    
    portfolioItems.innerHTML = '';
    
    // Очистить позиции с количеством 0 из массива
    practiceData.portfolio.stocks = practiceData.portfolio.stocks.filter(p => p.quantity > 0);
    practiceData.portfolio.bonds = practiceData.portfolio.bonds.filter(p => p.quantity > 0);
    
    // Сохранить очищенные данные
    savePracticeData();
    
    // Проверить, есть ли позиции с количеством > 0
    const hasStocks = practiceData.portfolio.stocks.some(p => p.quantity > 0);
    const hasBonds = practiceData.portfolio.bonds.some(p => p.quantity > 0);
    
    if (!hasStocks && !hasBonds) {
        portfolioItems.innerHTML = '<div class="empty-portfolio">Портфель пуст. Начните покупать акции и облигации!</div>';
        return;
    }
    
    // Отобразить только позиции с количеством > 0
    practiceData.portfolio.stocks.forEach(position => {
        // Пропустить позиции с количеством 0
        if (position.quantity <= 0) return;
        
        const stock = practiceStocks.find(s => s.id === position.id);
        if (!stock) return;
        
        // Обновить текущую цену в позиции
        position.currentPrice = stock.price;
        
        const currentValue = stock.price * position.quantity;
        const cost = position.avgPrice * position.quantity;
        const profit = currentValue - cost;
        const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <div class="portfolio-item-info">
                <div class="portfolio-item-name">
                    <strong>${position.name}</strong> (${position.symbol})
                </div>
                <div class="portfolio-item-details">
                    <div>Количество: ${position.quantity} шт.</div>
                    <div>Средняя цена покупки: ${position.avgPrice.toLocaleString()} 🪙</div>
                    <div>Текущая цена: ${stock.price.toLocaleString()} 🪙 <span class="practice-price-change ${stock.change >= 0 ? 'positive' : 'negative'}">(${stock.change >= 0 ? '+' : ''}${stock.change} 🪙)</span></div>
                    <div>Стоимость: ${currentValue.toLocaleString()} 🪙</div>
                    <div class="portfolio-profit ${profit >= 0 ? 'positive' : 'negative'}">
                        ${profit >= 0 ? '+' : ''}${profit.toLocaleString()} 🪙 (${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
            <div class="portfolio-item-actions">
                <button class="practice-sell-btn" onclick="sellPracticeStock(${position.id})">Продать</button>
            </div>
        `;
        portfolioItems.appendChild(portfolioItem);
    });
    
    // Отобразить только позиции с количеством > 0
    practiceData.portfolio.bonds.forEach(position => {
        // Пропустить позиции с количеством 0
        if (position.quantity <= 0) return;
        
        const bond = practiceBonds.find(b => b.id === position.id);
        if (!bond) return;
        
        const currentValue = bond.price * position.quantity;
        const cost = position.price * position.quantity;
        const profit = currentValue - cost;
        const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <div class="portfolio-item-info">
                <div class="portfolio-item-name"><strong>${position.name}</strong></div>
                <div class="portfolio-item-details">
                    <div>Количество: ${position.quantity} шт.</div>
                    <div>Цена покупки: ${position.price.toLocaleString()} 🪙</div>
                    <div>Текущая цена: ${bond.price.toLocaleString()} 🪙</div>
                    <div>Доходность: ${position.yield}%</div>
                    <div>Купон: ${position.coupon} 🪙 (${bond.frequency})</div>
                    <div>Стоимость: ${currentValue.toLocaleString()} 🪙</div>
                    <div class="portfolio-profit ${profit >= 0 ? 'positive' : 'negative'}">
                        ${profit >= 0 ? '+' : ''}${profit.toLocaleString()} 🪙 (${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
            <div class="portfolio-item-actions">
                <button class="practice-sell-btn" onclick="sellPracticeBond(${position.id})">Продать</button>
            </div>
        `;
        portfolioItems.appendChild(portfolioItem);
    });
}

// Продать акцию
function sellPracticeStock(stockId) {
    const position = practiceData.portfolio.stocks.find(s => s.id === stockId);
    if (!position) return;
    
    const stock = practiceStocks.find(s => s.id === stockId);
    if (!stock) return;
    
    const quantity = prompt(`Сколько акций ${position.name} вы хотите продать?\nУ вас: ${position.quantity} шт.\nТекущая цена: ${stock.price} 🪙`);
    
    if (!quantity || isNaN(quantity) || quantity <= 0 || quantity > position.quantity) return;
    
    const totalValue = stock.price * quantity;
    const cost = position.avgPrice * quantity;
    const profit = totalValue - cost;
    
    // Использовать баланс из practiceData
    if (practiceData && practiceData.balance !== undefined) {
        practiceData.balance += totalValue;
    } else {
        practiceCoins += totalValue;
    }
    savePracticeData();
    updateCoinsDisplay();
    saveUserProgress();
    
    if (quantity === position.quantity) {
        practiceData.portfolio.stocks = practiceData.portfolio.stocks.filter(s => s.id !== stockId);
    } else {
        position.quantity -= quantity;
    }
    
    savePracticeData();
    updatePracticeBalance();
    updatePracticePortfolio();
    loadPracticeStocks();
    loadPracticePortfolio(); // Обновить отображение портфеля
    
    alert(`Вы продали ${quantity} акций ${position.name} за ${totalValue.toLocaleString()} 🪙\n${profit >= 0 ? 'Прибыль' : 'Убыток'}: ${profit >= 0 ? '+' : ''}${profit.toLocaleString()} 🪙`);
}

// Продать облигацию
function sellPracticeBond(bondId) {
    const position = practiceData.portfolio.bonds.find(b => b.id === bondId);
    if (!position) return;
    
    const bond = practiceBonds.find(b => b.id === bondId);
    if (!bond) return;
    
    const quantity = prompt(`Сколько облигаций ${position.name} вы хотите продать?\nУ вас: ${position.quantity} шт.\nТекущая цена: ${bond.price} 🪙`);
    
    if (!quantity || isNaN(quantity) || quantity <= 0 || quantity > position.quantity) return;
    
    const totalValue = bond.price * quantity;
    
    // Использовать баланс из practiceData
    if (practiceData && practiceData.balance !== undefined) {
        practiceData.balance += totalValue;
    } else {
        practiceCoins += totalValue;
    }
    savePracticeData();
    updateCoinsDisplay();
    saveUserProgress();
    
    if (quantity === position.quantity) {
        practiceData.portfolio.bonds = practiceData.portfolio.bonds.filter(b => b.id !== bondId);
    } else {
        position.quantity -= quantity;
    }
    
    savePracticeData();
    updatePracticeBalance();
    updatePracticePortfolio();
    loadPracticeBonds();
    loadPracticePortfolio(); // Обновить отображение портфеля
    
    alert(`Вы продали ${quantity} облигаций ${position.name} за ${totalValue.toLocaleString()} 🪙`);
}

// Обновить баланс практики (используем баланс из practiceData)
function updatePracticeBalance() {
    const balanceEl = document.getElementById('practice-balance');
    if (balanceEl) {
        // Используем баланс из practiceData, если он есть, иначе используем монетки
        const balance = practiceData && practiceData.balance !== undefined ? practiceData.balance : practiceCoins;
        balanceEl.textContent = `${balance.toLocaleString()} 🪙`;
    }
}

// Обновить портфель практики
function updatePracticePortfolio() {
    // Использовать баланс из practiceData, если он есть, иначе использовать монетки
    const currentBalance = practiceData && practiceData.balance !== undefined ? practiceData.balance : practiceCoins;
    let portfolioValue = currentBalance;
    let totalCost = 0;
    
    // Учитывать только позиции с количеством > 0
    practiceData.portfolio.stocks.forEach(position => {
        if (position.quantity <= 0) return; // Пропустить позиции с количеством 0
        
        const stock = practiceStocks.find(s => s.id === position.id);
        if (stock) {
            portfolioValue += stock.price * position.quantity;
            totalCost += position.avgPrice * position.quantity;
        }
    });
    
    // Учитывать только позиции с количеством > 0
    practiceData.portfolio.bonds.forEach(position => {
        if (position.quantity <= 0) return; // Пропустить позиции с количеством 0
        
        const bond = practiceBonds.find(b => b.id === position.id);
        if (bond) {
            portfolioValue += bond.price * position.quantity;
            totalCost += position.price * position.quantity;
        }
    });
    
    const profit = portfolioValue - (currentBalance + totalCost);
    const profitPercent = (currentBalance + totalCost) > 0 ? (profit / (currentBalance + totalCost)) * 100 : 0;
    
    const portfolioValueEl = document.getElementById('practice-portfolio-value');
    const profitEl = document.getElementById('practice-profit');
    
    if (portfolioValueEl) {
        portfolioValueEl.textContent = `${portfolioValue.toLocaleString()} 🪙`;
    }
    
    if (profitEl) {
        profitEl.textContent = `${profit >= 0 ? '+' : ''}${profit.toLocaleString()} 🪙 (${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)`;
        profitEl.style.color = profit >= 0 ? '#10b981' : '#ef4444';
    }
    
    loadPracticePortfolio();
}

// Переключить вкладку инвестиций
function switchInvestmentTab(tabName, buttonElement) {
    // Убрать активный класс со всех вкладок
    document.querySelectorAll('.investment-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.investment-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавить активный класс выбранной вкладке
    const tabContent = document.getElementById(`investment-${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Обновить данные при переключении на портфель
    if (tabName === 'portfolio') {
        updatePracticePortfolio();
    }
}

// Показать банковский симулятор
function showBankPractice() {
    showScreen("bank-practice-screen");
    updateBankBalance();
}

// Обновить баланс банка
function updateBankBalance() {
    const balanceEl = document.getElementById('bank-balance');
    if (balanceEl) balanceEl.textContent = `${practiceData.balance.toLocaleString()} ₽`;
}

// Открыть симулятор вклада
function openDepositSimulator() {
    const amount = prompt('Какую сумму вы хотите разместить на вклад?\nВаш баланс: ' + practiceData.balance.toLocaleString() + ' ₽\n\nДоступные вклады:\n- 6 месяцев: 6% годовых\n- 12 месяцев: 7.5% годовых\n- 24 месяца: 8.5% годовых');
    
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const depositAmount = parseFloat(amount);
    if (depositAmount > practiceData.balance) {
        alert('Недостаточно средств!');
        return;
    }
    
    const term = prompt('Выберите срок вклада:\n1 - 6 месяцев (6%)\n2 - 12 месяцев (7.5%)\n3 - 24 месяца (8.5%)');
    
    let rate = 0;
    let months = 0;
    
    if (term === '1') {
        rate = 6;
        months = 6;
    } else if (term === '2') {
        rate = 7.5;
        months = 12;
    } else if (term === '3') {
        rate = 8.5;
        months = 24;
    } else {
        alert('Неверный выбор!');
        return;
    }
    
    const income = depositAmount * (rate / 100) * (months / 12);
    
    practiceData.balance -= depositAmount;
    savePracticeData();
    updateBankBalance();
    
    alert(`Вклад открыт!\nСумма: ${depositAmount.toLocaleString()} 🪙\nСрок: ${months} месяцев\nСтавка: ${rate}% годовых\nДоход через ${months} месяцев: ${income.toLocaleString()} 🪙`);
}

// Открыть симулятор кредита
function openCreditSimulator() {
    const amount = prompt('Какую сумму вы хотите взять в кредит?');
    
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const creditAmount = parseFloat(amount);
    const term = prompt('На какой срок (в месяцах)?\nРекомендуется: 12, 24, 36 месяцев');
    
    if (!term || isNaN(term) || term <= 0) return;
    
    const months = parseFloat(term);
    const rate = 15; // 15% годовых
    
    const monthlyRate = rate / 12 / 100;
    const monthlyPayment = creditAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const overpayment = totalPayment - creditAmount;
    
    const confirm = prompt(`Условия кредита:\nСумма: ${creditAmount.toLocaleString()} ₽\nСрок: ${months} месяцев\nСтавка: ${rate}% годовых\nЕжемесячный платеж: ${monthlyPayment.toFixed(2).toLocaleString()} ₽\nПереплата: ${overpayment.toLocaleString()} ₽\n\nВзять кредит? (да/нет)`);
    
    if (confirm && confirm.toLowerCase() === 'да') {
        practiceData.balance += creditAmount;
        savePracticeData();
        updateBankBalance();
        alert(`Кредит оформлен!\nСумма на счету: ${practiceData.balance.toLocaleString()} 🪙\nНе забудьте вносить ежемесячные платежи!`);
    }
}

// Открыть симулятор карты
function openCardSimulator() {
    const cardType = prompt('Выберите тип карты:\n1 - Дебетовая карта (бесплатно)\n2 - Кредитная карта (лимит 50 000 ₽, 20% годовых)');
    
    if (cardType === '1') {
        alert('Дебетовая карта оформлена!\nТеперь вы можете использовать её для оплаты покупок и переводов.');
    } else if (cardType === '2') {
        alert('Кредитная карта оформлена!\nКредитный лимит: 50 000 🪙\nСтавка: 20% годовых\nБеспроцентный период: 50 дней\nИспользуйте карту ответственно!');
    } else {
        alert('Неверный выбор!');
    }
}

// Сохранить данные практики
function savePracticeData() {
    localStorage.setItem('practiceData', JSON.stringify(practiceData));
}

// Загрузить данные практики
function loadPracticeData() {
    const saved = localStorage.getItem('practiceData');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            // Объединить с дефолтными значениями, чтобы не потерять структуру
            practiceData = {
                balance: loaded.balance || 100000,
                portfolio: {
                    stocks: loaded.portfolio?.stocks || [],
                    bonds: loaded.portfolio?.bonds || []
                },
                realEstate: {
                    balance: loaded.realEstate?.balance || 200000,
                    properties: loaded.realEstate?.properties || [],
                    totalIncome: loaded.realEstate?.totalIncome || 0
                }
            };
        } catch (e) {
            console.error('Ошибка загрузки данных практики:', e);
            // Оставить дефолтные значения
        }
    }
}

// Обновить цены акций (симуляция изменения рынка)
function updateStockPrices() {
    practiceStocks.forEach(stock => {
        // Сохранить старую цену для расчета изменения
        const oldPrice = stock.price;
        
        // Случайное изменение цены от -3% до +3%
        const changePercent = (Math.random() * 6 - 3) / 100;
        stock.price = Math.max(1, Math.round(stock.price * (1 + changePercent))); // Минимум 1 🪙
        stock.change = stock.price - oldPrice;
        stock.changePercent = parseFloat(((stock.change / oldPrice) * 100).toFixed(2));
    });
    
    // Обновить облигации (меньшие колебания)
    practiceBonds.forEach(bond => {
        const changePercent = (Math.random() * 2 - 1) / 100;
        bond.price = Math.max(1, Math.round(bond.price * (1 + changePercent))); // Минимум 1 🪙
    });
    
    // Обновить отображение, если экран практики открыт
    const investmentScreen = document.getElementById('investment-practice-screen');
    if (investmentScreen && investmentScreen.classList.contains('active')) {
        loadPracticeStocks();
        loadPracticeBonds();
        updatePracticePortfolio();
    }
}

// Запустить обновление цен каждые 10 секунд
setInterval(updateStockPrices, 10000);

// Обновить статистику игры
function updateGameStats() {
    const scoreEl = document.getElementById('game-score');
    const correctEl = document.getElementById('game-correct');
    const progressEl = document.getElementById('game-progress');
    
    if (scoreEl) scoreEl.textContent = gameState.score;
    if (correctEl) correctEl.textContent = gameState.correctAnswers;
    
    const totalCategories = gameCategories.length;
    const completed = gameState.completedCategories.length;
    const progress = totalCategories > 0 ? Math.round((completed / totalCategories) * 100) : 0;
    
    if (progressEl) progressEl.textContent = `${progress}%`;
}

// Сохранить состояние игры
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// ==================== СИМУЛЯТОР НЕДВИЖИМОСТИ ====================

// Данные недвижимости (российские города)
const realEstateProperties = [
    // Квартиры
    { id: 1, name: "Квартира в центре", price: 3900, income: 25, location: "Москва, Россия", type: "1-комн.", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop" },
    { id: 2, name: "Квартира с видом", price: 4250, income: 28, location: "Санкт-Петербург, Россия", type: "1-комн.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop" },
    { id: 3, name: "Семейная квартира", price: 3000, income: 20, location: "Казань, Россия", type: "2-комн.", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" },
    { id: 4, name: "Просторная квартира", price: 3200, income: 22, location: "Новосибирск, Россия", type: "2-комн.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
    { id: 7, name: "Элитная квартира", price: 15000, income: 90, location: "Москва, Россия", type: "3-комн.", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop" },
    { id: 8, name: "Пентхаус", price: 25000, income: 150, location: "Москва, Россия", type: "4-комн.", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop" },
    
    // Дома
    { id: 5, name: "Загородный дом", price: 8500, income: 50, location: "Московская область, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 6, name: "Коттедж", price: 12000, income: 70, location: "Ленинградская область, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
    { id: 9, name: "Дом с участком", price: 9500, income: 55, location: "Краснодарский край, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 10, name: "Двухэтажный дом", price: 11000, income: 65, location: "Сочи, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
    { id: 11, name: "Дом у озера", price: 13500, income: 80, location: "Карелия, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 12, name: "Элитный особняк", price: 18000, income: 110, location: "Московская область, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
    { id: 13, name: "Дом в лесу", price: 10500, income: 60, location: "Тверская область, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 14, name: "Современный дом", price: 14000, income: 85, location: "Подмосковье, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
    { id: 15, name: "Дом на берегу", price: 16000, income: 95, location: "Крым, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 16, name: "Дача с садом", price: 7500, income: 45, location: "Ярославская область, Россия", type: "Дом", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" }
];

// Показать симулятор недвижимости
function showRealEstatePractice() {
    showScreen("realestate-practice-screen");
    updateRealEstateDisplay();
}

// Вернуться к экрану недвижимости
function showRealEstatePractice() {
    showScreen("realestate-practice-screen");
    updateRealEstateDisplay();
}

// Обновить отображение недвижимости
function updateRealEstateDisplay() {
    // Убедиться, что realEstate инициализирован
    if (!practiceData.realEstate) {
        practiceData.realEstate = {
            balance: 200000,
            properties: [],
            totalIncome: 0
        };
    }
    if (!practiceData.realEstate.properties) {
        practiceData.realEstate.properties = [];
    }
    
    const totalIncome = practiceData.realEstate.properties.reduce((sum, prop) => {
        const property = realEstateProperties.find(p => p.id === prop.id);
        return sum + (property ? property.income : 0);
    }, 0);
    
    const incomePerHour = totalIncome / 730; // Примерно 730 часов в месяц
    
    const incomeValueEl = document.getElementById('realestate-income-value');
    const propertiesCountEl = document.getElementById('realestate-properties-count');
    const balanceEl = document.getElementById('realestate-balance');
    
    if (incomeValueEl) {
        incomeValueEl.textContent = `${incomePerHour.toFixed(2)} ₽`;
    }
    
    if (propertiesCountEl) {
        propertiesCountEl.textContent = practiceData.realEstate.properties.length;
    }
    
    const balanceDisplayEl = document.getElementById('realestate-balance-display');
    if (balanceDisplayEl) {
        balanceDisplayEl.textContent = `${practiceData.realEstate.balance.toLocaleString()} ₽`;
    }
    
    practiceData.realEstate.totalIncome = totalIncome;
    savePracticeData();
}

// Открыть рынок недвижимости
function openRealEstateMarket() {
    showScreen("realestate-market-screen");
    // Установить сортировку по умолчанию
    currentRealEstateSort = 'expensive';
    
    // Небольшая задержка для гарантии, что DOM готов
    setTimeout(() => {
        // Обновить активную кнопку фильтра
        document.querySelectorAll('.realestate-filter-btn').forEach(btn => btn.classList.remove('active'));
        const expensiveBtn = document.getElementById('filter-expensive');
        if (expensiveBtn) expensiveBtn.classList.add('active');
        
        updateRealEstateDisplay();
        loadRealEstateProperties();
    }, 100);
}

// Текущая сортировка недвижимости
let currentRealEstateSort = 'expensive';

// Сортировать недвижимость
function sortRealEstate(sortType) {
    currentRealEstateSort = sortType;
    
    document.querySelectorAll('.realestate-filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter-${sortType}`).classList.add('active');
    
    loadRealEstateProperties();
}

// Загрузить объекты недвижимости
function loadRealEstateProperties() {
    const propertiesList = document.getElementById('realestate-properties-list');
    if (!propertiesList) {
        console.error('Элемент realestate-properties-list не найден!');
        return;
    }
    
    propertiesList.innerHTML = '';
    
    if (!realEstateProperties || realEstateProperties.length === 0) {
        propertiesList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #64748b;">Объекты недвижимости скоро появятся</div>';
        return;
    }
    
    // Сортировать объекты
    const sortedProperties = [...realEstateProperties].sort((a, b) => {
        if (currentRealEstateSort === 'expensive') {
            return b.price - a.price;
        } else {
            return a.price - b.price;
        }
    });
    
    console.log(`Загружаю ${sortedProperties.length} объектов недвижимости`);
    
    sortedProperties.forEach((property, index) => {
        // Убедиться, что realEstate инициализирован
        if (!practiceData.realEstate) {
            practiceData.realEstate = { balance: 200000, properties: [], totalIncome: 0 };
        }
        if (!practiceData.realEstate.properties) {
            practiceData.realEstate.properties = [];
        }
        
        const owned = practiceData.realEstate.properties.find(p => p.id === property.id);
        
        // Определить эмодзи в зависимости от типа
        let emoji = '🏠';
        if (property.type.includes('1-комн') || property.type.includes('Студия')) {
            emoji = '🏘️';
        } else if (property.type.includes('2-комн')) {
            emoji = '🏡';
        } else if (property.type.includes('3-комн') || property.type.includes('4-комн')) {
            emoji = '🏛️';
        } else if (property.type.includes('Дом')) {
            emoji = '🏰';
        } else if (property.type.includes('Офис')) {
            emoji = '🏢';
        }
        
        // Доход в час
        const incomePerHour = (property.income / 730).toFixed(2);
        
        const propertyCard = document.createElement('div');
        propertyCard.className = 'realestate-property-card-list';
        if (owned) {
            propertyCard.classList.add('owned');
        }
        
        propertyCard.innerHTML = `
            <div class="property-emoji-section">
                <div class="property-emoji">${emoji}</div>
            </div>
            <div class="property-details-list">
                <div class="property-name-list">${property.name}</div>
                <div class="property-price-list">${property.price.toLocaleString()} ₽</div>
                <div class="property-location-list">📍 ${property.location}</div>
                <div class="property-income-hour">💵 Доход в час: ${incomePerHour} ₽</div>
                <button class="property-buy-btn-list" onclick="buyRealEstateProperty(${property.id})" ${owned ? 'disabled' : ''}>
                    ${owned ? 'Куплено' : 'Купить'}
                </button>
            </div>
        `;
        
        propertiesList.appendChild(propertyCard);
    });
    
    console.log(`Добавлено ${propertiesList.children.length} карточек в список`);
}

// Купить объект недвижимости
function buyRealEstateProperty(propertyId) {
    // Убедиться, что realEstate инициализирован
    if (!practiceData.realEstate) {
        practiceData.realEstate = { balance: 200000, properties: [], totalIncome: 0 };
    }
    if (!practiceData.realEstate.properties) {
        practiceData.realEstate.properties = [];
    }
    if (practiceData.realEstate.balance === undefined) {
        practiceData.realEstate.balance = 200000;
    }
    
    const property = realEstateProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    if (practiceData.realEstate.properties.find(p => p.id === property.id)) {
        alert('У вас уже есть этот объект!');
        return;
    }
    
    if (practiceData.realEstate.balance < property.price) {
        alert(`Недостаточно средств!\nНужно: ${property.price.toLocaleString()} 🪙\nУ вас: ${practiceData.realEstate.balance.toLocaleString()} 🪙`);
        return;
    }
    
    const confirm = confirm(`Купить "${property.name}"?\n\nЦена: ${property.price.toLocaleString()} ₽\nДоход в месяц: ${property.income.toLocaleString()} ₽\n\nВаш баланс: ${practiceData.realEstate.balance.toLocaleString()} ₽\nПосле покупки: ${(practiceData.realEstate.balance - property.price).toLocaleString()} ₽`);
    
    if (confirm) {
        practiceData.realEstate.balance -= property.price;
        practiceData.realEstate.properties.push({
            id: property.id,
            purchasePrice: property.price,
            purchaseDate: new Date().toISOString()
        });
        
        savePracticeData();
        updateRealEstateDisplay();
        loadRealEstateProperties();
        
        alert(`Поздравляем! Вы купили "${property.name}"!\n\nТеперь вы получаете ${property.income.toLocaleString()} 🪙 в месяц от аренды.`);
    }
}

// Открыть мою недвижимость
function openMyRealEstate() {
    // Убедиться, что realEstate инициализирован
    if (!practiceData.realEstate) {
        practiceData.realEstate = { balance: 200000, properties: [], totalIncome: 0 };
    }
    if (!practiceData.realEstate.properties) {
        practiceData.realEstate.properties = [];
    }
    
    if (practiceData.realEstate.properties.length === 0) {
        alert('У вас пока нет недвижимости.\nПерейдите на рынок недвижимости, чтобы купить объекты!');
        return;
    }
    
    let myPropertiesContent = "🏠 Моя недвижимость\n\n";
    myPropertiesContent += `Всего объектов: ${practiceData.realEstate.properties.length}\n\n`;
    
    let totalIncome = 0;
    
    practiceData.realEstate.properties.forEach((prop, index) => {
        const property = realEstateProperties.find(p => p.id === prop.id);
        if (property) {
            totalIncome += property.income;
            myPropertiesContent += `${index + 1}. ${property.name}\n`;
            myPropertiesContent += `   📍 ${property.location} | ${property.type}\n`;
            myPropertiesContent += `   💰 Куплено за: ${prop.purchasePrice.toLocaleString()} ₽\n`;
            myPropertiesContent += `   💵 Доход в месяц: ${property.income.toLocaleString()} ₽\n\n`;
        }
    });
    
    myPropertiesContent += `\n💰 Общий доход в месяц: ${totalIncome.toLocaleString()} ₽`;
    myPropertiesContent += `\n💵 Доход в час: ${(totalIncome / 730).toFixed(2)} ₽`;
    
    alert(myPropertiesContent);
}

// ===============================================
// MOBILE MENU FUNCTIONS
// ===============================================

/**
 * Переключает состояние мобильного меню
 * Открывает/закрывает боковое меню на мобильных устройствах
 */
function toggleMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    
    // Переключаем классы для анимации
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Блокируем скролл страницы когда меню открыто
    document.body.classList.toggle('menu-open');
}

/**
 * Закрывает мобильное меню
 * Используется при клике на оверлей или после выбора пункта меню
 */
function closeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Автоматически закрываем меню при изменении экрана
const originalShowScreen = showScreen;
showScreen = function(screenId) {
    closeMobileMenu();
    return originalShowScreen.apply(this, arguments);
};

// Закрываем меню при изменении размера окна (переход с мобильного на десктоп)
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250);
});

// Закрываем меню при клике на кнопку в мобильном меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const buttons = mobileMenu.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Закрываем меню после небольшой задержки для плавности
                setTimeout(closeMobileMenu, 100);
            });
        });
    }
    
    // Обновляем видимость кнопки входа в мобильном меню
    updateMobileMenuLoginButton();
});

// Функция для обновления видимости кнопки входа в мобильном меню
function updateMobileMenuLoginButton() {
    const mobileMenuLoginBtn = document.getElementById('mobile-menu-login-btn');
    if (mobileMenuLoginBtn) {
        if (currentUser) {
            mobileMenuLoginBtn.style.display = 'none';
        } else {
            mobileMenuLoginBtn.style.display = 'block';
        }
    }
}
