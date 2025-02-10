import Skill, { ISkill } from "@/models/skill.model";

export default class SkillService {
    public static async getAllSkills(): Promise<ISkill[] | null> {
        const skills = await Skill.find({});
        return skills;
    }

    public static async addNewSkill(newSkill: ISkill): Promise<ISkill | null> {
        const skill = await Skill.create(newSkill);
        return skill;
    }

    public static async deleteSkill(skillId: string): Promise<any> {
        return await Skill.deleteOne({ _id: skillId });
    }

    public static async preCalculatePopularity(skill: string, inc: number): Promise<any> {
        return await Skill.preCalculatePopularity(skill, inc);
    }
 }