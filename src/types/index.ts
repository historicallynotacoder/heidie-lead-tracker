export interface LeadTracker {
  id: number;
  username: string;
  recent_timestamp: string;
  messages: string[];
  latest_message: string;
  latest_sender: string;
  message_count: number;
  action_item: string;
}

export interface ParsedMessage {
  sender: string;
  message: string;
}

export type SortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'recent-first' | 'oldest-first';
export type FilterOption = 'all' | 'follow-up' | 'see-if-follow-up';
