'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is Sora2 AI generator?',
      answer: 'Sora2 is an advanced AI video generation platform that transforms text prompts and images into high-quality videos using cutting-edge artificial intelligence technology.'
    },
    {
      question: 'How does text-to-video work?',
      answer: 'Simply enter a text description of the video you want to create, and our AI model will generate a corresponding video based on your prompt. The AI understands context and creates relevant visual content.'
    },
    {
      question: 'Can I use Sora2 for free?',
      answer: 'Yes! Sora2 offers a free tier that allows you to try the platform and generate videos. You can upgrade to premium plans for more credits and advanced features.'
    },
    {
      question: 'What formats are supported?',
      answer: 'Sora2 supports multiple export formats including MP4, WebM, and MOV. You can choose the format that best suits your needs and platform requirements.'
    },
    {
      question: 'How long does generation take?',
      answer: 'Video generation typically takes 2-5 minutes depending on complexity and current server load. Premium users get priority processing for faster results.'
    },
    {
      question: 'Is Sora2 suitable for commercial use?',
      answer: 'Yes! All generated content comes with commercial license and unrestricted usage rights, making it perfect for marketing, social media, and professional projects.'
    },
    {
      question: 'What makes this different from other AI generators?',
      answer: 'Sora2 combines advanced AI technology with an intuitive interface, offering high-quality results, fast processing, and flexible export options in one platform.'
    },
    {
      question: 'Can Sora2 convert images to videos?',
      answer: 'Absolutely! Sora2 supports both text-to-video and image-to-video generation, allowing you to animate static images or create videos from scratch using text prompts.'
    },
    {
      question: 'Do I need technical skills?',
      answer: 'No technical skills required! Sora2 is designed to be user-friendly for everyone, from beginners to professionals. The intuitive interface makes AI video creation accessible to all.'
    },
    {
      question: 'How can I get support?',
      answer: 'Our support team is available to help you with any questions or issues. You can reach out through our contact form or check our comprehensive FAQ section.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sora2 FAQ
          </h2>
          <p className="text-xl text-gray-300">
            Common Questions About Sora2
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}