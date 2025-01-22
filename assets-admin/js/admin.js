// const passwordEye = document.querySelector(`#passwordEye`);
// const passwordInput = document.querySelector(`#inputPassword`);
// const nameInput = document.querySelector(`#inputName`);
// const loginBtn = document.querySelector(`#loginBtn`);

// // password private
// passwordEye.addEventListener("click", function () {
//   if (passwordInput.type === "password") {
//     passwordInput.type = "text";
//   } else {
//     passwordInput.type = "password";
//   }
// });

// // required login
// loginBtn.addEventListener("click", function () {
//   if (nameInput.value === "") {
//     nameInput.setAttribute("placeholder", "Required");
//   }
//   if (passwordInput.value === "") {
//     passwordInput.setAttribute("placeholder", "Required");
//   }
//   if (nameInput.value !== "" && passwordInput.value !== "") {
//     window.location.href = "../assets-admin/pages/dashboard.html";
//   }
// });




const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin";

// Məlumat çəkmək üçün funksiyanı yaradın
async function fetchData(endpoint, email, password) {
    try {
        const response = await fetch(`${baseURL}/${endpoint}`, {
            method: "POST", // Metod
            headers: {
                "Content-Type": "application/json", // JSON formatını göstərir
            },
            body: JSON.stringify({
                email: email, // Email sahəsi
                password: password, // Şifrə sahəsi
            }),
        });

        if (!response.ok) {
            throw new Error(`Xəta: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Sorğu zamanı xəta baş verdi:", error);
    }
}

// İstifadə nümunəsi
fetchData("login", "admin@admin.com", "1234");

