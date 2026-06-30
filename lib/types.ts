export type Thread = {
  id: string;
  title: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
};

export type Idea = {
  id: string;
  thread_id: string;
  content: string;
  created_by: string | null;
  author_email: string | null;
  created_at: string;
};

export type IdeaWithVotes = Idea & {
  votes: number;
  votedByMe: boolean;
};
