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
      question: 'How does the motion control work?',
      answer: 'Motion control allows you to describe specific movements, camera angles, and animation effects through text prompts. The AI interprets your descriptions and applies them to transform static images into dynamic videos.'
    },
    {
      question: 'Is there a limit on video generation?',
      answer: 'Currently, there are no strict limits on video generation. However, processing time may vary based on server load and video complexity. Premium users may receive priority processing.'
    },
    {
      question: 'Can I use generated videos commercially?',
      answer: 'Yes! All videos generated through Sora-2 Ai come with commercial usage rights. You can use them for marketing, social media, presentations, and any commercial projects without restrictions.'
    },
    {
      question: 'What happens if my video generation fails?',
      answer: 'If generation fails, please check your internet connection and try again. If the issue persists, contact our support team. Failed generations do not count against your usage limits.'
    },
    {
      question: 'How can I get the best results?',
      answer: 'For best results, use high-quality images (at least 720p), write detailed motion prompts, and choose appropriate resolution settings. The AI works best with clear, well-lit images and specific movement descriptions.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Sora-2 Ai
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
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
      </div>
    </section>
  )
}