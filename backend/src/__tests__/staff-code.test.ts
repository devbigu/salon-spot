import request from "supertest";
import { app } from "../app.js";

const auth = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

describe("Staff code generation", () => {
  it("uses salon initials, joining month, ISO weekday, and phone suffix", async () => {
    const stamp = Date.now();
    const password = "Password@123";
    const register = await request(app).post("/api/auth/register").send({
      name: "Staff Code Super Admin",
      email: `staff-code-${stamp}@example.com`,
      phone_number: `90${String(stamp).slice(-8)}`,
      password,
    });

    expect(register.status).toBe(201);

    const login = await request(app).post("/api/auth/login").send({
      email: `staff-code-${stamp}@example.com`,
      password,
    });

    expect(login.status).toBe(200);
    const token = login.body.data.accessToken as string;

    const salon = await request(app)
      .post("/api/salons")
      .set(auth(token))
      .send({
        name: "Sassy Salon",
      });

    expect(salon.status).toBe(201);

    const staff = await request(app)
      .post("/api/staff")
      .set(auth(token))
      .send({
        name: "Wednesday Staff",
        email: `wednesday-staff-${stamp}@example.com`,
        phone: "9876543809",
        jobRole: "Stylist",
        workingFrom: "10:00",
        workingTo: "19:00",
        weekOff: "MONDAY",
        joiningDate: "2026-06-03T10:00:00.000Z",
        salonId: salon.body.data.id,
      });

    expect(staff.status).toBe(201);
    expect(staff.body.data.staffCode).toBe("SS-06-3-809");
    expect(staff.body.data.joiningDate).toBe("2026-06-03T10:00:00.000Z");

    const duplicate = await request(app)
      .post("/api/staff")
      .set(auth(token))
      .send({
        name: "Duplicate Code Staff",
        email: `duplicate-staff-${stamp}@example.com`,
        phone: "9000000809",
        jobRole: "Stylist",
        workingFrom: "10:00",
        workingTo: "19:00",
        weekOff: "TUESDAY",
        joiningDate: "2026-06-03T12:00:00.000Z",
        salonId: salon.body.data.id,
      });

    expect(duplicate.status).toBe(409);
    expect(duplicate.body.message).toBe("Staff code already exists");
  });
});
