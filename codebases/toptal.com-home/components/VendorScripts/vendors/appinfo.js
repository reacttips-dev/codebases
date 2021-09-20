const preprocessData = data => ({
    lp_skill: data.lpSkill,
    lp_skill_title: data.lpSkillTitle,
    lp_skill_role: data.lpSkillRole
})

/**
 * https://github.com/toptal/appinfo#client-javascript-snippet
 */
export default ({
    baseUrl,
    withCredentials,
    jsClientUrl,
    data = false
}) => `
  window.onAppinfoLoad = function () {
    window.appinfo.grab('${baseUrl}', {
      data: ${JSON.stringify(data ? preprocessData(data) : {})},
      withCredentials: ${withCredentials}
    });
  };
  (function() {
    var d = document, s = d.createElement('script');
    s.src = '${jsClientUrl}';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
`