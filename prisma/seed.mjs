import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // =========================================
  // 1) Roles
  // =========================================
  const roles = await prisma.role.createMany({
    data: [
      { name: "maker" },
      { name: "chacker" },
      { name: "admin" },
    ],
  });

  console.log("✅ Roles created");

  // =========================================
  // 2) Permissions (Advanced RBAC)
  // =========================================

  const permissionList = [
    // CRUD
    "create",
    "read",
    "update",
    "delete",

    // Requests
    "request:create",
    "request:read",
    "request:update",
    "request:delete",
    "request:assign",
    "request:approve",
    "request:reject",
    "request:reopen",

    // Users
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "user:change-role",

    // Roles / Permissions
    "role:create",
    "role:read",
    "role:update",
    "role:delete",
    "role:assign-permission",
    "permission:create",
    "permission:read",
    "permission:update",
    "permission:delete",

    // Reports / Audit
    "report:view",
    "report:export",
    "audit:log:read",

    // Settings
    "settings:update",
    "settings:read",

    // Notifications
    "notification:send",
    "notification:read-all",
  ];

  const permissions = await prisma.permission.createMany({
    data: permissionList.map((action) => ({ action })),
  });

  console.log("✅ Permissions created");

  // Fetch inserted roles & permissions
  const dbRoles = await prisma.role.findMany();
  const dbPermissions = await prisma.permission.findMany();

  const findRole = (name) => dbRoles.find((r) => r.name === name);
  const findPerm = (action) =>
    dbPermissions.find((p) => p.action === action);

  // =========================================
  // 3) Assign permissions to roles
  // =========================================

  // maker permissions
  const makerPermissions = [
    "request:create",
    "request:read",
    "request:update",
    "notification:read-all",
  ];

  // chacker permissions
  const chackerPermissions = [
    "request:read",
    "request:update",
    "request:approve",
    "request:reject",
    "request:assign",
    "notification:read-all",
  ];

  // admin = all permissions
  const adminPermissions = permissionList;

  const rolePermissionData = [];

  const addPermissions = (roleName, actions) => {
    const role = findRole(roleName);
    actions.forEach((act) => {
      const perm = findPerm(act);
      if (role && perm) {
        rolePermissionData.push({
          role_id: role.id,
          permission_id: perm.id,
        });
      }
    });
  };

  addPermissions("maker", makerPermissions);
  addPermissions("chacker", chackerPermissions);
  addPermissions("admin", adminPermissions);

  await prisma.rolePermission.createMany({
    data: rolePermissionData,
  });

  console.log("✅ Role-Permissions created");


  // =========================================
  // 4) Users
  // =========================================
  const makerRole = findRole("maker");
  const chackerRole = findRole("chacker");
  const adminRole = findRole("admin");

  await prisma.user.createMany({
    data: [
      { username: "ahmed", role_id: makerRole.id },
      { username: "saad", role_id: chackerRole.id },
      { username: "admin", role_id: adminRole.id },
    ],
  });

  console.log("✅ Users created");

  // =========================================
  // 5) Requests (Dummy)
  // =========================================
  await prisma.request.createMany({
    data: [
      {
        maker_id: 1,
        shacker_id: 2,
        status: "pending",
        field: "Customer address missing.",
      },
      {
        maker_id: 1,
        shacker_id: 2,
        status: "approved",
        field: "All documents verified.",
      },
      {
        maker_id: 1,
        shacker_id: 2,
        status: "rejected",
        field: "Incomplete customer data.",
      },
    ],
  });

  console.log("✅ Requests created");
  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
