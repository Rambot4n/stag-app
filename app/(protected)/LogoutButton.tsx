export default function LogoutButton() {
  return (
    <a
      href="/api/auth/logout"
      className="text-sm font-medium text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
    >
      Log out
    </a>
  );
}
