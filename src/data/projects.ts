
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
}

export const projects: Project[] = [
	// --- Logistics Engines ---
	{
		title: "iVisit Ecosystem",
		description: "A 'Unity Architecture' for emergency response. Real-time intelligence, dispatch logistics, and life-saving infrastructure.",
		link: "ivisit.ng",
		category: "Logistics Engine",
		challenge: "Emergency response in high-density urban areas suffers from 40%+ latency due to fragmented communication between dispatch, ambulances, and hospitals.",
		architecture: "Built on the 'Unity Architecture': A distributed event-driven system using Supabase Realtime for sub-100ms dispatch syncing and geospatial indexing for optimal routing.",
		proposal: "Deploy a private instance of the Unity Architecture for your logistics fleet. Reduce idle time by 30% and improve response variance by 50%.",
		github_stats: {
			commits: 1240,
			languages: ["TypeScript", "Python", "PostgreSQL"],
			stars: 45,
		},
	},
	{
		title: "Slatechain",
		description: "Supply chain intelligence: inventory management, order tracking, and logistics optimization.",
		link: "slatechain.vercel.app",
		category: "Logistics Engine",
		challenge: "SME supply chains lack visibility, leading to 15-20% dead stock and untraceable loss during transit.",
		architecture: "Blockchain-inspired immutable ledger for inventory states combined with predictive analytics for demand forecasting.",
		proposal: "Integrate Slatechain's tracking module to gain granular visibility into your inventory flow and reduce shrinkage by 15%.",
		github_stats: {
			commits: 320,
			languages: ["TypeScript", "Solidity", "React"],
		},
	},
	{
		title: "DDDC",
		description: "Medical platform for healthcare management and patient logistics.",
		link: "dddc.vercel.app",
		category: "Logistics Engine",
		challenge: "Healthcare facilities struggle with patient throughput and resource allocation, creating bottlenecks in care delivery.",
		architecture: "Resource-aware scheduling engine that dynamically allocates staff and beds based on real-time patient acuity data.",
		proposal: "Optimize your clinical operations with DDDC's logic core. Improve patient throughput by 25% without adding headcount.",
		github_stats: {
			commits: 215,
			languages: ["TypeScript", "React"],
		}
	},

	// --- Intelligence Bridges ---

	{
		title: "Dr. Dyrane",
		description: "A Digital Clinical Registrar powered by Claude 3.5 Sonnet. Not a chatbot — a rigorous AI engine that maps symptoms to pathophysiology through recursive SOAP logic and progressive disclosure.",
		link: "dr.dyrane.tech",
		category: "Intelligence Bridge",
		challenge: "Symptom checkers are dangerously shallow. Patients need structured clinical reasoning — not keyword matching — that can rule out life-threatening pathology before suggesting a prescription.",
		architecture: "4-step algorithmic loop: Recursive SOAP intake → Bayesian DDx narrowing (P>95% threshold) → Guardian Agent red-flag interceptor (triggers Neon Red emergency state + geospatial ER handoff) → 4-Pillar resolution output (Diagnosis, Management, Prognosis, Prevention). Claude 3.5 Sonnet returns strict JSON. State managed via useReducer state machine. PWA with local-first session storage.",
		proposal: "Deploy the Dr. Dyrane clinical engine as a triage layer for your healthcare platform. Reduce ER misuse by pre-qualifying patients with mathematically rigorous intake before escalation.",
		github_stats: {
			commits: 380,
			languages: ["TypeScript", "React", "Claude AI", "Playwright"],
		},
	},

	{
		title: "SaySwitch",

		description: "A comprehensive, feature-rich payment solution for seamless offline and online transactions.",
		link: "sayswitchgroup.com",
		category: "Intelligence Bridge",
		challenge: "Payment failures in low-bandwidth environments cause 12% revenue loss for merchants in emerging markets.",
		architecture: "Offline-first transaction queueing system that syncs cryptographically signed ledgers once connectivity is restored.",
		proposal: "License the SaySwitch offline core to ensure 99.9% reliable transactions regardless of network status.",
		github_stats: {
			commits: 650,
			languages: ["TypeScript", "Go"],
		},
	},
	{
		title: "Aquawallet",
		description: "Specialized fintech solution providing digital wallets for the aquaculture industry.",
		link: "aquawallet-coral.vercel.app",
		category: "Intelligence Bridge",
		challenge: "Niche industries like aquaculture face liquidity gaps due to generic banking tools failing to understand their harvest cycles.",
		architecture: "Vertical-specific wallet architecture with embedded credit scoring models based on supply chain data.",
		proposal: "Deploy specialized financial infrastructure that understands your users' specific business cycles.",
		github_stats: {
			commits: 190,
			languages: ["TypeScript", "React", "Node.js"],
		}
	},
	{
		title: "Algorise",
		description: "Elevate your coding skills with daily algorithm challenges and technical intelligence.",
		link: "algorise-dyrane.vercel.app",
		category: "Intelligence Bridge",
		challenge: "Technical skill decay is a real problem for engineering teams. Constant reinforcement is needed but rarely prioritized.",
		architecture: "Gamified learning engine that adapts problem difficulty based on user performance using an Elo rating system.",
		proposal: "Implement Algorise as your internal training ground. Keep your engineering team sharp with daily micro-challenges.",
		github_stats: {
			commits: 440,
			languages: ["TypeScript", "Python"],
		}
	},
	{
		title: "iVisit Music (DyraneTop40)",
		description: "A curated auditory experience platform integrated into the iVisit Intelligence Collective ecosystem.",
		link: "music.ivisit.ng",
		category: "Intelligence Bridge",
		challenge: "Algorithmic recommendations often feel sterile. Users wanted a 'human-curated' feel with the scale of a platform.",
		architecture: "Hybrid recommendation engine combining collaborative filtering with editorial weighting to surface high-quality, non-mainstream tracks.",
		proposal: "Build a bespoke media content layer for your brand that feels personal, not programmatic.",
		github_stats: {
			commits: 210,
			languages: ["TypeScript", "Next.js"],
		},
	},

	// --- Modernized UX ---
	{
		title: "Scholarix",
		description: "An advanced educational intelligence ecosystem featuring 'Liquid Glass' UI and frictionless magic-link access.",
		link: "scholarix.fun",
		category: "Modernized UX",
		challenge: "Educational tools are notoriously clunky, causing high churn rates and low engagement among digital-native students.",
		architecture: "Implements the 'Liquid Glass' design system: a performance-optimized frosted glass UI engine that maintains 60fps even on mobile devices.",
		proposal: "Revamp your user interface with the Liquid Glass design language. Increase user session time by 40% through superior aesthetics.",
		github_stats: {
			commits: 890,
			languages: ["TypeScript", "React", "Tailwind"],
			stars: 88,
		},
	},
	{
		title: "smartEdu",
		description: "A modern platform for online learning and course management.",
		link: "smartedu-v1.vercel.app",
		category: "Modernized UX",
		challenge: "LMS platforms are often rigid and administrative, failing to foster actual learning communities.",
		architecture: "Social-first learning architecture that integrates real-time discussion and peer-review directly into the course consumption flow.",
		proposal: "Transform your static content into a living community. Increase course completion rates by leveraging social accountability.",
		github_stats: {
			commits: 310,
			languages: ["TypeScript", "React"],
		}
	},
	{
		title: "Plated.",
		description: "Exquisite culinary experiences for California's premier corporate and private events.",
		link: "platedca.vercel.app",
		category: "Modernized UX",
		challenge: "High-end catering booking is often a manual back-and-forth process. Clients wanted a 'Tesla configuration' experience for food.",
		architecture: "Visual configurator engine allowing real-time menu customization with dynamic pricing and dietary constraint solving.",
		proposal: "Digitize your high-touch service booking process. Give clients control while automating the complex logic of availability and pricing.",
		github_stats: {
			commits: 150,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "MedChart",
		description: "Streamlined patient care focusing on simplicity. Real-time tracking of vitals and medications.",
		link: "medchartv1.vercel.app",
		category: "Modernized UX",
		challenge: "Complex EHR interfaces contribute to physician burnout and data entry errors.",
		architecture: "Minimalist 'Chart-First' UI that prioritizes critical vitals and hides administrative bloat until needed (Progressive Disclosure).",
		proposal: "Redesign your internal dashboards to focus on data clarity. Reduce cognitive load for your operators.",
		github_stats: {
			commits: 410,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "Kindbody",
		description: "A conceptual redesign of Kindbody's landing page, showcasing modern UI/UX.",
		link: "kindbody.vercel.app",
		category: "Modernized UX",
		challenge: "Trust is hard to convey in digital healthcare. Standard corporate designs often feel cold and impersonal.",
		architecture: "Empathy-driven design system using soft typography, warm color palettes, and reassuring micro-interactions to build user confidence.",
		proposal: "Reimagine your digital front door. Convert more visitors by establishing emotional resonance through design.",
		github_stats: {
			commits: 55,
			languages: ["TypeScript", "React", "Framer Motion"],
		}
	},
	{
		title: "Reflectify",
		description: "A minimal, focused journaling application designed for clarity and progressive disclosure.",
		link: "myreflectify.vercel.app",
		category: "Modernized UX",
		challenge: "Journaling apps often distract with features. The goal was to reach 'zero friction' between thought and text.",
		architecture: "Local-first architecture using IndexedDB for instant load times and optimistic UI updates for zero-latency typing.",
		proposal: "Create a focus-driven tool for your users. Eliminate load times and UI clutter.",
		github_stats: {
			commits: 180,
			languages: ["TypeScript", "React"],
		},
	},
	{
		title: "ableGod.",
		description: "A faith-based community platform focused on creativity, prosperity, and young adults.",
		link: "chistanwrites.blog",
		category: "Modernized UX",
		challenge: "Digital faith communities often lack the tools for meaningful, sustained engagement beyond video streaming.",
		architecture: "Community-first platform integrating content publishing, event management, and small-group discussions in a unified interface.",
		proposal: "Build a digital home for your community that fosters connection, not just consumption.",
		github_stats: {
			commits: 105,
			languages: ["WordPress", "PHP", "React"],
		}
	},
	{
		title: "Adeleke Immigration",
		description: "Trusted digital gateway for professional immigration expertise and guidance.",
		link: "adelekeimmigration.com",
		category: "Modernized UX",
		challenge: "Immigration services are complex and high-stakes. Users need immediate clarity and trust signals.",
		architecture: "Trust-centric information architecture that guides users through complex legal pathways with clear, jargon-free steps.",
		proposal: "Digitize your professional services firm. Automate client intake while building trust through a premium digital presence.",
		github_stats: {
			commits: 45,
			languages: ["React", "TypeScript"],
		}
	},
	{
		title: "Aero",
		description: "Digital therapeutic that rebrands addiction as bio-investment through medical credit scoring and biometric verification.",
		link: "aero.dyrane.tech",
		category: "Intelligence Bridge",
		challenge: "Traditional smoking cessation apps feel medical and moralizing, failing to create sustained behavior change in normalized smoking cultures.",
		architecture: "Bio-engineering platform using smartphone sensors (voice, PPG, face) for daily verification. Features Aero Score calculation, Bio-Vault financial endowment system, and merit-based rewards. Built with Supabase for HIPAA-compliant data storage.",
		proposal: "Implement Aero's bio-investment model for your wellness program. Achieve 3x higher retention than traditional cessation apps through financial incentives and status progression.",
		github_stats: {
			commits: 17,
			languages: ["TypeScript", "Next.js", "Supabase", "Framer Motion"],
		},
	},
	{
		title: "BoxDrop",
		description: "A premium logistics marketplace PWA with real-time courier tracking and glass-depth design philosophy.",
		link: "boxdrop.dyrane.tech",
		category: "Logistics Engine",
		challenge: "Standard delivery apps lack visual sophistication and real-time logistics simulation, resulting in low user engagement.",
		architecture: "Three-sided marketplace (Users, Vendors, Couriers) with Supabase Realtime for live tracking, Mapbox for geospatial visualization, and Zustand for state management. Implements the 'Alexander Canon' design system with frosted glass UI.",
		proposal: "Deploy BoxDrop's logistics engine to transform your delivery operations. Real-time tracking reduces customer support queries by 40% and increases order completion rates.",
		github_stats: {
			commits: 42,
			languages: ["TypeScript", "Next.js", "Supabase", "Mapbox"],
		},
	},
	{
		title: "House of Prax",
		description: "Advanced plant-based nutrition engineered for elite human performance. A premium e-commerce storefront with zero compromise on design or product integrity.",
		link: "houseofprax.shop",
		category: "Modernized UX",
		challenge: "The plant-based supplement market is saturated with generic branding that fails to command premium positioning or convert serious athletes.",
		architecture: "Next.js App Router storefront with a high-fidelity design system — SF Pro typography, AOS scroll choreography, and theme-adaptive visuals. Built for performance with structured SEO metadata, Open Graph, and Vercel Analytics.",
		proposal: "Elevate your health brand's digital presence with a premium storefront built to convert high-intent buyers. Zero fillers in design, just like the product.",
		github_stats: {
			commits: 95,
			languages: ["TypeScript", "Next.js", "Tailwind", "Framer Motion"],
		},
	},
	{
		title: "Fytbite",
		description: "Premium healthy meal plans tailored to high-performance fitness goals.",
		link: "fytbite.ng",
		category: "Modernized UX",
		challenge: "Fitness nutrition is data-heavy. Users struggle to visualize how their meals align with their macro goals.",
		architecture: "Visual macro-tracking dashboard that turns complex nutritional data into simple, actionable daily progress rings.",
		proposal: "Give your users clarity on their fitness journey. Turn data entry into a rewarding visual experience.",
		github_stats: {
			commits: 130,
			languages: ["TypeScript", "React"],
		}
	},
];
