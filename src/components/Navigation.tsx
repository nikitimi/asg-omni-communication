import Link from "next/link";

export default function Navigation() {
  const routes = [
    { value: "email", name: "email" },
    { value: "voice", name: "voice" },
    { value: "sign-in", name: "chat" },
    { value: "dashboard", name: "SMS/MMS" },
  ];
  return (
    <nav className="flex gap-2 bg-blue-800 p-4 justify-around items-center">
      {routes.map(({ value, name }) => (
        <Link key={value} href={`/${value}`} className="capitalize">
          {name.replace("-", " ")}
        </Link>
      ))}
    </nav>
  );
}
