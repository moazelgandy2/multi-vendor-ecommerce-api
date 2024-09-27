export const allowedRoles = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role.toLowerCase())) {
      console.log(req.user.role);

      return res.status(403).json({
        message: "You don't have permission to perform this action.",
      });
    }
    next();
  };
};
