import request from "supertest";
import app from "../../src/app";

describe("App", () => {
  it("Acess index Api", async (done) => {
    const response = await request(app).get("/");
    expect(response.status).toBe(201);
    done();
  });
});
