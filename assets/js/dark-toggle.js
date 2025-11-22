// Dark mode toggle behavior
(function(){
  function setTheme(theme){
    try{
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      // update meta theme-color if present
      var meta = document.querySelector('meta[name="theme-color"]');
      if(meta){
        meta.setAttribute('content', theme === 'dark' ? '#07101a' : '#ffffff');
      }
    }catch(e){console.warn(e)}
  }

  function toggle(){
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', toggle);
    // update aria-pressed for a11y
    function updateAria(){
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', isDark? 'true':'false');
    }
    updateAria();
    // observe changes to data-theme
    var obs = new MutationObserver(updateAria);
    obs.observe(document.documentElement, {attributes:true,attributeFilter:['data-theme']});
  });
})();
