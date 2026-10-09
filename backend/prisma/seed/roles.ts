import { PrismaClient } from "@prisma/client";

export const ROLE_IDS = {
  OWNER: "d0c9038c-c08f-480a-9bb0-439f125fdc0b",
  CASHIER: "6c6e8f36-6844-4c3f-94a4-5f9b1203f9a7",
  OPERATIONS_STAFF: "c953ebde-f770-45f5-9076-bb52f917a41f",
} as const;

const roles = [
  { id: ROLE_IDS.OWNER, code: "OWNER", name: "Owner" },
  { id: ROLE_IDS.CASHIER, code: "CASHIER", name: "Kasir" },
  {
    id: ROLE_IDS.OPERATIONS_STAFF,
    code: "OPERATIONS_STAFF",
    name: "Staf Operasional",
  },
] as const;

export async function seedRoles(prisma: PrismaClient) {
  await prisma.$transaction(
    roles.map((role) =>
      prisma.role.upsert({
        where: { id: role.id },
        create: role,
        update: {
          code: role.code,
          name: role.name,
        },
      }),
    ),
  );
}
