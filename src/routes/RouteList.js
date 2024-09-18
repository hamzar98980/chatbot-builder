import Chats from "../views/Chat/Chats";
import ChatContacts from "../views/Chat/Contact";
import ChatGroups from "../views/Chat/Groups";
import Dashboard from "../views/Dashboard";
//Pages
import Profile from "../views/Profiles/Profile";
import EditProfile from "../views/Profiles/EditProfile";
import Account from "../views/Profiles/Account";
//Auth
import Login from "../views/Authentication/LogIn/Login/Login";
import LoginSimple from "../views/Authentication/LogIn/LoginSimple";
import LoginClassic from "../views/Authentication/LogIn/LoginClassic";
import Signup from "../views/Authentication/SignUp/Signup";
import SignUpSimple from "../views/Authentication/SignUp/SignupSimple";
import SignupClassic from "../views/Authentication/SignUp/SignupClassic";
import LockScreen from "../views/Authentication/LockScreen";
import ResetPassword from "../views/Authentication/ResetPassword";
import Error404 from "../views/Authentication/Error404/Error404";
import Error503 from "../views/Authentication/Error503/Error503";
import ChatPopup from "../views/ChatPopup/DirectMessage";
import ChatBot from "../views/ChatPopup/ChatBot";
import BotBuilder from "../views/Botbuilder/Index";

export const routes = [
  { path: "/", exact: true, component: Chats },
  { path: "dashboard", exact: true, component: Chats },
  //Apps
  { path: "apps/chat/chats", exact: true, component: Chats },
  { path: "apps/chat/chat-groups", exact: true, component: ChatGroups },
  { path: "apps/chat/chat-contact", exact: true, component: ChatContacts },
  { path: "apps/chat-bot/chatpopup", exact: true, component: ChatPopup },
  { path: "apps/chat-bot/chatbot", exact: true, component: ChatBot },
  //Pages
  { path: "pages/profile", exact: true, component: Profile },
  { path: "pages/edit-profile", exact: true, component: EditProfile },
  { path: "pages/account", exact: true, component: Account },
  { path: "pages/botbuilder", exact: true, component: BotBuilder },
  //Error
  { path: "error-404", exact: true, component: Error404 },
];

export const authRoutes = [
  { path: "/login", exact: true, component: Login },
  { path: "/login-simple", exact: true, component: LoginSimple },
  { path: "/login-classic", exact: true, component: LoginClassic },
  { path: "/signup", exact: true, component: Signup },
  { path: "/signup-simple", exact: true, component: SignUpSimple },
  { path: "/signup-classic", exact: true, component: SignupClassic },
  { path: "/lock-screen", exact: true, component: LockScreen },
  { path: "/reset-password", exact: true, component: ResetPassword },
  { path: "/error-503", exact: true, component: Error503 },
];
