// Wait for device to be ready 
if (window.cordova) { 
    document.addEventListener('deviceready', onDeviceReady, false); 
} else { 
    window.addEventListener('DOMContentLoaded', onDeviceReady); 
} 
 
function onDeviceReady() { 
    console.log('Device is ready'); 
 
    const iframe = document.getElementById('content-frame'); 
    const loading = document.getElementById('loading'); 
    const error = document.getElementById('error'); 
    const retryBtn = document.getElementById('retry-btn'); 
 
    const MAIN_URL = 'https://script.google.com/macros/s/AKfycbyEWDkgAquPukXHSPOFjRCp1JYR60vv2Ah8ywnsDdHC06eE9Ms3uCE9RevfQSqshWjP/exec'; 
 
    let backPressedOnce = false; // flag for double back press 
 
    retryBtn.addEventListener('click', loadIframeContent); 
 
    setTimeout(loadIframeContent, 300); 
 
    function loadIframeContent() { 
        console.log('Loading iframe content...'); 
 
        loading.style.display = 'flex'; 
        error.style.display = 'none'; 
        iframe.style.display = 'none'; 
 
        iframe.src = MAIN_URL; 
 
        iframe.onload = function() { 
            console.log('Iframe loaded successfully'); 
            loading.style.display = 'none'; 
            iframe.style.display = 'block'; 
        }; 
 
        iframe.onerror = function() { 
            console.error('Failed to load iframe content'); 
            loading.style.display = 'none'; 
            error.style.display = 'flex'; 
        }; 
 
        setTimeout(function() { 
            if (loading.style.display !== 'none') { 
                console.log('Iframe loading timeout'); 
                iframe.onerror(); 
            } 
        }, 15000); 
    } 
 
    // Handle back button 
    document.addEventListener('backbutton', function(e) { 
        e.preventDefault(); 
 
        try { 
            // Check if we are on main page 
            if (iframe.src === MAIN_URL || iframe.src === MAIN_URL + "/") { 
                if (backPressedOnce) { 
                    navigator.app.exitApp(); // exit app 
                } else { 
                    backPressedOnce = true; 
                    
                    // Toast message instead of alert
                    if (window.plugins && window.plugins.toast) {
                        window.plugins.toast.showShortBottom("اضغط رجوع مرة أخرى للخروج");
                    } else {
                        alert("اضغط رجوع مرة أخرى للخروج"); // fallback لو البلاجين مش موجود
                    }
 
                    setTimeout(() => { 
                        backPressedOnce = false; 
                    }, 2000); // reset after 2 seconds 
                } 
            } else { 
                // If not on main page, go back inside iframe or reload main page 
                if (iframe.contentWindow && iframe.contentWindow.history.length > 1) { 
                    iframe.contentWindow.history.back(); 
                } else { 
                    iframe.src = MAIN_URL; 
                } 
            } 
        } catch (err) { 
            console.log('Error handling back button', err); 
            iframe.src = MAIN_URL; 
        } 
    }, false); 
 
    // Handle online/offline 
    document.addEventListener('online', function() { 
        console.log('Device is online'); 
        if (error.style.display === 'flex') { 
            loadIframeContent(); 
        } 
    }, false); 
 
    document.addEventListener('offline', function() { 
        console.log('Device is offline'); 
        if (loading.style.display !== 'none') { 
            loading.style.display = 'none'; 
            error.style.display = 'flex'; 
        } 
    }, false); 
} 
 
setTimeout(function() { 
    if (typeof cordova === 'undefined') { 
        console.log('Cordova not detected, running in browser'); 
        onDeviceReady(); 
    } 
}, 2000); 
