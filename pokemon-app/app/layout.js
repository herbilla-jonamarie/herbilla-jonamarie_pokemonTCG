import "./globals.css";
import ReduxProvider from "./components/ReduxProvider";

export const metadata = {
  title: "PokéArena TCG",
  description: "Explore, collect and favorite Pokémon Trading Card Game cards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Russo+One&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}