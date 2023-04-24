//Funcion para Crear el usuario
var openModalButton = document.getElementById('open-modal-add');
var modal = document.getElementById('modal-add');
var cancelButton = document.getElementById('cancel-button');
var closeModalButton = document.createElement('button');
closeModalButton.textContent = 'Close';
closeModalButton.addEventListener('click', function () {
    modal.style.display = 'none';
});
openModalButton.addEventListener('click', function () {
    modal.style.display = 'block';
    modal.appendChild(closeModalButton);
});
cancelButton.addEventListener('click', function () {
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    nameInput.value = '';
    emailInput.value = '';
    modal.style.display = 'none'; // cerrar el modal
});
var addUserForm = document.getElementById("add-user-form");
addUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var name = nameInput.value;
    var email = emailInput.value;
    fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: "mutation {\n    createUser(name: \"".concat(name, "\", email: \"").concat(email, "\") {\n      id\n      name\n      email\n      createdAt\n      updatedAt\n    }\n  }"),
        }),
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        console.log(res);
        nameInput.value = "";
        emailInput.value = "";
        modal.style.display = 'none';
    })
        .catch(function (err) { return console.error(err); });
});
