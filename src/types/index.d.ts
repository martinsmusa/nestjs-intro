import { User } from '../users/users.entity';

declare global {
  namespace Express {
    interface Request {
      session?: { userId: number };
      currentUser?: User;
    }
  }
}
