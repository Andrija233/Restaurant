import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async(req: Request, res: Response) => {
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });
        if(existingUser) {
            return res.status(200).json({ message: "User already exists" });
        }

        const user = new User(req.body);
        await user.save();
        res.status(200).json(user.toObject());
    } catch (error) {
        console.log(error)
        res.status(500).json({ message:"Something went wrong" });
    }
}

export default { createCurrentUser }