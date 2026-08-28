import "./globals.css";
export const metadata = { title: "Losh — SeoraAI", description: "Unified AI workspace" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
