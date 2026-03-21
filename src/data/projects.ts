
/**
 * Theme-specific asset paths for screenshots that differ between light and dark mode.
 */
export interface ThemeVariant {
	light: string;
	dark: string;
}

/**
 * Showcase-ready media and supporting feature points for a project.
 */
export interface ProjectShowcase {
	id: string;
	title: string;
	description: string;
	desktopImage?: ThemeVariant; // 16:9 
	mobileImage: ThemeVariant;  // 9:16
	secondaryMobileImage?: ThemeVariant; // For Aero dual layout
	layout?: "single" | "dual-mobile";
	features: {
		icon: string;
		label: string;
		detail: string;
	}[];
}

/**
 * Proof point used in the structured case-study overlay.
 */
export interface ProjectCaseStudyMetric {
	label: string;
	value: string;
	detail: string;
}

/**
 * Key product or implementation decision highlighted in a case study.
 */
export interface ProjectCaseStudyDecision {
	title: string;
	detail: string;
}

/**
 * Rich case-study metadata used by the project overlay.
 */
export interface ProjectCaseStudy {
	role: string;
	users: string;
	surfaces: string;
	constraints: string[];
	decisions: ProjectCaseStudyDecision[];
	proofPoints: string[];
	outcomes: ProjectCaseStudyMetric[];
}

/**
 * Canonical project record used across the homepage, overlays, and previews.
 */
export interface Project {
	title: string;
	description: string;
	link: string;
	category: "Logistics Engine" | "Intelligence Bridge" | "Modernized UX";
	challenge: string;
	architecture: string;
	proposal: string;
	github_stats: {
		commits: number;
		languages: string[];
		stars?: number;
	};
	caseStudy?: ProjectCaseStudy;
	showcase?: ProjectShowcase[];
}

/**
 * Portfolio project dataset that drives the homepage, case studies, and proof strips.
 */
export const projects: Project[] = [
	// --- Logistics Engines ---
	{
		title: "iVisit Ecosystem",
		description: "Emergency dispatch software for ambulance coordination, routing, and hospital visibility.",
		link: "ivisit.ng",
		category: "Logistics Engine",
		challenge: "Emergency response teams lose time when dispatch, ambulance crews, and hospitals are working from different information.",
		architecture: "Built as a real-time operations product with live dispatch updates, route visibility, and synchronized views for both control-room staff and field teams.",
		proposal: "Best for response or logistics teams that need faster coordination, cleaner handoffs, and reliable live visibility.",
		github_stats: {
			commits: 1240,
			languages: ["TypeScript", "Python", "PostgreSQL"],
			stars: 45,
		},
		caseStudy: {
			role: "Product design, realtime workflow design, and frontend architecture",
			users: "Dispatch operators, ambulance crews, and hospital intake teams",
			surfaces: "Desktop control-room surface and mobile field workflows",
			constraints: [
				"High-pressure decisions where context switching costs time",
				"Realtime status changes across control room and field teams",
				"Operational visibility that has to stay readable while data updates"
			],
			decisions: [
				{
					title: "Shared operational state",
					detail: "The same dispatch state stays visible across desktop and mobile so teams are not reconciling different versions of the case."
				},
				{
					title: "Map-first coordination",
					detail: "Routing, vehicle position, and case status stay in the main workflow instead of being split across disconnected views."
				},
				{
					title: "Fast handoff patterns",
					detail: "Actions are built for speed so responders can update status quickly without losing context."
				}
			],
			proofPoints: [
				"Live product with both console and mobile responder views",
				"1,240 commits showing sustained iteration across the core workflow",
				"Public interest visible through 45 stars on the underlying work"
			],
			outcomes: [
				{
					label: "Status",
					value: "Live",
					detail: "Shipped as a working operations product, not a static concept."
				},
				{
					label: "Workflow",
					value: "Shared dispatch state",
					detail: "Control-room and field teams work from the same source of truth."
				},
				{
					label: "Trust",
					value: "Clearer coordination",
					detail: "The interface is built to reduce ambiguity at the moment a decision is made."
				}
			]
		},
		showcase: [
			{
				id: "ivisit-console",
				title: "Dispatch Control Surface",
				description: "A shared dispatch view for real-time coordination between the control room and the field.",
				desktopImage: {
					light: "/showcase/ivisit-console-light.png",
					dark: "/showcase/ivisit-console-dark.png"
				},
				mobileImage: {
					light: "/showcase/ivisit-mobile-light.png",
					dark: "/showcase/ivisit-mobile-dark.png"
				},
				layout: "single",
				features: [
					{ icon: "Navigation", label: "Live map", detail: "Shared location and route visibility for the whole team." },
					{ icon: "Activity", label: "Field handoff", detail: "Cleaner coordination between dispatch and responders." },
					{ icon: "Zap", label: "Fast actions", detail: "Quick command paths for high-pressure workflows." }
				]
			}
		],
	},
	{
		title: "Slatechain",
		description: "Supply chain platform for inventory visibility, order tracking, and replenishment planning.",
		link: "slatechain.vercel.app",
		category: "Logistics Engine",
		challenge: "Small and mid-sized supply chains often run on partial visibility, which creates dead stock and hard-to-trace losses.",
		architecture: "Combines inventory history, order tracking, and forecast signals so teams can see movement clearly and plan replenishment earlier.",
		proposal: "Best for businesses that need clearer inventory flow, traceability, and demand planning.",
		github_stats: {
			commits: 320,
			languages: ["TypeScript", "Solidity", "React"],
		},
	},
	{
		title: "DDDC",
		description: "Healthcare operations platform for patient flow, scheduling, and resource coordination.",
		link: "dddc.vercel.app",
		category: "Logistics Engine",
		challenge: "Care teams lose time when beds, staff, and patient flow are managed across disconnected systems.",
		architecture: "Uses real-time scheduling and resource-aware workflows to match patients, staff, and available capacity more clearly.",
		proposal: "Best for clinical teams that need cleaner throughput and less operational friction.",
		github_stats: {
			commits: 215,
			languages: ["TypeScript", "React"],
		}
	},

	// --- Intelligence Bridges ---

	{
		title: "Dr. Dyrane",
		description: "Clinical AI triage product that turns symptom intake into structured decision support.",
		link: "dr.dyrane.tech",
		category: "Intelligence Bridge",
		challenge: "Most symptom checkers stop at surface-level suggestions, which makes them hard to trust for real clinical decisions.",
		architecture: "Uses staged intake, differential narrowing, red-flag interception, and structured outputs so the reasoning stays visible and auditable.",
		proposal: "Best for healthcare products that need safer triage, clearer escalation, and more trustworthy AI guidance.",
		github_stats: {
			commits: 380,
			languages: ["TypeScript", "React", "Claude AI", "Playwright"],
			stars: 38,
		},
		caseStudy: {
			role: "Product design, AI interaction design, and frontend implementation",
			users: "Patients, clinicians evaluating outputs, and health product teams",
			surfaces: "Progressive intake flow, reasoning output, and escalation layer",
			constraints: [
				"Trust drops fast when AI feels vague or overconfident",
				"Clinical reasoning has to feel structured, not conversational for its own sake",
				"High-risk symptoms need visible escalation rather than soft suggestions"
			],
			decisions: [
				{
					title: "Staged intake",
					detail: "The interface collects symptoms step by step so users stay oriented and the system gets cleaner inputs."
				},
				{
					title: "Visible reasoning structure",
					detail: "Outputs follow a structured clinical pattern so the product feels like decision support instead of an opaque chatbot."
				},
				{
					title: "Guardrail escalation",
					detail: "Red-flag conditions interrupt the normal flow and push the product toward safer escalation behavior."
				}
			],
			proofPoints: [
				"Live triage product with structured intake and output flows",
				"380 commits across the product surface and underlying logic",
				"38 public stars showing external interest in the work"
			],
			outcomes: [
				{
					label: "Status",
					value: "Live",
					detail: "Publicly deployed product with real interaction flow."
				},
				{
					label: "Reasoning",
					value: "Structured",
					detail: "The product makes the clinical path feel more legible and auditable."
				},
				{
					label: "Safety",
					value: "Escalation-aware",
					detail: "High-risk patterns are treated as part of the product flow, not a hidden model concern."
				}
			]
		},
	},

	{
		title: "SaySwitch",

		description: "Payments platform for online and offline transactions in low-connectivity environments.",
		link: "sayswitchgroup.com",
		category: "Intelligence Bridge",
		challenge: "Merchants lose revenue when payments fail in weak-network conditions.",
		architecture: "Queues transactions offline and syncs signed records when connectivity returns, so payment flow stays reliable.",
		proposal: "Best for payment products that need reliability across unstable network conditions.",
		github_stats: {
			commits: 650,
			languages: ["TypeScript", "Go"],
		},
	},
	{
		title: "Aquawallet",
		description: "Vertical fintech product providing wallets and cash flow support for aquaculture businesses.",
		link: "aquawallet-coral.vercel.app",
		category: "Intelligence Bridge",
		challenge: "Niche industries like aquaculture face liquidity gaps because generic banking tools do not reflect their operating cycles.",
		architecture: "Uses vertical-specific wallet flows and credit signals based on supply chain behavior instead of generic consumer assumptions.",
		proposal: "Best for financial products serving industries with unusual cash cycles or operating constraints.",
		github_stats: {
			commits: 190,
			languages: ["TypeScript", "React", "Node.js"],
		}
	},
	{
		title: "Algorise",
		description: "Learning product for daily algorithm practice and technical skill retention.",
		link: "algorise-dyrane.vercel.app",
		category: "Intelligence Bridge",
		challenge: "Engineering teams lose sharpness when practice is inconsistent and reinforcement is left to chance.",
		architecture: "Uses adaptive challenge difficulty and lightweight daily loops to keep practice consistent without adding heavy overhead.",
		proposal: "Best for teams that want a structured, repeatable way to maintain technical sharpness.",
		github_stats: {
			commits: 440,
			languages: ["TypeScript", "Python"],
		}
	},
	{
		title: "iVisit Music (DyraneTop40)",
		description: "Curated music platform combining editorial selection with recommendation logic.",
		link: "music.ivisit.ng",
		category: "Intelligence Bridge",
		challenge: "Recommendation products often feel generic when algorithmic ranking overwhelms editorial taste.",
		architecture: "Blends recommendation logic with editorial weighting so discovery feels personal instead of purely automated.",
		proposal: "Best for brands that want a content experience with more voice and less algorithmic sameness.",
		github_stats: {
			commits: 210,
			languages: ["TypeScript", "Next.js"],
		},
	},

	// --- Modernized UX ---
	{
		title: "Scholarix",
		description: "Learning platform focused on faster access, clearer navigation, and better student focus.",
		link: "scholarix.fun",
		category: "Modernized UX",
		challenge: "Students drop off when learning tools are slow, cluttered, or built more for administration than use.",
		architecture: "Uses lightweight access, clearer learning flow, and a fast interface so students get to content with less friction.",
		proposal: "Best for education products that need stronger retention and a clearer product experience.",
		github_stats: {
			commits: 890,
			languages: ["TypeScript", "React", "Tailwind"],
			stars: 88,
		},
	},
	{
		title: "smartEdu",
		description: "Learning platform for courses, discussion, and community participation.",
		link: "smartedu-v1.vercel.app",
		category: "Modernized UX",
		challenge: "Many LMS products feel rigid and administrative, which weakens engagement and peer interaction.",
		architecture: "Combines course flow, discussion, and peer feedback so learning feels more active and less isolated.",
		proposal: "Best for learning products that need stronger community participation and course completion support.",
		github_stats: {
			commits: 310,
			languages: ["TypeScript", "React"],
		}
	},
	{
		title: "Plated.",
		description: "Catering booking experience that lets clients configure menus and pricing online.",
		link: "platedca.vercel.app",
		category: "Modernized UX",
		challenge: "High-touch event booking usually depends on back-and-forth emails, which slows down conversion.",
		architecture: "Turns menu selection, pricing, and dietary constraints into a guided configuration flow.",
		proposal: "Best for service businesses that want to reduce manual quoting and speed up buying decisions.",
		github_stats: {
			commits: 150,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "MedChart",
		description: "Clinical dashboard for vitals, medication, and patient status.",
		link: "medchartv1.vercel.app",
		category: "Modernized UX",
		challenge: "Dense EHR interfaces create cognitive load and slow down care decisions.",
		architecture: "Prioritizes critical patient information first and moves secondary detail behind progressive disclosure.",
		proposal: "Best for healthcare tools that need cleaner monitoring and lower cognitive load.",
		github_stats: {
			commits: 410,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "Kindbody",
		description: "Concept redesign for a healthcare landing page built around trust and reassurance.",
		link: "kindbody.vercel.app",
		category: "Modernized UX",
		challenge: "Healthcare landing pages often look generic or overly corporate, which weakens trust.",
		architecture: "Uses warmer visuals, softer typography, and calmer interaction patterns to make the experience feel more human.",
		proposal: "Best for health brands that need a more credible and approachable first impression.",
		github_stats: {
			commits: 55,
			languages: ["TypeScript", "React", "Framer Motion"],
		}
	},
	{
		title: "Reflectify",
		description: "Journaling app designed for focus and fast capture.",
		link: "myreflectify.vercel.app",
		category: "Modernized UX",
		challenge: "Too many journaling apps interrupt the writing moment with features and chrome.",
		architecture: "Local-first storage and simple writing surfaces keep typing fast and distractions low.",
		proposal: "Best for products that win by reducing friction and getting out of the user's way.",
		github_stats: {
			commits: 180,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "ableGod.",
		description: "Community platform for faith-based content, events, and group interaction.",
		link: "chistanwrites.blog",
		category: "Modernized UX",
		challenge: "Many faith communities have broadcast tools but weak support for ongoing participation and connection.",
		architecture: "Brings publishing, events, and discussion into one product so community activity is easier to sustain.",
		proposal: "Best for organizations that need a stronger digital home for ongoing participation.",
		github_stats: {
			commits: 105,
			languages: ["WordPress", "PHP", "React"],
		},
		showcase: [
			{
				id: "ablegod-stream",
				title: "Community Content Flow",
				description: "A browsing and reading experience designed to keep content, events, and community actions easy to reach.",
				desktopImage: {
					light: "/showcase/ablegod-desktop-light.png",
					dark: "/showcase/ablegod-desktop-dark.png"
				},
				mobileImage: {
					light: "/showcase/ablegod-mobile-light.png",
					dark: "/showcase/ablegod-mobile-dark.png"
				},
				layout: "single",
				features: [
					{ icon: "Navigation", label: "Responsive navigation", detail: "Content stays easy to reach across screen sizes." },
					{ icon: "Activity", label: "Continuous browsing", detail: "Reading, events, and participation stay connected." },
					{ icon: "Zap", label: "Offline-ready shell", detail: "PWA foundation keeps the experience lightweight and resilient." }
				]
			}
		],
	},
	{
		title: "Adeleke Immigration",
		description: "Immigration services website that turns complex legal paths into clear next steps.",
		link: "adelekeimmigration.com",
		category: "Modernized UX",
		challenge: "Immigration services are complex and high-stakes, so users need immediate clarity and trust signals.",
		architecture: "Uses trust-led information architecture, plain-language pathways, and guided intake to reduce confusion.",
		proposal: "Best for professional services firms that need more trust and a smoother intake path.",
		github_stats: {
			commits: 45,
			languages: ["React", "TypeScript"],
		}
	},
	{
		title: "Aero",
		description: "Behavior-change product combining health tracking, incentives, and daily verification.",
		link: "aero.dyrane.tech",
		category: "Intelligence Bridge",
		challenge: "Smoking cessation products often feel generic or punitive, which hurts sustained engagement.",
		architecture: "Combines sensor-based verification, progress scoring, and rewards so daily behavior change feels measurable and motivating.",
		proposal: "Best for wellness products that need stronger daily adherence and clearer progress loops.",
		github_stats: {
			commits: 17,
			languages: ["TypeScript", "Next.js", "Supabase", "Framer Motion"],
		},
		showcase: [
			{
				id: "aero-app",
				title: "Behavior and Reward Dashboard",
				description: "A mobile experience built around verification, progress, and financial incentives.",
				mobileImage: {
					light: "/showcase/aero-score-light.png",
					dark: "/showcase/aero-score-dark.png"
				},
				secondaryMobileImage: {
					light: "/showcase/aero-balance-light.png",
					dark: "/showcase/aero-balance-dark.png"
				},
				layout: "dual-mobile",
				features: [
					{ icon: "Activity", label: "Health scoring", detail: "Daily progress is visible and easy to read." },
					{ icon: "Shield", label: "Reward balance", detail: "Incentives stay visible instead of hidden in the system." },
					{ icon: "Zap", label: "Dual-screen flow", detail: "Two connected views support verification and progress tracking." }
				]
			}
		],
	},
	{
		title: "BoxDrop",
		description: "Logistics marketplace with live courier tracking for customers, vendors, and dispatchers.",
		link: "boxdrop.dyrane.tech",
		category: "Logistics Engine",
		challenge: "Delivery marketplaces often feel opaque, which drives support tickets and low trust.",
		architecture: "Combines live location tracking, multi-sided workflows, and marketplace state management in one delivery platform.",
		proposal: "Best for delivery products that need clearer fulfillment status and less support friction.",
		github_stats: {
			commits: 42,
			languages: ["TypeScript", "Next.js", "Supabase", "Mapbox"],
		},
	},
	{
		title: "House of Prax",
		description: "E-commerce storefront for plant-based performance nutrition.",
		link: "houseofprax.shop",
		category: "Modernized UX",
		challenge: "Supplement brands struggle to feel differentiated and trustworthy in a crowded market.",
		architecture: "Pairs strong product storytelling with a fast storefront, clear merchandising, and performance-aware build decisions.",
		proposal: "Best for consumer brands that need stronger positioning and a cleaner path to purchase.",
		github_stats: {
			commits: 95,
			languages: ["TypeScript", "Next.js", "Tailwind", "Framer Motion"],
		},
		caseStudy: {
			role: "Brand positioning, storefront UX, and frontend implementation",
			users: "High-intent wellness buyers comparing products in a crowded category",
			surfaces: "Landing page storytelling, merchandising flow, and mobile storefront",
			constraints: [
				"A crowded supplement market makes trust and differentiation harder to earn",
				"Premium positioning breaks quickly if the storefront feels generic",
				"Mobile shoppers need product clarity without a long learning curve"
			],
			decisions: [
				{
					title: "Product-first storytelling",
					detail: "The page leads with what the product is, why it matters, and what makes it credible before pushing hard on conversion."
				},
				{
					title: "Merchandising with restraint",
					detail: "The interface uses contrast, spacing, and pacing to create confidence without turning the storefront into visual noise."
				},
				{
					title: "Performance-aware polish",
					detail: "Motion and presentation are used to support the brand while keeping the buying flow responsive."
				}
			],
			proofPoints: [
				"Live storefront with responsive product and landing flows",
				"95 commits across the presentation and commerce experience",
				"Desktop and mobile surfaces kept consistent throughout the brand story"
			],
			outcomes: [
				{
					label: "Status",
					value: "Live",
					detail: "Shipped as a working storefront rather than a visual mockup."
				},
				{
					label: "Positioning",
					value: "Clearer product story",
					detail: "The site makes quality and intent visible earlier in the journey."
				},
				{
					label: "Buying flow",
					value: "Cleaner",
					detail: "The path from brand impression to product decision is more direct."
				}
			]
		},
		showcase: [
			{
				id: "hop-storefront",
				title: "Storefront Conversion System",
				description: "A commerce experience built to sell product quality, trust, and intent without extra noise.",
				desktopImage: {
					light: "/showcase/hop-desktop-light.png",
					dark: "/showcase/hop-desktop-dark.png"
				},
				mobileImage: {
					light: "/showcase/hop-mobile-light.png",
					dark: "/showcase/hop-mobile-dark.png"
				},
				layout: "single",
				features: [
					{ icon: "Activity", label: "Merchandising flow", detail: "Key product information stays visible through the buying journey." },
					{ icon: "Layers", label: "Product storytelling", detail: "The page explains why the product matters before it asks for the sale." },
					{ icon: "Zap", label: "Responsive storefront", detail: "Performance and presentation stay intact across devices." }
				]
			}
		],
	},
	{
		title: "Fytbite",
		description: "Nutrition product that helps users match meals to performance goals.",
		link: "fytbite.ng",
		category: "Modernized UX",
		challenge: "Users struggle to translate nutrition data into simple daily decisions.",
		architecture: "Turns meal data and macro targets into a clearer progress-driven interface.",
		proposal: "Best for wellness products that need to make heavy data easier to act on.",
		github_stats: {
			commits: 130,
			languages: ["TypeScript", "React"],
		}
	},
];
