const url = `https://${window.location.hostname}:${window.location.port}`;
(async function () {
    try {
        const response = await fetch(`${url}/user/me`);
        const data = await response.json();
        console.log(data)
        if (data.status) {
            updateloggerUIUser(data.picture, data.nickname);
            init();

        } else {
            unAuthenticated();
        }
    } catch (error) {
        console.log(error);
    }
}());

function updateloggerUIUser(picture, name) {
    document.querySelector('.nav-info-user').innerHTML = `
            <div class="avatar">
                <img src="${picture}" alt="">
            </div>
             <div class="border-right "><a class="name title">${name}</a></div> </a> </div> 
             <a class='title create-unit-btn' href = '/createUnit.html'> <i class="fad fa-layer-plus"></i> Create unit</a>
            <!--  <a href="/createUnit.html" ><i class="fad fa-clipboard-list"></i></a>-->
             <a href='/logout'  title='Logout'><i class="fad fa-sign-out"></i></a>
        `
}


