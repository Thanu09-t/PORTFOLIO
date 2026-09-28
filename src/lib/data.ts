export const SKILLS = [
  "PYTHON", "SQL", "MACHINE LEARNING", "DEEP LEARNING", "TENSORFLOW", "PYTORCH",
  "SCIKIT-LEARN", "NLP", "GENERATIVE AI", "CNN", "POWER BI", "DAX",
  "FLUTTER", "KOTLIN", "FIREBASE", "GIT", "GITHUB", "JUPYTER", "VS CODE",
] as const;

export type Project = {
  cat: string;
  title: string;
  desc: string;
  stack: string[];
  link: string;
  image?: string;
  placeholder?: boolean;
};

export const PROJECTS: Project[] = [
  {
    cat: "MEDICAL AI / DEEP LEARNING",
    title: "Low-Cost OA Assessment",
    desc: "A CNN-based osteoarthritis screening pipeline built on knee acoustic signals and patient-reported measures — designed to run on low-cost hardware in resource-constrained clinics.",
    stack: ["Python", "CNN", "Deep Learning"],
    link: "https://github.com/Thanu09-t/Low-Cost-OA-Assessment-CNN-Based-Integration-of-Knee-Sounds-and-Patient-Reported-Measures",
    image: "/projects/oa-assessment.jpg",
  },
  {
    cat: "GENERATIVE AI / NLP",
    title: "Lumina AI — Interview Copilot",
    desc: "An interview-preparation platform with mock interviews, resume analysis and context-aware feedback, plus a progress dashboard that tracks improvement across sessions.",
    stack: ["Generative AI", "NLP", "React", "Python"],
    link: "https://github.com/Thanu09-t/Lumina-AI-Interview-Prep-Copilot",
    image: "/projects/lumina-ai.jpg",
  },
  {
    cat: "SMART CITY / COMPUTER VISION",
    title: "EcoVision Intelligence Platform",
    desc: "A production-style smart-city system combining deep learning, computer vision, GIS mapping and route optimization for waste management and environmental monitoring, fully containerized for municipal deployment.",
    stack: ["Docker", "Node.js", "Python", "GIS"],
    link: "https://github.com/Thanu09-t/EcoVision-Intelligence-Platform",
    image: "/projects/ecovision.jpg",
  },
  {
    cat: "MEDIA FORENSICS",
    title: "DeepGuard — Deepfake Detection",
    desc: "A media-forensics platform that flags deepfakes and generative-AI edits in images and video using error-level analysis and DCT frequency analysis, with a real-time visualization layer.",
    stack: ["Python", "ELA", "DCT", "MediaPipe"],
    link: "https://github.com/Thanu09-t/DeepGuard-an-AI-powered-deepfake-detection-platform",
    image: "/projects/deepguard.jpg",
  },
  {
    cat: "MOBILITY / COMPUTER VISION",
    title: "AutoTrust — Pre-Owned Car Intelligence",
    desc: "An intelligent vehicle appraisal and inspection system using multi-angle computer vision, damage classification, and valuation modeling for pre-owned automotive fleets.",
    stack: ["Python", "YOLO", "Computer Vision", "PyTorch"],
    link: "https://github.com/Thanu09-t/AutoTrust-Car-Resale",
    image: "/projects/autotrust.jpg",
  },
];

export type ExperienceItem = { year: string; title: string; body: string; link?: string };

export const EXPERIENCE: ExperienceItem[] = [
  { year: "2026", title: "Android Development using Generative AI — Intern", body: "Built Android applications integrating generative-AI features with Kotlin and Android Studio, collaborating on app flows, testing, and deployment.", link: "/certificates/mindmatrix-internship-completion-letter.pdf" },
  { year: "2025", title: "Artificial Intelligence & Machine Learning — Intern", body: "30-day virtual internship contributing to model development and evaluation — preprocessing datasets, training models in Python, TensorFlow and Scikit-learn, and presenting results to mentors.", link: "/certificates/kodacy-aiml-internship.pdf" },
  { year: "2025", title: "TCS iON Career Edge — Young Professional", body: "Foundation program in corporate etiquette, communication, soft skills, and workplace readiness.", link: "/certificates/tcs-ion-career-edge.pdf" },
  { year: "2025", title: "Certificate of Internship — AI/ML, Kodacy × SPACE", body: "Completed applied AI/ML internship certification in association with SPACE.", link: "/certificates/kodacy-aiml-internship.pdf" },
];

export type Certification = {
  id: string;
  title: string;
  subtitle?: string;
  issuer: string;
  date: string;
  credentialId?: string;
  pdfUrl: string;
  verifyUrl?: string;
  image: string;
  description: string;
  tags: string[];
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: "aws-prompt-eng",
    title: "Foundations of Prompt Engineering",
    subtitle: "AWS Training & Certification Completion Certificate",
    issuer: "Amazon Web Services (AWS)",
    date: "July 24, 2026",
    pdfUrl: "/certificates/aws-foundations-prompt-engineering.pdf",
    image: "/certificates/aws-foundations-prompt-engineering.png",
    description: "Official AWS Training & Certification completion validating proficiency in prompt engineering principles, generative AI context grounding, few-shot conditioning, and LLM steering.",
    tags: ["AWS", "Prompt Engineering", "Generative AI", "LLMs"],
  },
  {
    id: "chaicode-genai-python",
    title: "Certificate of Completion — GenAI with Python v2",
    subtitle: "Comprehensive 40+ Hour Applied AI Program",
    issuer: "ChaiCode (Instructors: Piyush Garg & Hitesh Choudhary)",
    date: "2025",
    credentialId: "122158092324791710249857",
    pdfUrl: "/certificates/chaicode-genai-python.pdf",
    verifyUrl: "https://courses.chaicode.com/learn/certificate/12215809-232479",
    image: "/certificates/chaicode-genai-python.png",
    description: "Completed comprehensive 40+ hour intensive curriculum mastering Generative AI pipelines, LangChain, agentic patterns, API integration, and Python-driven LLM applications.",
    tags: ["GenAI", "Python v2", "LangChain", "AI Agents", "40+ Hours"],
  },
  {
    id: "skilldunia-career-guidance",
    title: "Certificate of Participation — Career Guidance Webinar",
    subtitle: "E-Cell IIT Hyderabad & Skilldunia Edutech",
    issuer: "Skilldunia Edutech × E-Cell IIT Hyderabad",
    date: "September 20, 2025",
    pdfUrl: "/certificates/skilldunia-career-guidance.pdf",
    image: "/certificates/skilldunia-career-guidance.png",
    description: "Active participation in the interactive webinar exploring pivotal technical industry trends, career roadmaps in emerging technologies, and entrepreneurial insights.",
    tags: ["E-Cell IIT Hyderabad", "Skilldunia", "Career Guidance", "Webinar"],
  },
];

export const EDUCATION = {
  degree: "B.E. — Artificial Intelligence & Machine Learning",
  school: "Bangalore Technological Institute, Bangalore, India",
  years: "2022 — 2026",
  cgpa: 9.01,
};

export const CONTACT = {
  email: "thanushreesthanushress212@gmail.com",
  linkedin: "https://www.linkedin.com/in/thanushree-s-30392736a",
  github: "https://github.com/Thanu09-t",
};
