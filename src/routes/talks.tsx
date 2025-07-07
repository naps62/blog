import { createFileRoute } from "@tanstack/react-router";

const talks = [
  {
    date: "July 2025",
    event: "ETHPrague 2025",
    title: "A local first approach for web3 development",
    video: "lEAsmgOjLK4",
    description:
      "A discussion on how local-friendly development is an important need of many developers, and why a lot of web3-specific tooling breaks that reality. my project, ethui, aims to improve on that.",
  },
  {
    date: "May 2023",
    event: "ETHGlobal Lisbon",
    title: "Let's fix our developer experience",
    video: "8knQYLuVKX4",
    description:
      "Like many others, I come from a web development background. And I miss the developer experience from those days. Short feedback loops and low cognitive load are the marks of a good DevEx. Foundry has come a long way to improve things, but a lot more can still be done, particularly for those who don't read EVM over breakfast. This is the story of the inefficiencies I found, the legacy standards we still rely on, and the tools I'm building to address it.",
  },
  {
    date: "May 2020",
    event: "DevOps Lisbon",
    title: "Automating your way to confidence",
    video: "KrRGMG99zyQ",
    description:
      "A few months ago, Github Actions went to public beta, and it ended up fitting our needs nicely. It also turned out that this CI has a lot more to offer than I was previously used to. This talk is about our journey to make better and faster releases, about how I'm trying to deprecate our project managers, and about how awesome Github Actions can be.",
  },
  {
    date: "2019",
    event: "Pixels Camp",
    title: "Smart Contracts: A Beginner's Guide",
    video: "tDthJdl26G4",
    description:
      "Let's talk blockchain! But not the whole money thing. Smart Contracts are the real juice. I will walk you through what a Smart Contract is and why you should care. We will discuss how they differ from traditional computing paradigms, how to approach coding one, and how dangerous they can be.",
  },
  {
    date: "2018",
    event: "ScaleConf Colombia",
    title: "An Introduction to Smart Contracts",
    video: "bYUrCHv9ewI",
    description:
      "Let's talk blockchain! But not the whole money thing. Smart Contracts are the real juice. I will walk you through what a Smart Contract is and why you should care. We will discuss how they differ from traditional computing methods, and what makes this so revolutionary.",
  },
  {
    date: "2017",
    event: "Pyconf Otto",
    title: "Mastering your Tools",
    video: "eCh0rS8g1r4",
    description:
      "This talk goes through some very practical advices about writing code efficiently: ranging from useful and perhaps-not-so-well-known tools, to some editor/terminal/OS configurations that I obsess over in order to tweak my environment to perfection.",
  },
];

export const Route = createFileRoute("/talks")({
  component: () => (
    <div className="prose prose-lg max-w-none">
      <h1>Talks</h1>
      <ul className="space-y-8">
        {talks.map((talk, i) => (
          <li key={i} className="border-b border-border-primary pb-8">
            <article>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {talk.title}
                  </h2>
                  <div className="text-nav-text">
                    {talk.event} ({talk.date})
                  </div>
                </div>
                <p className="text-nav-text">{talk.description}</p>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${talk.video}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  ),
});
