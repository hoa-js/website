import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  enhanceApp() {
    if (typeof window === 'undefined') return

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a')
      if (!link) return

      const isGithub = link.href?.includes('github.com')
      if (isGithub) {
        e.preventDefault()

        // GA4
        if (window.gtag) {
          window.gtag('event', 'conversion', {'send_to': 'AW-16800293392/Y3zgCN_RsooaEJDEgMs-'})
        }

        setTimeout(() => {
          window.open(link.href, link.target || '_blank')
        }, 150)
      }
    })
  }
}
