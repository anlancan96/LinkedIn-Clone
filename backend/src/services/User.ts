import User, { IUser, Experience } from "@/models/user.model";
import { IUpdateUserInput } from "../../../shared/src/users";
import { StatusCodes } from "http-status-codes";
import { APIError } from "@/middlewares/error-handler";
import Skill from "@/models/skill.model";
import { Types } from "mongoose";

class UserService {
    public static async updateProfile(userId: string, newProfile: IUpdateUserInput): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) {
            throw new APIError(StatusCodes.NOT_FOUND, 'User not found');
        }
        
        const newExperiences: Experience[] = [];
        newProfile.experiences.forEach((exp) => {
            if(user.experience.find(e => e.title !== exp.title)) 
            {
                const newExperience: Experience = {  ...exp as Omit<Experience, 'skills'>, skills: exp.skills.map(s =>  typeof s === 'string' ? new Types.ObjectId(s) : s)}
                newExperiences.push(newExperience);
            }
        });
        user.experience = newExperiences;
        await user.save();

        // Update skill counts
        for (const experience of newExperiences) {
            for (const skill of experience.skills) {
                await Skill.preCalculatePopularity(skill._id.toString(), 1);
            }
        }
        return user;
    }
}