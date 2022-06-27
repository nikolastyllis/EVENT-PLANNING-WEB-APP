const form = document.getElementById('form');
const first_name = document.getElementById('first-name');
const last_name = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password_check = document.getElementById('confirm-password');

form.addEventListener('submit', e => {
	e.preventDefault();
    let errors = checkInputs();
    console.log(errors);
	if(!errors)
    {
        //do email check
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                setSuccessFor(email);
                window.location.href = '/login'
            }
            else
            {
                setErrorFor(email, 'Email already in use!');
            }
        };

        const first_nameVal = first_name.value.trim();
        const last_nameVal = last_name.value.trim();
        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();

        var user = { email : emailVal , first_name : first_nameVal, last_name : last_nameVal, password : passwordVal };
        xhttp.open("POST", "/signupuser", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(user));
    }

});

function checkInputs() {
    let errors = 0;
	// trim to remove the whitespaces
    const first_nameVal = first_name.value.trim();
    const last_nameVal = last_name.value.trim();
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const password_checkVal = password_check.value.trim();


	if(first_nameVal === '') {
		setErrorFor(first_name, 'First name cannot be blank!');
        errors++;
	}
    else if(first_nameVal.length > 20)
    {
        setErrorFor(first_name, 'First name is too long!');
        errors++;
    }
    else {
		setSuccessFor(first_name);
	}

    if(last_nameVal === '') {
		setErrorFor(last_name, 'Last name cannot be blank!');
        errors++;
	}
    else if(last_nameVal.length > 20)
    {
        setErrorFor(last_name, 'Last name is too long!');
        errors++;
    }
    else {
		setSuccessFor(last_name);
	}

    if(emailVal === '') {
		setErrorFor(email, 'Email cannot be blank!');
        errors++;
	}
    else if(emailVal.length > 60)
    {
        setErrorFor(email, 'Email is too long!');
        errors++;
    }
    else {
		setSuccessFor(email);
	}

	if(passwordVal === '') {
		setErrorFor(password, 'Password cannot be blank!');
        errors++;
	}
    else if(passwordVal.length < 8)
    {
        setErrorFor(password, 'Password is too short!');
        errors++;
    }
    else {
		setSuccessFor(password);
	}

	if(password_checkVal === '') {
		setErrorFor(password_check, 'Password confirmation cannot be blank!');
        errors++;
	} else if(passwordVal !== password_checkVal) {
		setErrorFor(password_check, 'Passwords do not match!');
        errors++;
	} else{
		setSuccessFor(password_check);
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

