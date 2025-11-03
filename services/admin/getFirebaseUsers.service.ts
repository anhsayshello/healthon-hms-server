import { getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";

export default async function getFirebaseUsers(nextPageToken?: string) {
  const listUsersResult = await getAuth(app).listUsers(10, nextPageToken);
  const users = listUsersResult.users;

  return {
    data: users,
    nextPageToken: listUsersResult.pageToken,
  };
}
