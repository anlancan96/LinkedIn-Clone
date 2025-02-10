import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';
// Interface for User methods
interface IUserMethods {
  correctPassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

export interface Experience {
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date; 
  description?: string;
  skills: Types.ObjectId[]; 
}

// Interface for User document
export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'guide' | 'lead-guide' | 'admin';
  password: string;
  passwordChangedAt?: Date;
  bio?: string;
  experience: Experience[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User model
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<IUser | null>;
  findRoleByUserId(id: string): Promise<string | null>;
}

// Combine the Document and Methods interfaces
export type UserDocument = IUser & IUserMethods;

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role'
      },
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
      validate: {
        validator: function(this: IUser, password: string): boolean {
          // Custom password validation
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    },
    bio: {
      type: String,
      default: "", // Bio is optional, default to an empty string
    },
    experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      startDate: Date,
      endDate: Date,
      description: String,
      skills: [{ type: Types.ObjectId, ref: "Skill" }],
    }],
    passwordChangedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ email: 1 });

// Document middleware
userSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Ensure JWT is issued after password change
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.static('findRoleByUserId', function findRoleByUserId(userId: string) {
  return this.findById(userId).select('role').then(user => user?.role);
});

// Static methods
userSchema.static('findByEmail', function findByEmail(email: string) {
  return this.findOne({ email: email });
});
// Create the model
const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;