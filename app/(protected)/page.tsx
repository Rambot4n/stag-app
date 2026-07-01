import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function HomePage() {
  const surname = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <span className="text-sm font-medium text-slate-400">
          {surname ? `Hey, ${surname.split(" ")[0].charAt(0).toUpperCase() + surname.split(" ")[0].slice(1)}` : ""}
        </span>
        <LogoutButton />
      </div>

      {/* Placeholder - Josh is designing this page separately */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <p className="text-slate-400 text-sm">Home page coming soon</p>
      </div>
    </div>
  );
}
