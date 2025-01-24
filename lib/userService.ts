import {prisma} from "@/lib/prisma";

export async function getUserProfile(userId: number) {
  return prisma.users.findUnique({
    where: { id: userId },
    select: {
      weight: true,
      height: true,
      age: true,
      sex: true,
      activityLevel: true,
    },
  });
}
