import mongoose, { Model, Document, Types, Schema } from "mongoose";

export interface ISkill extends Document<Types.ObjectId> {
    title: string;
    experienceCount: number,
}

interface ISkillModel extends Model<ISkill, {}> {
    preCalculatePopularity(skill: ISkill, inc: number): Promise<any>;
}

const skillSchema = new Schema<ISkill, ISkillModel>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    experienceCount: {
        type: Number,
        default: 0,
    }
});

skillSchema.static('preCalculatePopularity', function preCalculatePopularity(skill: ISkill, inc: number) {
    return this.findByIdAndUpdate(skill, { $inc: { experienceCount: inc }})
})

const Skill = mongoose.model<ISkill, ISkillModel>('Skill', skillSchema);
export default Skill;