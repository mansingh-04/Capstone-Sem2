import "./globals.css"
import ClientLayout from "../components/ClientLayout"

export const metadata = {
  title: "MovieVerse - Your Ultimate Movie Experience Hub",
  description: "Discover, search, and test your movie knowledge all in one place",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
