if (myUser) {
    var user = JSON.parse(myUser);
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var totalClaims = 0;

const buttons = document.querySelectorAll('.clicked');
for (let button of buttons) {
    button.addEventListener('click', claim);
}

function claim() {
    if (totalClaims < 3) {
        const newp = document.createElement('p');
        newp.classList.add("claim");
        newp.innerText = `Claimed by: ${user.firstName}`;
        insertAfter(this, newp);
        totalClaims = totalClaims + 1;
        //console.log(totalClaims);
        for (let button of buttons) {
            button.disabled = true;
            setTimeout(() => {
                button.removeAttribute('disabled');
            }, 1000);
        }
        this.removeEventListener('click', claim);
    } else {
        const newp = document.createElement('p');
        newp.classList.add("claim");
        newp.innerText = 'No more claims available';
        insertAfter(this, newp);
        //console.log(totalClaims);
        this.removeEventListener('click', claim);
    }
}

const rBtn = document.querySelector('.replace');
if (myUser) {
    rBtn.addEventListener('click', replace);
}

function replace() {
    if (totalClaims) {
        const replaceWith = document.getElementById('replaceWith').value;
        const replaceBy = document.getElementById('replaceBy').value;
        //console.log(replaceWith);
        //console.log(replaceBy);
        const h5s = document.querySelectorAll('h5');
        for (let h5 of h5s) {
            if (h5.innerHTML === replaceWith) {
                var myDiv1 = h5.parentElement;
                //console.log(myDiv1);
                var text1 = myDiv1.lastElementChild;
                //console.log(text1);
                //console.log(text1.innerHTML)
                text1.innerHTML = 'No more claims available';
                //console.log(text1.innerHTML)
            }
        }
        for (let h5 of h5s) {
            if (h5.innerHTML === replaceBy) {
                var myDiv2 = h5.parentElement;
                //console.log(myDiv2);
                var text2 = myDiv2.lastElementChild;
                //console.log(text2);
                //console.log(text2.innerHTML)
                text2.innerHTML = `Claimed by: ${user.firstName}`;
                //console.log(text2.innerHTML)
            }
        }
    }
}



