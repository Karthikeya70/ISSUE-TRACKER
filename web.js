//This is the javascript logic code so that the user can submit the form only when he/she met the requirements



document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".submitbtn");

    const Name = document.getElementById("name");
    const email = document.getElementById("email");
    const depart = document.getElementById("depart");
    const sport = document.getElementById("sport");
    const areabox = document.getElementById("area");

    const nam = document.getElementsByClassName("n")[0];  //classname gives an object so we have to access the first element in it.
    const emailLabel = document.getElementsByClassName("e")[0];
    const d = document.getElementsByClassName("d")[0];
    const s = document.getElementsByClassName("s")[0];
    const q = document.getElementsByClassName("q")[0];

    const emailRegex = /^[A-Za-z0-9._-]+@iitgn\.ac\.in$/;  // The email should end with iitgn.ac.in
 
    const submit = async (event) => {
        event.preventDefault(); // Prevent the form from submitting immediately

        let messages = [];
        nam.innerHTML = "Name"; // Reset to default text
        emailLabel.innerHTML = "Email ID";
        d.innerHTML = "Department";
        s.innerHTML = "Sports";
        q.innerHTML = "Query";

        //If the details are empty then the text changes to red for alerting the user
        //Else the styling and all remains like before.
        if (Name.value.trim() === "") {
            nam.innerHTML = "Name is required";
            nam.style.color = "red";
            nam.style.fontWeight = "bold";
            messages.push("Name is required");
        } else {
            nam.style.color = "";
        }

        if (email.value.trim() === "") {
            emailLabel.innerHTML = "Email ID is required";
            emailLabel.style.color = "red";
            messages.push("Email ID is required");
        } else if (!emailRegex.test(email.value.trim())) {
            emailLabel.innerHTML = "Valid IITGN email ID is required";
            emailLabel.style.color = "red";
            messages.push("Valid IITGN email ID is required");
        } else {
            emailLabel.style.color = "";
        }

        if (depart.value === "") {
            d.innerHTML = "Department is required";
            d.style.color = "red";
            messages.push("Department is required");
        } else {
            d.style.color = "";
        }

        if (sport.value === "") {
            s.innerHTML = "Sport is required";
            s.style.color = "red";
            messages.push("Sport is required");
        } else {
            s.style.color = "";
        }

        if (areabox.value.trim() === "") {
            q.innerHTML = "Query description is required";
            q.style.color = "red";
            messages.push("Query description is required");
        } else {
            q.style.color = "";
        }



        if (messages.length === 0) {  //This line indicates that there is no error in form filling. We can start storing the data now.
            const formData = {
                Name: Name.value,
                Email: email.value,
                Department: depart.value,
                Sports: sport.value,
                Description: areabox.value
            };

            try {
                const response = await fetch("/submit-query", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    window.location.href = "/submit-query";
                } else {
                    console.error("Error submitting the form:", response.statusText);
                }
            } catch (error) {
                console.error("Error submitting the form:", error);
            }
        }


    };

    button.addEventListener("click", submit);
});

//comes back to the page once the user hits ok button in /submit-query

document.addEventListener("DOMContentLoaded", () => { 
    const okButton = document.getElementById("ok-button");

    okButton.addEventListener("click", () => {
        window.location.href = "/";
    });
});

