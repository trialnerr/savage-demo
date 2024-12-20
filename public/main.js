const thumbUp = document.getElementsByClassName('fa-thumbs-up');
const trash = document.getElementsByClassName('fa-trash');
const thumbDown = document.querySelectorAll('.fa-thumbs-down');

const thumbDownArray = Array.from(thumbDown);

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbUp = parseFloat(
      this.parentNode.parentNode.childNodes[5].innerText
    );
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        msg: msg,
        thumbUp: thumbUp,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        msg: msg,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

thumbDownArray.forEach((el) => {
  el.addEventListener('click', () => {
    console.log('click down');
    const name = el.parentNode.parentNode.childNodes[1].textContent;
    const msg = el.parentNode.parentNode.childNodes[3].innerText;
    const thumbDown = parseFloat(
      el.parentNode.parentNode.childNodes[9].innerText
    );
    
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        msg,
        thumbDown,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data); //we never see this cause the window reloads quickly
        window.location.reload(true);
      });
  });
});
