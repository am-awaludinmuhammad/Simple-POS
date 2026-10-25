import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/modules/auth/password.js";
import { ROLE_IDS } from "./roles.js";

export async function seedUsers(prisma: PrismaClient) {
  const username = process.env.SEED_OWNER_USERNAME;
  const phoneNumber = process.env.SEED_OWNER_PHONE;
  const password = process.env.SEED_OWNER_PASSWORD;

  if (!username && !phoneNumber && !password) {
    return;
  }

  if (!username || !phoneNumber || !password) {
    throw new Error(
      "SEED_OWNER_USERNAME, SEED_OWNER_PHONE, and SEED_OWNER_PASSWORD must be provided together.",
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { phoneNumber }],
    },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: process.env.SEED_OWNER_NAME || "Owner",
        username,
        phoneNumber,
        roleId: ROLE_IDS.OWNER,
        isActive: true,
      },
    });
    return;
  }

  await prisma.user.create({
    data: {
      name: process.env.SEED_OWNER_NAME || "Owner",
      username,
      phoneNumber,
      passwordHash: await hashPassword(password),
      roleId: ROLE_IDS.OWNER,
    },
  });
}
