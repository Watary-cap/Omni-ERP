import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:3000";
const DUMMYJSON_URL = "https://dummyjson.com";

export const users = [
  {
    id: "admin-arthur",
    username: "Arthur",
    password: "admin",
    role: "admin",
    employeeId: null,
  },
  {
    id: "user-julie",
    username: "Julie",
    password: "user",
    role: "user",
    employeeId: "4",
  },
];

export const employees = [
  {
    id: "4",
    firstName: "Julie",
    lastName: "Robert",
    email: "julie@omni-erp.fr",
    jobTitle: "Developpeuse Frontend",
    department: "Ressources humaines",
    status: "active",
    managerId: "1",
    teamId: "1",
    location: "Paris",
    avatar: "",
    phone: "",
    hireDate: "2022-01-01",
    skills: [],
  },
];

export const handlers = [
  // --- Authentification (JSON Server) ---
  http.get(`${API_URL}/users`, ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (username === null && password === null) {
      return HttpResponse.json(users);
    }

    return HttpResponse.json(
      users.filter(
        (user) =>
          user.username === username &&
          (password === null || user.password === password),
      ),
    );
  }),

  http.patch(`${API_URL}/users/:id`, async ({ params, request }) => {
    const patch = (await request.json()) as Record<string, unknown>;
    const user = users.find((item) => item.id === params.id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ ...user, ...patch });
  }),

  // --- RH ---
  http.get(`${API_URL}/employees`, () => HttpResponse.json(employees)),
  http.get(`${API_URL}/teams`, () => HttpResponse.json([])),
  http.get(`${API_URL}/leaves`, () => HttpResponse.json([])),
  http.get(`${API_URL}/attendance`, () => HttpResponse.json([])),

  // --- Catalogue (DummyJSON) ---
  http.get(`${DUMMYJSON_URL}/products`, () =>
    HttpResponse.json({
      products: [
        {
          id: 1,
          title: "Essence Mascara Lash Princess",
          category: "beauty",
          price: 9.99,
          stock: 99,
          rating: 2.56,
          thumbnail: "",
        },
      ],
      total: 1,
      skip: 0,
      limit: 1,
    }),
  ),

  http.get(`${DUMMYJSON_URL}/carts`, () =>
    HttpResponse.json({ carts: [], total: 0, skip: 0, limit: 0 }),
  ),
];
