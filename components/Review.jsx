"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function Review() {
  return (
    <div
      className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "ONE STOP SHOP has completely changed my online shopping experience. From browsing to checkout, everything was smooth. The products arrived well-packaged and exactly as shown. Highly trustworthy store",
    name: "Ebuka Obi",
    title: "Children Bicycle",
  },
  {
    quote:
      "I’ve ordered multiple times from ONE STOP SHOP and I’ve never been disappointed. The variety, pricing, and customer service are top-notch. Definitely worth recommending to friends and family.",
    name: "Ruth Christopher",
    title: "House Holds",
  },
  {
    quote: "ONE STOP SHOP is exactly what every online store should be. I found everything I needed in one place without jumping between multiple websites. The ordering process was simple, payment was secure, and delivery was faster than expected. The quality of the items was excellent, just as advertised. I’ll definitely keep shopping here.",
    name: "Tsado Muhammad",
    title: "Oven",
  },
  {
    quote:
      "I was initially cautious ordering online, but ONE STOP SHOP exceeded my expectations. The product quality, pricing, and customer service were outstanding. My order arrived neatly packaged and on time. It’s rare to find an online store this reliable.",
    name: "Eromosele Friday",
    title: "Refrigerator",
  },
  {
    quote:
      "What impressed me most about ONE STOP SHOP is the consistency. From product descriptions to delivery, everything was accurate and professional. The customer support team was responsive and helpful when I had a question. This store has earned my trust.",
    name: "Herman Okoro",
    title: "Solar Panel",
  },
];
