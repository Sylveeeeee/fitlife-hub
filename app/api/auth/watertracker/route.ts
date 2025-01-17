import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const glasses = await prisma.glass.findMany();
        res.status(200).json(glasses);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
      }
      break;

    case "POST":
      try {
        const { userId, count } = req.body;
        const glass = await prisma.glass.create({
          data: { userId, count },
        });
        res.status(201).json(glass);
      } catch (error) {
        res.status(500).json({ error: "Failed to create glass entry" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await prisma.glass.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: "Failed to delete glass entry" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
