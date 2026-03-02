import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        username: "admin",
        passwordHash: await bcrypt.hash("admin123", 12),
        securityWord: await bcrypt.hash("seguridad", 12),
      },
    });
    console.log("Default admin user created");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
