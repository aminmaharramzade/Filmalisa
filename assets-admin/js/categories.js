

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NjE4MzExLCJleHAiOjE3Njg3MjIzMTF9.D764-UeEH-tpz_lCtnPXi2ZcaydOOjh16-4SchtnFX4"; 
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${baseURL}/${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", 
                 "Authorization": `Bearer ${token}`
            },
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
fetchData("category"); 