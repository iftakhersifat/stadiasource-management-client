import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from './Components/Root/Home.jsx';
import Root from './Components/Root/Root.jsx';
import Login from './Components/Start/Login.jsx';
import Register from './Components/Start/Register.jsx';
import AuthProvider from './Components/Firebase/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';
import AdminPrivate from './Components/Firebase/AdminPrivate.jsx';
import AdminDashboard from './Components/Layout/AdminDashboard.jsx';
import DashboardHome from './Components/Layout/DashboardHome.jsx';
import ManageUsers from './Components/Admin/ManageUsers.jsx';
import ModeratorDashboard from './Components/Layout/ModeratorDashboard.jsx';
import EmployeePrivate from './Components/Firebase/EmployeePrivate.jsx';
import ManageNews from './Components/Layout/ManageNews.jsx';
import MatchManagement from './Components/Layout/MatchManagement.jsx';
import MatchDetails from './Components/Pages/MatchDetails.jsx';
import Fixtures from './Components/Pages/Fixtures.jsx';
import AddPlayer from './Components/Layout/AddPlayer.jsx';
import PlayerDetails from './Components/Pages/PlayerDetails.jsx';
import Player from './Components/Page/Player.jsx';
import ManagerRegistration from './Components/Layout/ManagerRegistration.jsx';
import ManagerDetails from './Components/Pages/ManagerDetails.jsx';
import Manager from './Components/Page/Manager.jsx';
import PlayerManagement from './Components/Layout/PlayerManagement.jsx';
import BannerManagement from './Components/Layout/BannerManagement.jsx';
import AddClubHistory from './Components/Layout/AddClubHistory.jsx';
import ClubDetails from './Components/Pages/ClubDetails.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children:[
      {index:true, Component:Home},
      {path:'/login', Component: Login},
      {path:'/register', Component: Register},
      {path:'/match/:id', Component: MatchDetails},
      {path:'/fixtures', Component: Fixtures},
      {path:'/player/:id', element: <PlayerDetails></PlayerDetails>},
      {path:'/manager/:id', element: <ManagerDetails></ManagerDetails>},
      {path:'/club-details/:id', element: <ClubDetails></ClubDetails>},

      {path:'/players', Component: Player},
      {path:'/managers', Component: Manager},
    ]
  },
  {
    path: "/admin",
    element: <AdminPrivate><AdminDashboard></AdminDashboard></AdminPrivate>,
    children: [
      {index:true, element: <DashboardHome />},
      {path:'manage-users', element: <ManageUsers />},
      { path: 'add-news', element: <ManageNews /> },
      { path: 'match-manage', element: <MatchManagement /> },
      { path: 'add-player', element: <AddPlayer /> },
      { path: 'add-manager', element: <ManagerRegistration /> },
      { path: 'team-set', element: <PlayerManagement /> },
      { path: 'banner', element: <BannerManagement /> },
      { path: 'add-club', element: <AddClubHistory /> },
    ],
  },

  {
    path: "/moderator",
    element: <EmployeePrivate><ModeratorDashboard /></EmployeePrivate>,
    children: [
      { path: 'add-news', element: <ManageNews /> },
      { path: 'add-news', element: <ManageNews /> },
      { path: 'match-manage', element: <MatchManagement /> },
      { path: 'add-player', element: <AddPlayer /> },
      { path: 'add-manager', element: <ManagerRegistration /> },
      { path: 'team-set', element: <PlayerManagement /> },
      { path: 'banner', element: <BannerManagement /> },
      { path: 'add-club', element: <AddClubHistory /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
