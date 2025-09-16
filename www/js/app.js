// Wait for device to be ready

if (window.cordova) {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    // Fallback for browser mode
    window.addEventListener('DOMContentLoaded', onDeviceReady);
}

function onDeviceReady() {
    console.log('Device is ready');
    
    const iframe = document.getElementById('content-frame');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const retryBtn = document.getElementById('retry-btn');
    
    // Set up retry button
    retryBtn.addEventListener('click', loadIframeContent);
    
    // Initial load with a small delay to ensure Cordova is fully ready
    setTimeout(loadIframeContent, 300);
    
    function loadIframeContent() {
        console.log('Loading iframe content...');
        
        // Show loading, hide error and iframe
        loading.style.display = 'flex';
        error.style.display = 'none';
        iframe.style.display = 'none';
        
        // Set iframe source
        iframe.src = 'https://script.google.com/macros/s/AKfycbyhWqe8rFs-viUaqY-qnJgW_d9YxqzxuyStyQ7HbpVbYI_jdqlugfmSw456GelzAFFd/exec';
        
        // Add load event listener to iframe
        iframe.onload = function() {
            console.log('Iframe loaded successfully');
            loading.style.display = 'none';
            iframe.style.display = 'block';
            // Only try to inject styles if same-origin and contentDocument/head exist
            try {
                if (
                    iframe.contentDocument &&
                    iframe.contentDocument.head &&
                    iframe.contentDocument.createElement &&
                    iframe.src.startsWith(window.location.origin)
                ) {
                    const style = iframe.contentDocument.createElement('style');
                    style.textContent = `
                        body { 
                            margin: 0; 
                            padding: 0; 
                            overflow: auto;
                            -webkit-overflow-scrolling: touch;
                        }
                        .app-container { 
                            width: 100% !important; 
                            height: 100% !important; 
                        }
                    `;
                    iframe.contentDocument.head.appendChild(style);
                }
            } catch (e) {
                // Suppress error, expected for cross-origin iframes
            }
        };
        
        // Add error event listener to iframe
        iframe.onerror = function() {
            console.error('Failed to load iframe content');
            loading.style.display = 'none';
            error.style.display = 'flex';
        };
        
        // Set timeout for iframe loading
        setTimeout(function() {
            if (loading.style.display !== 'none') {
                console.log('Iframe loading timeout');
                iframe.onerror();
            }
        }, 15000); // 15 second timeout
    }
    
    // Handle back button on Android
    document.addEventListener('backbutton', function(e) {
        // Try to go back in iframe history first
        try {
            iframe.contentWindow.history.back();
            e.preventDefault();
        } catch (err) {
            // If we can't go back in iframe, exit the app
            console.log('Cannot go back in iframe, exiting app');
            navigator.app.exitApp();
        }
    }, false);
    
    // Handle online/offline events
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

// Fallback in case deviceready doesn't fire
setTimeout(function() {
    if (typeof cordova === 'undefined') {
        console.log('Cordova not detected, running in browser');
        onDeviceReady();
    }
}, 2000);