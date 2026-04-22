import { Calculator } from "@/components/calculator/Calculator";

export default function Home() {
  return (
    <main className="flex-1 w-full bg-background relative selection:bg-primary/30">

      <div className="container mx-auto px-4 py-12 lg:py-24 space-y-12">
        <header className="text-center mb-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground drop-shadow-lg">
            Joule<span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-emerald-500 to-teal-500 pr-2">Hub</span>
          </h1>
        </header>

        <section className="flex justify-center w-full">
          <Calculator />
        </section>
      </div>
    </main>
  );
}
