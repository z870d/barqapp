import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding...")

  const admin = await prisma.role.create({ data: { name: "admin" } })
  const maker = await prisma.role.create({ data: { name: "maker" } })
  const shacker = await prisma.role.create({ data: { name: "shacker" } })

  // Permissions
  const createPerm = await prisma.permission.create({ data: { action: "create" } })
  const approvePerm = await prisma.permission.create({ data: { action: "approve" } })
  const rejectPerm = await prisma.permission.create({ data: { action: "reject" } })
  const viewAllPerm = await prisma.permission.create({ data: { action: "view_all" } })

  await prisma.rolePermission.createMany({
    data: [
      { role_id: admin.id, permission_id: createPerm.id },
      { role_id: admin.id, permission_id: approvePerm.id },
      { role_id: admin.id, permission_id: rejectPerm.id },
      { role_id: admin.id, permission_id: viewAllPerm.id },

      { role_id: maker.id, permission_id: createPerm.id },
      { role_id: maker.id, permission_id: viewAllPerm.id },

      { role_id: shacker.id, permission_id: approvePerm.id },
      { role_id: shacker.id, permission_id: rejectPerm.id },
      { role_id: shacker.id, permission_id: viewAllPerm.id },
    ],
  })

  await prisma.user.createMany({
    data: [
      { username: "Ahmed Al-Saad", role_id: admin.id },
      { username: "Saad Al-Qahtani", role_id: maker.id },
      { username: "Rakan Al-Harbi", role_id: shacker.id },
    ],
  })

  console.log("🌱 Done!")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
