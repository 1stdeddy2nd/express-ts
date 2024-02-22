import request, { type Response } from "supertest";
import app from "../app";
import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma/client";

let locationId: number | null = null;
const fakeLocationName = faker.location.city();
const fakeLocationName2 = faker.location.city();

describe("Location API", () => {
  describe("GET /locations", () => {
    it("should return all locations", async () => {
      return request(app)
        .get("/locations")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(Array.isArray(res.body.result)).toBe(true);
        });
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.location, "findMany").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .get("/locations")
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toEqual({
            error: { msg: "internal server error" },
          });

          jest.restoreAllMocks();
        });
    });
  });

  describe("POST /locations", () => {
    it("should get 403 when create location with wrong request body", async () => {
      return request(app)
        .post("/locations")
        .send({
          name: "Australia",
        })
        .expect(403);
    });

    it("should be able to create user", async () => {
      return request(app)
        .post("/locations")
        .send({
          name: fakeLocationName,
          timezone: "Australia/Sydney",
        })
        .expect(201)
        .then((res: Response) => {
          expect(res.statusCode).toEqual(201);
          locationId = res.body.id;
        });
    });

    it("should be get 403 if location with same name already exists", async () => {
      return request(app)
        .post("/locations")
        .send({
          name: fakeLocationName,
          timezone: faker.location.timeZone(),
        })
        .expect(403);
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.location, "create").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .post("/locations")
        .send({
          name: fakeLocationName2,
          timezone: faker.location.timeZone(),
        })
        .expect(500)
        .then((res: Response) => {
          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({
            error: { msg: "internal server error" },
          });

          // Restore the original implementation after the test
          jest.restoreAllMocks();
        });
    });
  });

  describe("PUT /locations/:id", () => {
    it("should get 404 when location not exists by id", async () => {
      return request(app)
        .put("/locations/999999")
        .send({
          name: fakeLocationName2,
          timezone: faker.location.timeZone(),
        })
        .expect(404)
        .expect({
          error: { msg: "location not found" },
        });
    });

    it("should get 403 when update user with wrong request body", async () => {
      return request(app)
        .put(`/locations/${locationId}`)
        .send({
          name: 1,
        })
        .expect(403);
    });

    it("should get 403 when update user with not unique name", async () => {
      // lets create mock location first
      // create it by using API POST
      const location = await request(app).post(`/locations`).send({
        name: faker.location.country(),
        timezone: faker.location.timeZone(),
      });

      await request(app)
        .put(`/locations/${locationId}`)
        .send({
          name: location.body.name,
        })
        .expect(403)
        .expect({
          error: { msg: "location name must be unique" },
        });

      // delete that mock location
      return request(app).delete(`/locations/${location.body.id}`);
    });

    it("should be able to update user", async () => {
      return request(app)
        .put(`/locations/${locationId}`)
        .send({
          name: fakeLocationName,
          timezone: faker.location.timeZone(),
        })
        .expect(200);
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.location, "update").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .put(`/locations/${locationId}`)
        .send({
          name: fakeLocationName,
          timezone: faker.location.timeZone(),
        })
        .expect(500)
        .then((res: Response) => {
          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({
            error: { msg: "internal server error" },
          });

          // Restore the original implementation after the test
          jest.restoreAllMocks();
        });
    });
  });

  describe("DELETE /locations/:id", () => {
    it("should get 404 when user not exists by id", async () => {
      return request(app).delete("/locations/999999").expect(404);
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.location, "delete").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .delete(`/locations/${locationId}`)
        .expect(500)
        .then((res: Response) => {
          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual({
            error: { msg: "internal server error" },
          });

          // Restore the original implementation after the test
          jest.restoreAllMocks();
        });
    });

    it("should be able to delete user", async () => {
      return request(app).delete(`/locations/${locationId}`).expect(200);
    });
  });
});
