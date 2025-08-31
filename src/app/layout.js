import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/next"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Codex - SOA ITER",
  description: "Official website of Codex club at SOA ITER",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <UserProvider>
            {children}
            <Analytics/>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
