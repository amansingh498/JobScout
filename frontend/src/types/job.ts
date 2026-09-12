export interface UserPreferences {
  target_roles: string[];
  min_salary?: number | null;
  min_stipend?: number | null;
  preferred_locations: string[];
  remote_allowed: boolean;
  skills: string[];
  employment_type: string;
}

export interface ResearchEvidence {
  field: string;
  value: string;
  source_url: string;
  source_name: string;
  source_type: 'official_site' | 'careers_page' | 'placement_page' | 'job_board' | 'employee_report' | 'forum' | 'unknown';
  confidence: number;
  confidence_tier?: 'Confirmed' | 'High' | 'Medium' | 'Low';
}

export interface GhostJobSignal {
  type: 'positive' | 'warning' | 'risk' | 'neutral';
  label: string;
  detail: string;
}

export interface GhostJobAudit {
  legitimacy_score: number;
  verdict: string;
  days_active: number;
  signals: GhostJobSignal[];
  recommendation: string;
}

export interface InterviewRound {
  round_name: string;
  focus: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  tips: string;
}

export interface InterviewBlueprint {
  rounds: InterviewRound[];
  top_technical_questions: string[];
  hiring_manager_focus: string;
}

export interface ApplicationPitch {
  cold_email: string;
  linkedin_dm: string;
  elevator_pitch_30s: string;
  skills_to_highlight: string[];
  quick_prep_plan: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string | null;
  work_mode?: string | null;
  employment_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  stipend_min?: number | null;
  stipend_max?: number | null;
  skills: string[];
  source_url: string;
  dedup_key: string;
  missing_fields: string[];
  research_results: ResearchEvidence[];
  match_score?: number | null;
  confidence_score?: number | null;
  score_breakdown?: {
    role_match: number;
    skills_match: number;
    compensation: number;
    location: number;
    work_mode: number;
  } | null;
  ghost_audit?: GhostJobAudit | null;
  interview_blueprint?: InterviewBlueprint | null;
  application_pitch?: ApplicationPitch | null;
}

export interface SearchRequest {
  search_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  preferences: UserPreferences;
  created_at: string;
  jobs: Job[];
  error?: string | null;
  current_step?: string | null;
  total_steps: number;
  step_index: number;
}
