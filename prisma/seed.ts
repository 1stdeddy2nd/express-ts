import { prisma } from "../prisma/client";

async function seed() {
  console.info("seeding starting...");
  await prisma.location.createMany({
    data: [
      {
        id: 1,
        name: "Indonesia",
        timezone: "Asia/Jakarta",
      },
      {
        id: 2,
        name: "Australia",
        timezone: "Australia/Sydney",
      },
      {
        id: 3,
        name: "Japan",
        timezone: "Asia/Tokyo",
      },
    ],
  });
}

seed();
