import { createBrowserRouter, Navigate } from "react-router-dom";
import IntroLayout from "./pages/IntroLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainAppPage from "./pages/MainAppPage";
import ProjectView from "./components/project_components/ProjectView";
import TaskView from "./components/task_components/TaskView";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import NothingSelected from "./components/project_components/NothingSelected";
import ResetRequestPage from "./pages/ResetRequestPage";
import ResetConfirmPage from "./pages/ResetConfirmPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <IntroLayout/>,
        children: [
            {
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "register",
                element: <RegisterPage/>
            },
            {
                path: "reset",
                element: <ResetRequestPage/>
            },
            {
                path: "reset/confirm",
                element: <ResetConfirmPage/>
            }
        ]
    },
    {
        path: "/projects",
        element: <ProtectedRoute>
            <MainAppPage/>
        </ProtectedRoute>,
        children: [
            {
                path:"",
                element: <NothingSelected/>
            },
            {
                path: ":projectId", 
                element: <ProjectView/>
            },
            {
                path: ":projectId/tasks/:taskId",
                element: <TaskView/>
            }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute roles={["admin"]}>
            <AdminPage/>
        </ProtectedRoute>
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
])

export default router;