// Timeline
export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  category: 'tool_release' | 'company' | 'open_source' | 'policy';
  impactScore: number;
  relatedLinks: { label: string; url: string }[];
  imageUrl?: string;
}

// AI Adoption
export interface UserGrowthPoint {
  month: string;
  copilot: number;
  chatgpt: number;
  cursor: number;
  claudeCode: number;
}

export interface UsageFrequency {
  frequency: string;
  percentage: number;
}

export interface UseCase {
  name: string;
  value: number;
}

export interface AIAdoptionData {
  userGrowth: UserGrowthPoint[];
  usageFrequency: UsageFrequency[];
  useCases: UseCase[];
}

// Stack Overflow
export interface SOTrafficPoint {
  month: string;
  visits: number;
  event?: string;
}

export interface SOSurveyData {
  annualQuestions: { year: number; questions: number }[];
  languageActivity: {
    language: string;
    years: { year: number; activity: number }[];
  }[];
}

// Code Generation
export interface CodeGenData {
  overallPercentage: number;
  industryComparison: { industry: string; percentage: number }[];
  acceptanceRate: { month: string; rate: number }[];
}

// Developer Salary
export interface SalaryComparison {
  category: string;
  withAI: number;
  withoutAI: number;
}

export interface JobTrend {
  year: number;
  positions: number;
}

export interface AIProficiencySalary {
  proficiency: number;
  salary: number;
  label: string;
}

export interface DeveloperSalaryData {
  salaryComparison: SalaryComparison[];
  jobTrends: JobTrend[];
  proficiencyVsSalary: AIProficiencySalary[];
}

// Language Rankings
export interface LanguageRankingEntry {
  name: string;
  color: string;
  scores: number[];
}

export interface LanguageRankingsData {
  years: number[];
  languages: LanguageRankingEntry[];
}

// AI Tools Compare
export interface AIToolInfo {
  name: string;
  pricing: string;
  languages: number;
  accuracy: number;
  contextWindow: string;
  ideSupport: string[];
  releaseDate: string;
}

// IDE Market
export interface IDEMarketEntry {
  year: number;
  vscode: number;
  jetbrains: number;
  vim: number;
  cursor: number;
}

export interface IDEBubbleEntry {
  name: string;
  plugins: number;
  aiIntegration: number;
  marketShare: number;
}

export interface IDEMarketData {
  marketShare: IDEMarketEntry[];
  ecosystem: IDEBubbleEntry[];
}

// Code Snippets (Quiz)
export interface CodeSnippet {
  id: number;
  language: string;
  code: string;
  source: 'human' | 'ai';
  explanation: string;
}

// Quiz Questions (Vote)
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  mockResults: number[];
}

// Tool Recommendations
export interface ToolRecommendation {
  language: string;
  experienceLevel: string;
  tool: string;
  reason: string;
}

// Page preview card
export interface PagePreview {
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
}
