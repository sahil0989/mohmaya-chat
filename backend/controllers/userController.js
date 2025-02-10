import User from "../models/usersModel.js";

const registerUser = async (req, res) => {
    try {
        const { name, username, profilePic, emailId, password } = req.body;

        if (!name || !username || !emailId) {
            return res.status(404).json({ message: 'All Creadentials required' });
        }

        const findUser = await User.findOne({ $or: [{ emailId }, { username }] });

        if (findUser) {
            return res.status(409).json({ message: "User already registered!!" });
        }
        else {
            const userDetails = new User({
                name,
                username,
                profilePic,
                emailId,
                password
            })
            await userDetails.save()
            return res.status(201).json(userDetails)
        }
    } catch (err) {
        console.log("Sign-Up Error: ", err.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(404).json({ message: "All Credentials required" });
        }

        const user = await User.findOne({ username });

        if (user) {
            if (user.username === username) {
                res.status(200).json(user);
            } else {
                res.status(400).json({ message: "Wrong Credentials" });
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        console.log("Login Error: ", err.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, username, emailId, password } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);

        if (user) {
            user.name = name || user.name;
            user.emailId = emailId || user.emailId;
            user.username = username || user.username;
            user.password = password || user.password;

            await user.save()

            return res.status(200).json(user)
        } else {
            return res.status(404).json({ message: "user not found" });
        }

    } catch (err) {
        console.log("Update User Error: ", err.message);
    }
}

const userDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const user = await User.findById(id);

            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        }
    } catch (err) {
        console.log("Details Error: ", err.message);
    }
}

const allUsers = async (req, res) => {
    try {
        const user = await User.find();

        return res.status(200).json(user || []);
    } catch (err) {
        console.log("All Users Error: ", err.message);
    }
}

export { registerUser, loginUser, updateUser, userDetails, allUsers };