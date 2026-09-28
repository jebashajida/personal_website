/**
 * Portfolio content - final CV edition.
 * Identity, role, experience dates, education, five CV projects, and research
 * follow Jeba_Shajida_CV_Final.pdf. Do not merge older CV experience dates.
 * GitHub descriptions below summarize reviewed repository contents.
 * Empty links stay hidden: never invent a demo or an employer contribution.
 * The approved programmer-avatar artwork is a static illustration, not a GLB.
 */

export const profile = {
  "name": "Jeba Shajida",
  "shortName": "Jeba",
  "email": "jeba.18feb@gmail.com",
  "location": "Dhaka, Bangladesh",
  "headline": "Frontend developer & interactive 3D developer",
  "description": "I turn ideas into thoughtful interfaces, interactive 3D experiences, and data-driven tools. A little engineering. A little imagination. Always curious.",
  "about": "I'm Jeba, a Computer Science and Engineering graduate based in Dhaka. I build frontend interfaces and interactive 3D experiences, bringing usability, engineering, and visual creativity together.",
  "aboutSecond": "My experience spans software development research at NGX, Ulterior Engineering, and IT operations during my internship at Bisorgo. My projects explore web dashboards, 3D simulations, and machine learning.",
  "languages": [
    "English",
    "Bengali"
  ],
  "showResume": true,
  "resumeFile": "Jeba_Shajida_CV_Final.pdf",
  "socials": {
    "github": "https://github.com/jebashajida",
    "linkedin": "https://www.linkedin.com/in/jeba-shajida-1253823b2/",
    "artstation": ""
  },
  "avatarFile": "jeba-avatar-1254.webp"
};

export const skillGroups = [
  {
    "number": "01",
    "icon": "code",
    "title": "Frontend & web development",
    "description": "Thoughtful interfaces, connected to the logic behind them.",
    "skills": [
      "JavaScript",
      "React",
      "HTML5 & CSS3",
      "Responsive UI",
      "Node.js (basic)",
      "REST / API integration"
    ]
  },
  {
    "number": "02",
    "icon": "cube",
    "title": "3D & creative development",
    "description": "Adding depth, movement, and a little surprise to the screen.",
    "skills": [
      "Three.js",
      "Two.js",
      "Blender",
      "Unity",
      "OpenGL"
    ]
  },
  {
    "number": "03",
    "icon": "sliders",
    "title": "Systems & data",
    "description": "Understanding software, monitoring systems, and exploring patterns.",
    "skills": [
      "SCADA / HMI concepts",
      "Python",
      "C++ & Java",
      "MySQL",
      "Machine learning fundamentals",
      "UAT & troubleshooting"
    ]
  }
];

export const projects = [
  {
    "id": "heks-dashboard",
    "title": "HEKS Bangladesh",
    "originalTitle": "HEKS Bangladesh - Web MIS Dashboard",
    "subtitle": "Clarity for work that matters.",
    "category": "software",
    "label": "FRONTEND / MIS DASHBOARD",
    "art": "dashboard",
    "description": "A browser-based dashboard interface for NGO management workflows, bringing KPI cards, beneficiary records, activity tracking, and report views into one place.",
    "role": "Designed and developed the dashboard interface using HTML, CSS, and JavaScript.",
    "details": [
      "KPI cards for the dashboard overview",
      "Beneficiary records",
      "Activity tracking",
      "Report views for NGO management workflows"
    ],
    "tags": [
      "HTML",
      "CSS",
      "JavaScript",
      "Dashboard UI"
    ],
    "github": "",
    "live": "",
    "sourceLabel": "Final CV project",
    "sourceNote": "Project and contribution from Jeba_Shajida_CV_Final.pdf. A matching public repository and deployed demo could not be verified; no URL has been guessed.",
    "number": "01"
  },
  {
    "sourceLabel": "Final CV project",
    "sourceNote": "Description and contribution from Jeba_Shajida_CV_Final.pdf. The linked public repository was empty when reviewed; it is not a live implementation.",
    "id": "steadystep",
    "number": "02",
    "title": "SteadyStep",
    "subtitle": "Technology with a human side.",
    "category": "software",
    "label": "SOFTWARE DESIGN",
    "art": "care",
    "description": "A collaborative elderly care support solution featuring health monitoring, emergency alerts, voice control, reminders, and family communication.",
    "role": "Contributed to system diagrams, UI/UX design, software analysis, and testing.",
    "details": [
      "Health monitoring and reminders",
      "Emergency alerts and voice control",
      "Communication with family members",
      "System diagrams, software analysis, UI/UX design, and testing"
    ],
    "tags": [
      "UI / UX",
      "Systems analysis",
      "Testing"
    ],
    "github": "https://github.com/jebashajida/SteadyStep",
    "githubLabel": "Repository",
    "live": ""
  },
  {
    "sourceLabel": "Final CV project",
    "sourceNote": "Project description and contribution are from Jeba_Shajida_CV_Final.pdf. No matching public implementation or live demo has been verified.",
    "id": "city-landscape",
    "number": "03",
    "title": "Station_Mountain_City",
    "subtitle": "A small world, brought to life.",
    "category": "graphics",
    "label": "COMPUTER GRAPHICS",
    "art": "city",
    "originalTitle": "Station_Mountain_City - City & Landscape Simulation",
    "description": "An OpenGL-based animated environment featuring an aircraft landing, moving vehicles, drifting clouds, and city-mountain scenery.",
    "role": "Developed an OpenGL-based city and landscape simulation.",
    "details": [
      "Animated plane landing",
      "Moving vehicles and drifting clouds",
      "City and mountain environments",
      "Real-time animation using OpenGL"
    ],
    "tags": [
      "OpenGL",
      "Animation",
      "Simulation"
    ],
    "github": "",
    "live": ""
  },
  {
    "sourceLabel": "GitHub repository",
    "sourceNote": "Summary based on the public repository file listing. No deployed demo is listed. The linked repository includes several coursework folders.",
    "id": "web-technologies",
    "title": "Web Technology Lab",
    "subtitle": "The foundations behind the interface.",
    "category": "software",
    "label": "WEB DEVELOPMENT",
    "art": "web",
    "description": "Web-development coursework bringing together PHP exercises, lab tasks, and an IT labour marketplace project folder.",
    "roleHeading": "Repository overview",
    "role": "A collection of coursework and project files from the Fall 2024-2025 web technologies course.",
    "details": [
      "PHP practice and web technology lab work",
      "IT labour marketplace project directory",
      "WebTechPro and final-project directories",
      "CV page and other course exercises"
    ],
    "tags": [
      "PHP",
      "Web development",
      "Coursework"
    ],
    "github": "https://github.com/jebashajida/Learning-web-technologies-fall2024-2025-sec-b",
    "live": "",
    "number": "04"
  },
  {
    "sourceLabel": "GitHub README & notebook",
    "sourceNote": "Description paraphrased from the public README and notebook file listing. Model performance has not been independently verified.",
    "id": "customer-churn",
    "title": "Customer Churn Prediction",
    "subtitle": "Understanding why customers leave.",
    "category": "ml",
    "label": "DATA SCIENCE",
    "art": "churn",
    "description": "A notebook-based study of customer churn, exploring how historical customer data can reveal patterns associated with leaving or continuing a service.",
    "roleHeading": "Repository overview",
    "role": "The Data-Science-Projects repository includes a churn prediction notebook, a related project directory, and an e-commerce dataset.",
    "details": [
      "Customer churn prediction notebook",
      "Historical customer patterns",
      "E-commerce dataset included in the repository",
      "Notebook-based exploration rather than a hosted web application"
    ],
    "tags": [
      "Machine learning",
      "Jupyter",
      "Customer analytics"
    ],
    "github": "https://github.com/jebashajida/Data-Science-Projects",
    "preview": "https://github.com/jebashajida/Data-Science-Projects/blob/main/Customer%20Churn%20Prediction%20Using%20Machine%20Learning.ipynb",
    "live": "",
    "number": "05"
  },
  {
    "sourceLabel": "GitHub README & notebook",
    "sourceNote": "Summary based on the public README and notebook file listing. No accuracy claim or live application is implied.",
    "id": "fraud-detection",
    "title": "Fraud & Anomaly Detection",
    "subtitle": "Looking beyond the expected.",
    "category": "ml",
    "label": "MACHINE LEARNING",
    "art": "fraud",
    "description": "Explores classification and anomaly detection as approaches to identifying potentially fraudulent activity, documented in a Jupyter notebook.",
    "roleHeading": "Repository overview",
    "role": "A fraud and anomaly detection study included in the Data-Science-Projects repository.",
    "details": [
      "Fraud detection notebook",
      "Classification and anomaly detection approaches",
      "Machine learning for recognizing unusual patterns",
      "Companion work to the customer churn notebook"
    ],
    "tags": [
      "Anomaly detection",
      "Classification",
      "Jupyter"
    ],
    "github": "https://github.com/jebashajida/Data-Science-Projects",
    "preview": "https://github.com/jebashajida/Data-Science-Projects/blob/main/Fraud%20Detection%20and%20Anomaly%20Detection.ipynb",
    "live": "",
    "number": "06"
  },
  {
    "sourceLabel": "GitHub repository",
    "sourceNote": "Summary based on the public repository file listing. Individual algorithms were not inferred from the filenames.",
    "id": "cvpr-notebooks",
    "title": "Computer Vision Notebooks",
    "subtitle": "Experiments in seeing differently.",
    "category": "ml",
    "label": "COMPUTER VISION",
    "art": "vision",
    "description": "Computer vision and pattern recognition coursework organized into assignment notebooks and a CP notebook in my public Cvpr repository.",
    "roleHeading": "Repository overview",
    "role": "The repository contains ASSIGNMENT-1.ipynb, ASSIGNMENT-2.ipynb, and CP.ipynb.",
    "details": [
      "Two assignment notebooks",
      "CP.ipynb course notebook",
      "Publicly browsable notebook files",
      "Coursework in computer vision and pattern recognition"
    ],
    "tags": [
      "Computer vision",
      "Jupyter",
      "Coursework"
    ],
    "github": "https://github.com/jebashajida/Cvpr",
    "live": "",
    "preview": "https://github.com/jebashajida/Cvpr/blob/main/ASSIGNMENT-1.ipynb",
    "number": "07"
  },
  {
    "sourceLabel": "Final CV project",
    "sourceNote": "Project description and contribution are from Jeba_Shajida_CV_Final.pdf. No matching public implementation or live demo has been verified.",
    "id": "animal-classification",
    "number": "08",
    "title": "Animal Image Classification",
    "subtitle": "Finding patterns, one image at a time.",
    "category": "ml",
    "label": "MACHINE LEARNING",
    "art": "animals",
    "description": "A k-nearest neighbors model for classifying images of cats, dogs, and pandas, with preprocessing, feature extraction, and performance evaluation.",
    "role": "Built a machine-learning workflow for cat, dog, and panda image classification, including preprocessing, feature extraction, and model evaluation.",
    "details": [
      "Cat, dog, and panda image categories",
      "Image preprocessing",
      "Feature extraction and k-NN classification",
      "Model evaluation"
    ],
    "tags": [
      "k-NN",
      "Feature extraction",
      "Classification"
    ],
    "github": "",
    "live": ""
  },
  {
    "sourceLabel": "Final CV project",
    "sourceNote": "Project description and contribution are from Jeba_Shajida_CV_Final.pdf. No matching public implementation or live demo has been verified.",
    "id": "student-classification",
    "number": "09",
    "title": "Student Classification",
    "subtitle": "Learning how to learn.",
    "category": "ml",
    "label": "NEURAL NETWORKS",
    "art": "network",
    "description": "A multi-layer neural network for classifying student categories, using data preprocessing, training with backpropagation, and performance evaluation.",
    "role": "Developed a multilayer neural network for student-category classification, with data preprocessing, backpropagation-based training, and performance evaluation.",
    "details": [
      "Data preprocessing",
      "Multilayer neural network",
      "Backpropagation-based training",
      "Performance evaluation"
    ],
    "tags": [
      "Neural networks",
      "Backpropagation",
      "Data preprocessing"
    ],
    "github": "",
    "live": ""
  }
];

export const experience = [
  {
    "role": "Software Development Research Assistant",
    "organization": "NGX Department, Ulterior Engineering",
    "period": "June 2026 - September 2026",
    "description": "Contributed to software development and research activities within the NGX department.",
    "tags": [
      "Software development",
      "Research"
    ]
  },
  {
    "role": "IT Department Intern",
    "organization": "Bisorgo",
    "period": "February 2026 - May 2026",
    "description": "Supported software development, IT operations, and web-based MIS/CRM reporting for HEKS Bangladesh.",
    "tags": [
      "IT operations",
      "MIS / CRM",
      "Web reporting"
    ]
  }
];

export const education = [
  {
    "degree": "B.Sc. in Computer Science & Engineering",
    "institution": "American International University-Bangladesh",
    "period": "2022 - 2026",
    "grade": "CGPA 3.52"
  },
  {
    "degree": "Higher Secondary School Certificate",
    "institution": "BAF Shaheen School and College, Jashore",
    "period": "2020",
    "grade": "GPA 5.00"
  },
  {
    "degree": "Secondary School Certificate",
    "institution": "BAF Shaheen School and College, Jashore",
    "period": "2018",
    "grade": "GPA 5.00"
  }
];

export const research = [
  {
    "title": "A Comparative Analysis of Classification Data Mining Techniques: Deriving Key Factors for Diabetes Prediction.",
    "tag": "DATA MINING",
    "note": "Published in IEEE QPAIN, 2026 (as listed in my CV)."
  },
  {
    "title": "Multimodal Model for Enhanced Pneumonia Diagnosis in Medical Imaging.",
    "tag": "MEDICAL IMAGING",
    "note": ""
  },
  {
    "title": "Rethinking Traffic Management in Dhaka: Sustainable Strategies for Congestion Reduction.",
    "tag": "TRAFFIC MANAGEMENT",
    "note": ""
  },
  {
    "title": "MAD-YOLO: Motion-Aware Directional Depthwise Convolutions for Traffic Sign Detection.",
    "tag": "COMPUTER VISION",
    "note": ""
  }
];
