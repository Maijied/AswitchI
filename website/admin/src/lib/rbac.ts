import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Role = "master" | "admin" | "moderator" | "dev";

export interface UserAccess {
  email: string;
  role: Role;
  permissions: {
    canDeploy: boolean;
    canViewLogs: boolean;
    canManageUsers: boolean;
    canEditContent: boolean;
  };
  addedAt: string;
}

const DEFAULT_PERMISSIONS: Record<Role, UserAccess["permissions"]> = {
  master: { canDeploy: true, canViewLogs: true, canManageUsers: true, canEditContent: true },
  admin: { canDeploy: true, canViewLogs: true, canManageUsers: false, canEditContent: true },
  moderator: { canDeploy: false, canViewLogs: false, canManageUsers: false, canEditContent: true },
  dev: { canDeploy: false, canViewLogs: true, canManageUsers: false, canEditContent: false }
};

// Always allow the master admin
export const MASTER_ADMIN = "mdshuvo40@gmail.com";

export async function getUserAccess(email: string): Promise<UserAccess | null> {
  if (email === MASTER_ADMIN) {
    return {
      email,
      role: "master",
      permissions: DEFAULT_PERMISSIONS.master,
      addedAt: new Date().toISOString()
    };
  }

  try {
    const docRef = doc(db, "access_control", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserAccess;
    }
  } catch (error) {
    console.error("Error fetching access control:", error);
  }
  return null;
}

export async function getAllUsersAccess(): Promise<UserAccess[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "access_control"));
    const users = querySnapshot.docs.map(doc => doc.data() as UserAccess);
    // Add master admin to the list artificially if not present in DB
    if (!users.find(u => u.email === MASTER_ADMIN)) {
      users.unshift({
        email: MASTER_ADMIN,
        role: "master",
        permissions: DEFAULT_PERMISSIONS.master,
        addedAt: "System Default"
      });
    }
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function setUserAccess(email: string, role: Role, customPermissions?: Partial<UserAccess["permissions"]>): Promise<void> {
  if (email === MASTER_ADMIN) throw new Error("Cannot modify Master Admin.");
  
  const permissions = {
    ...DEFAULT_PERMISSIONS[role],
    ...(customPermissions || {})
  };

  await setDoc(doc(db, "access_control", email), {
    email,
    role,
    permissions,
    addedAt: new Date().toISOString()
  });
}

export async function removeUserAccess(email: string): Promise<void> {
  if (email === MASTER_ADMIN) throw new Error("Cannot remove Master Admin.");
  await deleteDoc(doc(db, "access_control", email));
}
