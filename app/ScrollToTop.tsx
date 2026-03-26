'use client'

import { useEffect } from 'react'

export function ScrollToTop() {
  useEffect(() => {
    // Принудительно скроллим вверх при загрузке
    window.scrollTo(0, 0)
    
    // Отключаем запоминание позиции скролла браузером
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return null
}