import { Request as Req } from 'express';
import { User } from './users.interface';
import { JwtDto } from '../dto/jwt.dto';


export interface DataStoredInToken {
  _id: string;
  email: string;
  name: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Req {
  user: User;
  jwt?: JwtDto;
}

export interface Request extends Req {
  user?: Partial<User>;
  error?: boolean;
}
