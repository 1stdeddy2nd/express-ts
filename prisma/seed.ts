import { prisma } from "../prisma/client";
import { faker } from "@faker-js/faker";
import moment from "moment-timezone";

async function seed() {
  console.info("seeding starting...");
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

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

  await prisma.user.createMany({
    data: [...Array(10)].map(() => ({
      email: faker.internet.email(),
      birth_date: new Date(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      location_id: 1,
    })),
  });
}

seed();
