import Link from "next/link";

export default function Navigation() {
  const routes = ["connect", "sign-in", "sign-up", "dashboard"];
  return (
    <nav className="flex gap-2 bg-blue-800 p-4 justify-around items-center">
      {routes.map((route) => (
        <Link
          key={route}
          href={`/${route}`}
          className="capitalize border border-green-200"
        >
          {route.replace("-", " ")}
        </Link>
      ))}
    </nav>
  );
}
