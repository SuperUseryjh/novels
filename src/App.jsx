import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { Compass, Shuffle, Search, X, Book, ChevronRight, BookOpen, Hash, ArrowLeft, ArrowRight, Volume2, Square, Share2, Sun, Moon, Type, Settings, History, Gauge, Volume1, RotateCcw, Loader2, Frown } from 'lucide-react'
import { marked } from 'marked'
import './index.css'

const Toast = ({ message, visible }) => {
  if (!visible) return null
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl text-sm font-bold animate-toast-in">
      {message}
    </div>
  )
}

const HomeView = ({ 
  config, 
  searchQuery, 
  setSearchQuery, 
  selectedTag, 
  setSelectedTag, 
  displayedNovels, 
  showAll, 
  setShowAll, 
  navigate, 
  resumeInfo, 
  setResumeInfo,
  randomNovel 
}) => {
  const allTags = useMemo(() => {
    if (!config?.novels) return []
    const tags = new Set()
    config.novels.forEach(novel => {
      if (novel.tags && Array.isArray(novel.tags)) {
        novel.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [config])

  const filteredNovels = useMemo(() => {
    if (!config?.novels) return []
    return config.novels.filter(novel => {
      const matchesSearch = searchQuery === '' || 
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTag = !selectedTag || 
        (novel.tags && Array.isArray(novel.tags) && novel.tags.includes(selectedTag))
      
      return matchesSearch && matchesTag
    })
  }, [config, searchQuery, selectedTag])

  const displayed = useMemo(() => {
    const hasSearch = searchQuery || selectedTag
    if (hasSearch) {
      return filteredNovels
    } else {
      return showAll ? filteredNovels : filteredNovels.slice(0, 6)
    }
  }, [filteredNovels, searchQuery, selectedTag, showAll])

  return (
    <div className="max-w-5xl mx-auto p-8 pt-16 relative min-h-screen">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Compass className="w-8 h-8 text-rose-500" />
          </div>
          <button
            onClick={randomNovel}
            className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-md shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
            title="随机跳转"
          >
            <Shuffle className="w-6 h-6" />
          </button>
        </div>
        <h1 className="text-4xl font-serif-sc font-bold tracking-tight text-gray-900 dark:text-white mb-3">私人书廊</h1>
        <div className="w-12 h-1 bg-rose-500 mx-auto rounded-full"></div>
      </header>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索小说标题、作者或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {(searchQuery || selectedTag) && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            找到 <span className="font-bold text-rose-500">{filteredNovels.length}</span> 部小说
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="ml-2 text-rose-500 hover:underline font-medium"
              >
                清除筛选
              </button>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {displayed.length > 0 ? (
          displayed.map(novel => (
            <div 
              key={novel.id}
              onClick={() => navigate(`/detail/${novel.id}`)}
              className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl book-card-shadow border border-gray-100/50 dark:border-gray-700 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                {novel.cover ? 
                  <img src={novel.cover} alt={novel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : 
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <Book className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white text-sm font-medium flex items-center gap-1">书籍详情 <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-serif-sc font-bold mb-1 truncate text-gray-900 dark:text-white">{novel.title}</h2>
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-3">{novel.author}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed">{novel.description}</p>
                {novel.tags && Array.isArray(novel.tags) && novel.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {novel.tags.map(tag => (
                      <span 
                        key={tag}
                        onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                        className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-medium rounded-md cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">没有找到匹配的小说</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {searchQuery && `尝试搜索 "${searchQuery}" 无结果`}
              {selectedTag && `标签 "${selectedTag}" 下无小说`}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>

      {!searchQuery && !selectedTag && filteredNovels.length > 6 && !showAll && (
        <div className="text-center mb-20">
          <button
            onClick={() => setShowAll(true)}
            className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-rose-500 text-rose-500 dark:text-rose-400 rounded-full font-bold hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            显示全部 {filteredNovels.length} 部小说
          </button>
        </div>
      )}

      {!searchQuery && !selectedTag && showAll && (
        <div className="text-center mb-20">
          <button
            onClick={() => setShowAll(false)}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            收起
          </button>
        </div>
      )}

      {resumeInfo && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 animate-slide-in-up">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 dark:border-black/10">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-rose-500 p-2 rounded-xl shrink-0">
                <History className="text-white w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">上次读到</p>
                <p className="text-sm font-bold truncate">《{resumeInfo.novelTitle}》 {resumeInfo.chapterTitle}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setResumeInfo(null)}
                className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate(`/reader/${resumeInfo.novelId}/${resumeInfo.chapterIndex}`)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
              >
                继续阅读
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const DetailView = ({ config, novelId, navigate }) => {
  const novel = config?.novels.find(n => n.id === novelId)
  if (!novel) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 text-center">
      <h2 className="text-xl font-bold mb-4 dark:text-white">未找到该小说 ID: {novelId}</h2>
      <button onClick={() => navigate('/')} className="text-rose-500 font-bold">返回书库</button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-8 pt-12 animate-fade-in">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-rose-500 font-medium mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 返回书库
      </button>
      <div className="flex flex-col md:flex-row gap-12 mb-20 items-start">
        <div className="w-56 aspect-[3/4] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex-shrink-0 overflow-hidden border-8 border-white dark:border-gray-800 sticky top-12">
          {novel.cover ? 
            <img src={novel.cover} alt={novel.title} className="w-full h-full object-cover" /> : 
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <BookOpen className="w-16 h-16 text-gray-200" />
            </div>
          }
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-serif-sc font-bold mb-4 leading-tight text-gray-900 dark:text-white">{novel.title}</h1>
          <p className="text-xl text-rose-600 dark:text-rose-400 mb-8 font-medium italic">by {novel.author}</p>
          <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-10">
            {novel.description}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/reader/${novelId}/0`)}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-lg"
            >
              立刻开始阅读
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-serif-sc font-bold mb-8 flex items-center gap-3">
          <Hash className="text-rose-500" /> 章节目录
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          {novel.chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => navigate(`/reader/${novelId}/${index}`)}
              className="text-left py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all flex items-center gap-4 group border-b border-gray-50 dark:border-gray-700/50"
            >
              <span className="text-xs font-mono text-gray-300 dark:text-gray-600 group-hover:text-rose-400">{ (index + 1).toString().padStart(2, '0') }</span>
              <span className="text-gray-700 dark:text-gray-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const ReaderView = ({ config, novelId, chapterIndex, navigate }) => {
  const [rawContent, setRawContent] = useState('')
  const [loadingContent, setLoadingContent] = useState(true)
  const [isReading, setIsReading] = useState(false)
  const [speechSynth, setSpeechSynth] = useState(null)
  const [showSpeechSettings, setShowSpeechSettings] = useState(false)
  const [speechSettings, setSpeechSettings] = useState({
    rate: 1.0,
    volume: 1.0
  })
  const [settings, setSettings] = useState({
    darkMode: false,
    fontSize: 19,
    maxWidth: 720
  })

  const novel = config?.novels.find(n => n.id === novelId)
  const chapter = novel?.chapters[chapterIndex]

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynth(window.speechSynthesis)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!chapter) return
      try {
        setLoadingContent(true)
        const res = await fetch(`/article/${novelId}/${chapter.path}`)
        const txt = await res.text()
        setRawContent(txt)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        setRawContent('加载内容失败。')
      } finally {
        setLoadingContent(false)
      }
    }
    load()
  }, [novelId, chapterIndex])

  useEffect(() => {
    if (novelId && chapter !== undefined) {
      localStorage.setItem('last_read', JSON.stringify({
        novelId,
        chapterIndex
      }))
    }
  }, [novelId, chapterIndex])

  useEffect(() => {
    return () => {
      if (speechSynth) {
        speechSynth.cancel()
      }
    }
  }, [speechSynth])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSpeechSettings && !e.target.closest('.relative')) {
        setShowSpeechSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSpeechSettings])

  const toggleReading = () => {
    if (!speechSynth || !rawContent) return

    if (isReading) {
      speechSynth.cancel()
      setIsReading(false)
      return
    }

    const text = rawContent.replace(/[#*>\n]/g, ' ').replace(/\s+/g, ' ').trim()
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = speechSettings.rate
    utterance.pitch = 1.0
    utterance.volume = speechSettings.volume

    utterance.onend = () => {
      setIsReading(false)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setIsReading(false)
    }

    speechSynth.speak(utterance)
    setIsReading(true)
  }

  const copyShareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('已复制分享链接到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制浏览器地址')
    })
  }

  const htmlContent = useMemo(() => {
    if (!rawContent) return ''
    try {
      return marked.parse(rawContent)
    } catch (e) {
      const lines = rawContent.split('\n')
      return lines.map((line, i) => {
        if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mb-6">${line.slice(2)}</h1>`
        if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold mb-4">${line.slice(3)}</h2>`
        if (line.startsWith('### ')) return `<h3 class="text-xl font-bold mb-3">${line.slice(4)}</h3>`
        if (line.startsWith('> ')) return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">${line.slice(2)}</blockquote>`
        if (line.trim() === '') return '<br/>'
        return `<p>${line}</p>`
      }).join('')
    }
  }, [rawContent])

  if (!novel || !chapter) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 text-center">
      <h2 className="text-xl font-bold mb-4 dark:text-white">未找到章节信息</h2>
      <button onClick={() => navigate('/')} className="text-rose-500 font-bold">返回书库</button>
    </div>
  )

  const readerBg = settings.darkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-[#fcfaf2] text-[#333333]'

  return (
    <div className={`min-h-screen transition-all duration-500 ${readerBg}`}>
      <div className="fixed top-0 left-0 right-0 z-20 h-16 flex items-center bg-inherit/80 backdrop-blur-md px-6">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <button onClick={() => navigate(`/detail/${novelId}`)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-serif-sc font-bold opacity-40 truncate px-4">{chapter.title}</div>
          <div className="flex gap-1 relative">
            <button onClick={toggleReading} title={isReading ? "停止朗读" : "大声朗读"} className={`p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors ${isReading ? 'text-rose-500' : ''}`}>
              {isReading ? <Square className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowSpeechSettings(!showSpeechSettings)} 
              title="朗读设置" 
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={copyShareLink} title="分享本章" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setSettings(s => ({ ...s, fontSize: s.fontSize >= 30 ? 16 : s.fontSize + 2 }))} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <Type className="w-5 h-5" />
            </button>

            {showSpeechSettings && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-rose-500" />
                    朗读设置
                  </h3>
                  <button onClick={() => setShowSpeechSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Gauge className="w-3 h-3" />
                        语速
                      </label>
                      <span className="text-xs font-mono font-bold text-rose-500">{speechSettings.rate.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speechSettings.rate}
                      onChange={(e) => setSpeechSettings(s => ({ ...s, rate: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                      <span>慢</span>
                      <span>正常</span>
                      <span>快</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Volume1 className="w-3 h-3" />
                        音量
                      </label>
                      <span className="text-xs font-mono font-bold text-rose-500">{Math.round(speechSettings.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={speechSettings.volume}
                      onChange={(e) => setSpeechSettings(s => ({ ...s, volume: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                      <span>静音</span>
                      <span>适中</span>
                      <span>最大</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSpeechSettings({ rate: 1.0, volume: 1.0 })}
                    className="w-full py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    恢复默认设置
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-32 animate-fade-in font-serif-sc" style={{ maxWidth: `${settings.maxWidth}px`, fontSize: `${settings.fontSize}px`, lineHeight: '1.9' }}>
        <h2 className="text-4xl font-bold mb-20 text-center text-gray-900 dark:text-gray-100">{chapter.title}</h2>
        {loadingContent ? (
          <div className="space-y-8 py-20">
            {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full animate-pulse"></div>)}
          </div>
        ) : (
          <div 
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        <div className="mt-32 flex flex-col items-center gap-12 pb-40">
          <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="w-full flex gap-6">
            {chapterIndex > 0 && (
              <button 
                onClick={() => navigate(`/reader/${novelId}/${chapterIndex - 1}`)}
                className="flex-1 flex items-center justify-center gap-3 p-6 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-all font-bold"
              >
                <ArrowLeft className="w-5 h-5" /> 上一章
              </button>
            )}
            {chapterIndex < novel.chapters.length - 1 && (
              <button 
                onClick={() => navigate(`/reader/${novelId}/${chapterIndex + 1}`)}
                className="flex-1 flex items-center justify-center gap-3 p-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl hover:bg-rose-600 dark:hover:bg-rose-400 dark:hover:text-white transition-all font-bold shadow-xl"
              >
                下一章 <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ message: '', visible: false })
  const [resumeInfo, setResumeInfo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const response = await fetch('/article/index.json')
        if (!response.ok) throw new Error('无法读取配置文件。')
        const data = await response.json()
        setConfig(data)
      } catch (err) {
        setError(err.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    if (config) {
      const lastRead = localStorage.getItem('last_read')
      if (lastRead) {
        try {
          const parsed = JSON.parse(lastRead)
          const novel = config.novels.find(n => n.id === parsed.novelId)
          const chapter = novel?.chapters[parsed.chapterIndex]
          if (novel && chapter) {
            setResumeInfo({
              novelId: parsed.novelId,
              chapterIndex: parsed.chapterIndex,
              novelTitle: novel.title,
              chapterTitle: chapter.title
            })
          }
        } catch (e) {
          console.error("Failed to parse history")
        }
      }
    }
  }, [config])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const randomNovel = () => {
    if (!config?.novels || config.novels.length === 0) return
    const randomIndex = Math.floor(Math.random() * config.novels.length)
    const novel = config.novels[randomIndex]
    window.location.href = `/detail/${novel.id}`
    showToastMsg(`随机跳转到：《${novel.title}》`)
  }

  const showToastMsg = (msg) => {
    setToast({ message: msg, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 2000)
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center text-rose-500 bg-[#fdfaf5] dark:bg-zinc-950">
      <Loader2 className="animate-spin w-12 h-12 mb-4" />
      <p className="text-xs font-bold tracking-widest uppercase opacity-40">Loading Library</p>
    </div>
  )

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 bg-white dark:bg-zinc-900">
      <Frown className="w-16 h-16 text-gray-200 mb-6" />
      <h2 className="text-xl font-bold mb-4 dark:text-white">{error}</h2>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-200">
        重试
      </button>
    </div>
  )

  return (
    <Router>
      <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-zinc-950' : 'bg-[#f8f9fa]'}`}>
        <div className="dark:bg-zinc-950 dark:text-gray-100">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomeView
                  config={config}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  displayedNovels={[]}
                  showAll={showAll}
                  setShowAll={setShowAll}
                  navigate={(path) => window.location.href = path}
                  resumeInfo={resumeInfo}
                  setResumeInfo={setResumeInfo}
                  randomNovel={randomNovel}
                />
              } 
            />
            <Route 
              path="/detail/:novelId" 
              element={
                <DetailView
                  config={config}
                  novelId={new URLSearchParams(window.location.search).get('id') || window.location.pathname.split('/')[2]}
                  navigate={(path) => window.location.href = path}
                />
              } 
            />
            <Route 
              path="/reader/:novelId/:chapterIndex" 
              element={
                <ReaderView
                  config={config}
                  novelId={window.location.pathname.split('/')[2]}
                  chapterIndex={parseInt(window.location.pathname.split('/')[3], 10) || 0}
                  navigate={(path) => window.location.href = path}
                />
              } 
            />
          </Routes>
        </div>
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </Router>
  )
}

export default App
