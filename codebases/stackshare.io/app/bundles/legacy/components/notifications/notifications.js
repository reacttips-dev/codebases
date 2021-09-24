let notifications = document.querySelector('#notifications_header');
let loading = false;
let page = 0;

function windowScroll() {
  if (loading) return;
  if (notifications.offsetTop + notifications.scrollHeight > scrollY + innerHeight) return;

  page++;
  loading = true;

  let div = document.createElement('div');
  div.innerHTML = `Loading... <img src="https://img.stackshare.io/fe/spinner.svg"/>`;
  div.classList.add('loading');
  notifications.appendChild(div);

  CSRFFetch(`/api/v1/notifications/index?page=${page}`)
    .then(response => {
      if (response.status === 200) return response.text();
    })
    .then(text => {
      for (let el of document.querySelectorAll('.loading')) el.remove();
      if (text.length <= 1) return;

      let div = document.createElement('div');
      div.innerHTML = text;
      notifications.appendChild(div);
      loading = false;
    });
}

if (location.pathname === '/notifications') {
  window.addEventListener('scroll', windowScroll);
}
