import * as React from "react"

// Use base URL of Marketo Landing Pages to prevent ad-blockers from disabling form script
const marketoBaseUrl = `//${process.env.GATSBY_MKTO_LP_DOMAIN}`
const munchkinId = process.env.GATSBY_MKTO_MUNCHKIN_ID

const destyleMktoForm = (mktoForm, moreStyles) => {
  const formEl = mktoForm.getFormElem()[0]

  // remove element styles from <form> and children
  const styledEls = Array.from(formEl.querySelectorAll("[style]")).concat(
    formEl
  )

  styledEls.forEach(el => el.removeAttribute("style"))

  // disable remote stylesheets and local <style>s
  const styleSheets = Array.from(document.styleSheets)

  styleSheets.forEach(ss => {
    if (formEl.contains(ss.ownerNode)) {
      ss.disabled = true
    }
  })

  if (!moreStyles) formEl.setAttribute("data-styles-ready", "true")
}

/*
 * There may be a way to load this more performantly
 * make this a loadable component? TBD.
 */
const loadMarketoScript = setScriptLoaded => {
  if (window.MktoForms2) return setScriptLoaded(true)

  const script = document.createElement(`script`)
  script.defer = true
  script.onload = () => (window?.MktoForms2 ? setScriptLoaded(true) : null)
  script.src = `//${process.env.GATSBY_MKTO_LP_DOMAIN}/js/forms2/js/forms2.min.js`
  document.head.appendChild(script)
}

function useMarketo({ formId, callback }) {
  const [scriptLoaded, setScriptLoaded] = React.useState(false)
  const [formLoaded, setFormLoaded] = React.useState(false)

  React.useEffect(() => {
    if (scriptLoaded) {
      if (!formLoaded) {
        MktoForms2.setOptions({
          formXDPath: `/rs/${munchkinId}/images/marketo-xdframe-relative.html`,
        })
        MktoForms2.loadForm(marketoBaseUrl, munchkinId, formId, callback)
        MktoForms2.whenRendered(form => destyleMktoForm(form))
        setFormLoaded(true)
      }
    } else {
      loadMarketoScript(setScriptLoaded)
    }
  }, [scriptLoaded])
}

export default useMarketo
