'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What video resolutions does Sora-2 Ai support?',
      answer: 'Sora-2 Ai supports 480p, 720p, and 1080p video generation. Choose the most suitable resolution based on your project needs, with processing time ranging from 1-3 minutes depending on quality and duration.'
    },
    {
      question: 'How long can I generate videos in Sora-2?',
      answer: 'You can generate videos with 5-second or 10-second duration. This is perfect for social media content, presentations, animations, and creative projects that require precise timing control.'
    },
    {
      question: 'Can I add audio to videos in Sora-2?',
      answer: 'Yes! Sora-2 Ai supports audio integration in WAV and MP3 formats. Audio duration should be 3-30 seconds with a maximum file size of 15MB. Audio will be automatically processed to match video length.'
    },
    {
      question: 'What image formats does Sora-2 support?',
      answer: 'Supported formats include JPEG, JPG, PNG (no transparency), BMP, and WEBP. Images should be 360-2000 pixels in width and height with a maximum file size of 10MB for optimal processing.'
    },
    {
      question: 'What is prompt expansion in Sora-2 Ai?',
      answer: 'Prompt expansion uses LLM technology to automatically enhance your text prompts for better video generation results. This feature helps create more detailed and accurate motion descriptions.'
    },
    {
      question: 'How long does video processing take in Sora-2 Ai?',
      answer: 'Processing typically takes 1-3 minutes, depending on resolution and duration. 1080p and 10-second videos take longer than 480p and 5-second videos. You will receive status updates during processing.'
    },
    {
      question: 'Can I use Sora-2 Ai for commercial projects?',
      answer: 'Yes! All paid plans include commercial licensing rights. You can create videos for marketing, social media, presentations, or any commercial purpose with full usage rights.'
    },
    {
      question: 'How is Sora-2 Ai different from other tools?',
      answer: 'Sora-2 Ai offers professional quality with multiple resolution options, audio integration, flexible duration control, and advanced prompt expansion. It is designed for both beginners and professionals.'
    },
    {
      question: 'How does the credit system work?',
      answer: 'Each video generation consumes credits based on resolution and duration. Higher quality (1080p) and longer duration (10 seconds) videos consume more credits. Check your plan for credit allowances and pricing.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions about Sora-2 Ai
          </h2>
          <p className="text-lg text-gray-600">
            Find the answers you need
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

