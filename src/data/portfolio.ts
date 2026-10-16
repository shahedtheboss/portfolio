/**
 * Centralized portfolio content.
 * EDIT ME: replace placeholder links (marked TODO) with real URLs.
 * Nothing here should claim unverified achievements — keep statuses honest.
 */

export const identity = {
  name: "Md. Shahdath Hussain",
  monogram: "MSH",
  eyebrow: "WEB DEVELOPER · EEE STUDENT · AI & ROBOTICS",
  headlineA: "Driven by Curiosity,",
  headlineB: "Building Intelligent Systems",
  tagline:
    "EEE Undergraduate at CUET | Web Developer with 6 Years of Experience | AI, Robotics & Reinforcement Learning",
  intro:
    "I'm an Electrical and Electronic Engineering student at CUET with approximately six years of experience in web development. Having spent years building for the web, I'm now expanding into artificial intelligence, reinforcement learning, robotics, and intelligent control systems — combining software development with engineering fundamentals to build systems that solve meaningful real-world problems.",
  status: "Currently exploring: Reinforcement Learning, Robotics, Deep Learning & Embedded Systems",
  email: "shahedshahadat0123@gmail.com",
  github: "https://github.com/shahedtheboss",
  linkedin: "https://www.linkedin.com/in/shahadat-hussain-shahed/",
  youtube: "https://www.youtube.com/@shahedtheboss",
};

export const identityCard = [
  { label: "Degree", value: "Electrical & Electronic Engineering" },
  { label: "Institution", value: "Chittagong University of Engineering and Technology, Bangladesh" },
  { label: "Experience", value: "Web Dev, ML, RL, Embedded Systems, Electronics" },
  { label: "Focus", value: "AI, Robotics & Intelligent Control" },
];

export const aboutThemes = [
  {
    title: "Web Development",
    body: "Approximately six years of building for the web — websites, applications, and practical software problems solved end to end.",
  },
  {
    title: "Engineering Foundations",
    body: "Electrical and electronic engineering fundamentals: control systems, automation, and the physical principles behind engineered systems.",
  },
  {
    title: "Intelligent Systems",
    body: "Machine learning, neural networks, reinforcement learning, robotics, and autonomous decision-making.",
  },
  {
    title: "Research Mindset",
    body: "Studying research papers, reproducing existing approaches, testing hypotheses, and gradually developing independent research questions.",
  },
];

export const researchInterests = [
  {
    key: "A",
    title: "Reinforcement Learning & Autonomous Robotics",
    body: "How agents learn effective behavior through interaction with their environments.",
    topics: [
      "Deep Q-Networks (DQN)",
      "Policy optimization & actor-critic methods",
      "Reward design & exploration strategies",
      "Autonomous navigation & obstacle avoidance",
      "Learning-based control",
    ],
  },
  {
    key: "B",
    title: "Intelligent Control Systems",
    body: "How machine learning can complement classical control theory and engineering knowledge.",
    topics: [
      "Learning-based control",
      "Adaptive & intelligent control",
      "Optimization of control decisions",
      "Model-based + learning-based hybrids",
    ],
  },
  {
    key: "C",
    title: "Computer Vision & Industrial AI",
    body: "Machine learning and visual perception applied to engineering and manufacturing problems.",
    topics: [
      "Image classification & visual inspection",
      "Industrial defect detection",
      "Sensor-based decision-making",
      "AI-assisted quality control",
      "Vision + automation integration",
    ],
  },
  {
    key: "D",
    title: "AI-Driven Industrial Automation",
    body: "Intelligent software working with PLCs, sensors, actuators, and industrial processes.",
    topics: [
      "Vision-guided inspection & rejection",
      "PLC-based automation",
      "Embedded AI systems",
      "Intelligent monitoring & control",
    ],
  },
];

export type SkillGroup = {
  title: string;
  level: "Currently Practicing" | "Working Knowledge" | "Engineering Foundations";
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Web Development & Software Engineering",
    level: "Currently Practicing",
    skills: [
      "HTML, CSS & JavaScript",
      "Frontend development",
      "Responsive web design",
      "API integration",
      "Deployment & hosting",
      "Debugging & maintenance workflows",
      "Git & GitHub",
    ],
  },
  {
    title: "Machine Learning & Deep Learning",
    level: "Currently Practicing",
    skills: [
      "PyTorch",
      "Neural network fundamentals",
      "Supervised learning",
      "Tensor manipulation & model training",
      "Model evaluation & experimental analysis",
    ],
  },
  {
    title: "Reinforcement Learning",
    level: "Currently Practicing",
    skills: [
      "Q-learning fundamentals",
      "Deep Q-Networks (DQN)",
      "Bellman targets",
      "Experience replay",
      "Target networks",
      "Epsilon-greedy exploration",
    ],
  },
  {
    title: "Programming & Development",
    level: "Working Knowledge",
    skills: ["Python", "OOP fundamentals", "C/C++ basics", "Linux & Ubuntu", "Git & GitHub"],
  },
  {
    title: "Robotics & Simulation",
    level: "Working Knowledge",
    skills: [
      "ROS 2 fundamentals",
      "Robot navigation concepts",
      "Gazebo simulation workflows",
      "Sensor-to-action pipelines",
      "Obstacle avoidance",
      "Raspberry Pi",
      "ESP32",
      "Arduino",
    ],
  },
  {
    title: "Electrical & Electronic Engineering",
    level: "Engineering Foundations",
    skills: [
      "Circuit analysis & network theorems",
      "Analog & digital electronics",
      "Electrical machines & transformers",
      "Power systems & power electronics",
      "Signals & systems",
      "Control systems",
      "Microprocessors & microcontrollers",
      "Measurement & instrumentation",
      "Digital logic design",
    ],
  },
  {
    title: "Industrial Automation",
    level: "Engineering Foundations",
    skills: [
      "PLC programming",
      "Siemens TIA Portal",
      "Ladder logic",
      "HMI fundamentals",
      "Industrial sensors & automation",
      "Motor controls & drives",
      "SCADA & industrial communication",
    ],
  },
  {
    title: "Additional Tools",
    level: "Working Knowledge",
    skills: [
      "MATLAB/Simulink",
      "OpenCV & computer vision",
      "LaTeX & technical writing",
      "Circuit simulation",
      "Office software",
    ],
  },
];

export type Project = {
  title: string;
  category: "web" | "ai" | "robotics" | "embedded";
  categoryLabel: string;
  status: "Completed" | "In Progress" | "Planned";
  summary: string;
  details: string[];
  tech: string[];
  image: "robot" | "vision" | "automation" | "ml" | "web" | "rfid" | "chat" | "restaurant" | "oled";
  link?: string;
};

export const projectFilters = [
  { key: "all", label: "All Projects" },
  { key: "web", label: "Web Development" },
  { key: "embedded", label: "Embedded & IoT" },
  { key: "ai", label: "AI & Machine Learning" },
  { key: "robotics", label: "Robotics & Automation" },
] as const;

export const projects: Project[] = [
  {
    title: "AI-Assisted Industrial Bottle Inspection & Rejection",
    category: "robotics",
    categoryLabel: "Industrial Automation · Machine Vision · PLC",
    status: "Planned",
    summary:
      "Integrating visual inspection with an automated rejection mechanism — where electrical engineering, industrial automation, and AI meet.",
    details: [
      "Defect detection from images",
      "Communication between an AI-processing unit and a PLC",
      "Sensor-triggered inspection & conveyor control",
      "Automated rejection of defective products",
    ],
    tech: ["Raspberry Pi", "PLC", "Machine Vision", "Sensors & Actuators"],
    image: "automation",
  },
  {
    title: "DQN-Based Robot Navigation & Obstacle Avoidance",
    category: "robotics",
    categoryLabel: "Reinforcement Learning · Robotics · ROS 2",
    status: "In Progress",
    summary:
      "A robot navigation system where a deep reinforcement learning agent selects movement actions from environmental observations.",
    details: [
      "DQN-based action selection from sensor inputs",
      "Reward-function design for navigation & obstacle avoidance",
      "Experience replay and target networks",
      "ROS 2 communication and simulation integration",
    ],
    tech: ["Python", "PyTorch", "DQN", "ROS 2", "Gazebo"],
    image: "robot",
  },
  {
    title: "Real-Time RFID Access Logging System",
    category: "embedded",
    categoryLabel: "Embedded Systems · ESP32 · Next.js",
    status: "Completed",
    summary:
      "An RFID-based access logger: an ESP32 reads tags while a full-stack Next.js dashboard records and displays access events in real time.",
    details: [
      "RFID tag reading on an ESP32",
      "Real-time logging of access events",
      "Full-stack Next.js dashboard",
      "Embedded firmware meeting full-stack web development",
    ],
    tech: ["ESP32", "C++", "Next.js", "JavaScript"],
    image: "rfid",
    link: "https://github.com/shahedtheboss/Real-Time-RFID-Access-Logging-System-with-ESP32-Next.js-Full-Stack-Dashboard",
  },
  {
    title: "Next Restaurant App",
    category: "web",
    categoryLabel: "Web Development · Next.js · Full Stack",
    status: "Completed",
    summary:
      "A complete full-stack restaurant and food-ordering web application, from authentication and ordering through to deployment.",
    details: [
      "Next.js and React frontend",
      "Node.js backend with MongoDB",
      "User authentication and ordering flow",
      "Deployed on Vercel",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB", "Vercel"],
    image: "restaurant",
    link: "https://github.com/shahedtheboss/nextrestaurantapp",
  },
  {
    title: "Bistro92 — Smart Food Ordering System",
    category: "embedded",
    categoryLabel: "Embedded Systems · ESP32 · Firebase",
    status: "Completed",
    summary:
      "A smart food-ordering system built around an ESP32 with an OLED display and a Firebase backend.",
    details: [
      "ESP32 firmware written in C++",
      "OLED display for order feedback",
      "Firebase backend for order data",
      "Physical interface for placing orders",
    ],
    tech: ["ESP32", "C++", "OLED", "Firebase"],
    image: "oled",
    link: "https://github.com/shahedtheboss/bistro92",
  },
  {
    title: "Breast Cancer Classification Using PyTorch",
    category: "ai",
    categoryLabel: "Machine Learning · PyTorch · Model Evaluation",
    status: "Completed",
    summary:
      "An educational supervised-learning experiment on the scikit-learn breast cancer dataset — preprocessing, scaling, and training a neural-network classifier.",
    details: [
      "Feature preprocessing, splitting & scaling",
      "Neural network design with PyTorch",
      "Training loop with loss function & optimizer",
      "Model performance evaluation",
    ],
    tech: ["Python", "PyTorch", "scikit-learn", "NumPy"],
    image: "ml",
  },
  {
    title: "Smart Quality Inspector — Industrial Defect Detection",
    category: "ai",
    categoryLabel: "Computer Vision · PyTorch · Industrial AI",
    status: "Planned",
    summary:
      "A machine-learning system for identifying defective products and unusual visual patterns in industrial inspection scenarios.",
    details: [
      "Image preprocessing & CNN-based feature extraction",
      "Model training and evaluation",
      "Precision, recall, F1-score & confusion-matrix analysis",
      "A simple image-upload demo interface",
    ],
    tech: ["Python", "PyTorch", "CNN", "OpenCV"],
    image: "vision",
  },
  {
    title: "Covid Tracker",
    category: "web",
    categoryLabel: "Web Development · React · Live Data",
    status: "Completed",
    summary:
      "A worldwide and country-wise COVID-19 tracker app built with React, presenting live statistics that can be explored by country.",
    details: [
      "Live case-data fetching",
      "Worldwide and country-wise views",
      "React state and filtering",
      "Responsive data display",
    ],
    tech: ["React", "JavaScript", "CSS"],
    image: "web",
    link: "https://github.com/shahedtheboss/covidtracker",
  },
  {
    title: "WhatsApp Clone",
    category: "web",
    categoryLabel: "Web Development · React · Messaging",
    status: "Completed",
    summary:
      "A global messaging application built with React — Google authentication and a chat interface modelled on WhatsApp.",
    details: [
      "Google authentication",
      "Chat interface modelled on WhatsApp",
      "Conversation and message flow",
      "Responsive layout",
    ],
    tech: ["React", "JavaScript", "CSS"],
    image: "chat",
    link: "https://github.com/shahedtheboss/whatsapp-clone",
  },
];

export const experience = [
  {
    title: "Independent Web Development",
    period: "~6 Years",
    kind: "Development Experience",
    body: "A sustained technical background building websites and web applications — frontend and backend implementation, deployment, debugging, and maintenance across personal and collaborative projects.",
  },
  {
    title: "MERN Stack Mentorship",
    period: "2021 – 2023",
    kind: "Teaching Experience",
    body: "Tutored over thousands of students live in mastering MERN-stack web development at an educational platform.",
  },
  {
    title: "Freelancing",
    period: "4+ Years",
    kind: "Freelance Experience",
    body: "Worked as a full-stack web developer on Freelancer, Upwork and Fiverr for over four years, delivering client websites and web applications end to end.",
  },
  {
    title: "Industrial Automation Training",
    period: "Completed",
    kind: "Technical Training",
    body: "Hands-on training with Siemens TIA Portal, PLC programming and simulation, ladder logic, HMI systems, sensors and pneumatic systems, and conveyor automation — including a conveyor bottle-separation design exercise.",
  },
  {
    title: "Industrial Visits",
    period: "Completed",
    kind: "Industrial Exposure",
    body: "Observed AI-assisted bottle rejection, HMI and conveyor systems, servo motors and sensors, PLC-based industrial control, boiler and turbine protection concepts, and control-room workflows at manufacturing and power-generation facilities.",
  },
];

export type Certification = {
  key: "mlContest" | "industrialAutomation" | "sciblitz" | "mieRobolution" | "datathon";
  award: string;
  title: string;
  issuer: string;
  period?: string;
  body: string;
};

export const certifications: Certification[] = [
  {
    key: "mlContest",
    award: "1st Prize",
    title: "CUET ML Contest 2.0 — Beginner Track",
    issuer: "IEEE Computer Society CUET Student Branch Chapter",
    body: "Secured first prize in the Beginner Track of the CUET ML Contest 2.0, organized by the IEEE Computer Society CUET Student Branch Chapter.",
  },
  {
    key: "industrialAutomation",
    award: "Training Completion",
    title: "Industrial Automation Training",
    issuer: "IICT, CUET · EDGE Project, Bangladesh Computer Council (ICT Division)",
    period: "Apr – May 2026 · 80 hours",
    body: 'Completed the 80-hour "Industrial Automation" training under the Digital Skills 4 Students initiative, conducted by the Institute of Information and Communication Technology (IICT), CUET.',
  },
  {
    key: "sciblitz",
    award: "Certificate of Appreciation",
    title: "3 Minute Thesis (3MT) — SciBlitz 1.0",
    issuer: "IEEE CUET Student Branch",
    body: "Recognised for presenting scholarly work in the 3 Minute Thesis segment of SciBlitz 1.0, communicating research concisely and effectively.",
  },
  {
    key: "mieRobolution",
    award: "Certificate of Participation",
    title: "Techathon — MIE ROBOLUTION 1.0",
    issuer: "Department of Mechatronics & Industrial Engineering, CUET",
    period: "May 8 – 10, 2025",
    body: "Took part in the Techathon at MIE ROBOLUTION 1.0 as a member of team Quantum Flex.",
  },
  {
    key: "datathon",
    award: "Certificate of Participation",
    title: "Datathon — CUET CSE Fest 2025",
    issuer: "Department of CSE, CUET · Delineate",
    period: "2025",
    body: "Participated in the Datathon as a member of team Al-Wakeel, working on data analysis, problem-solving, and solution development.",
  },
];

export const journey = [
  { step: "01", title: "Start of Programming", body: "Started learning C programming in junior high in 2017.", ahead: false },
  { step: "02", title: "Web Development", body: "Began teaching myself web development in 2020, and have been building and learning with it ever since.", ahead: false },
  { step: "03", title: "Python & ML", body: "Picked up Python basics and machine-learning fundamentals in 2024.", ahead: false },
  { step: "04", title: "EEE Foundations", body: "Electrical & electronic engineering fundamentals at CUET.", ahead: false },
  { step: "05", title: "PyTorch & Neural Networks", body: "Implementing and training neural networks.", ahead: false },
  { step: "06", title: "Reinforcement Learning", body: "Q-learning and Deep Q-Networks.", ahead: false },
  { step: "07", title: "ROS 2 & Navigation", body: "Robot-navigation systems and simulation.", ahead: false },
  { step: "08", title: "Building & Implementing RL Projects", body: "Building and implementing further reinforcement-learning projects.", ahead: true },
  { step: "09", title: "Paper Reproduction", body: "Reproducing research and running experiments.", ahead: true },
  { step: "10", title: "Advanced RL & Control", body: "Future exploration of intelligent control.", ahead: true },
];

export const education = {
  institution: "Chittagong University of Engineering and Technology (CUET)",
  program: "B.Sc. in Electrical and Electronic Engineering (EEE)",
  status: "Undergraduate student",
  graduation: "Expected graduation: 2028",
};
