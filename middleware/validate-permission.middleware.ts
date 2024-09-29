import { db } from "../database/db";

export const allowedRoles = (...roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    const { user } = req;

    if (!roles.includes(req.user.role.toLowerCase())) {
      const roleFromDB = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      console.log("roleFromDB=>", roleFromDB);

      if (roleFromDB && !roles.includes(roleFromDB.role.toLowerCase()))
        return res.status(403).json({
          message: "You don't have permission to perform this action.",
        });
    }
    next();
  };
};
