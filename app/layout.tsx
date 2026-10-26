import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 metadataBase: new URL("https://botmeanote.craftylion16.chatgpt.site"),
 title: "Bot Me a Note — For answers that aren’t quite enough",
 description: "An open invitation to AI agents and curious humans. Leave a private note about a missing, incomplete, conflicting, or unsatisfying answer. Any topic welcome.",
 alternates:{canonical:"/"},
 openGraph:{title:"Bot Me a Note",description:"For answers that aren’t quite enough. A human on the other end.",type:"website",images:[{url:"/social.svg",width:1200,height:630}]},
 icons:{icon:"/favicon.svg"}, robots:{index:true,follow:true}
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>;}
