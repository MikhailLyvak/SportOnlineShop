const defaultLanguage = 'en';
const navs = {
    'en': {
        'language-selector': 'ENG',
        'login-crm': 'Login to CRM',

        'nav-back': 'Back',
        'nav-forward': 'Forward',

        'blog-header': 'Blog',
        'blog-read-more-button': 'Read more',

        'nav-edu': 'EDUCATION',
        'nav-edu-platform': 'Education Platform',
        'nav-edu-webinar': 'Webinar',
        'nav-store': 'STORE',
        'nav-contact': 'CONTACTS',

        'pitch-deck': 'Pitch Deck',
        'download': 'Download',

        'nav-about-crm': 'About CRM',
        'nav-features': 'Features',
        'nav-val-e': 'VAL-E',
        'nav-hub': 'HUB',
        'nav-process': 'Work process',
        'nav-about-us': 'About us',
        'nav-video': 'Video',
        'nav-blog': 'Blog',

        'directions-header': 'DIRECTIONS',
        'direction-1': 'Food Industry Enterprises',
        'direction-2': 'Poultry Farms, Farms, Livestock Complexes',
        'direction-3': 'Elevators, Granaries',
        'direction-4': 'Terminals, Warehouses',
        'direction-5': 'Transport and Quarantine Cargo',
        'direction-6': 'Supermarkets, Shops',
        'direction-7': 'Restaurants, Cafes',
        'direction-8': 'Private Objects',

        'equipment-header': 'EQUIPMENT',
        'equipment-1': 'Products',
        'equipment-2': 'Sticky Products',
        'equipment-3': 'Rodent Control Equipment',
        'equipment-4': 'Insecticide Equipment',
        'equipment-5': 'UV Lamps',

        'company-title': 'LLC "Troyan.systemz"',
        'company-num': '45081430',
        'bank-title': 'account',
        'bank-num': 'UA363510050000026003879184045',
        'bank-name': 'JOINT STOCK COMPANY "UKRSIBBANK"',
        'address-title': 'address',
        'address': 'Ukraine, Irpin, st. Gagarina, 9',
        'email': 'main@trojan.systems',
        'worktime-1': 'Mn-Fr:',
        'worktime-2': 'St-Sn:',

        'cta-header': 'Book demo-presentation Trojan‑CRM and\u00A0smart multitrap',
        'cta-button': 'Subscribe',

        'terms-link': 'Terms, Conditions & Refund Policy'
    },
    'ua': {
        'language-selector': 'UA',
        'login-crm': 'Вхід в CRM',

        'nav-back': 'Назад',
        'nav-forward': 'Вперед',
        
        'blog-header': 'Блог',
        'blog-read-more-button': 'Читати далі',

        'nav-edu': 'НАВЧАННЯ',
        'nav-edu-platform': 'Навчальна платформа',
        'nav-edu-webinar': 'Вебінар',
        'nav-store': 'МАГАЗИН',
        'nav-contact': 'КОНТАКТИ',
        
        'pitch-deck': 'Комерційна пропозиція',
        'download': 'Завантажити',

        'nav-about-crm': 'Про CRM',
        'nav-features': 'Особливості',
        'nav-val-e': 'VAL-E',
        'nav-hub': 'HUB',
        'nav-process': 'Процес роботи',
        'nav-about-us': 'Про нас',
        'nav-video': 'Відео',
        'nav-blog': 'Блог',

        'directions-header': 'НАПРЯМКИ',
        'direction-1': 'Підприємства харчової промисловості',
        'direction-2': 'Птахофабрики, ферми, тваринницькі комплекси',
        'direction-3': 'Елеватори, зерносховища',
        'direction-4': 'Термінали, складські приміщення',
        'direction-5': 'Транспорт і підкарантинний вантаж',
        'direction-6': 'Супермаркети, магазини',
        'direction-7': 'Ресторани, кафе',
        'direction-8': 'Приватні об’єкти',

        'equipment-header': 'ОБЛАДНАННЯ',
        'equipment-1': 'Препарати',
        'equipment-2': 'Липка продукція',
        'equipment-3': 'Дератизаційне обладнання',
        'equipment-4': 'Інсектицидне обладнання',
        'equipment-5': 'UV-лампи',

        'company-title': 'ТОВ «Троян.системз»',
        'company-num': '45081430',
        'bank-title': 'рахунок',
        'bank-num': 'UA363510050000026003879184045',
        'bank-name': 'АКЦІОНЕРНЕ ТОВАРИСТВО "УКРСИББАНК"',
        'address-title': 'адреса',
        'address': 'м. Ірпінь, вул. Гагаріна, 9',
        'email': 'main@trojan.systems',
        'worktime-1': 'пон-пт:',
        'worktime-2': 'сб-нд:',

        'cta-header': 'Забронюй демо-презентацію Trojan‑CRM і\u00A0smart multitrap',
        'cta-button': 'Забронювати',

        'terms-link': 'Правила і умови, політика повернення'
    },
};


let currentLanguage = getLanguageFromCookies() || defaultLanguage;


function updateLanguageAndContent(language) {
    // Update the current language
    currentLanguage = language;

    // Save the current language in cookies
    saveLanguageToCookies(currentLanguage);

    // Update the content based on the selected language
    updateBaseContent(currentLanguage);
}

function getLanguageFromCookies() {
    // Placeholder logic to get language from cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=').map(part => part.trim());
        if (name === 'language') {
            return value;
        }
    }
    return null;
}

function saveLanguageToCookies(language) {
    // Placeholder logic to save language to cookies
    document.cookie = `language=${language}; expires=${getCookieExpirationDate()}; path=/`;
}

function getCookieExpirationDate() {
    // Placeholder logic to get a future expiration date for the cookie
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    return expirationDate.toUTCString();
}

function updateBaseContent(language) {
    Object.keys(navs[language]).forEach(key => {
        const elements = document.getElementsByClassName(key);
        if (elements.length > 0) {
            Array.from(elements).forEach(element => {
                if (key === 'terms-link') {
                    element.setAttribute('href', (language === 'en') ? '/terms-eng' : '/terms-ua');
                    element.textContent = navs[language][key];
                } else {
                    element.textContent = navs[language][key];
                }
            });
        }
    });
};