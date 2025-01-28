import Link from "next/link";

export default function Home() {
  const routes = ["connect", "sign-in", "sign-up"];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <nav className="flex gap-2">
          {routes.map((route) => (
            <Link key={route} href={`/${route}`} className="capitalize">
              {route.replace("-", " ")}
            </Link>
          ))}
        </nav>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
