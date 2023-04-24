"use strict";
//Funcion para Crear el usuario
const openModalButton = document.getElementById('open-modal-add');
const modal = document.getElementById('modal-add');
const cancelButton = document.getElementById('cancel-button');
const closeModalButton = document.createElement('button');
closeModalButton.innerHTML = '×';
closeModalButton.classList.add('close');
closeModalButton.addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    nameInput.value = '';
    emailInput.value = '';
    modal.style.display = 'none';
});
openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
    modal.appendChild(closeModalButton);
});
cancelButton.addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    nameInput.value = '';
    emailInput.value = '';
    modal.style.display = 'none'; // cerrar el modal
});
const addUserForm = document.getElementById("add-user-form");
addUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const name = nameInput.value;
    const email = emailInput.value;
    fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `mutation {
    createUser(name: "${name}", email: "${email}") { 
        id name email createdAt updatedAt 
    }
}`,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
        console.log(res);
        nameInput.value = "";
        emailInput.value = "";
        modal.style.display = 'none';
    })
        .catch((err) => console.error(err));
});
