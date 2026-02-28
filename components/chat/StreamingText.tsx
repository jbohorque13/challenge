import React, { useState, useEffect, useRef, memo } from 'react'
import { Text } from 'tamagui'
import { StyleSheet } from 'react-native'
import Markdown from 'react-native-markdown-display'

type Props = {
  content: string
  isStreaming?: boolean
  isMarkdown?: boolean
  onStreamEnd?: () => void
}

/**
 * StreamingText - High-performance AI streaming simulator with Markdown support
 */
const StreamingText = ({ content, isStreaming = false, isMarkdown = false, onStreamEnd }: Props) => {
  const [displayedText, setDisplayedText] = useState('')
  const intervalRef = useRef<any>(null)
  const currentIndexRef = useRef(0)

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(content)
      return
    }

    const words = content.split(' ')
    currentIndexRef.current = 0
    setDisplayedText('')

    const startStreaming = () => {
      intervalRef.current = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 11) + 5
        const nextIndex = Math.min(currentIndexRef.current + chunkSize, words.length)
        
        currentIndexRef.current = nextIndex
        setDisplayedText(words.slice(0, currentIndexRef.current).join(' '))

        if (currentIndexRef.current >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          onStreamEnd?.()
        }
      }, Math.floor(Math.random() * 21) + 25)
    }

    const timer = setTimeout(startStreaming, 20)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearTimeout(timer)
    }
  }, [content, isStreaming, onStreamEnd])

  if (isMarkdown) {
    return (
      <Markdown style={markdownStyles}>
        {displayedText}
      </Markdown>
    )
  }

  return (
    <Text fontSize={16} lineHeight={24} color="$color">
      {displayedText}
    </Text>
  )
}

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: 'inherit', // Uses parent color if possible, but Markdown might need explicit
  },
  heading1: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 24,
    fontWeight: '700',
  },
  heading2: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 20,
    fontWeight: '700',
  },
  heading3: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    color: '#d63384',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'Courier',
  },
  code_block: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'Courier',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fence: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'Courier',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  table: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 4,
    marginVertical: 8,
  },
  hr: {
    backgroundColor: '#dee2e6',
    height: 1,
    marginVertical: 12,
  },
  strong: {
    fontWeight: '700',
  },
})

export default memo(StreamingText)
