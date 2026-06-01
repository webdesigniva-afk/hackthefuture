export const languages = ["en", "bg"] as const;

export type Lang = (typeof languages)[number];

export function isLang(value: string | undefined): value is Lang {
	return value === "en" || value === "bg";
}

export function getLang(value: string | undefined): Lang {
	return isLang(value) ? value : "en";
}

export function langPath(lang: Lang, path = "/") {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `/${lang}${normalized === "/" ? "" : normalized}`;
}

export function translateRecord<T>(record: Record<Lang, T>, lang: Lang): T {
	return record[lang] ?? record.en;
}

export const siteCopy = {
	en: {
		meta: {
			homeTitle: "HTF | CHALLENGE",
			homeDescription: "CATALIZATOR is a leadership platform for institutional decision-makers.",
			publicationsTitle: "Publications | CATALIZATOR",
			publicationsDescription: "Articles, video, image essays, and partner thinking from CATALIZATOR.",
			defaultDescription: "A leadership platform for institutional decision-makers.",
		},
		nav: {
			publications: "Publications",
			requestParticipation: "Apply",
			primary: "Primary navigation",
			footer: "Footer navigation",
			home: "Hack The Future home",
			language: "Language switcher",
		},
		hero: {
			caption: ["Shumen", "June 26–27, 2026", "Pilot Edition", "Future Readiness Days"],
			platform: "Future Readiness Challenge",
			title: "Stop waiting for the future. Start building it.",
			intro: "A two-day challenge for 15–19-year-olds in Shumen. Pick a real problem facing Bulgaria. Build a solution with your team. Present it to people who can actually do something about it.",
			videoLabel: "Shumen city atmosphere",
			participants: ["Mayors", "Senior municipal leaders", "Business leaders", "Academics"],
			sharedAgenda: "One Shared Agenda.",
		},
		intro: {
			eyebrow: "INTRODUCTION",
			title: "What this is",
			intro: "Two days. Your team. A real problem. A jury that takes you seriously. A ceremony on the third day when the strongest teams get recognized in front of the city.",
			body: [
				"You and the other young people in the room pick one of four challenges facing Bulgaria right now. You spend two days working on it together. You build something — a pitch, a prototype, a plan, a campaign — and you present it to a jury made up of people from business, government, and academia.",
				"You do not need to be a programmer. You do not need to already have an idea. You do not need to be top of your class. You need to want to be there.",
			],
			statement: "If you have ever looked at something in your city, your school, or your country and thought “this could be better”, this is where you stop just thinking it.",
		},
		civicImage: {
			alt: "Municipal leaders in a working session",
			statement: "The platform is hosted by a real city, for leaders whose decisions are measured in streets, schools, infrastructure, trust, and time.",
		},
		atmospheric: {
			eyebrow: "Civic atmosphere",
			title: "Governance is no longer distant. It is visible in the city itself.",
			intro: "In the spaces where people work, move, learn, build, and wait, public leadership becomes concrete.",
			alt: "Aerial view of Shumen at night",
		},
		what: {
			eyebrow: "What CATALIZATOR is",
			title: "A serious institutional platform, not a conference format.",
			intro: "CATALIZATOR is a leadership platform for the people responsible for governing cities and the people whose work shapes them.",
			principles: [
				{
					title: "Invitation-only participation",
					body: "Participation is by invitation only, with a room shaped around people who can contribute to the work rather than observe it from a distance.",
				},
				{
					title: "One shared agenda",
					body: "CATALIZATOR has a single shared agenda. There are no parallel tracks, exhibition floors, sponsored sessions, or observers.",
				},
				{
					title: "A working platform",
					body: "The format combines two days of structured sessions with a closed working session focused on alignment, cooperation, and next steps.",
				},
				{
					title: "Permanent home",
					body: "Hosted permanently in Shumen, each edition builds on the last through continued cooperation, working groups, and long-term institutional relationships.",
				},
			],
		},
		agenda: {
			eyebrow: "Agenda",
			title: "Two core questions set the frame.",
			intro: "The agenda is intentionally narrow. CATALIZATOR works through two questions that are already shaping the future capacity of cities and institutions.",
			questions: [
				{
					number: "01",
					title: "Governance under uncertainty",
					body: "How can cities preserve direction, legitimacy, and capacity when certainty is no longer available? This question examines long-term decision-making under fiscal pressure, political volatility, social fragmentation, demographic change, and institutional strain.",
				},
				{
					number: "02",
					title: "Civic governance and artificial intelligence",
					body: "How should municipalities govern AI before its civic effects are fully understood? This question focuses on democratic responsibility, administrative competence, public trust, and the standards institutions need before adoption becomes default.",
				},
			],
		},
		room: {
			eyebrow: "Who's in the room",
			title: "A small room, shaped around responsibility.",
			intro: "The platform brings together people whose work affects cities, businesses, institutions, and public confidence.",
			participants: [
				{
					title: "Mayors and senior municipal leaders",
					body: "The people who carry the actual weight of governing cities. Public leaders responsible for services, infrastructure, local development, and civic confidence.",
				},
				{
					title: "Business leaders",
					body: "Business leaders whose work is tied to the future of the cities they operate in, from employment and investment to resilience and long-term economic life.",
				},
				{
					title: "Academics",
					body: "Researchers and educators who bring research, institutional thinking, and long-term perspective to the room.",
				},
				{
					title: "The room is small by design",
					body: "Success is not measured by attendance. It is measured by the quality of what is decided, exchanged, and carried forward.",
				},
			],
		},
		gallery: {
			label: "Shumen Institute of Technology campus",
			moments: ["Campus architecture, left fragment", "Campus architecture, central fragment", "Campus architecture, right fragment"],
		},
		about: {
			eyebrow: "About us / Partners",
			title: "Rooted in Shumen, built with partners across public life, technology, education, and business.",
			intro: "CATALIZATOR is hosted by the Municipality of Shumen in partnership with Sofia Tech Park, the Shumen Institute of Technology, and Visoko Darvo.",
			body: "Each founding partner contributes a different form of institutional, academic, technological, or strategic capacity to the platform.",
			partners: [
				{
					name: "Municipality of Shumen",
					description: "The host municipality and permanent home of CATALIZATOR. Shumen anchors the platform in civic responsibility and local leadership.",
				},
				{
					name: "Sofia Tech Park",
					description: "A national technology and innovation platform. It brings practical knowledge, networks, and a forward-looking view of public systems.",
				},
				{
					name: "Shumen Institute of Technology",
					description: "The academic partner connecting research, regional talent, and applied learning.",
				},
				{
					name: "Visoko Darvo",
					description: "A long-term business partner rooted in production, enterprise, and regional economic life.",
				},
			],
		},
		publicationsHome: {
			eyebrow: "Publications",
			title: "A publication space for the work between editions.",
			intro: "Articles, video, images from sessions, and partner thinking will live here as CATALIZATOR develops into an ongoing civic intelligence platform.",
			featured: "Featured",
			items: [
				{
					title: "Field Notes",
					description: "Observations from municipal practice, institutional dialogue, and the realities of governing close to the ground.",
					type: "Notes",
					date: "Founding edition",
				},
				{
					title: "Governance Briefs",
					description: "Short analytical papers on uncertainty, civic AI, local capacity, and the operating conditions of public leadership.",
					type: "Brief",
					date: "April 2026",
				},
				{
					title: "Dispatches from Shumen",
					description: "Updates from the founding edition and the permanent platform taking shape around the city.",
					type: "Dispatch",
					date: "Shumen",
				},
			],
		},
		publicationsPage: {
			eyebrow: "Publications",
			title: "The ongoing record of CATALIZATOR.",
			intro: "Articles, video, images from sessions, and partner thinking will live here between editions.",
			pagination: "Page 1 of 1",
			previous: "Previous",
			next: "Next",
		},
		publication: {
			back: "Back to Publications",
			videoForthcoming: "Video forthcoming",
			related: "Related",
			author: "Author",
		},
		closing: {
			eyebrow: "Closing statement",
			title: "The cities and businesses that endure are not the lucky ones.",
			body: "They are the ones whose leaders build the capacity - deliberately and with discipline - to learn, adapt, and act with intention.",
			final: "CATALIZATOR is the platform for that work.",
		},
		footer: {
			statement: "You bring the energy. We bring the challenge. Together, we hack the future.",
			founders: "Partners",
			partnerLabel: "Partner institutions",
			links: [
				{ label: "Privacy & Cookies", href: "/privacy" },
				{ label: "Contact", href: "/contact" },
				{ label: "Instagram", href: "https://www.instagram.com" },
				{ label: "TikTok", href: "https://www.tiktok.com" },
			],
			website: "website",
		},
		scrollToTop: "Scroll to top",
		media: {
			photoPlaceholder: "Photo to be added",
		},
	},
	bg: {
		meta: {
			homeTitle: "HTF | CHALLENGE",
			homeDescription: "CATALIZATOR е платформа за лидерство, създадена за институционални ръководители и лица, които вземат стратегически решения.",
			publicationsTitle: "Публикации | CATALIZATOR",
			publicationsDescription: "Статии, видео съдържание, визуални есета и партньорски анализи от CATALIZATOR.",
			defaultDescription: "Платформа за лидерство за институционални ръководители и лица, които вземат стратегически решения.",
		},
		nav: {
			publications: "Публикации",
			requestParticipation: "Заявка за участие",
			primary: "Основна навигация",
			footer: "Навигация във футъра",
			home: "Начална страница на CATALIZATOR",
			language: "Избор на език",
		},
		hero: {
			caption: ["Шумен", "април 2026", "първо издание", "домакин: Община Шумен"],
			platform: "Платформа за общинско лидерство и стратегически диалог",
			title: "Най-важните решения за бъдещето на градовете днес се вземат на местно ниво.",
			intro: "CATALIZATOR събира кметове, общински ръководители, представители на бизнеса и академичната общност в обща платформа за стратегически диалог, споделена отговорност и дългосрочно сътрудничество.",
			videoLabel: "Градска атмосфера от Шумен",
			participants: ["Кметове", "Висши общински ръководители", "Бизнес лидери", "Академична общност"],
			sharedAgenda: "Единна обща програма.",
		},
		intro: {
			eyebrow: "Въведение",
			title: "Управлението на градовете става все по-сложно, а последствията от местните решения - все по-дългосрочни.",
			intro: "Системите, върху които функционират повечето градове, са създадени за по-предвидим свят. Днес икономическите, технологичните, социалните и демографските промени се развиват по-бързо, отколкото институциите могат да се адаптират към тях.",
			body: [
				"Отговорността обаче остава местна - в общините, върху хората, чиито решения влияят пряко върху развитието, устойчивостта и доверието в градовете.",
				"CATALIZATOR съществува, за да събере тези разговори, опит и перспективи в една обща работна среда. Не като поредна конференция, а като дългосрочна платформа за кметове, общински ръководители, представители на бизнеса и академичната общност, свързани от бъдещето на градовете.",
			],
			statement: "Градът не е фон. Той е мястото, в което решенията се превръщат в реалност.",
		},
		civicImage: {
			alt: "Общински ръководители по време на работна сесия",
			statement: "CATALIZATOR се провежда в реален град и е създаден за лидери, чиито решения оставят отражение върху инфраструктурата, образованието, публичната среда, доверието и дългосрочното развитие на града.",
		},
		atmospheric: {
			eyebrow: "Градска среда",
			title: "Управлението вече не е абстрактна идея. То се вижда в начина, по който функционира самият град.",
			intro: "В средата, в която хората живеят, работят, учат и изграждат бъдещето си, решенията на местното управление имат пряко и видимо отражение.",
			alt: "Въздушен изглед към Шумен през нощта",
		},
		what: {
			eyebrow: "Какво е CATALIZATOR",
			title: "Платформа за лидерство, стратегически диалог и дългосрочно сътрудничество.",
			intro: "CATALIZATOR събира хората, които носят отговорност за управлението на градовете, и онези, чиято работа определя тяхното бъдеще.",
			principles: [
				{
					title: "Участие с покана",
					body: "CATALIZATOR е създаден като ограничен работен формат с участие по покана. Средата е изградена около хора, които участват активно в разговора и процеса на работа.",
				},
				{
					title: "Една обща програма",
					body: "Платформата работи в рамките на една обща програма. Няма паралелни панели, изложбени пространства, спонсорирани сесии или публика в ролята на наблюдател.",
				},
				{
					title: "Работен формат",
					body: "Форматът съчетава два дни структурирани дискусии и работни сесии със закрита среща, насочена към координация, сътрудничество и конкретни следващи стъпки.",
				},
				{
					title: "Дългосрочна платформа",
					body: "С постоянен дом в Шумен, CATALIZATOR се развива като дългосрочна платформа за сътрудничество между градове, институции, бизнес и академична общност.",
				},
			],
		},
		agenda: {
			eyebrow: "Програма",
			title: "Два въпроса стоят в основата на първото издание на CATALIZATOR.",
			intro: "Програмата е целенасочено фокусирана върху теми, които вече определят способността на градовете и институциите да се адаптират, да вземат решения и да изграждат устойчивост в условия на ускоряваща се промяна.",
			questions: [
				{
					number: "01",
					title: "Управление в условия на несигурност",
					body: "Как градовете могат да запазят посока, устойчивост и обществено доверие в среда на нарастваща несигурност? Темата разглежда дългосрочното управление в условията на икономически натиск, демографски промени, институционално напрежение и все по-сложна обществена среда.",
				},
				{
					number: "02",
					title: "Изкуственият интелект и публичното управление",
					body: "Как институциите трябва да подхождат към изкуствения интелект, преди обществените му последици да са напълно ясни? Темата поставя фокус върху отговорността, доверието, административния капацитет и необходимостта от ясни принципи при навлизането на алгоритмични системи в публичния сектор.",
				},
			],
		},
		room: {
			eyebrow: "Кой участва",
			title: "Ограничен формат, изграден около отговорността и реалното участие.",
			intro: "CATALIZATOR събира хора, чиято работа има пряко значение за развитието на градовете, институциите, икономиката и общественото доверие.",
			participants: [
				{
					title: "Кметове и висши общински ръководители",
					body: "Хората, които ежедневно носят отговорността за управлението на градовете - от публичните услуги и инфраструктурата до местното развитие и доверието в институциите.",
				},
				{
					title: "Бизнес лидери",
					body: "Представители на бизнеса, чиято дейност е свързана с дългосрочното развитие, устойчивостта и икономическия живот на градовете, в които работят.",
				},
				{
					title: "Академична общност",
					body: "Изследователи, преподаватели и експерти, които допринасят с научна перспектива, аналитично мислене и дългосрочен поглед върху развитието на обществото и институциите.",
				},
				{
					title: "Форматът остава целенасочено ограничен",
					body: "Успехът на платформата не се измерва с броя участници, а с качеството на разговорите, решенията и сътрудничеството, което продължава и след самото събитие.",
				},
			],
		},
		gallery: {
			label: "Кампус на Шуменския институт по технологии",
			moments: ["Архитектура на кампуса, ляв фрагмент", "Архитектура на кампуса, централен фрагмент", "Архитектура на кампуса, десен фрагмент"],
		},
		about: {
			eyebrow: "За нас / Партньори",
			title: "Изграден в Шумен, в партньорство с институции от публичния сектор, технологиите, образованието и бизнеса.",
			intro: "CATALIZATOR се реализира от Община Шумен в партньорство със София Тех Парк, Шуменски Технологичен Институт и Фондация \"Високо дърво\".",
			body: "Всеки от партньорите допринася към платформата с различен институционален, технологичен, академичен или стратегически опит.",
			partners: [
				{
					name: "Община Шумен",
					description: "Домакин и постоянен дом на CATALIZATOR. Общината поставя платформата в контекста на местното управление, обществената отговорност и дългосрочното развитие на града.",
				},
				{
					name: "София Тех Парк",
					description: "Национална платформа за технологии, иновации и предприемачество, която допринася с технологична перспектива, експертен капацитет и институционални мрежи.",
				},
				{
					name: "Шуменски Технологичен Институт",
					description: "Академичният и образователен партньор на платформата, свързващ обучението, научната работа и развитието на регионален талант.",
				},
				{
					name: "Фондация \"Високо дърво\"",
					description: "Стратегически партньор с дългосрочен поглед върху индустрията, предприемачеството, конкурентоспособността и регионалното развитие.",
				},
			],
		},
		publicationsHome: {
			eyebrow: "Публикации",
			title: "Платформа за анализи, позиции и материали между отделните издания.",
			intro: "Тук CATALIZATOR публикува статии, разговори, видео съдържание, материали от сесиите и партньорски анализи, свързани с управлението на градовете, институционалния капацитет и дългосрочното развитие.",
			featured: "Акцент",
			items: [
				{
					title: "Бележки от практиката",
					description: "Наблюдения от общинската практика, институционалния диалог и реалностите на управлението близо до хората.",
					type: "Бележки",
					date: "Учредително издание",
				},
				{
					title: "Управленски анализи",
					description: "Кратки аналитични текстове за несигурността, гражданския изкуствен интелект, местния капацитет и условията, в които работи публичното лидерство.",
					type: "Анализ",
					date: "април 2026",
				},
				{
					title: "От Шумен",
					description: "Актуални материали от учредителното издание и от постоянната платформа, която се изгражда около града.",
					type: "Платформа",
					date: "Шумен",
				},
			],
		},
		publicationsPage: {
			eyebrow: "Публикации",
			title: "Продължаващият архив на CATALIZATOR.",
			intro: "Статии, видео съдържание, изображения от сесии и партньорски анализи ще бъдат публикувани тук между отделните издания.",
			pagination: "Страница 1 от 1",
			previous: "Предишна",
			next: "Следваща",
		},
		publication: {
			back: "Обратно към публикациите",
			videoForthcoming: "Видео предстои",
			related: "Свързани публикации",
			author: "Автор",
		},
		closing: {
			eyebrow: "Заключение",
			title: "Градовете и организациите, които устояват във времето, не разчитат на случайност.",
			body: "Те изграждат капацитет — последователно, с дисциплина и с дългосрочна перспектива — за да се адаптират, да вземат решения и да действат с ясна посока.",
			final: "CATALIZATOR е платформа за тази работа.",
		},
		footer: {
			statement: "You bring the energy. We bring the challenge. Together, we hack the future.",
			founders: "Partners",
			partnerLabel: "Partner institutions",
			links: [
				{ label: "Поверителност и бисквитки", href: "/privacy" },
				{ label: "Контакт", href: "/contact" },
				{ label: "Instagram", href: "https://www.instagram.com" },
				{ label: "TikTok", href: "https://www.tiktok.com" },
			],
			website: "уебсайт",
		},
		scrollToTop: "Към началото",
		media: {
			photoPlaceholder: "Тук ще има снимка",
		},
	},
} as const;
