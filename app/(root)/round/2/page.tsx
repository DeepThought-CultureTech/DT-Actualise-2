import { Round2CTA } from "@/components/round2/hook/CTA";
import Guide from "@/components/round2/hook/Guide";
import { MindsetSection } from "@/components/round2/hook/MindsetYouNeed";
import RoundTwoHero from "@/components/round2/hook/RoundTwoHero";
import WhatsNext from "@/components/round2/hook/WhatsNext";

//test commit

export default function Page() {
  return (
    <div>
      <main>
        <RoundTwoHero />
        <WhatsNext />
        <Guide />
        <MindsetSection />
        <Round2CTA />
      </main>
    </div>
  )
}