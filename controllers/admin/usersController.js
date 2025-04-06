// Controllers for admin users routes
import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {    // Get all users
  try {
    const users = await User.find({});
    const usersList = [];

    usersList.push({
      message: "Here is the list of all the users",
      Notice:
        "To promote a user to admin, use the PUT /admin/users/promote/:id endpoint using the _id of the user and to demote use the PUT /admin/users/demote/:id endpoint",
    });

    users.forEach((user) => {
      const { _id, name, email, role, reservationsHistory } = user;
      usersList.push({ _id, name, email, role, reservationsHistory });
    });

    res.status(200).json(usersList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const promoteUserToAdmin = async (req, res) => {   // promote user to admin
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.role == "admin") {
      return res.status(403).json({ message: "This user is already an admin"})
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: "Invalid User ID" });
  }
};

export const demoteAdminToUser = async (req, res) => {   // demote admin to user
  try {
    const { id } = req.params;
    if (req.user.id == id) {
      return res.status(403).json({ message: "You cannot demote yourself" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.role == "user") {
      return res.status(403).json({ message: "This user is already a regular user" })
    }
    user.role = "user";
    await user.save();
    res.status(200).json({ message: "Admin demoted to user" });
  } catch (error) {
    res.status(500).json({ message: "Invalid User ID!" });
  }
};