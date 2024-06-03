import express from "express";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found", success: false });
    }
    return res.status(200).json({ data: users, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email } = req.body;
    await prisma.user.create({
      data: {
        email,
      },
    });
    return res.status(201).json({ message: "User created", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Id is required", success: false });
    }
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "User deleted", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.underline);
});
