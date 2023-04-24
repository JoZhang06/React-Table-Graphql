//Funcion para Crear el usuario
const openModalButton = document.getElementById('open-modal-add') as HTMLElement;
const modal = document.getElementById('modal-add') as HTMLElement;
const cancelButton = document.getElementById('cancel-button') as HTMLElement;
const closeModalButton = document.createElement('button');

closeModalButton.textContent = 'Close';
closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

openModalButton.addEventListener('click', () => {
  modal.style.display = 'block';
  modal.appendChild(closeModalButton);
});

cancelButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  nameInput.value = '';
  emailInput.value = '';
  modal.style.display = 'none'; // cerrar el modal
});

const addUserForm = document.getElementById("add-user-form") as HTMLFormElement;
addUserForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const name = nameInput.value;
  const email = emailInput.value;

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation {
    createUser(name: "${name}", email: "${email}") {
      id
      name
      email
      createdAt
      updatedAt
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
