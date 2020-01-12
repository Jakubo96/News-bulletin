import { User } from '@app/auth/user';

export interface News {
  id?: string;
  title: string;
  content: string;
  imagesUrls: string[];
  author: Partial<User>;
  created: number;
  modified: number;
}
