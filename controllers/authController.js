// import User from "../models/NewUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const signup = async (req, res) => {
  console.log("req.body user signup", req.body);
  let { name, email, password, role, familyCode, nickName,
    dueDate, } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Only generate a familyCode if it's not provided
    if (!familyCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const generateCode = () => {
        let result = '';
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          result += chars[randomIndex];
        }
        return result;
      };

      // Keep generating until it's unique in the DB
      let isUnique = false;
      while (!isUnique) {
        const code = generateCode();
        const existingCode = await User.findOne({ familyCode: code });
        if (!existingCode) {
          familyCode = code;
          isUnique = true;
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, role, familyCode, nickName, familyCode, dueDate });

    res.status(201).json({ message: "User created successfully", name, email, role, familyCode, dueDate, nickName });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, familyCode: user.familyCode, image: user.image },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
