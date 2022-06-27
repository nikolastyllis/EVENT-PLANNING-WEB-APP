const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
	e.preventDefault();
    let errors = checkInputs();
    console.log(errors);
	if(!errors)
    {
        //do login check
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                setSuccessFor(email);
                setSuccessFor(password);
                window.location.href = '/main'
            }
            else
            {
                setErrorFor(email, 'Password or email incorrect!');
                setErrorFor(password, 'Password or email incorrect!');
            }
        };

        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();
        var user = { email : emailVal , password : passwordVal };
        xhttp.open("POST", "/loginuser", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(user));
    }

});

function checkInputs() {
    let errors = 0;

    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    if(emailVal === '') {
		setErrorFor(email, 'Email cannot be blank!');
        errors++;
	}
    else {
		setSuccessFor(email);
	}

	if(passwordVal === '') {
		setErrorFor(password, 'Password cannot be blank!');
        errors++;
	}
    else {
		setSuccessFor(password);
	}

    return errors;
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

