const bel = require('bel')

module.exports = function (domain, tosdr) {
  let knownPractices = tosdr && tosdr.message && tosdr.message !== 'Unknown'
  let subtitle
  let status

  if (knownPractices) {
    subtitle = `${tosdr.message} Privacy Practices`
    status = tosdr.message.toLowerCase()
  } else {
    subtitle = `Unknown Privacy Practices`
    status = `unknown`
  }

  return bel`<div>
    <a href="#" class="hero__close js-sliding-subview-close">
      <span class="icon icon__arrow icon__arrow--left">
      </span>
    </a>
    <div class="hero__icon privacy-practices__icon--${status}">
    </div>
    <h1 class="hero__title">
      ${domain}
    </h1>
    <h2 class="hero__subtitle">
      ${subtitle}
    </h2>
  </div>`
}
