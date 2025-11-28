import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../utils/AuthContext"; // ✅ Chemin corrigé
import { FamilyMembersProvider } from "../utils/FamilyMembersContext"; // ✅ Chemin corrigé
import { TaskTypeProvider } from "../utils/TaskTypeContext"; // ✅ Chemin corrigé
import { TaskProvider } from "../utils/TaskContext"; // ✅ Chemin corrigé

export default function RootLayout() {
  return (
    <AuthProvider>
      <FamilyMembersProvider>
        <TaskTypeProvider>
          <TaskProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toast />
          </TaskProvider>
        </TaskTypeProvider>
      </FamilyMembersProvider>
    </AuthProvider>
  );
}