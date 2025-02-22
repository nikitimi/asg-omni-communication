import Navigation from "@/components/Navigation";
import VoicePeer from "@/components/VoicePeer";

export default function Voice() {
  return (
    <div>
      <Navigation />
      <section className="flex h-screen items-center justify-center flex-col">
        <VoicePeer />
      </section>
    </div>
  );
}
