document.addEventListener('DOMContentLoaded', () => {
    // 1. Get employee data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    const defaultEmp = {
        id: 'CNKD_HCM_THUYLTT1',
        name: 'Lê Thị Thu Thủy',
        avatar: 'avatar.png',
        license: '0312345678',
        territory: 'TP. Hồ Chí Minh',
        phone: '0981234567'
    };

    const empId = urlParams.get('ref') || defaultEmp.id;
    let empName = defaultEmp.name;
    let avatarSrc = defaultEmp.avatar;
    let empLicense = defaultEmp.license;
    let empTerritory = defaultEmp.territory;
    let empPhone = defaultEmp.phone;

    // Simulate database
    if (empId === 'CNKD_HCM_THUYLTT1') {
        empName = 'Lê Thị Thu Thủy';
        empLicense = '0312345678';
        empTerritory = 'TP. Hồ Chí Minh';
        empPhone = '0981234567';
    } else if (empId === 'NV123456') {
        empName = 'Nguyễn Thị A';
        empLicense = '01D8888999';
        empTerritory = 'Hà Nội';
        empPhone = '0979999888';
    } else if (empId !== defaultEmp.id) {
        empName = 'Chuyên viên ' + empId;
        empLicense = 'GP-' + empId;
        empTerritory = 'Hồ Chí Minh';
        empPhone = '18008098';
    }

    // 2. Update UI with employee info
    document.getElementById('empId').textContent = empId;
    document.getElementById('empName').textContent = empName;
    document.getElementById('empLicense').textContent = empLicense;
    document.getElementById('empTerritory').textContent = empTerritory;
    document.getElementById('empPhone').textContent = empPhone;
    document.getElementById('btnCall').href = 'tel:' + empPhone;
    const elTopEmpId = document.getElementById('topEmpId');
    if (elTopEmpId) elTopEmpId.textContent = empId;
    
    const elTopEmpName = document.getElementById('topEmpName');
    if (elTopEmpName) elTopEmpName.textContent = empName;
    
    const elFooterEmpName = document.getElementById('footerEmpName');
    if (elFooterEmpName) elFooterEmpName.textContent = empName + ' (' + empId + ')';

    // Update QR Code Dynamic Link
    const currentUrl = window.location.href.split('?')[0] + '?ref=' + empId;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;
    document.getElementById('qrImage').src = qrUrl;
    
    // Set Download QR Link
    const downloadQrBtn = document.getElementById('downloadQr');
    downloadQrBtn.href = qrUrl;
    // To actually force a download in some browsers for cross-origin images, 
    // it's better to fetch it as a blob, but for this prototype href="qrUrl" works as a fallback.
    downloadQrBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `QR_${empId}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            showToast('Đang tải mã QR xuống...');
        } catch (error) {
            window.open(qrUrl, '_blank');
        }
    });

    // 3. Countdown Timer Logic (Persistent)
    const timerDisplay = document.getElementById('timerDisplay');
    let expireTime = localStorage.getItem('countdownExpire_v2');
    
    if (!expireTime || Date.now() > parseInt(expireTime)) {
        // Set new expiration time to 33 minutes and 20 seconds from now (2000 seconds)
        expireTime = Date.now() + 2000 * 1000;
        localStorage.setItem('countdownExpire_v2', expireTime);
    } else {
        expireTime = parseInt(expireTime);
    }
    
    // Cập nhật hiển thị ngay lập tức trước khi setInterval chạy
    let initialTimeLeft = Math.floor((expireTime - Date.now()) / 1000);
    if (initialTimeLeft > 0) {
        let min = Math.floor(initialTimeLeft / 60);
        let sec = initialTimeLeft % 60;
        timerDisplay.textContent = (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    }

    const countdown = setInterval(() => {
        let timeLeft = Math.floor((expireTime - Date.now()) / 1000);
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = "00:00";
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = 
            (minutes < 10 ? "0" : "") + minutes + ":" + 
            (seconds < 10 ? "0" : "") + seconds;
    }, 1000);
    
    // 4. Attach tracking ID to all buy buttons
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            let targetUrl = this.getAttribute('data-url');
            
            // Append affiliate tracking parameter
            const separator = targetUrl.includes('?') ? '&' : '?';
            targetUrl += `${separator}ref_code=${empId}`;
            
            // Open Product Modal
            openProductModal(this, targetUrl, empId);
        });
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Handle "Call" button
    document.getElementById('btnCall').addEventListener('click', function() {
        // Here we could also trigger an API call to log that this customer called the employee
        console.log(`Customer intent to call employee ${empId}`);
    });
});

// Global function to copy ID
function copyId() {
    const idText = document.getElementById('empId').textContent;
    navigator.clipboard.writeText(idText).then(() => {
        // Find toast and show message
        const toast = document.getElementById('toast');
        toast.textContent = "Đã sao chép ID: " + idText;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }).catch(err => {
        console.error('Không thể sao chép', err);
    });
}

// Drag to scroll functionality for product grids
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.product-grid');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            slider.style.scrollSnapType = 'none'; // Disable snap while dragging
            slider.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'auto';
            slider.style.scrollSnapType = 'x mandatory';
            slider.style.scrollBehavior = 'smooth';
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'auto';
            slider.style.scrollSnapType = 'x mandatory';
            slider.style.scrollBehavior = 'smooth';
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    });
});

// --- Product Modal Logic ---
function openProductModal(btnElement, targetUrl, empId) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const card = btnElement.closest('.product-card');
    if (!card) return;

    // Extract product info
    const title = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').innerHTML;
    const featuresList = card.querySelector('.features').innerHTML;

    // Populate Modal Info
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').innerHTML = priceText;
    document.getElementById('modalFeatures').innerHTML = featuresList;

    // Generate Modal QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`;
    document.getElementById('modalQrImage').src = qrUrl;

    // Set Share Link
    document.getElementById('modalShareLink').value = targetUrl;
    
    // Set Download link config
    const downloadBtn = document.getElementById('modalDownloadQrBtn');
    downloadBtn.onclick = async function(e) {
        e.preventDefault();
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `QR_Goi_Cuoc_${title}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            showToast('Đang tải mã QR gói cước...');
        } catch (error) {
            window.open(qrUrl, '_blank');
        }
    };

    // Show Modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Global function to copy share link inside modal
function copyShareLink() {
    const linkInput = document.getElementById('modalShareLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile
    navigator.clipboard.writeText(linkInput.value).then(() => {
        const toast = document.getElementById('toast');
        toast.textContent = "Đã sao chép link chia sẻ!";
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }).catch(err => {
        console.error('Không thể sao chép', err);
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
});
