import { ICreateUserInput, IUserResponse } from '../../../../shared/src/users';
import { APIError } from '../../middlewares/error-handler';
import User from '../../models/user.model';

export class AuthService {
  public static async signup(userData: ICreateUserInput): Promise<IUserResponse> {
    const existingUser = await User.findByEmail(userData.email);
    
    if (existingUser) {
      throw new APIError(400, 'Email already in use');
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  public static async login(
    email: string,
    password: string
  ): Promise<IUserResponse> {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      throw new APIError(401, 'Incorrect email or password');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}