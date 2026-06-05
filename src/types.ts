export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string; // Lucide icon reference
  benefits: string[];
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarSeed: string; // For generating high-quality placeholder avatars
  metrics: {
    label: string;
    value: string;
  };
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  details: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  projectDescription: string;
  estimatedBudget: string;
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'under_review' | 'architecture_design' | 'proposal_generation' | 'ready_for_meeting';
  aiAnalysis?: {
    suggestedCategory: string;
    modules: string[];
    techStack: string[];
    complexity: 'Baixa' | 'Média' | 'Alta' | 'Altíssima';
    roiEstimate: string;
    detailedBlueprint: string;
    chatHistory?: ChatMessage[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    action: string;
  };
}
