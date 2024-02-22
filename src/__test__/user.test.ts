import request, { type Response } from "supertest";
import app from "../app";
import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma/client";

let userId: string | null = null;

describe("User API", () => {
  describe("GET /users", () => {
    it("should return all users", async () => {
      return request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(Array.isArray(res.body.result)).toBe(true);
        });
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.user, "findMany").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .get("/users")
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toEqual({
            error: { msg: "internal server error" },
          });

          jest.restoreAllMocks();
        });
    });
  });

  describe("POST /users", () => {
    it("should get 403 when create user with wrong request body", async () => {
      return request(app)
        .post("/users")
        .send({
          email: faker.internet.email(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
        })
        .expect(403);
    });

    it("should get 404 when create user with unregistered location_id", async () => {
      return request(app)
        .post("/users")
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 999999,
        })
        .expect(404);
    });

    it("should be able to create user", async () => {
      return request(app)
        .post("/users")
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
        })
        .expect(201)
        .then((res: Response) => {
          expect(res.statusCode).toEqual(201);
          userId = res.body.id;
        });
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.user, "create").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .post("/users")
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
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

  describe("PUT /users/:id", () => {
    it("should get 404 when user not exists by id", async () => {
      return request(app)
        .put("/users/999999")
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
        })
        .expect(404);
    });

    it("should get 404 when location not exists by location_id", async () => {
      return request(app)
        .put(`/users/${userId}`)
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 999999,
        })
        .expect(404);
    });

    it("should get 403 when update user with wrong request body", async () => {
      return request(app)
        .put(`/users/${userId}`)
        .send({
          email: faker.person.firstName(),
        })
        .expect(403);
    });

    it("should be able to update user", async () => {
      return request(app)
        .put(`/users/${userId}`)
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
        })
        .expect(200);
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.user, "update").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .put(`/users/${userId}`)
        .send({
          email: faker.internet.email(),
          birth_date: faker.date.birthdate(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          location_id: 1,
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

  describe("DELETE /users/:id", () => {
    it("should get 404 when user not exists by id", async () => {
      return request(app).delete("/users/999999").expect(404);
    });

    it("should handle internal server error", async () => {
      // Mocking the function to throw an error (simulating an internal error)
      jest.spyOn(prisma.user, "delete").mockImplementation(() => {
        throw new Error("Something went wrong");
      });

      return request(app)
        .delete(`/users/${userId}`)
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
      return request(app).delete(`/users/${userId}`).expect(200);
    });
  });
});
