import React, { useState, useEffect, useRef, memo } from 'react'
import { Text } from 'tamagui'

type Props = {
  content: string
  isStreaming?: boolean
  onStreamEnd?: () => void
}

/**
 * StreamingText - High-performance AI streaming simulator
 * 
 * Logic:
 * 1. Chunks text by words (simulating tokenized streaming).
 * 2. Uses a fast interval (25-45ms) to append 5-15 words at a time.
 * 3. Immediately displays initial content if available.
 * 
 * UX Rationale:
 * Creating a "materializing" feel by appending chunks rather than
 * a typewriter effect, which is easier on the eyes and mimics modern
 * LLM behavior.
 */
const StreamingText = ({ content, isStreaming = false, onStreamEnd }: Props) => {
  const [displayedText, setDisplayedText] = useState('')
  const intervalRef = useRef<any>(null)
  
  // Track the current word index we've reached
  const currentIndexRef = useRef(0)

  useEffect(() => {
    // If not streaming, just show the full content immediately
    if (!isStreaming) {
      setDisplayedText(content)
      return
    }

    // Prepare text into chunks (words)
    const words = content.split(' ')
    currentIndexRef.current = 0
    setDisplayedText('')

    const startStreaming = () => {
      intervalRef.current = setInterval(() => {
        // Randomize chunk size for realistic "generation" feel
        const chunkSize = Math.floor(Math.random() * 11) + 5 // 5 to 15 words
        const nextIndex = Math.min(currentIndexRef.current + chunkSize, words.length)
        
        currentIndexRef.current = nextIndex
        setDisplayedText(words.slice(0, currentIndexRef.current).join(' '))

        if (currentIndexRef.current >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          onStreamEnd?.()
        }
      }, Math.floor(Math.random() * 21) + 25) // 25ms to 45ms
    }

    // Instant start (<50ms)
    const timer = setTimeout(startStreaming, 20)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearTimeout(timer)
    }
  }, [content, isStreaming, onStreamEnd])

  return (
    <Text fontSize={16} lineHeight={24}>
      {displayedText}
    </Text>
  )
}

export default memo(StreamingText)
