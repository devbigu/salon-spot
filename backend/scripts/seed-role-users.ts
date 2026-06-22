import "dotenv/config";

import { prisma } from "../src/config/prisma.js";
import { hashPass } from "../src/utils/password.js";

const accounts = [
  {
    role: "SUPER_ADMIN" as const,
    name: "Test Super Admin",
    email: "test_superadmin@test.com",
    password: "testsuperadmin",
  },
  {
    role: "SALON_ADMIN" as const,
    name: "Test Salon Admin",
    email: "test_admin@test.com",
    password: "testadmin",
  },
  {
    role: "BRANCH_MANAGER" as const,
    name: "Test Branch Manager",
    email: "test_manager@test.com",
    password: "testmanager",
  },
  {
    role: "RECEPTIONIST" as const,
    name: "Test Receptionist",
    email: "test_receptionist@test.com",
    password: "testreceptionist",
  },
  {
    role: "STAFF" as const,
    name: "Test Staff",
    email: "test_staff@test.com",
    password: "teststaff",
  },
];

const main = async () => {
  let salon = await prisma.salon.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!salon) {
    salon = await prisma.salon.create({
      data: { name: "Test Salon" },
    });
  }

  let branch = await prisma.branch.findFirst({
    where: { salonId: salon.id },
    orderBy: { createdAt: "asc" },
  });

  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        name: "Test Branch",
        salonId: salon.id,
      },
    });
  }

  for (const account of accounts) {
    const passwordHash = await hashPass(account.password);
    const needsSalon = account.role !== "SUPER_ADMIN";
    const needsBranch =
      account.role === "BRANCH_MANAGER" ||
      account.role === "RECEPTIONIST" ||
      account.role === "STAFF";

    await prisma.user.upsert({
      where: { email: account.email },
      create: {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
        ...(needsSalon ? { salonId: salon.id } : {}),
        ...(needsBranch ? { branchId: branch.id } : {}),
      },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
        salonId: needsSalon ? salon.id : null,
        branchId: needsBranch ? branch.id : null,
      },
    });
  }

  console.table(
    accounts.map(({ role, email, password }) => ({ role, email, password }))
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

