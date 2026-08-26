import { Button } from "@/components/ui/button";
import "../App.css";
import { PiFlowerLotusDuotone } from "react-icons/pi";


function Home() {


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex w-full max-w-xl flex-col items-center text-center">

        {/* Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/10 bg-white shadow-sm">
          <PiFlowerLotusDuotone className="h-12 w-12 text-green-600" />
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Brainwell
        </h1>

        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          Explore how different brain regions relate to your thoughts,
          emotions, attention, and behavior.
        </p>

        {/* Disclaimer */}
        <div className="mt-6 flex max-w-md items-start gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-left shadow-sm backdrop-blur-sm">
          <span className="mt-0.5 text-sm text-muted-foreground">
            ⓘ
          </span>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Brainwell is an educational and exploratory tool. It is not intended
            to diagnose, treat, or replace professional medical advice.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => (window.location.href = "/brain-map")}
          size="lg"
          className="mt-8 h-11 px-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Explore your brain
          <span className="ml-2 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Button>

        {/* Small secondary hint */}
        <p className="mt-4 text-xs text-muted-foreground">
          Educational  •  Exploratory  •  Private
        </p>
      </div>
    </div>
  );
}

export default Home;
