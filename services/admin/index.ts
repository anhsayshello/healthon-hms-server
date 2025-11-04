import createDoctor from "./createDoctor.service";
import createStaff from "./createStaff.service";
import deleteUserById from "./deleteUserById.service";
import getAdminDashboardStatistics from "./getAdminDashBoardStatistic.service";
import getFirebaseUsers from "./getFirebaseUsers.service";
import setStaffRole from "./setStaffRole.service";
import setUserAccess from "./setUserAccess.service";

const adminService = {
  createDoctor,
  createStaff,
  setStaffRole,
  setUserAccess,
  getAdminDashboardStatistics,
  getFirebaseUsers,
  deleteUserById,
};

export default adminService;
