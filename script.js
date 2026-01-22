let currentMode = 'enhance';

// 1. Handle Upload Preview
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const uploadState = document.getElementById('uploadState');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            uploadState.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// 2. Mode Switcher UI
function setMode(mode) {
    currentMode = mode;
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('text-gray-400');
    });
    
    // Highlight active button
    event.target.classList.add('bg-accent', 'text-white');
    event.target.classList.remove('text-gray-400');
}

// 3. Fungsi Utama "Run AI"
async function runRifqyAI() {
    const prompt = document.getElementById('promptInput').value;
    const apiKey = document.getElementById('apiKey').value;
    const resultContainer = document.getElementById('resultContainer');
    
    // Validasi
    if(imagePreview.src === "") {
        alert("Upload gambar dulu bos!");
        return;
    }

    // Tampilkan Loading
    const loadingHtml = `
        <div class="flex flex-col items-center justify-center min-w-[200px] h-[200px] bg-white/5 rounded-xl border border-white/10 animate-pulse">
            <div class="loader mb-2"></div>
            <span class="text-xs text-blue-400">Rifqy AI Processing...</span>
        </div>`;
    
    // Hapus teks "belum ada hasil" jika ada
    if(resultContainer.innerHTML.includes("Belum ada hasil")) {
        resultContainer.innerHTML = "";
    }
    
    // Tambahkan loading ke container (temporary placeholder)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = loadingHtml;
    resultContainer.prepend(tempDiv);

    try {
        let imageUrl = "";

        // --- SKENARIO 1: DEMO MODE (GITHUB PAGES) ---
        if (!apiKey) {
            // Jika tidak ada API Key, kita panggil file dummy di folder api/
            console.log("Mode Demo: Mengambil data statis...");
            
            // Delay buatan biar kerasa kayak mikir
            await new Promise(r => setTimeout(r, 2000)); 

            const response = await fetch('./api/demo.json');
            const data = await response.json();
            
            // Kita ambil gambar random dari Unsplash sebagai "hasil" simulasi
            imageUrl = currentMode === 'sketch' 
                ? "https://images.unsplash.com/photo-1473862170180-84427c485aca?q=80&w=600&auto=format&fit=crop" // Gambar pesawat real
                : data.output_url; // Dari JSON
            
            alert("Ini Mode Demo (Tanpa API Key). Gambar hasil adalah simulasi.");
        } 
        
        // --- SKENARIO 2: REAL MODE (Jika user input Key) ---
        else {
            // Note: Memanggil API langsung dari Browser sering kena CORS.
            // Ini hanya contoh logika jika kamu punya proxy atau server sendiri.
            alert("Fitur Live API membutuhkan Backend Server (Vercel/Node.js). Menggunakan simulasi untuk GitHub Pages.");
            imageUrl = "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=600&auto=format&fit=crop"; // Simulasi sukses
        }

        // Tampilkan Hasil
        const resultHtml = `
            <div class="min-w-[250px] relative group">
                <img src="${imageUrl}" class="rounded-xl border border-white/10 h-[200px] w-full object-cover">
                <div class="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white backdrop-blur-md">
                    ${currentMode.toUpperCase()}
                </div>
                <a href="${imageUrl}" target="_blank" class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl text-white font-bold">
                    Download
                </a>
            </div>
        `;
        
        tempDiv.outerHTML = resultHtml; // Ganti loading dengan gambar

    } catch (error) {
        console.error(error);
        tempDiv.innerHTML = `<div class="text-red-500 text-xs p-4">Gagal: ${error.message}</div>`;
    }
}
