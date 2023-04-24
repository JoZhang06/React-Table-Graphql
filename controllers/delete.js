"use strict";
function deleteUser(id) {
    const confirmDelete = confirm("Are you sure to delete this user?");
    if (confirmDelete) {
        fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `mutation {
            deleteUser(id: ${id}) {
              id
            }
          }`,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
            const user = res.data.deleteUser;
            const row = document.getElementById(`user-${user.id}`);
            if (row) {
                row.remove();
            }
        })
            .catch((err) => console.error(err));
    }
}
