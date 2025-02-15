"use client"
import React from "react";
import HeroSection from "./components/hero_section";

export default function Home() {
  return (
    <main className="h-screen">
      <HeroSection />
      <DecryptedText text="Hover me!" />

{/* Example 2: Customized speed and characters */}
<DecryptedText
text="Customize me"
speed={100}
maxIterations={20}
characters="ABCD1234!?"
className="revealed"
parentClassName="all-letters"
encryptedClassName="encrypted"
/>

{/* Example 3: Animate on view (runs once) */}
<div style={{ marginTop: '4rem' }}>
<DecryptedText
  text="This text animates when in view"
  animateOn="view"
  revealDirection="center"
/>
</div>
    </main>
  );
}

import DecryptedText from "@/app/ui_comp/de_para"

{/* Example 1: Defaults (hover to decrypt) */}
