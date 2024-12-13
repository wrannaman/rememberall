import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Use Cases', href: '#use-cases' },
  { name: 'Try Our GPT', href: 'https://chatgpt.com/g/g-6758dcd4e3948191b55b20aba2866b3b-rememberall' },
  { name: 'Open Source', href: 'https://github.com/wrannaman/rememberall' },
  { name: 'Install', href: '/auth' },
]

const useCases = [
  {
    name: 'Works Everywhere',
    description: 'Compatible with ChatGPT, Claude, and other major AI assistants. One click to save conversations or inject relevant context.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Never Repeat Yourself',
    description: 'Stop explaining your preferences and context in every chat. Just mention @rememberall and your AI instantly knows your relevant history.',
    icon: SparklesIcon,
  },
  {
    name: 'Seamless Memory Storage',
    description: 'Your conversations are automatically indexed and stored. No manual input required - just chat naturally and let Rememberall handle the rest.',
    icon: BoltIcon,
  },
  {
    name: 'Context-Aware Recall',
    description: 'Rememberall intelligently surfaces only the most relevant memories based on your current conversation. No information overload.',
    icon: CommandLineIcon,
  },
  {
    name: 'Private & Secure',
    description: 'Your memories are encrypted and stored securely. You control what\'s remembered and what\'s forgotten.',
    icon: ShieldCheckIcon,
  },
]

const demoExamples = [
  {
    before: "In the middle of an important conversation...",
    after: "*clicks 'Remember' button*",
    response: "✓ Conversation saved! Edit or tag this memory in your dashboard for better context management."
  },
  {
    before: "Starting a new chat about your project...",
    after: "*clicks 'Inject Context' button*",
    response: "Relevant context from your past conversations has been added to the chat: Your React project uses TypeScript, Tailwind, and you prefer functional components..."
  }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoExamples.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>Rememberall | Perfect Memory for Your AI Assistant</title>
        <meta name="description" content="Give your AI assistant perfect memory. Just mention @rememberall to access context from all your past conversations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Rememberall</span>
              <img className="h-8 w-auto" src="/icon.png" alt="Rememberall" />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold text-white hover:text-indigo-300">
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-white">
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Rememberall</span>
                <img className="h-8 w-auto" src="/icon.png" alt="Rememberall" />
              </a>
              <button
                type="button"
                className="text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-800">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-base font-semibold text-white hover:bg-gray-800"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative isolate pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-purple-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl">
                  Your AI Assistant with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Perfect Memory
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  A simple Chrome extension that adds memory to your AI chats. Works with ChatGPT, Claude, and other AI assistants.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Proudly open source on <a href="https://github.com/wrannaman/rememberall" className="text-indigo-400 hover:text-indigo-300 underline">GitHub</a>
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a href="#install" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Install Now
                  </a>
                  <a href="#demo" className="text-sm font-semibold leading-6 text-white">
                    See it in action <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* Live Demo Section */}
              <div className="mt-16 flow-root sm:mt-24">
                <div className="relative rounded-xl bg-gray-900/80 p-8 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/70 to-indigo-500/0" />
                  <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-purple-400/0 via-purple-400/70 to-purple-400/0" />
                  <div className="transition-all duration-500 ease-in-out">
                    <div className="mb-4 text-sm text-gray-400">Before:</div>
                    <p className="text-white mb-6">{demoExamples[currentDemo].before}</p>
                    <div className="mb-4 text-sm text-gray-400">With Rememberall:</div>
                    <p className="text-indigo-400 mb-6">{demoExamples[currentDemo].after}</p>
                    <div className="mb-4 text-sm text-gray-400">AI Response:</div>
                    <p className="text-green-400">{demoExamples[currentDemo].response}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need for perfect AI memory
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {useCases.map((useCase) => (
                <div key={useCase.name} className="flex flex-col bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition-all hover:scale-105">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold text-white">
                    <useCase.icon className="h-7 w-7 flex-none text-indigo-400" />
                    {useCase.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base text-gray-400">
                    <p className="flex-auto">{useCase.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-lg border-t border-gray-800 p-4 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          <div className="text-white">
            <p className="font-semibold">Ready to enhance your AI's memory?</p>
            <p className="text-sm text-gray-400">Available on OpenAI's GPT Store</p>
          </div>
          <a
            href="https://chat.openai.com"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105"
          >
            Install Now →
          </a>
        </div>
      </div>
    </div>
  );
}