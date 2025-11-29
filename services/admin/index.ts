import createDoctor from "./createDoctor.service";
import createStaff from "./createStaff.service";
import deleteUserById from "./deleteUserById.service";
import getFirebaseUsers from "./getFirebaseUsers.service";
import getUserById from "./getUserById.service";
import setStaffRole from "./setStaffRole.service";
import setUserAccess from "./setUserAccess.service";

const adminService = {
  createDoctor,
  createStaff,
  setStaffRole,
  setUserAccess,
  getFirebaseUsers,
  deleteUserById,
  getUserById,
};

export default adminService;
