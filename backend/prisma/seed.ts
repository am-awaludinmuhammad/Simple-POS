import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seed/roles.js";
import { seedUsers } from "./seed/users.js";

const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedUsers(prisma);
}

main()
  .then(() => {
    console.log("Database seed completed.");
  })
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
