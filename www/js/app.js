document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  console.log('Device is ready');
  
  const iframe = document.getElementById('content-frame');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const retryBtn = document.getElementById('retry-btn');
  
  // Set up retry button
  retryBtn.addEventListener('click', loadIframeContent);
  
  // Initial load
  loadIframeContent();
  
  function loadIframeContent() {
    // Show loading, hide error and iframe
    loading.style.display = 'flex';
    error.style.display = 'none';
    iframe.style.display = 'none';
    
    // Add load event listener to iframe
    iframe.onload = function() {
      console.log('Iframe loaded successfully');
      loading.style.display = 'none';
      iframe.style.display = 'block';
    };
    
    // Add error event listener to iframe
    iframe.onerror = function() {
      console.error('Failed to load iframe content');
      loading.style.display = 'none';
      error.style.display = 'flex';
    };
    
    // Force reload of iframe content
    // Adding a timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const currentSrc = iframe.src.split('?')[0];
    iframe.src = currentSrc + '?t=' + timestamp;
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
}