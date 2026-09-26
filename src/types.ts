export type UrgencyLevel = 'rendah' | 'sedang' | 'mendesak';
export type QuestionStatus = 'pending' | 'answered';

export interface ExpertUser {
  id: string;
  email: string;
  name: string;
  title: string;
  institution?: string;
  avatar?: string;
}

export interface Answer {
  id: string;
  question_id?: string;
  expert_name: string;
  expert_title: string;
  expert_avatar?: string;
  content: string;
  action_steps: string[];
  created_at: string;
  likes: number;
}

export interface Question {
  id: string;
  created_at: string;
  farmer_name: string;
  farmer_region?: string;
  crop_type?: string;
  category: string;
  title: string;
  content: string;
  image_url?: string;
  urgency: UrgencyLevel;
  status: QuestionStatus;
  views: number;
  likes: number;
  answer?: Answer;
}

export interface CategoryItem {
  id: string;
  name: string;
  tag: string;
  iconName: string;
  count: number;
  description: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  snippet: string;
  imageUrl: string;
}

export interface NewQuestionInput {
  farmer_name: string;
  farmer_region: string;
  crop_type: string;
  category: string;
  title: string;
  content: string;
  image_url?: string;
  urgency: UrgencyLevel;
}

export interface NewAnswerInput {
  question_id: string;
  content: string;
  action_steps: string[];
}
