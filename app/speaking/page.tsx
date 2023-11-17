import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { formatDate } from 'pliny/utils/formatDate'

const talks = [
  {
    date: 'May 2023',
    event: 'ETHGlobal Lisbon',
    title: "Let's fix our developer experience",
    video: '8knQYLuVKX4',
    description:
      "Like many others, I come from a web development background. And I miss the developer experience from those days. Short feedback loops and low cognitive load are the marks of a good DevEx. Foundry has come a long way to improve things, but a lot more can still be done, particularly for those who don't read EVM over breakfast. This is the story of the inefficiencies I found, the legacy standards we still rely on, and the tools I'm building to address it.",
  },
  {
    date: 'May 2020',
    event: 'DevOps Lisbon',
    title: 'Automating your way to confidence',
    video: 'KrRGMG99zyQ',
    description:
      "A few months ago, Github Actions went to public beta, and it ended up fitting our needs nicely. It also turned out that this CI has a lot more to offer than I was previously used to. This talk is about our journey to make better and faster releases, about how I'm trying to deprecate our project managers, and about how awesome Github Actions can be.",
  },
  {
    date: '2019',
    event: 'Pixels Camp',
    title: "Smart Contracts: A Beginner's Guide",
    video: 'tDthJdl26G4',
    description:
      "Let's talk blockchain! But not the whole money thing. Smart Contracts are the real juice. I will walk you through what a Smart Contract is and why you should care. We will discuss how they differ from traditional computing paradigms, how to approach coding one, and how dangerous they can be.",
  },
  {
    date: '2018',
    event: 'ScaleConf Colombia',
    title: 'An Introduction to Smart Contracts',
    video: 'bYUrCHv9ewI',
    description:
      "Let's talk blockchain! But not the whole money thing. Smart Contracts are the real juice. I will walk you through what a Smart Contract is and why you should care. We will discuss how they differ from traditional computing methods, and what makes this so revolutionary.",
  },
  {
    date: '2017',
    event: 'Pyconf Otto',
    title: 'Mastering your Tools',
    video: 'eCh0rS8g1r4',
    description:
      'This talk goes through some very practical advices about writing code efficiently: ranging from useful and perhaps-not-so-well-known tools, to some editor/terminal/OS configurations that I obsess over in order to tweak my environment to perfection.',
  },
]

export default async function Page() {
  return (
    <ul>
      {talks.map((talk, i) => {
        const { date, title, video, event, description } = talk
        return (
          <li key={i} className="py-10">
            <article>
              <div className="space-y-2 xl:grid xl:grid-cols-6 xl:items-baseline xl:space-y-0">
                <div className="space-y-5 xl:col-span-5">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">{title}</h2>
                      <div className="flex flex-wrap">
                        {event} ({date})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="prose prose-xl mb-3 max-w-none pt-6 text-gray-500 dark:text-gray-400">
                {description}
              </p>
              <iframe
                src={`https://www.youtube.com/embed/${video}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            </article>
          </li>
        )
      })}
    </ul>
  )
}
