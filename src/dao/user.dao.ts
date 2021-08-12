import User, { DUser, IUser } from "../schemas/user.model";

export namespace UserDao {

    export async function getAllUsers(){
        const users : IUser[] = await User.find();
        return users; 
    }

    export async function getUserById(userId: any){
        const user : IUser = await User.findOne({_id: userId});
        return user; 
    }

    export async function createUser(data: DUser) {
        const iUser = new User(data);
        let user = await iUser.save();
        return getUserById(user.id);
    }

    export async function getUserByName(userName : string){
        const user = await User.findOne({name : userName});
        return user;
    }

    export async function updateUserById(userId: string, data: Partial<DUser>){
        const user = await User.findByIdAndUpdate({_id : userId}, { $set: data}, {new : true});
        return user;
    }

    export async function deleteUserByid(userId: string){
        await User.deleteOne({_id: userId});
        return "User Deleted";
    }

}